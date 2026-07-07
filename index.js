// =========================================================
// DEV R B — portfolio interactions
// Vanilla JS, no dependencies.
// =========================================================

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // ---------------------------------------------------------
  // Footer year
  // ---------------------------------------------------------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------------------------------------------------------
  // Tab bar: click to scroll to section
  // ---------------------------------------------------------
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var sections = tabs
    .map(function (tab) {
      var id = tab.getAttribute('data-target');
      return document.getElementById(id);
    })
    .filter(Boolean);

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var id = tab.getAttribute('data-target');
      var target = document.getElementById(id);
      if (!target) return;
      var offset = 96; // chrome bar + tab bar height
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // ---------------------------------------------------------
  // Active tab tracking on scroll
  // ---------------------------------------------------------
  function setActiveTab(id) {
    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-target') === id);
    });
  }

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });

    // ---------------------------------------------------------
    // Scroll reveal for sections
    // ---------------------------------------------------------
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    sections.forEach(function (s) { revealObserver.observe(s); });
  } else {
    // Fallback: just show everything
    sections.forEach(function (s) { s.classList.add('in-view'); });
  }

  // ---------------------------------------------------------
  // Hero role: typing / rotating subtitle
  // ---------------------------------------------------------
  var roles = [
    'Software Developer — Data',
    'Full Stack Developer',
    '800+ LeetCode problems solved',
  ];

  var typedEl = document.getElementById('typed-role');

  if (typedEl && !prefersReducedMotion) {
    var roleIndex = 0;
    var charIndex = roles[0].length;
    var deleting = false;
    var holdTicks = 0;
    var TYPE_SPEED = 42;
    var DELETE_SPEED = 26;
    var HOLD_TICKS = 55; // ~2.3s at delete-tick rate used for hold too

    function tick() {
      var current = roles[roleIndex];

      if (!deleting) {
        if (charIndex < current.length) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          setTimeout(tick, TYPE_SPEED);
        } else {
          holdTicks++;
          if (holdTicks > HOLD_TICKS) {
            deleting = true;
            holdTicks = 0;
            setTimeout(tick, DELETE_SPEED);
          } else {
            setTimeout(tick, 40);
          }
        }
      } else {
        if (charIndex > 0) {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          setTimeout(tick, DELETE_SPEED);
        } else {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 300);
        }
      }
    }

    // start the rotation after the initial hold
    setTimeout(tick, 1800);
  }
})();
