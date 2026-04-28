'use strict';

/* ============================================================
   CORE: showPage — GLOBAL so onclick="showPage('id')" works
   ============================================================ */
window.showPage = function(id) {
  if (!id) id = 'home';

  // Hide all pages
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });

  // Deactivate all sidebar nav items
  document.querySelectorAll('.nav-item[data-page]').forEach(function(n) {
    n.classList.remove('active');
  });

  // Show target page
  var page = document.getElementById('page-' + id);
  if (page) {
    page.classList.add('active');
  }

  // Activate sidebar nav item
  var navItem = document.querySelector('.nav-item[data-page="' + id + '"]');
  if (navItem) {
    navItem.classList.add('active');
    navItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');

  // Update URL hash (no page reload)
  history.replaceState(null, '', '#' + id);
};

/* ============================================================
   SIDEBAR NAV ITEMS — event listeners on buttons
   ============================================================ */
document.querySelectorAll('.nav-item[data-page]').forEach(function(item) {
  item.addEventListener('click', function() {
    showPage(this.getAttribute('data-page'));
  });
});

/* ============================================================
   MOBILE SIDEBAR TOGGLE
   ============================================================ */
var sidebar    = document.getElementById('sidebar');
var overlay    = document.getElementById('overlay');
var menuToggle = document.getElementById('menu-toggle');

menuToggle.addEventListener('click', function() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
});
overlay.addEventListener('click', function() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});

/* ============================================================
   THEME TOGGLE
   ============================================================ */
var themeBtn = document.getElementById('theme-btn');
var isDark   = true;
themeBtn.addEventListener('click', function() {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  themeBtn.textContent = isDark ? '☀️' : '🌙';
});

/* ============================================================
   COPY BUTTONS
   ============================================================ */
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.copy-btn');
  if (!btn) return;
  var pre = btn.closest('.cb').querySelector('pre');
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(function() {
    var orig = btn.textContent;
    btn.textContent = '✓ Copied';
    btn.classList.add('ok');
    setTimeout(function() {
      btn.textContent = orig;
      btn.classList.remove('ok');
    }, 1800);
  }).catch(function() {
    // Fallback for file:// protocol
    var ta = document.createElement('textarea');
    ta.value = pre.innerText;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    var orig = btn.textContent;
    btn.textContent = '✓ Copied';
    btn.classList.add('ok');
    setTimeout(function() {
      btn.textContent = orig;
      btn.classList.remove('ok');
    }, 1800);
  });
});

/* ============================================================
   ACCORDION
   ============================================================ */
document.addEventListener('click', function(e) {
  var hdr = e.target.closest('.acc-hdr');
  if (!hdr) return;
  var body   = hdr.nextElementSibling;
  var isOpen = hdr.classList.contains('open');
  hdr.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
});

/* ============================================================
   TABS
   ============================================================ */
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.tab-btn');
  if (!btn) return;
  var tabs   = btn.closest('.tabs');
  var target = btn.getAttribute('data-tab');
  tabs.querySelectorAll('.tab-btn').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-tab') === target);
  });
  tabs.querySelectorAll('.tab-panel').forEach(function(p) {
    p.classList.toggle('active', p.getAttribute('data-panel') === target);
  });
});

// Init first tab in each tab group
document.querySelectorAll('.tabs').forEach(function(tabs) {
  var first = tabs.querySelector('.tab-btn');
  if (first) {
    var target = first.getAttribute('data-tab');
    first.classList.add('active');
    var panel = tabs.querySelector('.tab-panel[data-panel="' + target + '"]');
    if (panel) panel.classList.add('active');
  }
});

/* ============================================================
   QUIZ
   ============================================================ */
document.addEventListener('click', function(e) {
  var opt = e.target.closest('.quiz-opt');
  if (!opt) return;
  var card = opt.closest('.quiz-card');
  if (card.dataset.answered) return;
  card.dataset.answered = '1';
  var isCorrect = opt.getAttribute('data-correct') === '1';
  opt.classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) {
    var right = card.querySelector('[data-correct="1"]');
    if (right) right.classList.add('correct');
  }
  var exp = card.querySelector('.quiz-exp');
  if (exp) { exp.classList.add('show', isCorrect ? 'correct' : 'wrong'); }
  card.querySelectorAll('.quiz-opt').forEach(function(o) {
    o.style.pointerEvents = 'none';
  });
});

/* ============================================================
   SEARCH
   ============================================================ */
var searchIndex = [
  { page: 'home',             title: 'Home — Overview & Roadmap',              section: 'Start Here'  },
  { page: 'java-oop',         title: 'Java OOP — Classes, Inheritance',        section: 'Java Core'   },
  { page: 'java-collections', title: 'Java Collections — List, Map, Set',      section: 'Java Core'   },
  { page: 'java8',            title: 'Java 8 — Lambda, Streams, Optional',     section: 'Java Core'   },
  { page: 'java-exceptions',  title: 'Java Exception Handling',                section: 'Java Core'   },
  { page: 'java-strings',     title: 'Java Strings & StringBuilder',           section: 'Java Core'   },
  { page: 'java-interfaces',  title: 'Java Interfaces & Abstract Classes',     section: 'Java Core'   },
  { page: 'intro',            title: 'Selenium Introduction & Architecture',   section: 'Selenium'    },
  { page: 'setup',            title: 'Environment Setup — Maven, pom.xml',     section: 'Selenium'    },
  { page: 'locators',         title: 'Locators — ID, Name, XPath, CSS',        section: 'Selenium'    },
  { page: 'xpath',            title: 'XPath & CSS Selectors — Advanced',       section: 'Selenium'    },
  { page: 'webdriver',        title: 'WebDriver API — All Methods',            section: 'Selenium'    },
  { page: 'waits',            title: 'Waits — Implicit, Explicit, Fluent',     section: 'Selenium'    },
  { page: 'actions',          title: 'Actions Class — Mouse & Keyboard',       section: 'Selenium'    },
  { page: 'handling',         title: 'Alerts, Frames, Windows, Cookies',       section: 'Selenium'    },
  { page: 'framework',        title: 'Hybrid Framework Design',                section: 'Framework'   },
  { page: 'testng-adv',       title: 'TestNG Advanced — Listeners, Parallel',  section: 'Framework'   },
  { page: 'datadriven',       title: 'Data-Driven — Excel, JSON',              section: 'Framework'   },
  { page: 'bdd',              title: 'BDD Cucumber — Feature Files',           section: 'Framework'   },
  { page: 'cicd',             title: 'CI/CD — Jenkins, GitHub Actions',        section: 'DevOps'      },
  { page: 'grid',             title: 'Selenium Grid & Docker',                 section: 'DevOps'      },
  { page: 'reporting',        title: 'ExtentReports & Allure',                 section: 'Reporting'   },
  { page: 'logging',          title: 'Log4j2 Logging in Automation',           section: 'Reporting'   },
  { page: 'interview',        title: 'Interview Q&A — 100+ Questions',         section: 'Interview'   },
  { page: 'cheatsheet',       title: 'Cheat Sheet — Quick Reference',          section: 'Reference'   },
];

var searchInput   = document.getElementById('search');
var searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', function() {
  var q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.classList.remove('show'); return; }
  var hits = searchIndex.filter(function(i) {
    return i.title.toLowerCase().indexOf(q) !== -1 ||
           i.section.toLowerCase().indexOf(q) !== -1;
  }).slice(0, 8);
  if (!hits.length) { searchResults.classList.remove('show'); return; }
  searchResults.innerHTML = hits.map(function(h) {
    return '<div class="sr-item" onclick="showPage(\'' + h.page + '\'); document.getElementById(\'search\').value=\'\'; document.getElementById(\'search-results\').classList.remove(\'show\')">' +
           '<div class="sr-title">' + h.title + '</div>' +
           '<div class="sr-section">' + h.section + '</div></div>';
  }).join('');
  searchResults.classList.add('show');
});

document.addEventListener('click', function(e) {
  if (!e.target.closest('#search-wrap')) {
    searchResults.classList.remove('show');
  }
});

/* ============================================================
   PROGRESS BARS — animate on load
   ============================================================ */
setTimeout(function() {
  document.querySelectorAll('.prog-fill[data-w]').forEach(function(el) {
    el.style.width = el.getAttribute('data-w');
  });
}, 300);

/* ============================================================
   INITIAL ROUTE — show page from URL hash
   ============================================================ */
(function() {
  var hash = window.location.hash.replace('#', '') || 'home';
  showPage(hash);
})();
