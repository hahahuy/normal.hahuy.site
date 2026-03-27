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

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
  });

  // ── Last Updated ─────────────────────────────────────
  const now = new Date();
  const fmt = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  document.querySelectorAll('#lastUpdated, #lastUpdatedFull').forEach(el => {
    el.textContent = 'Updated ' + fmt;
  });

  // ── Smooth Scroll Nav ─────────────────────────────────
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Scroll Spy ────────────────────────────────────────
  const sections  = ['about', 'experience', 'writing', 'projects', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  function setActiveNav(id) {
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
  }

  // Use IntersectionObserver — fire when section is ≥10% visible
  const spyObserver = new IntersectionObserver(
    entries => {
      // Pick the topmost intersecting section
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActiveNav(visible[0].target.id);
    },
    { rootMargin: '-10% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach(s => spyObserver.observe(s));

  // Set first nav link active on load
  setActiveNav('about');

  // ── Tag Filter ────────────────────────────────────────
  const pills     = document.querySelectorAll('.skill-pill[data-skill]');
  const cards     = document.querySelectorAll('.project-card[data-tags]');
  const resetBtns = document.querySelectorAll('#resetFilter, #resetFilter2');
  const noResults = document.getElementById('noResults');
  const noResultsLabel = document.getElementById('noResultsSkill');

  let activeSkill = null;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const skill = pill.dataset.skill;
      activeSkill === skill ? clearFilter() : activateFilter(skill);
    });
  });

  resetBtns.forEach(btn => btn.addEventListener('click', clearFilter));

  function activateFilter(skill) {
    activeSkill = skill;
    pills.forEach(p => {
      p.classList.remove('active', 'dimmed');
      p.classList.add(p.dataset.skill === skill ? 'active' : 'dimmed');
    });

    let count = 0;
    cards.forEach(card => {
      const match = card.dataset.tags.split(',').map(t => t.trim()).includes(skill);
      card.classList.toggle('hidden', !match);
      if (match) count++;
    });

    resetBtns.forEach(b => b.removeAttribute('hidden'));

    if (count === 0) {
      noResultsLabel.textContent = `"${skill}"`;
      noResults.removeAttribute('hidden');
    } else {
      noResults.setAttribute('hidden', '');
    }

    // Scroll to projects section when filter activates
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clearFilter() {
    activeSkill = null;
    pills.forEach(p => p.classList.remove('active', 'dimmed'));
    cards.forEach(c => c.classList.remove('hidden'));
    resetBtns.forEach(b => b.setAttribute('hidden', ''));
    noResults.setAttribute('hidden', '');
  }

  // ── Fade-In (sections + cards) ────────────────────────
  const fadeEls = document.querySelectorAll('.fade-section, .fade-card');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      entries => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          const delay = entry.target.classList.contains('fade-card') ? i * 55 : 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          fadeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );
    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── Language Bar Animation ────────────────────────────
  const langFills = document.querySelectorAll('.lang-fill');

  if ('IntersectionObserver' in window) {
    const langObserver = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('animate');
            langObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.8 }
    );
    langFills.forEach(f => langObserver.observe(f));
  } else {
    langFills.forEach(f => f.classList.add('animate'));
  }

  // ── Copy Email (sidebar + contact section) ────────────
  function attachCopyEmail(btn) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const email = btn.dataset.email;
      if (!email) return;

      const show = () => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      };

      navigator.clipboard.writeText(email).then(show).catch(() => {
        const ta = Object.assign(document.createElement('textarea'), {
          value: email, style: 'position:fixed;opacity:0',
        });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        show();
      });
    });
  }

  document.querySelectorAll('.copy-email').forEach(attachCopyEmail);
})();
