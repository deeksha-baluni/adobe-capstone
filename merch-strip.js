/**
 * blocks/merch-strip/merch-strip.js
 * Renders the 4-up merch spotlight row.
 */

/**
 * @param {HTMLElement} block
 * @param {object} data  { merch: MerchItem[] }
 */
export default function decorate(block, { merch = [] } = {}) {
  block.innerHTML = `
    <div class="section-header">
      <h2>Club merch spotlight</h2>
      <a href="merch.html" class="see-all">Visit shop →</a>
    </div>
    <ul class="merch-strip" role="list">
      ${merch.map(item => `
        <li class="merch-card">
          <div class="merch-img" style="background:${item.iconBg}" aria-hidden="true">${item.icon}</div>
          <div class="merch-body">
            <p class="merch-name">${item.name}</p>
            <span class="merch-sub">${item.sub}</span>
            <div class="merch-price">${item.price}</div>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
}
