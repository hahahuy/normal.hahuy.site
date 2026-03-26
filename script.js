/* normal.hahuy.site — script.js */
'use strict';

(() => {
  // ── Elements ──────────────────────────────────────────
  const pills       = document.querySelectorAll('.skill-pill[data-skill]');
  const cards       = document.querySelectorAll('.project-card[data-tags]');
  const resetBtns   = document.querySelectorAll('#resetFilter, #resetFilter2');
  const noResults   = document.getElementById('noResults');
  const noResultsSkillLabel = document.getElementById('noResultsSkill');
  const copyEmailBtn = document.querySelector('.copy-email');

  let activeSkill = null;

  // ── Tag Filter ────────────────────────────────────────
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const skill = pill.dataset.skill;

      if (activeSkill === skill) {
        // Deselect — show all
        clearFilter();
      } else {
        activateFilter(skill, pill);
      }
    });
  });

  resetBtns.forEach(btn => btn.addEventListener('click', clearFilter));

  function activateFilter(skill, activePill) {
    activeSkill = skill;

    // Update pill states
    pills.forEach(p => {
      p.classList.remove('active', 'dimmed');
      if (p.dataset.skill === skill) {
        p.classList.add('active');
      } else {
        p.classList.add('dimmed');
      }
    });

    // Show/hide cards
    let matchCount = 0;
    cards.forEach(card => {
      const tags = card.dataset.tags.split(',').map(t => t.trim());
      if (tags.includes(skill)) {
        card.classList.remove('hidden');
        matchCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Reset button visibility
    resetBtns.forEach(btn => btn.removeAttribute('hidden'));

    // No-results state
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

  // ── Card Fade-In (IntersectionObserver) ───────────────
  const fadeCards = document.querySelectorAll('.fade-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger by index
            const delay = i * 60;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    fadeCards.forEach(card => observer.observe(card));
  } else {
    // Fallback: show all immediately
    fadeCards.forEach(card => card.classList.add('visible'));
  }

  // ── Copy Email ────────────────────────────────────────
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.dataset.email;
      if (!email) return;

      navigator.clipboard.writeText(email).then(() => {
        copyEmailBtn.classList.add('copied');
        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        copyEmailBtn.classList.add('copied');
        setTimeout(() => copyEmailBtn.classList.remove('copied'), 2000);
      });
    });
  }
})();
