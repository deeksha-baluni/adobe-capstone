/**
 * blocks/nav/nav.js
 * Renders the top navigation bar.
 * EDS note: block receives a <div class="nav"> table from the document.
 */

import { getCurrentUser } from '../../utils/auth-helpers.js';

const LINKS = [
  { label: 'Home',      href: 'index.html',     key: 'home' },
  { label: 'Clubs',     href: 'clubs.html',      key: 'clubs' },
  { label: 'Events',    href: 'events.html',     key: 'events' },
  { label: 'Resources', href: 'resources.html',  key: 'resources' },
  { label: 'Gallery',   href: 'gallery.html',    key: 'gallery' },
  { label: 'Merch',     href: 'merch.html',      key: 'merch' },
];

/** Determine active page from current filename */
function getActivePage() {
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  if (filename === '' || filename === 'index.html') return 'home';
  return filename.replace('.html', '');
}

/**
 * Default export — EDS block signature.
 * @param {HTMLElement} block  The container element in index.html
 * @param {object}      data   Injected by blocks.js (user object)
 */
export default function decorate(block, { user } = {}) {
  const activePage = getActivePage();
  const currentUser = user || getCurrentUser() || { initials: '?', name: 'Guest' };

  block.innerHTML = `
    <div class="nav-inner">

      <!-- LEFT: Logo -->
      <a href="index.html" class="nav-logo" aria-label="Adobe Clubs home">
        <div class="adobe-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
            <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM.411 22.624L8.886 1.376H15.28L6.794 22.624zM23.589 22.624h-6.403l-2.99-7.573 2.29-5.403z"/>
          </svg>
        </div>
        <span>Clubs</span>
      </a>

      <!-- CENTER: Nav links -->
      <div class="nav-center">
        <nav aria-label="Main navigation">
          <ul class="nav-links" role="list">
            ${LINKS.map(link => `
              <li>
                <a href="${link.href}"
                   class="${activePage === link.key ? 'active' : ''}"
                   ${activePage === link.key ? 'aria-current="page"' : ''}>
                  ${link.label}
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>
      </div>

      <!-- RIGHT: Profile avatar only -->
      <div class="nav-right">
        <button class="avatar" aria-label="User menu: ${currentUser.name}">
          ${currentUser.initials}
        </button>
      </div>

    </div>
  `;
}
