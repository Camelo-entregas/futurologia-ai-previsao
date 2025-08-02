-- Database schema for FuturoLogia IA - Football Analytics SaaS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_cron for scheduled tasks (optional)
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create leagues table
CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT,
  league_id UUID REFERENCES public.leagues(id),
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  favorite_team_id UUID REFERENCES public.teams(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Create subscriptions table to track user plans
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium', 'pro')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'cancelled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID NOT NULL REFERENCES public.leagues(id),
  home_team_id UUID NOT NULL REFERENCES public.teams(id),
  away_team_id UUID NOT NULL REFERENCES public.teams(id),
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'in_play', 'finished', 'postponed', 'canceled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create match_analytics table for storing real match data
CREATE TABLE public.match_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id),
  home_win_probability NUMERIC(5,2),
  draw_probability NUMERIC(5,2),
  away_win_probability NUMERIC(5,2),
  home_goals INTEGER,
  away_goals INTEGER,
  home_corners INTEGER,
  away_corners INTEGER,
  home_yellow_cards INTEGER,
  away_yellow_cards INTEGER,
  home_red_cards INTEGER,
  away_red_cards INTEGER,
  home_possession INTEGER,
  away_possession INTEGER,
  home_shots_on_target INTEGER,
  away_shots_on_target INTEGER,
  home_shots_off_target INTEGER,
  away_shots_off_target INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_recommendations table for storing AI-generated recommendations
CREATE TABLE public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN (
    '1x2', 
    'over_under', 
    'both_teams_to_score', 
    'handicap', 
    'correct_score'
  )),
  confidence_score NUMERIC(5,2) NOT NULL,
  description TEXT,
  reasoning TEXT,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_favorites table
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, team_id),
  UNIQUE(user_id, league_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create RLS policies for matches (public read access)
CREATE POLICY "Anyone can view matches" 
ON public.matches 
FOR SELECT 
USING (true);

-- Create RLS policies for match_analytics (public read access)
CREATE POLICY "Anyone can view match analytics" 
ON public.match_analytics 
FOR SELECT 
USING (true);

-- Create RLS policies for AI recommendations
CREATE POLICY "Free users can view basic recommendations" 
ON public.ai_recommendations 
FOR SELECT 
USING (
  recommendation_type = '1x2' AND
  EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = auth.uid() 
    AND s.status = 'active'
  )
);

CREATE POLICY "Premium users can view all recommendations" 
ON public.ai_recommendations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = auth.uid() 
    AND s.status = 'active'
    AND s.plan_type IN ('premium', 'pro')
  )
);

-- Create RLS policies for user favorites
CREATE POLICY "Users can manage their favorites" 
ON public.user_favorites 
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  INSERT INTO public.subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_match_analytics_updated_at
  BEFORE UPDATE ON public.match_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate match probabilities
CREATE OR REPLACE FUNCTION public.calculate_match_probabilities(
  p_home_team_id UUID,
  p_away_team_id UUID
)
RETURNS TABLE(
  home_win_prob NUMERIC(5,2),
  draw_prob NUMERIC(5,2),
  away_win_prob NUMERIC(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    45.0 AS home_win_prob,  -- Placeholder - replace with actual calculation
    30.0 AS draw_prob,      -- Placeholder - replace with actual calculation
    25.0 AS away_win_prob   -- Placeholder - replace with actual calculation
  FROM 
    public.teams ht,
    public.teams at
  WHERE 
    ht.id = p_home_team_id AND 
    at.id = p_away_team_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_matches_league_id ON public.matches(league_id);
CREATE INDEX idx_matches_date ON public.matches(match_date);
CREATE INDEX idx_match_analytics_match_id ON public.match_analytics(match_id);
CREATE INDEX idx_ai_recommendations_match_id ON public.ai_recommendations(match_id);