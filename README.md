# 🍪 Cookie | Freshly Baked Artisan Cookies

A modern, highly performant, accessible, and SEO-optimized frontend web application for a boutique artisan bakery located in Lima, Peru. Built with pure web standards (HTML5, modular CSS3, and native ES6+ JavaScript modules), enriched with custom e-commerce interactions, GSAP ScrollTrigger reveals, and Matter.js 2D rigid-body physics.

---

## ✨ Features

- **Artisan Physics & Animations**: Matter.js 2D physics simulation of cookies tumbling inside an artisan paper bag, colliding naturally and transitioning to the featured product cards upon scrolling with GSAP ScrollTrigger.
- **Quick View Product Modal**: Detail modal presenting high-resolution cookie imagery, live quantity selectors, subtotal calculations, calorie and allergen information, and real-time wishlist toggling.
- **Interactive Shopping Cart Drawer**: Off-canvas slide-out drawer with dynamic subtotal calculations, free local shipping indicator, item quantity steppers, item removal, and flying product animation on add.
- **Wishlist Drawer**: Saved products drawer with real-time badge counters, persistence, and instant "Move to Cart" action.
- **Custom Cookie Box Builder**:
  - Choice of box sizes (4, 6, or 12 cookies).
  - Dynamic visual slots reflecting box progress, fill percentage, and capacity meter.
  - Flavor mix-and-match selector with real-time price calculations based on selected cookies.
  - Interactive individual cookie removal directly from visual box slots.
- **Simulated Checkout & Order Confirmation**:
  - Modal checkout form with client-side field validation (full name, email, phone, street address, city, postal code).
  - Order review summary with live itemized pricing.
  - Persistent simulated order receipts with unique order tracking numbers (#CK-XXXXX).
  - Full-screen multi-stream rainbow confetti celebration on order placement.
- **Notification System**: Accessible, non-blocking floating toast notifications queue with thumbnail previews and dismiss animations.
- **Technical SEO & Accessibility**:
  - Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`, `address`).
  - Google Schema.org `Bakery` JSON-LD structured data with truthful bakery details.
  - Complete Open Graph, Twitter Cards, preconnect hints, responsive image hints (`fetchpriority="high"`, `loading="lazy"`).
  - Keyboard accessible modal dialogs (`Escape` key listeners, ARIA dialog roles, labelled-by attributes).
  - Clean `robots.txt` and `sitemap.xml`.

---

## 📁 Final Project Architecture

```
Cookie/
│
├── index.html                  # Single semantic, SEO-optimized HTML entry point
├── robots.txt                  # Search engine crawler instructions
├── sitemap.xml                 # XML sitemap with canonical page anchors
├── README.md                   # Project documentation
│
├── assets/                     # Static media assets
│   └── img/                    # Optimized product and hero PNG assets
│
├── css/                        # Modular CSS Architecture
│   ├── style.css               # Sole CSS entry point (imports all stylesheets)
│   ├── responsive.css          # Unified media query breakpoints (<=340px to >=1150px)
│   │
│   ├── base/
│   │   ├── variables.css       # Design tokens, color palette, responsive typography
│   │   ├── typography.css      # Google Fonts & heading rules
│   │   └── reset.css           # Box reset, scrollbars, reusable container/grid classes
│   │
│   ├── layout/
│   │   ├── header.css          # Fixed header, badges, and action buttons
│   │   ├── navigation.css      # Responsive mobile/desktop navbar & links
│   │   └── footer.css          # Multi-column footer & social icons
│   │
│   ├── components/
│   │   ├── buttons.css         # Solid and ghost action buttons
│   │   ├── cards.css           # Base card shadows and hover lift states
│   │   ├── modals.css          # Base modal overlay and quick view styling
│   │   ├── cart.css            # Off-canvas cart drawer & flying cookie animation
│   │   ├── wishlist.css        # Wishlist specific drawer tweaks
│   │   ├── toast.css           # Floating feedback notification pills
│   │   ├── forms.css           # Form controls, input validation, checkout UI
│   │   └── confetti.css        # Confetti canvas styling
│   │
│   └── sections/
│       ├── home.css            # Hero banner, ratings, falling cookie layout
│       ├── featured.css        # Best-seller showcase cards
│       ├── about.css           # Bakery background & feature icons
│       ├── products.css        # Product grid & add-to-cart triggers
│       ├── box-builder.css     # 3-step custom box builder & visual slots
│       └── contact.css         # Map embed, WhatsApp card & opening hours
│
└── js/                         # Native ES6+ JavaScript Architecture
    ├── script.js               # Sole JS entry point (imports and coordinates modules)
    │
    ├── data/
    │   └── products.js         # Centralized product catalog and lookup helpers
    │
    ├── modules/
    │   ├── navigation.js       # Header scroll, mobile drawer menu, active link spy
    │   ├── animations.js       # GSAP ScrollTrigger reveals and staggered entrance
    │   ├── physics.js          # Matter.js 2D rigid-body simulation for cookies
    │   ├── quick-view.js       # Quick View product modal controller
    │   ├── cart.js             # Cart state, badge updates, flying animation
    │   ├── wishlist.js         # Wishlist storage, drawer sync, heart toggles
    │   ├── box-builder.js      # Custom box slots, meter & dynamic pricing
    │   ├── checkout.js         # Checkout form validation & summary renderer
    │   ├── order-summary.js    # Order confirmation modal & confetti trigger
    │   ├── toast.js            # Toast notifications manager
    │   ├── confetti.js         # High-performance canvas rainbow confetti
    │   └── storage.js          # LocalStorage abstractions (cart, wishlist, orders)
    │
    └── utils/
        ├── helpers.js          # Safe JSON parsing & common utilities
        └── currency.js         # Currency formatting helpers ($ X.XX)
```

---

## ⚡ Absolute Entry Point Rules

- **CSS**: Exactly one entry point: `css/style.css`.
- **JavaScript**: Exactly one entry point: `js/script.js`.
- No `main.js` or `main.css` exists in this architecture.
- Both entry points are linked cleanly in `index.html`:
  ```html
  <link rel="stylesheet" href="css/style.css" />
  ...
  <script type="module" src="js/script.js"></script>
  ```

---

## 🚀 Running Locally

Because this project utilizes native browser **ES Modules** (`<script type="module">`), modern browsers enforce CORS security policies when opening files directly via the `file://` protocol. A local development server is required:

### Option 1: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

### Option 2: Node.js (npx)
```bash
# Using http-server
npx http-server . -p 8080

# Or using serve
npx serve .
```

### Option 3: Python 3
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 🛠️ Technologies & Libraries

- **Markup & Styling**: HTML5, CSS3 Custom Properties (BEM-inspired naming convention), Responsive Grid & Flexbox.
- **JavaScript**: Native ES6+ (Modules, LocalStorage, Canvas API, Event Delegation).
- **Icons**: [Remix Icon v4](https://remixicon.com/) (CDN).
- **Animations**: [GSAP 3](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/) (CDN).
- **Physics**: [Matter.js 0.20](https://brm.io/matter-js/) (CDN).
- **Architecture**: Zero framework overhead (no React, Vue, Angular), zero build step required.

---

## ⚠️ Notes on Simulated E-Commerce

This is a portfolio and demonstration frontend application. All checkout interactions, orders, and receipts are simulated client-side using `localStorage`. No actual financial transactions or payment cards are processed.

