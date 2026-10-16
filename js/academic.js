/**
 * Academic Webpage JavaScript for Quoc-Huy Vo
 * Zero dependencies. Blazing fast, accessible, lightweight.
 */

(function () {
  'use strict';

  // --- Theme Management ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function getPreferredTheme() {
    const saved = localStorage.getItem('academic_theme');
    if (saved) return saved;
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('academic_theme', theme);

    if (themeToggleBtn) {
      const sunIcon = themeToggleBtn.querySelector('.icon-sun');
      const moonIcon = themeToggleBtn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'inline-block';
          moonIcon.style.display = 'none';
          themeToggleBtn.setAttribute('title', 'Switch to light mode');
          themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'inline-block';
          themeToggleBtn.setAttribute('title', 'Switch to dark mode');
          themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
      }
    }
  }

  // Initialize theme immediately
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Publication Filter ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');

  if (filterButtons.length > 0 && pubCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        pubCards.forEach(card => {
          const categories = card.getAttribute('data-category') || '';
          if (filterValue === 'all' || categories.split(' ').includes(filterValue)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Toast Notification ---
  let toastTimeout;
  function showToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // --- BibTeX Accordion & Copy ---
  document.querySelectorAll('.bibtex-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const box = document.getElementById(targetId);
      if (box) {
        const isShown = box.classList.contains('show');
        box.classList.toggle('show');
        btn.classList.toggle('active', !isShown);
      }
    });
  });

  document.querySelectorAll('.bibtex-copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCodeId = btn.getAttribute('data-code');
      const codeElem = document.getElementById(targetCodeId);
      if (codeElem) {
        navigator.clipboard.writeText(codeElem.innerText.trim()).then(() => {
          showToast('BibTeX citation copied to clipboard!');
        }).catch(() => {
          showToast('Failed to copy to clipboard.');
        });
      }
    });
  });

  // --- Copy Email to Clipboard ---
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'huyvq1428@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied: ' + email);
      }).catch(() => {
        showToast('Could not copy email.');
      });
    });
  });

  // --- Active Nav Highlighting via IntersectionObserver ---
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }
})();
