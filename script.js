/* normal.hahuy.site — script.js */
'use strict';

(() => {
  // ── Dark Mode ─────────────────────────────────────────
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  function setTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  // Sync when OS preference changes (and no manual override stored)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ── Tag Filter ────────────────────────────────────────
  const pills     = document.querySelectorAll('.skill-pill[data-skill]');
  const cards     = document.querySelectorAll('.project-card[data-tags]');
  const resetBtns = document.querySelectorAll('#resetFilter, #resetFilter2');
  const noResults = document.getElementById('noResults');
  const noResultsSkillLabel = document.getElementById('noResultsSkill');

  let activeSkill = null;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const skill = pill.dataset.skill;
      if (activeSkill === skill) {
        clearFilter();
      } else {
        activateFilter(skill);
      }
    });
  });

  resetBtns.forEach(btn => btn.addEventListener('click', clearFilter));

  function activateFilter(skill) {
    activeSkill = skill;

    pills.forEach(p => {
      p.classList.remove('active', 'dimmed');
      p.classList.add(p.dataset.skill === skill ? 'active' : 'dimmed');
    });

    let matchCount = 0;
    cards.forEach(card => {
      const tags = card.dataset.tags.split(',').map(t => t.trim());
      const match = tags.includes(skill);
      card.classList.toggle('hidden', !match);
      if (match) matchCount++;
    });

    resetBtns.forEach(btn => btn.removeAttribute('hidden'));

    if (matchCount === 0) {
      noResultsSkillLabel.textContent = `"${skill}"`;
      noResults.removeAttribute('hidden');
    } else {
      noResults.setAttribute('hidden', '');
    }
  }

  function clearFilter() {
    activeSkill = null;
    pills.forEach(p => p.classList.remove('active', 'dimmed'));
    cards.forEach(card => card.classList.remove('hidden'));
    resetBtns.forEach(btn => btn.setAttribute('hidden', ''));
    noResults.setAttribute('hidden', '');
  }

  // ── IntersectionObserver Fade-In ───────────────────────
  const fadeEls = document.querySelectorAll('.fade-card, .fade-section');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = entry.target.classList.contains('fade-section') ? 0 : i * 60;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── Language bar animation ────────────────────────────
  const langFills = document.querySelectorAll('.lang-fill');

  if ('IntersectionObserver' in window) {
    const langObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            langObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    langFills.forEach(bar => langObserver.observe(bar));
  } else {
    langFills.forEach(bar => bar.classList.add('animate'));
  }

  // ── Copy Email ────────────────────────────────────────
  const copyEmailBtn = document.querySelector('.copy-email');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.dataset.email;
      if (!email) return;

      const show = () => {
        copyEmailBtn.classList.add('copied');
        setTimeout(() => copyEmailBtn.classList.remove('copied'), 2000);
      };

      navigator.clipboard.writeText(email).then(show).catch(() => {
        // Fallback for older browsers
        const ta = Object.assign(document.createElement('textarea'), {
          value: email,
          style: 'position:fixed;opacity:0',
        });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        show();
      });
    });
  }
})();
