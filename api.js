// Configuração da API - Exemplo usando API-Football
const API_KEY = 'SUA_CHAVE_DE_API'; // Obtenha em https://www.api-football.com/
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';

async function fetchLeagues() {
  const response = await fetch(`${BASE_URL}/leagues`, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  });
  const data = await response.json();
  return data.response.map(league => ({
    id: league.league.id,
    name: league.league.name,
    country: league.country.name
  }));
}

async function fetchTeams(leagueId) {
  const response = await fetch(`${BASE_URL}/teams?league=${leagueId}&season=2023`, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  });
  const data = await response.json();
  return data.response.map(team => ({
    id: team.team.id,
    name: team.team.name,
    logo: team.team.logo
  }));
}

async function fetchLastMatches(teamId, leagueId, last = 5) {
  const response = await fetch(`${BASE_URL}/fixtures?team=${teamId}&league=${leagueId}&last=${last}`, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  });
  const data = await response.json();
  return data.response;
}

// Função para simular dados caso não tenha API real
async function getMockData() {
  return {
    leagues: [
      { id: 71, name: 'Brasileiro Série A', country: 'Brazil' },
      { id: 39, name: 'Premier League', country: 'England' }
    ],
    teams: {
      71: [
        { id: 131, name: 'Flamengo', logo: '' },
        { id: 134, name: 'Palmeiras', logo: '' }
      ],
      39: [
        { id: 40, name: 'Liverpool', logo: '' },
        { id: 50, name: 'Manchester City', logo: '' }
      ]
    },
    matches: [
      {
        fixture: { id: 1, date: '2023-05-15' },
        teams: { home: { id: 131, name: 'Flamengo' }, away: { id: 134, name: 'Palmeiras' } },
        goals: { home: 2, away: 1 },
        score: {
          halftime: { home: 1, away: 0 },
          fulltime: { home: 2, away: 1 }
        },
        statistics: [
          {
            type: 'Shots on Goal',
            value: { home: 5, away: 3 }
          },
          {
            type: 'Corners',
            value: { home: 7, away: 4 }
          }
        ]
      }
    ]
  };
}