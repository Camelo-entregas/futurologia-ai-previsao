document.addEventListener('DOMContentLoaded', async function() {
  const leagueSelect = document.getElementById('league-select');
  const homeTeamSelect = document.getElementById('home-team');
  const awayTeamSelect = document.getElementById('away-team');
  const analyzeBtn = document.getElementById('analyze-btn');
  const resultsContainer = document.getElementById('analysis-results');
  const statsGrid = document.querySelector('.stats-grid');
  const aiRecommendation = document.getElementById('ai-recommendation');

  // Carrega campeonatos
  let leagues, teams;
  
  try {
    // leagues = await fetchLeagues(); // Use esta linha com API real
    const mockData = await getMockData();
    leagues = mockData.leagues;
    teams = mockData.teams;
    
    leagueSelect.innerHTML = '<option value="">Selecione um campeonato</option>';
    leagues.forEach(league => {
      leagueSelect.innerHTML += `<option value="${league.id}">${league.name} (${league.country})</option>`;
    });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    leagueSelect.innerHTML = '<option value="">Erro ao carregar campeonatos</option>';
  }

  // Evento de seleção de campeonato
  leagueSelect.addEventListener('change', async function() {
    const leagueId = this.value;
    
    if (!leagueId) {
      homeTeamSelect.innerHTML = '<option value="">Selecione um campeonato primeiro</option>';
      awayTeamSelect.innerHTML = '<option value="">Selecione um campeonato primeiro</option>';
      homeTeamSelect.disabled = true;
      awayTeamSelect.disabled = true;
      return;
    }
    
    try {
      // teams = await fetchTeams(leagueId); // Use esta linha com API real
      const teamList = teams[leagueId] || [];
      
      homeTeamSelect.innerHTML = '<option value="">Selecione o time mandante</option>';
      awayTeamSelect.innerHTML = '<option value="">Selecione o time visitante</option>';
      
      teamList.forEach(team => {
        homeTeamSelect.innerHTML += `<option value="${team.id}">${team.name}</option>`;
        awayTeamSelect.innerHTML += `<option value="${team.id}">${team.name}</option>`;
      });
      
      homeTeamSelect.disabled = false;
      awayTeamSelect.disabled = false;
    } catch (error) {
      console.error('Erro ao carregar times:', error);
      homeTeamSelect.innerHTML = '<option value="">Erro ao carregar times</option>';
      awayTeamSelect.innerHTML = '<option value="">Erro ao carregar times</option>';
    }
  });

  // Evento de análise
  analyzeBtn.addEventListener('click', async function() {
    const leagueId = leagueSelect.value;
    const homeTeamId = homeTeamSelect.value;
    const awayTeamId = awayTeamSelect.value;
    
    if (!leagueId || !homeTeamId || !awayTeamId) {
      alert('Selecione um campeonato e ambos os times para analisar!');
      return;
    }
    
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisando...';
    
    try {
      // Simulação de análise - substitua por chamadas reais à API
      const homeTeamName = homeTeamSelect.options[homeTeamSelect.selectedIndex].text;
      const awayTeamName = awayTeamSelect.options[awayTeamSelect.selectedIndex].text;
      
      // Gerar estatísticas simuladas
      const stats = generateMockStats(homeTeamName, awayTeamName);
      
      // Exibir resultados
      displayResults(stats);
      
      // Gerar recomendação
      const recommendation = generateRecommendation(stats);
      aiRecommendation.innerHTML = recommendation;
      
      resultsContainer.classList.remove('hidden');
    } catch (error) {
      console.error('Erro na análise:', error);
      alert('Erro ao analisar o confronto. Tente novamente.');
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = '<i class="fas fa-chart-line"></i> Analisar Confronto';
    }
  });

  function generateMockStats(homeTeam, awayTeam) {
    return {
      homeTeam,
      awayTeam,
      lastMatches: 5,
      homeWins: Math.floor(Math.random() * 4),
      awayWins: Math.floor(Math.random() * 3),
      draws: Math.floor(Math.random() * 2),
      homeGoals: Math.floor(Math.random() * 10) + 5,
      awayGoals: Math.floor(Math.random() * 8) + 3,
      avgHomeGoals: (Math.random() * 2 + 1).toFixed(1),
      avgAwayGoals: (Math.random() * 1.5 + 0.5).toFixed(1),
      over2_5: Math.floor(Math.random() * 3) + 2,
      corners: Math.floor(Math.random() * 30) + 10,
      yellowCards: Math.floor(Math.random() * 15) + 5,
      redCards: Math.floor(Math.random() * 3),
      bothScored: Math.floor(Math.random() * 3) + 1,
      homeWinProbability: Math.floor(Math.random() * 40) + 40,
      awayWinProbability: Math.floor(Math.random() * 30) + 20,
      drawProbability: 100 - (Math.floor(Math.random() * 40) + 40 + Math.floor(Math.random() * 30) + 20)
    };
  }

  function displayResults(stats) {
    statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Vitórias do ${stats.homeTeam}</div>
        <div class="stat-value">${stats.homeWins}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Vitórias do ${stats.awayTeam}</div>
        <div class="stat-value">${stats.awayWins}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Empates</div>
        <div class="stat-value">${stats.draws}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Gols (${stats.homeTeam})</div>
        <div class="stat-value">${stats.homeGoals}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Gols (${stats.awayTeam})</div>
        <div class="stat-value">${stats.awayGoals}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Jogos com Over 2.5</div>
        <div class="stat-value">${stats.over2_5}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Escanteios</div>
        <div class="stat-value">${stats.corners}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Cartões Amarelos</div>
        <div class="stat-value">${stats.yellowCards}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Cartões Vermelhos</div>
        <div class="stat-value">${stats.redCards}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Ambos marcaram</div>
        <div class="stat-value">${stats.bothScored}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Prob. Vitória ${stats.homeTeam}</div>
        <div class="stat-value">${stats.homeWinProbability}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Prob. Empate</div>
        <div class="stat-value">${stats.drawProbability}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Prob. Vitória ${stats.awayTeam}</div>
        <div class="stat-value">${stats.awayWinProbability}%</div>
      </div>
    `;
  }

  function generateRecommendation(stats) {
    let recommendation = `Baseado nos últimos ${stats.lastMatches} jogos analisados:<br><br>`;
    
    // Probabilidade de vitória
    if (stats.homeWinProbability > 50) {
      recommendation += `📈 <strong>${stats.homeTeam} tem alta probabilidade de vitória (${stats.homeWinProbability}%)</strong><br>`;
    } else if (stats.awayWinProbability > 45) {
      recommendation += `📉 <strong>${stats.awayTeam} tem boa chance de vitória (${stats.awayWinProbability}%)</strong><br>`;
    } else {
      recommendation += `⚖ <strong>Jogo equilibrado, maior probabilidade de empate (${stats.drawProbability}%)</strong><br>`;
    }
    
    // Over/Under
    if (stats.over2_5 >= 3) {
      recommendation += `🎯 <strong>Ótima chance de Over 2.5 gols (aconteceu em ${stats.over2_5} dos últimos 5 jogos)</strong><br>`;
    } else {
      recommendation += `🛡 <strong>Jogo mais defensivo, considere Under 2.5 gols</strong><br>`;
    }
    
    // Ambos marcam
    if (stats.bothScored >= 3) {
      recommendation += `🔔 <strong>Ambos times marcam frequentemente (${stats.bothScored} dos últimos 5)</strong><br>`;
    }
    
    // Cartões
    if (stats.yellowCards > 12) {
      recommendation += `🟨 <strong>Alto número de cartões amarelos esperado (média de ${(stats.yellowCards/5).toFixed(1)} por jogo)</strong><br>`;
    }
    
    recommendation += `<br>📊 <em>Análise gerada em ${new Date().toLocaleString()}</em>`;
    
    return recommendation;
  }
});