/**
 * EMMY Restaurant - Search Module
 * Handles: Global live search overlay, instant filtering
 */

'use strict';

const Search = (() => {
  let overlay, input, resultsContainer;

  /* ---- Build result card ---- */
  const buildResult = (item) => `
    <div class="menu-card" style="font-size:0.85rem;" role="option" tabindex="0"
         aria-label="${item.name}">
      <div class="menu-card-img" style="height:140px;">
        <img src="${item.image}" alt="${item.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=70'">
      </div>
      <div class="menu-card-body" style="padding:12px;">
        <p class="menu-card-category">${item.category}</p>
        <h4 class="menu-card-name" style="font-size:1rem;">${item.name}</h4>
        <div class="menu-card-footer" style="margin-top:8px;">
          <span class="menu-card-price">$${item.price.toFixed(2)}</span>
          <button class="add-to-cart-btn ripple-container" data-id="${item.id}" 
                  style="padding:8px;margin-top:0;font-size:0.75rem;"
                  aria-label="Add ${item.name} to cart">
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  `;

  const search = (query) => {
    if (!resultsContainer) return;

    const q = query.trim().toLowerCase();

    if (!q) {
      resultsContainer.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px 0;color:var(--text-muted);">
          <p style="font-size:2rem;">🔍</p>
          <p>Start typing to search our menu...</p>
        </div>`;
      return;
    }

    const MENU_DATA = window.EmmyMenu?.MENU_DATA || [];
    const results = MENU_DATA.filter(item =>
      item.name.toLowerCase().includes(q)   ||
      item.desc.toLowerCase().includes(q)   ||
      item.category.toLowerCase().includes(q)
    );

    if (!results.length) {
      resultsContainer.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px 0;color:var(--text-muted);">
          <p style="font-size:2rem;">😕</p>
          <p>No results for "<strong>${query}</strong>"</p>
          <p style="font-size:0.8rem;margin-top:8px;">Try searching for a dish, category, or ingredient.</p>
        </div>`;
      return;
    }

    resultsContainer.innerHTML = results.map(buildResult).join('');

    // Attach cart events
    resultsContainer.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = MENU_DATA.find(i => i.id === btn.dataset.id);
        if (item) {
          window.EmmyCart?.addItem(item);
          window.EmmyApp?.Toast.show('Added to Cart! 🛒', item.name, 'success');
          closeOverlay();
        }
      });
    });
  };

  const openOverlay = () => {
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input?.focus(), 100);
  };

  const closeOverlay = () => {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
    if (input) input.value = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
  };

  const init = () => {
    overlay          = document.getElementById('search-overlay');
    input            = document.getElementById('global-search-input');
    resultsContainer = document.getElementById('search-results');

    if (!overlay) return;

    // Search trigger buttons
    document.querySelectorAll('[data-search-trigger]').forEach(btn => {
      btn.addEventListener('click', openOverlay);
    });

    // Live search
    let debounceTimer;
    input?.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => search(e.target.value), 250);
    });

    // Close button
    overlay.querySelector('.search-close-btn')?.addEventListener('click', closeOverlay);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOverlay();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        overlay.classList.contains('open') ? closeOverlay() : openOverlay();
      }
    });
  };

  return { init, open: openOverlay, close: closeOverlay };
})();

document.addEventListener('DOMContentLoaded', () => Search.init());

window.EmmySearch = Search;
