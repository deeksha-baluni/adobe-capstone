/**
 * blocks/clubs-grid/clubs-grid.js
 * Full-screen single-card auto-gliding carousel for Featured Clubs.
 *
 * 📁 Club background images:
 *   Drop your images into:  assets/images/clubs/<club-id>.jpg
 *   e.g.  assets/images/clubs/adobe-lens.jpg
 *         assets/images/clubs/dev-guild.jpg
 *   The carousel will automatically pick them up by club ID.
 */

import { isMemberOf, joinClub, leaveClub } from '../../utils/auth-helpers.js';

const AUTO_GLIDE_MS = 4500; // ms between auto-slides
const IMAGE_BASE    = './assets/images/clubs/'; // <-- put images here

/**
 * @param {HTMLElement} block
 * @param {object} data  { clubs: Club[] }
 */
export default function decorate(block, { clubs = [] } = {}) {
  if (!clubs.length) return;

  let currentIndex = 0;
  let autoTimer    = null;
  const total      = clubs.length;

  /* ── Build HTML ── */
  block.innerHTML = `
    <div class="clubs-section-header">
      <h2>Featured clubs</h2>
      <a href="clubs.html" class="see-all" id="clubs-see-all">See all clubs →</a>
    </div>

    <div class="clubs-carousel-wrapper" id="clubs-carousel">

      <!-- Arrow buttons -->
      <button class="carousel-arrow carousel-arrow-prev" id="clubs-prev" aria-label="Previous club">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button class="carousel-arrow carousel-arrow-next" id="clubs-next" aria-label="Next club">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <!-- Sliding track -->
      <ul class="clubs-carousel-track" id="clubs-track" role="list">
        ${clubs.map((club, i) => renderSlide(club, i)).join('')}
      </ul>

    </div>

    <!-- Footer: dots + progress + counter -->
    <div class="carousel-footer">
      <div class="carousel-dots" id="clubs-dots" role="tablist">
        ${clubs.map((_, i) => `
          <button class="carousel-dot ${i === 0 ? 'active' : ''}"
                  role="tab"
                  aria-selected="${i === 0}"
                  aria-label="Club ${i + 1}"
                  data-index="${i}">
          </button>
        `).join('')}
      </div>

      <div class="carousel-progress" title="Auto-advance progress">
        <div class="carousel-progress-bar" id="clubs-progress-bar"></div>
      </div>

      <span class="carousel-counter" id="clubs-counter" aria-live="polite">
        1 / ${total}
      </span>
    </div>
  `;

  /* ── Element refs ── */
  const track       = block.querySelector('#clubs-track');
  const prevBtn     = block.querySelector('#clubs-prev');
  const nextBtn     = block.querySelector('#clubs-next');
  const dots        = block.querySelectorAll('.carousel-dot');
  const progressBar = block.querySelector('#clubs-progress-bar');
  const counter     = block.querySelector('#clubs-counter');

  /* ── Slide to index ── */
  function slideTo(index, resetTimer = true) {
    currentIndex = ((index % total) + total) % total; // wrap around

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-selected', i === currentIndex);
    });

    // Counter
    counter.textContent = `${currentIndex + 1} / ${total}`;

    // Progress bar — reset then animate
    progressBar.style.transition = 'none';
    progressBar.style.width      = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressBar.style.transition = `width ${AUTO_GLIDE_MS}ms linear`;
        progressBar.style.width      = '100%';
      });
    });

    if (resetTimer) restartAutoGlide();
  }

  /* ── Auto-glide ── */
  function startAutoGlide() {
    autoTimer = setInterval(() => slideTo(currentIndex + 1, false), AUTO_GLIDE_MS);
  }
  function stopAutoGlide()    { clearInterval(autoTimer); }
  function restartAutoGlide() { stopAutoGlide(); startAutoGlide(); }

  /* ── Arrow controls ── */
  prevBtn.addEventListener('click', () => slideTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => slideTo(currentIndex + 1));

  /* ── Dot controls ── */
  dots.forEach(dot => {
    dot.addEventListener('click', () => slideTo(Number(dot.dataset.index)));
  });

  /* ── Pause on hover ── */
  const wrapper = block.querySelector('#clubs-carousel');
  wrapper.addEventListener('mouseenter', () => {
    stopAutoGlide();
    progressBar.style.transition = 'none';
  });
  wrapper.addEventListener('mouseleave', () => {
    restartAutoGlide();
  });

  /* ── Touch / swipe ── */
  let touchStartX = 0;
  wrapper.addEventListener('touchstart',  e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend',    e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) slideTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  });

  /* ── Join / Leave ── */
  block.querySelectorAll('.btn-join').forEach(btn => {
    btn.addEventListener('click', () => {
      const clubId = btn.dataset.clubId;
      const joined = isMemberOf(clubId);
      if (joined) {
        leaveClub(clubId);
        btn.textContent = '+ Join';
        btn.setAttribute('aria-pressed', 'false');
        btn.closest('.club-card').classList.remove('is-member');
      } else {
        joinClub(clubId);
        btn.textContent = '✓ Joined';
        btn.setAttribute('aria-pressed', 'true');
        btn.closest('.club-card').classList.add('is-member');
      }
    });
  });

  /* ── Init ── */
  slideTo(0, false);
  startAutoGlide();
}

/* ── Render one full-width slide ── */
function renderSlide(club, i) {
  const joined    = isMemberOf(club.id);
  const imagePath = `${IMAGE_BASE}${club.id}.jpg`;

  return `
    <li class="club-card ${joined ? 'is-member' : ''}"
        style="
          --club-accent: ${club.accent};
          background-image: url('${imagePath}');
        "
        data-club-id="${club.id}"
        aria-label="${club.name} club"
        role="listitem">

      <div class="club-card-content">
        <div class="club-card-left">
          <span class="club-tag">${club.tag}</span>
          <div class="club-name">${club.name}</div>
          <div class="club-desc">${club.desc}</div>
        </div>

        <div class="club-card-right">
          <button class="btn-join"
                  data-club-id="${club.id}"
                  aria-pressed="${joined}"
                  aria-label="${joined ? 'Leave' : 'Join'} ${club.name}">
            ${joined ? '✓ Joined' : '+ Join'}
          </button>
        </div>
      </div>

    </li>
  `;
}
