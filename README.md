# EMMY Restaurant — Premium Restaurant Website

![EMMY Restaurant](assets/images/hero_restaurant.png)

> *"Taste Excellence at EMMY — Fresh ingredients. Exceptional dining. Unforgettable moments."*

---

## 🍽️ About

**EMMY** is a fully functional, premium-quality restaurant website built with **HTML5, CSS3, and JavaScript (ES6)**. The design features a luxury aesthetic, smooth animations, and a polished user experience across all devices.

---

## ✨ Features

### Core Functionality
- ✅ **Responsive Navigation** — Sticky header, mobile hamburger menu, smooth scrolling
- ✅ **Hero Section** — Parallax background, typing effect, floating food elements
- ✅ **About Section** — Animated statistics counters
- ✅ **Menu System** — Filterable by category with live search
- ✅ **Shopping Cart** — Add/remove items, quantity control, tax calculation, checkout
- ✅ **Reservation System** — Full validation, local storage, confirmation modal
- ✅ **Masonry Gallery** — Lightbox popup with keyboard navigation
- ✅ **Testimonials Carousel** — Auto-play, touch swipe, keyboard control
- ✅ **Special Offers** — Countdown timers
- ✅ **Contact Form** — Validation and success feedback
- ✅ **Newsletter** — Email validation and subscription

### Premium UI Features
- ✅ **Dark/Light Mode Toggle** — Persisted in localStorage
- ✅ **Custom Cursor** — Smooth follower cursor with hover states
- ✅ **Page Loader** — Branded loading animation
- ✅ **Scroll Progress Bar** — Gold gradient top bar
- ✅ **Toast Notifications** — Multi-type notification system
- ✅ **Back to Top Button** — Smooth animated return
- ✅ **Floating WhatsApp Button** — Direct chat link
- ✅ **Floating Reserve Button** — Quick access CTA
- ✅ **Glassmorphism Cards** — Frosted glass effect
- ✅ **Ripple Button Effects** — Premium micro-interactions
- ✅ **Intersection Observer Animations** — Scroll-triggered fade/slide animations
- ✅ **Favourite Items** — Heart toggle with localStorage

### Technical
- ✅ **Modular JavaScript** — 6 separate JS modules
- ✅ **Local Storage** — Cart, reservations, favourites, newsletter, dark mode
- ✅ **SEO Optimized** — Meta tags, Open Graph, JSON-LD structured data
- ✅ **Accessibility** — ARIA labels, keyboard navigation, focus indicators
- ✅ **Lazy Loading** — Native + Intersection Observer fallback
- ✅ **Cross-Browser** — Chrome, Firefox, Safari, Edge

---

## 📁 Folder Structure

```
emmy-restaurant/
│
├── index.html              # Main one-page website
├── menu.html               # Dedicated menu page (extensible)
├── robots.txt              # SEO robots file
├── sitemap.xml             # XML sitemap
│
├── css/
│   ├── style.css           # Core design system + all components
│   ├── responsive.css      # Mobile/tablet breakpoints
│   └── animations.css      # Keyframes + animation utilities
│
├── js/
│   ├── app.js              # Core: nav, cursor, dark mode, scroll, toast
│   ├── menu.js             # Menu data, filter, render, search
│   ├── cart.js             # Shopping cart + checkout
│   ├── reservation.js      # Reservation form + validation
│   ├── gallery.js          # Gallery grid + lightbox + carousel
│   └── search.js           # Global search overlay
│
├── assets/
│   ├── images/             # Restaurant + food images
│   ├── icons/              # Icons
│   ├── videos/             # Video assets (placeholder)
│   └── fonts/              # Custom fonts (placeholder)
│
└── README.md
```

---

## 🚀 Getting Started

### Open Locally
Simply open `index.html` in any modern web browser. No build tools or server required.

```bash
# On Windows
start emmy-restaurant/index.html

# Or double-click the file in Explorer
```

### Deploy to Netlify / Vercel / GitHub Pages
1. Push the `emmy-restaurant/` folder to a GitHub repository
2. Connect to Netlify / Vercel
3. Deploy the root directory — no build command needed

---

## 🔌 Backend Integration (Ready to Connect)

The codebase includes placeholder functions for:

| Service      | Purpose                | File              |
|--------------|------------------------|-------------------|
| **Firebase** | Database, Auth         | `reservation.js`  |
| **EmailJS**  | Email confirmations    | `reservation.js`  |
| **Stripe**   | Payment processing     | `cart.js`         |
| **Paystack** | Alternative payments   | `cart.js`         |
| **Google Maps** | Map embed          | `index.html`      |

---

## 🎨 Design System

| Token          | Value                 |
|----------------|-----------------------|
| Primary Color  | `#8B0000` (Burgundy)  |
| Secondary      | `#D4AF37` (Gold)      |
| Background     | `#111111`             |
| Card BG        | `#1C1C1C`             |
| Heading Font   | Playfair Display      |
| Body Font      | Poppins               |

---

## 📋 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 88+            |
| Firefox | 85+            |
| Safari  | 14+            |
| Edge    | 88+            |

---

## 📄 License

© 2024 EMMY Restaurant. All rights reserved.

---

*Built with ❤️ and exceptional taste by the EMMY Design Studio.*
