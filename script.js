'use strict';

// Safety net: if JS takes too long or errors, make all animated elements visible
// This prevents a blank page if IntersectionObserver or any other API fails
(function safetyNet() {
  setTimeout(function() {
    try {
      var els = document.querySelectorAll('[data-animate]');
      for (var i = 0; i < els.length; i++) {
        if (!els[i].classList.contains('visible')) {
          els[i].classList.add('visible');
          startCountersIn(els[i]);
        }
      }
    } catch(e) {}
  }, 1000);
})();

// ==================== COUNTER HELPERS ====================
// Defined at the top level so both the observer and safety net can call them.

function animateCounter(element) {
  try {
    if (element.dataset.animated) return; // don't replay
    element.dataset.animated = '1';
    var target = parseInt(element.dataset.target, 10);
    if (isNaN(target)) { element.textContent = element.dataset.target; return; }
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(easeOut * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  } catch(e) {}
}

function startCountersIn(parentEl) {
  try {
    var counters = parentEl.querySelectorAll('.counter[data-target]');
    for (var i = 0; i < counters.length; i++) {
      animateCounter(counters[i]);
    }
  } catch(e) {}
}

// ==================== NAV ====================
try {
  (function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var ticking = false;

    function updateNav() {
      if (window.scrollY > 100) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateNav();
  })();
} catch(e) { console.warn('Nav init failed:', e); }

// ==================== SCROLL ANIMATIONS ====================
// Counters are started here, when the element actually enters the viewport.
try {
  (function initScrollAnimations() {
    var elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    // Fallback for browsers without IntersectionObserver (older Android)
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add('visible');
        startCountersIn(elements[i]);
      }
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          startCountersIn(entry.target); // trigger counters when visible
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    elements.forEach(function(el) { observer.observe(el); });
  })();
} catch(e) {
  console.warn('Scroll animations failed:', e);
  try {
    var els = document.querySelectorAll('[data-animate]');
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add('visible');
      startCountersIn(els[i]);
    }
  } catch(e2) {}
}

// ==================== FAQ ACCORDION ====================
try {
  (function initFAQ() {
    var questions = document.querySelectorAll('.faq-question');
    if (!questions.length) return;

    function toggleFAQ(question) {
      var item = question.parentElement;
      if (!item) return;
      var answer = item.querySelector('.faq-answer');
      if (!answer) return;
      var isOpen = question.classList.contains('open');

      questions.forEach(function(q) {
        q.classList.remove('open');
        q.setAttribute('aria-expanded', 'false');
        var a = q.parentElement && q.parentElement.querySelector('.faq-answer');
        if (a) a.classList.remove('open');
      });

      if (!isOpen) {
        question.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    }

    questions.forEach(function(question) {
      question.addEventListener('click', function() { toggleFAQ(question); });
      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFAQ(question);
        }
      });
    });
  })();
} catch(e) { console.warn('FAQ failed:', e); }

// ==================== SMOOTH SCROLL ====================
try {
  (function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        var nav = document.getElementById('nav');
        var navHeight = (nav && nav.offsetHeight) || 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });
  })();
} catch(e) { console.warn('Smooth scroll failed:', e); }
