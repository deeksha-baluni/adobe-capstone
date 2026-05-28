/**
 * blocks/hero/hero.js
 * Renders the homepage hero — headline, CTA, stats, upcoming events panel.
 */

/**
 * @param {HTMLElement} block
 * @param {object} data  { stats, events }
 */
export default function decorate(block, { stats = {}, events = [] } = {}) {
  const typeLabels = {
    'In-person': { bg: 'var(--red-light)', color: 'var(--red)' },
    'Virtual':   { bg: '#e8f5e9',          color: '#2e7d32'     },
  };

  block.innerHTML = `
    <div class="hero-inner">
      <!-- Left: headline + CTA + stats -->
      <div class="hero-content fade-up">
        <div class="hero-tag" aria-label="Internal platform for Bengaluru chapter">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
          Adobe Internal — Bengaluru Chapter
        </div>

        <h1 class="hero-heading">
          Your community,<br>
          <span class="hero-heading-accent">all in one place</span>
        </h1>

        <p class="hero-sub">
          Discover clubs, join events, connect with colleagues, and explore everything your Adobe community has to offer.
        </p>

        <div class="hero-actions">
          <button class="btn-primary">Explore clubs</button>
          <button class="btn-outline">View my dashboard</button>
        </div>

        <div class="stats-row" role="list" aria-label="Community statistics">
          <div class="stat" role="listitem">
            <strong>${stats.clubs ?? 14}</strong>
            Active clubs
          </div>
          <div class="stat" role="listitem">
            <strong>${stats.members ?? '420+'}</strong>
            Members
          </div>
          <div class="stat" role="listitem">
            <strong>${stats.events ?? 8}</strong>
            Events this month
          </div>
        </div>
      </div>

      <!-- Right: upcoming events card -->
      <aside class="hero-events-card fade-up" style="animation-delay:.1s" aria-label="Upcoming events">
        <div class="hero-events-label">Upcoming events</div>
        <ul class="events-list" role="list">
          ${events.map(e => {
            const style = typeLabels[e.type] || { bg: '#f5f5f5', color: '#555' };
            return `
            <li class="event-item">
              <div class="event-date" aria-label="${e.month} ${e.day}">
                <span class="event-month">${e.month}</span>
                <strong class="event-day">${e.day}</strong>
              </div>
              <div class="event-info">
                <p class="event-title">${e.title}</p>
                <span class="event-meta">${e.club} · ${e.time}</span>
                <span class="event-type-tag" style="background:${style.bg};color:${style.color}">${e.type}</span>
              </div>
            </li>`;
          }).join('')}
        </ul>
        <a href="events.html" class="events-see-all">View all events →</a>
      </aside>
    </div>
  `;
}
