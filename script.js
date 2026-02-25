'use strict';

// ==================== NAV ====================
// Show sticky nav on scroll down, hide on scroll up
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNav() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }

    lastScrollY = currentScrollY;
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

// ==================== SCROLL ANIMATIONS ====================
// Reveal elements on scroll using Intersection Observer
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
})();

// ==================== COUNTERS ====================
// Animate stats numbers from 0 to target
(function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 1600;
    const start = performance.now();

    function step(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  // Start animations immediately on page load
  counters.forEach(counter => animateCounter(counter));
})();

// ==================== FAQ ACCORDION ====================
// Toggle FAQ items, close others when one opens
(function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  function toggleFAQ(question) {
    const item = question.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isOpen = question.classList.contains('open');

    // Close all
    questions.forEach(q => {
      q.classList.remove('open');
      q.setAttribute('aria-expanded', 'false');
      q.parentElement.querySelector('.faq-answer').classList.remove('open');
    });

    // Toggle current
    if (!isOpen) {
      question.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  }

  questions.forEach(question => {
    question.addEventListener('click', () => toggleFAQ(question));
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(question);
      }
    });
  });
})();

// ==================== SMOOTH SCROLL ====================
// Smooth anchor scrolling for nav links
(function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.getElementById('nav')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
})();
