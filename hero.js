/**
 * blocks/hero/hero.js
 * Renders the homepage hero — centered headline, CTA, stats.
 */

/**
 * @param {HTMLElement} block
 * @param {object} data  { stats }
 */
export default function decorate(block, { stats = {} } = {}) {
  block.innerHTML = `
    <div class="hero-inner fade-up">

      <!-- Tag -->
      <div class="hero-tag" aria-label="Internal platform for Bengaluru chapter">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
        Adobe Internal — Bengaluru Chapter
      </div>

      <!-- Headline -->
      <h1 class="hero-heading">
        Your community,
        <span class="hero-heading-accent">all in one place</span>
      </h1>

      <!-- Subtext -->
      <p class="hero-sub">
        Discover clubs, join events, connect with colleagues, and explore everything your Adobe community has to offer.
      </p>

      <!-- CTAs -->
      <div class="hero-actions">
        <button class="btn-primary" id="hero-cta-explore">Explore clubs</button>
        <button class="btn-outline" id="hero-cta-dashboard">View my dashboard</button>
      </div>

      <!-- Stats -->
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
  `;
}
