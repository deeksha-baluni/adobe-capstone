/**
 * blocks/upcoming-events/upcoming-events.js
 * Small 3-up auto-gliding carousel for Upcoming Events.
 *
 * 📁 Event background images:
 *   Drop images into:  assets/images/events/<event-id>.jpg
 *   e.g.  assets/images/events/evt-1.jpg
 *         assets/images/events/evt-2.jpg
 *   The carousel picks them up automatically by event ID.
 */

const AUTO_GLIDE_MS = 3500;
const IMAGE_BASE    = './assets/images/events/';
const VISIBLE       = () => window.innerWidth < 560 ? 1 : window.innerWidth < 900 ? 2 : 3;

/**
 * @param {HTMLElement} block
 * @param {object} data  { events: Event[] }
 */
export default function decorate(block, { events = [] } = {}) {
  if (!events.length) return;

  let currentIndex = 0;
  let autoTimer    = null;
  const total      = events.length;

  /* ── Build HTML ── */
  block.innerHTML = `
    <div class="events-section-header">
      <h2>Upcoming events</h2>
      <a href="events.html" class="events-see-all" id="events-see-all">See all events →</a>
    </div>

    <div class="events-carousel-wrapper" id="events-carousel" style="padding: 0 20px;">

      <!-- Prev arrow -->
      <button class="events-arrow events-arrow-prev" id="events-prev" aria-label="Previous events">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <!-- Track -->
      <ul class="events-carousel-track" id="events-track" role="list">
        ${events.map(ev => renderEventCard(ev)).join('')}
      </ul>

      <!-- Next arrow -->
      <button class="events-arrow events-arrow-next" id="events-next" aria-label="Next events">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

    </div>

    <!-- Footer -->
    <div class="events-carousel-footer">
      <div class="events-dots" id="events-dots" role="tablist">
        ${events.map((_, i) => `
          <button class="events-dot ${i === 0 ? 'active' : ''}"
                  role="tab"
                  aria-selected="${i === 0}"
                  aria-label="Event slide ${i + 1}"
                  data-index="${i}">
          </button>
        `).join('')}
      </div>

      <div class="events-progress" title="Auto-advance progress">
        <div class="events-progress-bar" id="events-progress-bar"></div>
      </div>

      <span class="events-counter" id="events-counter" aria-live="polite">1 / ${total}</span>
    </div>
  `;

  /* ── Element refs ── */
  const track       = block.querySelector('#events-track');
  const prevBtn     = block.querySelector('#events-prev');
  const nextBtn     = block.querySelector('#events-next');
  const dots        = block.querySelectorAll('.events-dot');
  const progressBar = block.querySelector('#events-progress-bar');
  const counter     = block.querySelector('#events-counter');
  const wrapper     = block.querySelector('#events-carousel');

  /* ── Slide logic ── */
  function slideTo(rawIndex, resetTimer = true) {
    const vis     = VISIBLE();
    const maxIndex = Math.max(0, total - vis);
    currentIndex  = Math.max(0, Math.min(rawIndex, maxIndex));

    // Calculate offset: card width + gap
    const card    = track.querySelector('.event-card');
    const gap     = 16;
    const offset  = card ? (card.offsetWidth + gap) * currentIndex : 0;
    track.style.transform = `translateX(-${offset}px)`;

    // Dots — highlight the one matching currentIndex
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-selected', i === currentIndex);
    });

    // Counter
    counter.textContent = `${currentIndex + 1} / ${total}`;

    // Arrow states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    // Progress bar reset + animate
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
    autoTimer = setInterval(() => {
      const vis      = VISIBLE();
      const maxIndex = Math.max(0, total - vis);
      // wrap back to 0 when we hit the end
      slideTo(currentIndex >= maxIndex ? 0 : currentIndex + 1, false);
    }, AUTO_GLIDE_MS);
  }
  function stopAutoGlide()    { clearInterval(autoTimer); }
  function restartAutoGlide() { stopAutoGlide(); startAutoGlide(); }

  /* ── Controls ── */
  prevBtn.addEventListener('click', () => slideTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => slideTo(currentIndex + 1));
  dots.forEach(dot => dot.addEventListener('click', () => slideTo(Number(dot.dataset.index))));

  /* ── Pause on hover ── */
  wrapper.addEventListener('mouseenter', () => {
    stopAutoGlide();
    progressBar.style.transition = 'none';
  });
  wrapper.addEventListener('mouseleave', () => restartAutoGlide());

  /* ── Touch swipe ── */
  let touchStartX = 0;
  wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) slideTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  });

  /* ── Init ── */
  slideTo(0, false);
  startAutoGlide();
}

/* ── Render one event card ── */
function renderEventCard(ev) {
  const isVirtual   = ev.type === 'Virtual';
  const typePill    = isVirtual
    ? `<span class="event-type-pill virtual">Virtual</span>`
    : `<span class="event-type-pill in-person">In-person</span>`;

  const imagePath = `${IMAGE_BASE}${ev.id}.jpg`;

  return `
    <li class="event-card"
        style="background-image: url('${imagePath}');"
        data-event-id="${ev.id}"
        role="listitem">

      <div class="event-card-body">

        <!-- Top: date badge + type pill -->
        <div class="event-card-top">
          <div class="event-date-badge">
            <span class="ev-month">${ev.month}</span>
            <span class="ev-day">${ev.day}</span>
          </div>
          ${typePill}
        </div>

        <!-- Bottom: club, title, meta -->
        <div class="event-card-bottom">
          <div class="event-club-name">${ev.club}</div>
          <div class="event-title">${ev.title}</div>
          <div class="event-meta-row">
            <span class="event-meta-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              ${ev.time}
            </span>
            <span class="event-meta-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              ${ev.location}
            </span>
          </div>
        </div>

      </div>
    </li>
  `;
}
