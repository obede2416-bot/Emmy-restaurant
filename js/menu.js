/**
 * EMMY Restaurant - Menu Module
 * Handles: Menu data, filtering, rendering, and search
 */

'use strict';

/* ============================================================
   MENU DATA
   Replace image URLs with local paths when assets are available.
   ============================================================ */
const MENU_DATA = [
  // --- BREAKFAST ---
  {
    id: 'b1',
    category: 'breakfast',
    name: 'Royal Eggs Benedict',
    desc: 'Poached eggs, smoked salmon, hollandaise sauce on toasted brioche.',
    price: 24.99,
    rating: 4.8,
    reviews: 142,
    badge: 'Chef\'s Pick',
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=600&q=80',
    isFav: false
  },
  {
    id: 'b2',
    category: 'breakfast',
    name: 'Truffle Avocado Toast',
    desc: 'Sourdough, whipped ricotta, truffle oil, micro herbs & cherry tomatoes.',
    price: 18.99,
    rating: 4.7,
    reviews: 98,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1603046891744-1f057f04f5cc?w=600&q=80',
    isFav: false
  },
  {
    id: 'b3',
    category: 'breakfast',
    name: 'Wagyu Steak & Eggs',
    desc: 'Premium wagyu, sunny-side eggs, seasonal greens & herb butter.',
    price: 42.00,
    rating: 4.9,
    reviews: 67,
    badge: 'Premium',
    image: 'assets/images/menu_steak.png',
    isFav: false
  },
  {
    id: 'b4',
    category: 'breakfast',
    name: 'French Toast Royale',
    desc: 'Thick brioche, crème brûlée custard, fresh berries, maple syrup.',
    price: 19.99,
    rating: 4.6,
    reviews: 115,
    badge: null,
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80',
    isFav: false
  },
  // --- LUNCH ---
  {
    id: 'l1',
    category: 'lunch',
    name: 'Lobster Bisque',
    desc: 'Velvety bisque with whole lobster tail, cream, brandy, fresh tarragon.',
    price: 36.00,
    rating: 4.9,
    reviews: 203,
    badge: 'Signature',
    image: 'assets/images/menu_lobster.png',
    isFav: false
  },
  {
    id: 'l2',
    category: 'lunch',
    name: 'Pan-Seared Duck Breast',
    desc: 'Duck breast, cherry jus, roasted root vegetables, pommes sarladaises.',
    price: 44.00,
    rating: 4.8,
    reviews: 87,
    badge: 'Chef\'s Pick',
    image: 'https://images.unsplash.com/photo-1544025162-d76594e31cae?w=600&q=80',
    isFav: false
  },
  {
    id: 'l3',
    category: 'lunch',
    name: 'Mediterranean Salad',
    desc: 'Arugula, heirloom tomatoes, feta, olives, lemon-herb vinaigrette.',
    price: 22.50,
    rating: 4.5,
    reviews: 76,
    badge: 'Healthy',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    isFav: false
  },
  {
    id: 'l4',
    category: 'lunch',
    name: 'EMMY Wagyu Burger',
    desc: 'Double wagyu patty, aged cheddar, truffle mayo, caramelised onions.',
    price: 38.00,
    rating: 4.9,
    reviews: 312,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    isFav: false
  },
  // --- DINNER ---
  {
    id: 'd1',
    category: 'dinner',
    name: 'Wagyu Beef Tenderloin',
    desc: 'A5 Wagyu, truffle butter, bone marrow sauce, asparagus, potato purée.',
    price: 89.00,
    rating: 5.0,
    reviews: 156,
    badge: 'Masterpiece',
    image: 'assets/images/menu_steak.png',
    isFav: false
  },
  {
    id: 'd2',
    category: 'dinner',
    name: 'Butter Poached Lobster',
    desc: 'Whole Atlantic lobster, beurre blanc, saffron potatoes, sea vegetables.',
    price: 95.00,
    rating: 4.9,
    reviews: 94,
    badge: 'Premium',
    image: 'assets/images/menu_lobster.png',
    isFav: false
  },
  {
    id: 'd3',
    category: 'dinner',
    name: 'Braised Lamb Shank',
    desc: 'Slow-braised lamb, rosemary jus, roasted garlic, creamy polenta.',
    price: 58.00,
    rating: 4.8,
    reviews: 178,
    badge: 'Chef\'s Pick',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80',
    isFav: false
  },
  {
    id: 'd4',
    category: 'dinner',
    name: 'Truffle Pasta Royale',
    desc: 'Hand-made tagliatelle, black truffle, pecorino, 24-month Parmesan.',
    price: 52.00,
    rating: 4.7,
    reviews: 201,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
    isFav: false
  },
  // --- DESSERTS ---
  {
    id: 'ds1',
    category: 'desserts',
    name: 'Chocolate Lava Cake',
    desc: 'Warm Valrhona chocolate, vanilla bean ice cream, gold leaf, raspberry.',
    price: 18.00,
    rating: 4.9,
    reviews: 388,
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80',
    isFav: false
  },
  {
    id: 'ds2',
    category: 'desserts',
    name: 'Crème Brûlée Classique',
    desc: 'Silky vanilla custard, caramelised sugar, fresh seasonal berries.',
    price: 15.00,
    rating: 4.8,
    reviews: 224,
    badge: null,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    isFav: false
  },
  {
    id: 'ds3',
    category: 'desserts',
    name: 'Tiramisu di EMMY',
    desc: 'House-made mascarpone, espresso-soaked ladyfingers, cocoa cloud.',
    price: 14.00,
    rating: 4.7,
    reviews: 167,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
    isFav: false
  },
  // --- DRINKS ---
  {
    id: 'dr1',
    category: 'drinks',
    name: 'EMMY Signature Cocktail',
    desc: 'Aged rum, elderflower, hibiscus, citrus, prosecco float, gold dust.',
    price: 22.00,
    rating: 4.9,
    reviews: 145,
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
    isFav: false
  },
  {
    id: 'dr2',
    category: 'drinks',
    name: 'Grand Cru Bordeaux',
    desc: 'Curated selection of premier Bordeaux vintages, per glass or bottle.',
    price: 45.00,
    rating: 5.0,
    reviews: 89,
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
    isFav: false
  },
  {
    id: 'dr3',
    category: 'drinks',
    name: 'Cold Brew Affair',
    desc: 'Single origin cold brew, vanilla cream, caramel, artisan ice sphere.',
    price: 12.00,
    rating: 4.6,
    reviews: 112,
    badge: null,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    isFav: false
  },
  {
    id: 'dr4',
    category: 'drinks',
    name: 'Tropical Bliss Mocktail',
    desc: 'Passion fruit, mango, mint, ginger beer, coconut water, edible flowers.',
    price: 14.00,
    rating: 4.7,
    reviews: 98,
    badge: 'Non-Alcoholic',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
    isFav: false
  }
];

/* ============================================================
   FAVOURITES PERSISTENCE
   ============================================================ */
const getFavourites = () => JSON.parse(localStorage.getItem('emmy-favs') || '[]');
const saveFavourites = (favs) => localStorage.setItem('emmy-favs', JSON.stringify(favs));

const initFavourites = () => {
  const favs = getFavourites();
  MENU_DATA.forEach(item => {
    item.isFav = favs.includes(item.id);
  });
};

/* ============================================================
   RENDER HELPERS
   ============================================================ */

/**
 * Build star HTML from numeric rating
 */
const renderStars = (rating) => {
  const full   = Math.floor(rating);
  const half   = rating % 1 >= 0.5;
  let stars    = '★'.repeat(full);
  if (half) stars += '½';
  return stars;
};

/**
 * Build a single menu card HTML
 */
const buildMenuCard = (item) => `
  <div class="menu-card" data-category="${item.category}" data-id="${item.id}" role="article"
       aria-label="${item.name}">
    <div class="menu-card-img">
      <img src="${item.image}" alt="${item.name}" loading="lazy" 
           onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'">
      ${item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : ''}
      <button class="menu-fav-btn ${item.isFav ? 'active' : ''}" 
              data-id="${item.id}" 
              aria-label="${item.isFav ? 'Remove from favourites' : 'Add to favourites'}"
              title="${item.isFav ? 'Remove from favourites' : 'Add to favourites'}">
        ${item.isFav ? '❤️' : '🤍'}
      </button>
    </div>
    <div class="menu-card-body">
      <p class="menu-card-category">${item.category}</p>
      <h3 class="menu-card-name">${item.name}</h3>
      <p class="menu-card-desc">${item.desc}</p>
      <div class="menu-card-footer">
        <span class="menu-card-price">$${item.price.toFixed(2)}</span>
        <div class="menu-card-rating" aria-label="Rating: ${item.rating} out of 5">
          <span class="stars" aria-hidden="true">${renderStars(item.rating)}</span>
          <span>(${item.reviews})</span>
        </div>
      </div>
      <button class="add-to-cart-btn ripple-container" 
              data-id="${item.id}"
              aria-label="Add ${item.name} to cart">
        🛒 Add to Cart
      </button>
    </div>
  </div>
`;

/* ============================================================
   MENU MODULE
   ============================================================ */
const Menu = (() => {
  let grid, filterBtns, currentFilter = 'all', currentSearch = '';

  /**
   * Get filtered + searched items
   */
  const getFilteredItems = () => {
    return MENU_DATA.filter(item => {
      const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
      const matchesSearch = !currentSearch || [item.name, item.desc, item.category].some(
        str => str.toLowerCase().includes(currentSearch.toLowerCase())
      );
      return matchesFilter && matchesSearch;
    });
  };

  /**
   * Render menu cards with animation
   */
  const render = () => {
    if (!grid) return;
    const items = getFilteredItems();

    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:60px 0; color:var(--text-muted);">
          <div style="font-size:3rem;margin-bottom:12px;">🍽️</div>
          <p>No dishes found. Try a different search.</p>
        </div>`;
      return;
    }

    // Fade out → update → fade in
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(10px)';

    setTimeout(() => {
      grid.innerHTML = items.map(buildMenuCard).join('');

      // Re-attach event listeners
      attachCardEvents();

      // Ripple effect on new buttons
      grid.querySelectorAll('.btn, .add-to-cart-btn, .filter-btn').forEach(btn => {
        btn.classList.add('ripple-container');
      });

      grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    }, 200);
  };

  /**
   * Attach event handlers to rendered cards
   */
  const attachCardEvents = () => {
    // Favourite buttons
    grid.querySelectorAll('.menu-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = MENU_DATA.find(i => i.id === id);
        if (!item) return;

        item.isFav = !item.isFav;
        const favs = getFavourites();

        if (item.isFav) {
          if (!favs.includes(id)) favs.push(id);
          btn.innerHTML = '❤️';
          btn.classList.add('active');
          window.EmmyApp?.Toast.show('Added to Favourites', item.name, 'info');
        } else {
          const idx = favs.indexOf(id);
          if (idx > -1) favs.splice(idx, 1);
          btn.innerHTML = '🤍';
          btn.classList.remove('active');
        }
        saveFavourites(favs);
      });
    });

    // Add to Cart buttons
    grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id   = btn.dataset.id;
        const item = MENU_DATA.find(i => i.id === id);
        if (!item) return;
        window.EmmyCart?.addItem(item);
        window.EmmyApp?.Toast.show('Added to Cart! 🛒', item.name, 'success');
      });
    });
  };

  /**
   * Set active filter
   */
  const setFilter = (category) => {
    currentFilter = category;
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });
    render();
  };

  /**
   * Set search term
   */
  const setSearch = (term) => {
    currentSearch = term;
    currentFilter = 'all'; // reset filter on search
    filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === 'all'));
    render();
  };

  const init = () => {
    grid       = document.getElementById('menu-grid');
    filterBtns = document.querySelectorAll('.filter-btn');

    if (!grid) return;

    initFavourites();

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Search input
    const searchInput = document.getElementById('menu-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => setSearch(e.target.value.trim()));
    }

    render();
  };

  return { init, setSearch, MENU_DATA };
})();

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Menu.init();
});

// Export
window.EmmyMenu = Menu;
