/**
 * EMMY Restaurant - Shopping Cart Module
 * Handles: Add/remove items, quantity, local storage, checkout
 */

'use strict';

const Cart = (() => {
  const STORAGE_KEY = 'emmy-cart';
  const TAX_RATE    = 0.1; // 10%

  let items = [];
  let sidebarEl, countBadge, itemsContainer, subtotalEl, taxEl, totalEl;

  /* ---- Persistence ---- */
  const load   = () => { items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); };
  const save   = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  const clear  = () => { items = []; save(); };

  /* ---- Core Operations ---- */

  /**
   * Add or increment item in cart
   * @param {Object} menuItem - item from MENU_DATA
   */
  const addItem = (menuItem) => {
    const existing = items.find(i => i.id === menuItem.id);
    if (existing) {
      existing.qty++;
    } else {
      items.push({
        id:    menuItem.id,
        name:  menuItem.name,
        price: menuItem.price,
        image: menuItem.image,
        qty:   1
      });
    }
    save();
    render();
    openSidebar();
    updateBadge();
  };

  const removeItem = (id) => {
    items = items.filter(i => i.id !== id);
    save();
    render();
    updateBadge();
  };

  const updateQty = (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) removeItem(id);
    else { save(); render(); updateBadge(); }
  };

  /* ---- Totals ---- */
  const getSubtotal = () => items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const getTax      = () => getSubtotal() * TAX_RATE;
  const getTotal    = () => getSubtotal() + getTax();
  const getCount    = () => items.reduce((sum, i) => sum + i.qty, 0);

  /* ---- Badge ---- */
  const updateBadge = () => {
    if (!countBadge) return;
    const count = getCount();
    countBadge.textContent = count;
    countBadge.classList.toggle('show', count > 0);
  };

  /* ---- Sidebar ---- */
  const openSidebar  = () => {
    sidebarEl?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebarEl?.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* ---- Render Cart ---- */
  const render = () => {
    if (!itemsContainer) return;

    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty" role="status">
          <span class="empty-icon" aria-hidden="true">🛒</span>
          <p>Your cart is empty</p>
          <p style="font-size:0.75rem;margin-top:4px;">Add dishes from the menu</p>
        </div>`;
    } else {
      itemsContainer.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.id}" role="listitem">
          <img src="${item.image}" alt="${item.name}" 
               onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80'">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
            <div class="cart-quantity" role="group" aria-label="Quantity for ${item.name}">
              <button class="qty-btn" data-action="decrease" data-id="${item.id}" 
                      aria-label="Decrease quantity">−</button>
              <span class="qty-num" aria-live="polite">${item.qty}</span>
              <button class="qty-btn" data-action="increase" data-id="${item.id}" 
                      aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-remove" data-id="${item.id}" 
                  aria-label="Remove ${item.name} from cart">✕</button>
        </div>
      `).join('');
    }

    // Update totals
    const subtotal = getSubtotal();
    const tax      = getTax();
    const total    = getTotal();

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl)      taxEl.textContent      = `$${tax.toFixed(2)}`;
    if (totalEl)    totalEl.textContent    = `$${total.toFixed(2)}`;

    // Attach quantity & remove handlers
    itemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = btn.dataset.action === 'increase' ? 1 : -1;
        updateQty(btn.dataset.id, delta);
      });
    });

    itemsContainer.querySelectorAll('.cart-remove').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
  };

  /* ---- Checkout ---- */
  const openCheckout = () => {
    if (items.length === 0) {
      window.EmmyApp?.Toast.show('Cart is Empty', 'Please add items before checking out.', 'warning');
      return;
    }

    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    // Populate checkout modal
    const itemsPreview = modal.querySelector('.checkout-items-preview');
    if (itemsPreview) {
      itemsPreview.innerHTML = items.map(i =>
        `<div class="checkout-item-row">
          <span>${i.name} × ${i.qty}</span>
          <span>$${(i.price * i.qty).toFixed(2)}</span>
        </div>`
      ).join('');
    }

    const sub = getSubtotal(), tax = getTax(), tot = getTotal();
    const rows = modal.querySelectorAll('.checkout-totals .row');
    if (rows[0]) rows[0].querySelector('span:last-child').textContent = `$${sub.toFixed(2)}`;
    if (rows[1]) rows[1].querySelector('span:last-child').textContent = `$${tax.toFixed(2)}`;
    const grand = modal.querySelector('.grand span:last-child');
    if (grand) grand.textContent = `$${tot.toFixed(2)}`;

    modal.classList.add('open');
    closeSidebar();
  };

  const processPayment = (method) => {
    const modal = document.getElementById('checkout-modal');
    modal?.classList.remove('open');

    // Placeholder for Stripe / Paystack integration
    // StripeAPI.checkout(items, getTotal());
    // PaystackAPI.checkout(items, getTotal());

    // Save order to localStorage for now
    const order = {
      id:     'ORD-' + Date.now(),
      date:   new Date().toISOString(),
      items:  [...items],
      total:  getTotal(),
      method
    };
    const orders = JSON.parse(localStorage.getItem('emmy-orders') || '[]');
    orders.push(order);
    localStorage.setItem('emmy-orders', JSON.stringify(orders));

    clear();
    render();
    updateBadge();

    window.EmmyApp?.Toast.show(
      'Order Placed! 🎉',
      `Order #${order.id} confirmed via ${method === 'stripe' ? 'Stripe' : 'Paystack'}.`,
      'success',
      6000
    );

    // Show success modal
    showOrderSuccess(order.id);
  };

  const showOrderSuccess = (orderId) => {
    const modal = document.getElementById('order-success-modal');
    if (!modal) return;
    const idEl = modal.querySelector('.order-id');
    if (idEl) idEl.textContent = orderId;
    modal.classList.add('open');
  };

  /* ---- INIT ---- */
  const init = () => {
    sidebarEl      = document.getElementById('cart-sidebar');
    countBadge     = document.querySelector('.cart-count');
    itemsContainer = document.getElementById('cart-items');
    subtotalEl     = document.getElementById('cart-subtotal');
    taxEl          = document.getElementById('cart-tax');
    totalEl        = document.getElementById('cart-total');

    load();
    render();
    updateBadge();

    // Toggle cart sidebar
    document.getElementById('cart-toggle')?.addEventListener('click', () => {
      if (sidebarEl?.classList.contains('open')) closeSidebar();
      else openSidebar();
    });

    document.querySelector('.cart-close')?.addEventListener('click', closeSidebar);

    // Checkout button
    document.querySelector('.checkout-btn')?.addEventListener('click', openCheckout);

    // Payment method buttons
    document.querySelectorAll('.pay-btn').forEach(btn => {
      btn.addEventListener('click', () => processPayment(btn.dataset.method));
    });

    // Close checkout modal
    document.getElementById('checkout-modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('checkout-modal')) {
        document.getElementById('checkout-modal').classList.remove('open');
      }
    });

    // Close order success modal
    document.getElementById('order-success-modal')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close-btn')) {
        document.getElementById('order-success-modal').classList.remove('open');
      }
    });
  };

  return { init, addItem, removeItem, updateQty, getTotal, getCount, items: () => items };
})();

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => Cart.init());

window.EmmyCart = Cart;
