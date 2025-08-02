document.addEventListener('DOMContentLoaded', function() {
  // Botão de previsões
  const predictionsBtn = document.getElementById('predictionsBtn');
  predictionsBtn.addEventListener('click', function() {
    window.location.href = '#predictions';
    loadPredictions();
  });

  // Botão de demonstração
  const demoBtn = document.getElementById('demoBtn');
  demoBtn.addEventListener('click', function() {
    showDemo();
  });

  // Função para carregar previsões
  function loadPredictions() {
    // Implementar chamada à API futuramente
    console.log('Carregando previsões...');
  }

  // Função para mostrar demonstração
  function showDemo() {
    alert('Demonstração interativa será implementada em breve!');
  }
});