let AppState = loadState();

function navigateTo(view) {
  window.location.hash = view;
}

function renderCurrentView() {
  const hash = window.location.hash.slice(1) || 'welcome';
  const validViews = ['welcome', 'setup', 'dashboard', 'semester', 'planner', 'guide', 'scale'];

  if (!validViews.includes(hash)) {
    navigateTo('welcome');
    return;
  }

  updateNavActive(hash);

  switch (hash) {
    case 'welcome':
      renderWelcome();
      break;
    case 'setup':
      renderSetup(AppState);
      break;
    case 'dashboard':
      renderDashboard(AppState);
      break;
    case 'semester':
      renderSemesterCalculator(AppState);
      break;
    case 'planner':
      plannerCourses = AppState.planner.courses || [];
      renderPlanner(AppState);
      break;
    case 'guide':
      renderGuide();
      break;
    case 'scale':
      renderGPAScale();
      break;
  }
}

function updateNavActive(view) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + view);
  });
}

function initApp() {
  initI18n();

  window.addEventListener('hashchange', renderCurrentView);

  document.querySelector('.nav-mobile-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('open');
    });
  });

  if (!AppState.student.setupComplete && window.location.hash !== '#welcome') {
    navigateTo('welcome');
  }

  renderCurrentView();
}

document.addEventListener('DOMContentLoaded', initApp);
