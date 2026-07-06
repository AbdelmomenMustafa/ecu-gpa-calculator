let currentLang = 'en';

function getCurrentLang() {
  return localStorage.getItem('ecu-gpa-lang') || 'en';
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ecu-gpa-lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const enBtn = document.getElementById('lang-en');
  const arBtn = document.getElementById('lang-ar');
  if (enBtn && arBtn) {
    enBtn.classList.toggle('active', lang === 'en');
    arBtn.classList.toggle('active', lang === 'ar');
  }

  document.body.classList.toggle('rtl', lang === 'ar');

  if (typeof window.renderCurrentView === 'function') {
    window.renderCurrentView();
  }
}

function t(key, params = {}) {
  const keys = key.split('.');
  let value = translations[currentLang];
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }
  if (typeof value !== 'string') return key;

  return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
    return params[paramKey] !== undefined ? params[paramKey] : match;
  });
}

function isRTL() {
  return currentLang === 'ar';
}

function initI18n() {
  currentLang = getCurrentLang();
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl', currentLang === 'ar');

  const enBtn = document.getElementById('lang-en');
  const arBtn = document.getElementById('lang-ar');
  if (enBtn && arBtn) {
    enBtn.classList.toggle('active', currentLang === 'en');
    arBtn.classList.toggle('active', currentLang === 'ar');

    enBtn.addEventListener('click', () => setLang('en'));
    arBtn.addEventListener('click', () => setLang('ar'));
  }
}
