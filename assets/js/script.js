/*=============== SHOW & CLOSE MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* Menu show */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/* Menu hidden */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== REMOVE MOBILE MENU ===============*/
const navLink = document.querySelectorAll(".nav_link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav_link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*=============== CHANGE HEADER STYLES ===============*/
const scrollHeader = () => {
  const header = document.getElementById("header");
  // Add the .scroll-header class if the bottom scroll of the viewport is greater than 50
  this.scrollY >= 50
    ? header.classList.add("scroll-header")
    : header.classList.remove("scroll-header");
};
window.addEventListener("scroll", scrollHeader);

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  // Add the .show-scroll class if the bottom scroll of the viewport is greater than 350
  this.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
};
window.addEventListener("scroll", scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

// Link the ID of each section (section id="home") to each link (a href="#home")
// and activate the link with the class .active-link
const scrollActive = () => {
  // We get the position by scrolling down
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const id = section.id, // id of each section
      top = section.offsetTop - 50, // Distance from the top edge
      height = section.offsetHeight, // Element height
      link = document.querySelector(".nav_menu a[href*=" + id + "]"); // id nav link

    if (!link) return;

    link.classList.toggle(
      "active-link",
      scrollY > top && scrollY <= top + height,
    );
  });
};
window.addEventListener("scroll", scrollActive);

/*=============== HOME & FEATURED ANIMATION (GSAP + MATTER JS) ===============*/
const homeImage = document.querySelector(".home_image"),
  homeBag = document.querySelector(".home_bag"),
  homeCookies = document.querySelectorAll(".home_cookie"),
  featuredImgs = document.querySelectorAll(".featured_img"),
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (homeImage && !reduceMotion) {
  const { Engine, Runner, Bodies, Body, Composite, Events } = Matter;

  /* Physics world inside the bag (calculated on a 280px wide bag) */
  const bagWidth = 280,
    cookieRadius = 36,
    wallLeft = 29,
    wallRight = 251,
    bagFloor = 405,
    bagCeiling = -30;

  const engine = Engine.create(),
    runner = Runner.create();

  engine.gravity.y = 1.2;

  // Invisible walls of the bag (tall walls so the cookies always fall back inside)
  Composite.add(engine.world, [
    Bodies.rectangle(wallLeft - 50, bagFloor - 1000, 100, 2200, {
      isStatic: true,
    }),
    Bodies.rectangle(wallRight + 50, bagFloor - 1000, 100, 2200, {
      isStatic: true,
    }),
    Bodies.rectangle(bagWidth / 2, bagFloor + 50, 400, 100, {
      isStatic: true,
      label: "floor",
    }),
  ]);

  // Each cookie is a circle inside the physics world
  const cookies = [...homeCookies].map((cookie) => ({
    cookie,
    body: Bodies.circle(bagWidth / 2, -100, cookieRadius, {
      label: "cookie",
      restitution: 0.5,
      friction: 0.05,
      frictionAir: 0.015,
    }),
    inBag: false,
    flying: false,
    from: { x: bagWidth / 2, y: -100 },
    angle: 0,
  }));

  const getScale = () => homeBag.offsetWidth / bagWidth;

  // Moves a cookie image to a point (x, y) inside .home_image
  const placeCookie = (cookie, x, y, angle, size = 1) => {
    const moveX = x - (cookie.offsetLeft + cookie.offsetWidth / 2),
      moveY = y - (cookie.offsetTop + cookie.offsetHeight / 2);

    cookie.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${angle}rad) scale(${size})`;
  };

  // Puts a cookie inside the bag (the physics control it)
  const addCookie = (item, x, y) => {
    if (item.inBag) return;

    Body.setPosition(item.body, { x, y });
    Body.setVelocity(item.body, { x: 0, y: 0 });
    Body.setAngularVelocity(item.body, 0);
    Composite.add(engine.world, item.body);
    item.inBag = true;
  };

  // Draws the cookies in the position calculated by the physics
  Events.on(engine, "afterUpdate", () => {
    const scale = getScale();

    cookies.forEach(({ cookie, body, inBag }) => {
      if (!inBag) return;

      // Maximum spin speed, so the cookies turn slowly
      Body.setAngularVelocity(
        body,
        gsap.utils.clamp(-0.2, 0.2, body.angularVelocity),
      );
      placeCookie(
        cookie,
        body.position.x * scale,
        body.position.y * scale,
        body.angle,
      );
    });
  });

  // Small bounce of the bag when a cookie hits the bottom
  Events.on(engine, "collisionStart", ({ pairs }) => {
    pairs.forEach(({ bodyA, bodyB }) => {
      const cookie = bodyA.label === "cookie" ? bodyA : bodyB,
        floor = bodyA.label === "floor" || bodyB.label === "floor";

      if (floor && cookie.label === "cookie" && cookie.speed > 4) {
        gsap.fromTo(
          homeBag,
          { scaleY: 0.97 },
          {
            scaleY: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
            transformOrigin: "bottom",
          },
        );
      }
    });
  });

  /* 1. Intro: the bag comes up and the cookies fall inside */
  const dropCookies = () => {
    cookies.forEach((item, index) => {
      gsap.delayedCall(index * 0.25, () => {
        if (item.flying) return;

        addCookie(item, gsap.utils.random(70, 210), -60);
        Body.setAngle(item.body, gsap.utils.random(0, Math.PI));
        gsap.to(item.cookie, { opacity: 1, duration: 0.3 });
      });
    });
  };

  // Invisible lid: the cookies can peek out of the bag, but they don't fly away
  const addLid = () => {
    Composite.add(
      engine.world,
      Bodies.rectangle(bagWidth / 2, bagCeiling - 50, 400, 100, {
        isStatic: true,
      }),
    );
  };

  gsap.set(homeCookies, { opacity: 0 });

  gsap
    .timeline()
    .from(".home_data > *", {
      y: -100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    })
    .from(
      homeBag,
      { yPercent: 120, opacity: 0, duration: 1.2, ease: "back.out(1.4)" },
      0.3,
    )
    .add(dropCookies, "-=0.2")
    .add(addLid, "+=2.5");

  Runner.run(runner, engine);

  /* 2. Mouse over the bag: the cookies move away and get mixed */
  homeImage.addEventListener("mousemove", (e) => {
    const rect = homeImage.getBoundingClientRect(),
      scale = getScale(),
      mouseX = (e.clientX - rect.left) / scale,
      mouseY = (e.clientY - rect.top) / scale;

    cookies.forEach(({ body, inBag }) => {
      if (!inBag) return;

      const distanceX = body.position.x - mouseX,
        distanceY = body.position.y - mouseY,
        distance = Math.hypot(distanceX, distanceY) || 1;

      if (distance > 140) return;

      // The closer the mouse, the stronger the push
      const push = ((140 - distance) / 140) * 2.5;

      Body.setVelocity(body, {
        x: gsap.utils.clamp(
          -9,
          9,
          body.velocity.x + (distanceX / distance) * push + e.movementX * 0.08,
        ),
        y: gsap.utils.clamp(
          -9,
          9,
          body.velocity.y +
            (distanceY / distance) * push +
            e.movementY * 0.08 -
            0.5,
        ),
      });
      Body.setAngularVelocity(body, body.angularVelocity + e.movementX * 0.002);
    });
  });

  // On touch screens, touching the bag makes the cookies jump
  homeImage.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") return;

    cookies.forEach(({ body, inBag }) => {
      if (!inBag) return;

      Body.setVelocity(body, {
        x: gsap.utils.random(-6, 6),
        y: gsap.utils.random(-14, -8),
      });
      Body.setAngularVelocity(body, gsap.utils.random(-0.2, 0.2));
    });
  });

  /* 3. Scroll: three cookies leave the bag and travel to their featured card */
  const mix = (start, end, progress) => start + (end - start) * progress,
    easeInOut = (progress) =>
      progress < 0.5
        ? 2 * progress * progress
        : 1 - (-2 * progress + 2) ** 2 / 2;

  // Back in the bag: the physics take control again
  const backToBag = (item, target) => {
    item.flying = false;
    item.cookie.style.zIndex = "";
    addCookie(
      item,
      item.from.x,
      Math.max(item.from.y, bagCeiling + cookieRadius + 10),
    );
    Body.setAngle(item.body, item.angle);
    gsap.set(item.cookie, { opacity: 1 });
    gsap.set(target, { opacity: 0 });
  };

  const moveCookie = (item, target, progress) => {
    const { cookie, body } = item,
      goingBack = progress < item.progress;

    item.progress = progress;

    // It is falling into the bag: the scroll doesn't move it
    if (item.falling) return;

    if (progress <= 0) {
      item.waiting = false;
      if (item.flying) backToBag(item, target);
      return;
    }

    // It already fell into the bag: it stays there until the scroll goes down again
    if (item.waiting && goingBack) return;

    // Leaves the bag: this cookie stops using the physics
    if (!item.flying) {
      item.flying = true;
      item.waiting = false;
      item.from = { x: body.position.x, y: body.position.y };
      item.outX = body.position.x; // Where it comes out of the bag
      item.angle = body.angle % (Math.PI * 2);

      if (item.inBag) {
        Composite.remove(engine.world, body);
        item.inBag = false;
      }
    }

    const scale = getScale(),
      homeRect = homeImage.getBoundingClientRect(),
      targetRect = target.getBoundingClientRect(),
      size = cookie.offsetWidth,
      startX = item.from.x * scale,
      startY = item.from.y * scale,
      outX = item.outX * scale,
      outY = -size * 0.6, // Above the mouth of the bag
      endX = targetRect.left + targetRect.width / 2 - homeRect.left,
      endY = targetRect.top + targetRect.height / 2 - homeRect.top;

    // Coming back: as soon as it reaches the bag, it falls inside without stopping
    if (progress < 0.15 && item.out) {
      const fall = { step: 0 };

      item.out = false;
      item.falling = true;
      cookie.style.zIndex = "";

      gsap.to(fall, {
        step: 1,
        duration: 0.25,
        ease: "power2.in",
        onUpdate: () =>
          placeCookie(
            cookie,
            mix(outX, startX, fall.step),
            mix(outY, startY, fall.step),
            item.angle,
          ),
        onComplete: () => {
          item.falling = false;
          item.waiting = true;
          backToBag(item, target);
          Body.setVelocity(body, { x: 0, y: 5 });
        },
      });
      return;
    }

    if (progress < 0.15) {
      // The cookie goes up and comes out of the bag (behind the bag)
      const step = easeInOut(progress / 0.15);

      cookie.style.zIndex = "";
      placeCookie(
        cookie,
        mix(startX, outX, step),
        mix(startY, outY, step),
        item.angle,
      );
    } else {
      // When it comes back, it enters through the mouth of the bag in its lane and falls
      item.out = true;
      item.from = { x: item.lane, y: bagCeiling + cookieRadius + 10 };

      // The cookie travels to its card (in front of everything)
      // It goes down at the same speed as the scroll, so it is always visible
      const step = (progress - 0.15) / 0.85,
        smooth = easeInOut(step),
        jump = Math.sin(Math.PI * step) * 40, // Small jump when it comes out
        x = mix(outX, endX, smooth),
        y = mix(outY, endY, step) - jump;

      cookie.style.zIndex = 5;
      placeCookie(
        cookie,
        x,
        y,
        mix(item.angle, Math.PI * 2, smooth),
        mix(1, targetRect.width / size, smooth),
      );
    }

    // The cookie arrives: the image of the card takes its place
    const arrived = progress >= 1;

    gsap.set(target, { opacity: arrived ? 1 : 0 });
    gsap.set(cookie, { opacity: arrived ? 0 : 1 });

    // From the card, it comes back straight to its lane, so the cookies don't cross above the bag
    if (arrived) item.outX = item.lane;
  };

  gsap.registerPlugin(ScrollTrigger);

  featuredImgs.forEach((featuredImg, index) => {
    const item = cookies[index], // cookie-1, cookie-2 and cookie-3 are the featured cookies
      travel = { progress: 0 };

    // Left, center and right lanes, so the three cookies don't fall on top of each other
    item.lane =
      wallLeft +
      cookieRadius +
      (index * (wallRight - wallLeft - cookieRadius * 2)) / 2;

    gsap.set(featuredImg, { opacity: 0 });

    gsap.to(travel, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: homeImage, // Starts while the bag is still visible
        start: "top 15%",
        endTrigger: ".featured", // The three cookies arrive at the same time
        end: "top 20%",
        scrub: 0.6,
      },
      onUpdate: () => moveCookie(item, featuredImg, travel.progress),
    });
  });
}

/*=============== GSAP ANIMATION ===============*/
if (!reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  // The elements fall from the top when they enter the screen
  const reveal = (elements, vars = {}, trigger = elements) => {
    gsap.from(elements, {
      y: -100,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      ...vars,
      scrollTrigger: { trigger, start: "top 85%" },
    });
  };

  // Cards that fall one by one, each one with its image (with a small turn)
  const revealCards = (cards, image) => {
    gsap.set(cards, { y: -100, opacity: 0 });
    if (image) gsap.set(image, { y: -60, rotation: -30, opacity: 0 });

    ScrollTrigger.batch(cards, {
      start: "top 85%",
      once: true,
      onEnter: (batch) => {
        const timeline = gsap.timeline();

        batch.forEach((card, index) => {
          timeline.to(
            card,
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              clearProps: "all",
            },
            index * 0.15,
          ); // Clears GSAP styles so the hover works

          if (image) {
            timeline.to(
              card.querySelector(image),
              {
                y: 0,
                rotation: 0,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.7)",
                clearProps: "all",
              },
              index * 0.15 + 0.5,
            );
          }
        });
      },
    });
  };

  /* Section titles */
  reveal(".featured :is(.section_subtitle, .section_title)", {
    stagger: 0.2,
  });
  reveal(".products :is(.section_subtitle, .section_title)", {
    stagger: 0.2,
  });
  reveal(".contact :is(.section_subtitle, .section_title)", { stagger: 0.2 });

  /* Featured: the card comes up, its content appears and the cookie lands later */
  gsap.utils.toArray(".featured_card").forEach((card) => {
    gsap
      .timeline({ scrollTrigger: { trigger: card, start: "top 85%" } })
      .from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all",
      }) // Clears GSAP styles so the hover works
      .from(
        card.querySelectorAll(":scope > :not(.featured_img)"),
        { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 },
        "-=0.4",
      );
  });

  /* About */
  reveal(".about_img");
  reveal(".about_data > *", { stagger: 0.15, delay: 0.3 }, ".about_data");

  /* Products */
  revealCards(".products_card", ".products_img");
  reveal(".products_more");

  /* Contact */
  revealCards(".contact_card");
  reveal(".contact_button");
  reveal(".contact_map", { delay: 0.3 });

  /* Footer */
  reveal(".footer_group > *", { stagger: 0.2 }, ".footer");
  reveal(".footer_data", { stagger: 0.2 }, ".footer_content");
}

/*====================================================================
  ==================== COOKIE SHOP E-COMMERCE CORE ===================
  ====================================================================*/

/*=============== 1. PRODUCT CATALOG DATA ===============*/
const PRODUCTS_DATA = [
  {
    id: "cookie-classic",
    name: "Classic Chocolate",
    shortName: "Classic",
    price: 5.99,
    image: "./assets/img/cookie-1.png",
    alt: "Classic chocolate chip cookie",
    badge: "Best sellers",
    description: "Golden and crispy on the outside, soft on the inside, with generous pieces of melted semi-sweet chocolate.",
    calories: "280 kcal",
    allergens: "Gluten, Dairy, Soy",
  },
  {
    id: "cookie-double-choco",
    name: "Double Chocolate",
    shortName: "Double choco",
    price: 9.99,
    image: "./assets/img/cookie-2.png",
    alt: "Double chocolate cookie with white chocolate chips",
    badge: "Popular",
    description: "A rich, intense cocoa dough with chunks of premium white chocolate that melt on the palate with every bite.",
    calories: "320 kcal",
    allergens: "Gluten, Dairy, Soy",
  },
  {
    id: "cookie-red-velvet",
    name: "Red Velvet",
    shortName: "Red velvet",
    price: 12.99,
    image: "./assets/img/cookie-3.png",
    alt: "Red velvet cookie with white chocolate chips",
    badge: "Favorite",
    description: "Smooth and velvety cocoa dough infused with vanilla, loaded with creamy white chocolate chips for your enjoyment.",
    calories: "310 kcal",
    allergens: "Gluten, Dairy",
  },
  {
    id: "cookie-oats-raisins",
    name: "Oats & Raisins",
    shortName: "Oats and raisins",
    price: 6.99,
    image: "./assets/img/cookie-4.png",
    alt: "Oatmeal raisin cookie",
    badge: "Wholesome",
    description: "Toasted rolled oats combined with plump, juicy raisins and warm cinnamon spice for a comforting homestyle treat.",
    calories: "250 kcal",
    allergens: "Gluten",
  },
  {
    id: "cookie-peanuts",
    name: "Peanut Butter Crunch",
    shortName: "Peanuts",
    price: 4.99,
    image: "./assets/img/cookie-5.png",
    alt: "Peanut butter cookie",
    badge: "Classic",
    description: "Creamy roasted peanut butter folded into tender dough with crispy edges and a melt-in-your-mouth center.",
    calories: "290 kcal",
    allergens: "Peanuts, Dairy, Gluten",
  },
  {
    id: "cookie-white-matcha",
    name: "White Matcha",
    shortName: "White matcha",
    price: 13.99,
    image: "./assets/img/cookie-6.png",
    alt: "White chocolate matcha cookie",
    badge: "Artisan",
    description: "Authentic ceremonial-grade Japanese green matcha dough balanced with sweet, silky Belgian white chocolate chips.",
    calories: "300 kcal",
    allergens: "Gluten, Dairy",
  },
];

const getProductById = (id) => PRODUCTS_DATA.find((item) => item.id === id);

/*=============== 2. LOCAL STORAGE MANAGERS ===============*/
const STORAGE_KEYS = {
  CART: "cookie_cart_v1",
};

const safeJSONParse = (str, fallback) => {
  try {
    const parsed = JSON.parse(str);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn("LocalStorage parse error:", err);
    return fallback;
  }
};

const loadCart = () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.CART), []);
const saveCart = (cartData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartData));
  } catch (err) {
    console.error("Cart save error:", err);
  }
};

/* State Variables */
let cart = loadCart();
let currentQuickViewProduct = null;
let quickViewQuantity = 1;

/*=============== 3. TOAST NOTIFICATION SYSTEM ===============*/
const showToast = ({ title, message, image, icon = "ri-check-line" }) => {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    ${image ? `<img src="${image}" alt="" class="toast_img">` : `<i class="${icon} toast_icon"></i>`}
    <div class="toast_content">
      <div class="toast_title">${title}</div>
      <div class="toast_message">${message}</div>
    </div>
    <button type="button" class="toast_close" aria-label="Dismiss notification">&times;</button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  const dismiss = () => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 350);
  };

  toast.querySelector(".toast_close").addEventListener("click", dismiss);
  setTimeout(dismiss, 3800);
};

/*=============== 4. FLYING PRODUCT ANIMATION ===============*/
const triggerFlyToCart = (sourceElement, imageSrc) => {
  const cartBtn = document.getElementById("cart-btn");
  if (!sourceElement || !cartBtn || !imageSrc) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = cartBtn.getBoundingClientRect();

  const flyImg = document.createElement("img");
  flyImg.src = imageSrc;
  flyImg.className = "flying_cookie_clone";
  const startSize = Math.max(50, Math.min(sourceRect.width || 80, 100));
  flyImg.style.width = `${startSize}px`;
  flyImg.style.height = `${startSize}px`;
  flyImg.style.left = `${sourceRect.left + sourceRect.width / 2 - startSize / 2}px`;
  flyImg.style.top = `${sourceRect.top + sourceRect.height / 2 - startSize / 2}px`;
  document.body.appendChild(flyImg);

  const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  if (window.gsap) {
    gsap.to(flyImg, {
      x: deltaX,
      y: deltaY,
      scale: 0.22,
      rotation: 360,
      opacity: 0.5,
      duration: 0.85,
      ease: "power2.inOut",
      onComplete: () => {
        flyImg.remove();
        bounceBadge(document.getElementById("cart-badge"));
      },
    });
  } else {
    setTimeout(() => flyImg.remove(), 600);
  }
};

const bounceBadge = (badge) => {
  if (!badge) return;
  badge.classList.add("badge-bounce");
  setTimeout(() => badge.classList.remove("badge-bounce"), 350);
};

const updateCartBadge = () => {
  const badge = document.getElementById("cart-badge");
  const countPill = document.getElementById("cart-drawer-count");
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (badge) badge.textContent = totalItems;
  if (countPill) countPill.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"}`;
};

/*=============== 5. QUICK VIEW MODAL ===============*/
const quickViewModal = document.getElementById("quickview-modal");
const quickViewClose = document.getElementById("quickview-close");
const quickViewOverlay = document.getElementById("quickview-overlay");
const quickViewQty = document.getElementById("quickview-qty");
const quickViewQtyMinus = document.getElementById("quickview-qty-minus");
const quickViewQtyPlus = document.getElementById("quickview-qty-plus");
const quickViewTotal = document.getElementById("quickview-total");
const quickViewAddCart = document.getElementById("quickview-add-cart");
const quickViewWishlist = document.getElementById("quickview-wishlist");
const quickViewWishlistIcon = document.getElementById("quickview-wishlist-icon");

const openQuickView = (productId) => {
  const product = getProductById(productId);
  if (!product) return;

  currentQuickViewProduct = product;
  quickViewQuantity = 1;

  // Populate data
  document.getElementById("quickview-img").src = product.image;
  document.getElementById("quickview-img").alt = product.alt;
  document.getElementById("quickview-badge").textContent = product.badge;
  document.getElementById("quickview-title").textContent = product.name;
  document.getElementById("quickview-price").textContent = `$ ${product.price.toFixed(2)}`;
  document.getElementById("quickview-calories").innerHTML = `<i class="ri-fire-line"></i> ${product.calories}`;
  document.getElementById("quickview-description").textContent = product.description;
  document.getElementById("quickview-allergens").textContent = product.allergens;

  updateQuickViewCalculation();

  // Open modal
  quickViewModal.classList.add("show");
  document.body.classList.add("modal-open");
};

const closeQuickView = () => {
  if (!quickViewModal) return;
  quickViewModal.classList.remove("show");
  document.body.classList.remove("modal-open");
};

const updateQuickViewCalculation = () => {
  if (!currentQuickViewProduct) return;
  if (quickViewQty) quickViewQty.textContent = quickViewQuantity;
  if (quickViewTotal) {
    const total = (currentQuickViewProduct.price * quickViewQuantity).toFixed(2);
    quickViewTotal.textContent = `Total: $${total}`;
  }
};

if (quickViewQtyMinus) {
  quickViewQtyMinus.addEventListener("click", () => {
    if (quickViewQuantity > 1) {
      quickViewQuantity--;
      updateQuickViewCalculation();
    }
  });
}

if (quickViewQtyPlus) {
  quickViewQtyPlus.addEventListener("click", () => {
    quickViewQuantity++;
    updateQuickViewCalculation();
  });
}

if (quickViewAddCart) {
  quickViewAddCart.addEventListener("click", () => {
    if (!currentQuickViewProduct) return;
    const modalImg = document.getElementById("quickview-img");
    triggerFlyToCart(modalImg, currentQuickViewProduct.image);
    addToCart(currentQuickViewProduct.id, quickViewQuantity);
    showToast({
      title: currentQuickViewProduct.name,
      message: `Added ${quickViewQuantity} to your cart!`,
      image: currentQuickViewProduct.image,
    });
    closeQuickView();
  });
}

if (quickViewClose) quickViewClose.addEventListener("click", closeQuickView);
if (quickViewOverlay) quickViewOverlay.addEventListener("click", closeQuickView);

/*=============== 6. SHOPPING CART SYSTEM ===============*/
const cartDrawer = document.getElementById("cart-drawer");
const cartClose = document.getElementById("cart-close");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartEmptyState = document.getElementById("cart-empty");
const cartFooter = document.getElementById("cart-footer");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartTotalEl = document.getElementById("cart-total");
const cartCheckoutBtn = document.getElementById("cart-checkout-btn");
const cartEmptyShopBtn = document.getElementById("cart-empty-shop");
const headerCartBtn = document.getElementById("cart-btn");

const openCart = () => {
  renderCart();
  cartDrawer.classList.add("show");
  document.body.classList.add("modal-open");
};

const closeCart = () => {
  cartDrawer.classList.remove("show");
  if (!document.querySelector(".modal.show, .drawer.show:not(#cart-drawer)")) {
    document.body.classList.remove("modal-open");
  }
};

const addToCart = (productId, quantity = 1, customBoxData = null) => {
  if (customBoxData) {
    const boxCartItem = {
      cartItemId: `box-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isCustomBox: true,
      name: `Custom Cookie Box (${customBoxData.size} Pack)`,
      details: customBoxData.details,
      price: customBoxData.price,
      quantity: 1,
      image: "./assets/img/home-bag.png",
    };
    cart.push(boxCartItem);
  } else {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(
      (item) => !item.isCustomBox && item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        cartItemId: `item-${product.id}`,
        productId: product.id,
        isCustomBox: false,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      });
    }
  }

  saveCart(cart);
  updateCartBadge();
  if (cartDrawer && cartDrawer.classList.contains("show")) {
    renderCart();
  }
};

const updateCartItemQuantity = (cartItemId, newQuantity) => {
  const itemIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
  if (itemIndex === -1) return;

  if (newQuantity <= 0) {
    const removedItem = cart[itemIndex];
    cart.splice(itemIndex, 1);
    showToast({
      title: removedItem.name,
      message: "Item removed from cart",
      image: removedItem.image,
    });
  } else {
    cart[itemIndex].quantity = newQuantity;
  }

  saveCart(cart);
  updateCartBadge();
  renderCart();
};

const removeCartItem = (cartItemId) => {
  const itemIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
  if (itemIndex === -1) return;

  const removedItem = cart[itemIndex];
  cart.splice(itemIndex, 1);
  saveCart(cart);
  updateCartBadge();
  renderCart();

  showToast({
    title: removedItem.name,
    message: "Removed from your cart",
    image: removedItem.image,
  });
};

const renderCart = () => {
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartEmptyState.style.display = "flex";
    cartItemsContainer.style.display = "none";
    cartFooter.style.display = "none";
    return;
  }

  cartEmptyState.style.display = "none";
  cartItemsContainer.style.display = "flex";
  cartFooter.style.display = "block";

  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.className = "drawer_item";
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="drawer_item-img">
      <div class="drawer_item-info">
        <h4 class="drawer_item-title">${item.name}</h4>
        ${item.isCustomBox ? `<p class="drawer_item-desc">${item.details}</p>` : ""}
        <span class="drawer_item-price">$ ${item.price.toFixed(2)}</span>
        
        <div class="drawer_item-stepper">
          <button type="button" class="stepper_btn" data-action="decrease" data-id="${item.cartItemId}" aria-label="Decrease quantity">
            <i class="ri-subtract-line"></i>
          </button>
          <span class="stepper_count">${item.quantity}</span>
          <button type="button" class="stepper_btn" data-action="increase" data-id="${item.cartItemId}" aria-label="Increase quantity">
            <i class="ri-add-line"></i>
          </button>
        </div>
      </div>
      <button type="button" class="drawer_item-remove" data-action="remove" data-id="${item.cartItemId}" title="Remove item" aria-label="Remove item">
        <i class="ri-delete-bin-line"></i>
      </button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  const formattedSubtotal = `$ ${subtotal.toFixed(2)}`;
  if (cartSubtotalEl) cartSubtotalEl.textContent = formattedSubtotal;
  if (cartTotalEl) cartTotalEl.textContent = formattedSubtotal;
};

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    const cartItemId = btn.dataset.id;
    if (!action || !cartItemId) return;

    const currentItem = cart.find((item) => item.cartItemId === cartItemId);
    if (!currentItem) return;

    if (action === "decrease") {
      updateCartItemQuantity(cartItemId, currentItem.quantity - 1);
    } else if (action === "increase") {
      updateCartItemQuantity(cartItemId, currentItem.quantity + 1);
    } else if (action === "remove") {
      removeCartItem(cartItemId);
    }
  });
}

if (headerCartBtn) headerCartBtn.addEventListener("click", openCart);
if (cartClose) cartClose.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
if (cartEmptyShopBtn) {
  cartEmptyShopBtn.addEventListener("click", () => {
    closeCart();
  });
}

// Escape key to close modal & drawer
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeQuickView();
    closeCart();
  }
});

// Click delegation
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".products_add");
  if (addBtn) {
    e.stopPropagation();
    const productId = addBtn.getAttribute("data-product-id");
    const product = getProductById(productId);
    if (!product) return;

    const card = addBtn.closest(".products_card");
    const img = card ? card.querySelector(".products_img") : null;
    triggerFlyToCart(img, product.image);

    addToCart(productId, 1);
    showToast({
      title: product.name,
      message: "Added to your cart!",
      image: product.image,
    });
    return;
  }

  const qvBtn = e.target.closest(".products_quick-btn, .featured_button");
  if (qvBtn) {
    e.stopPropagation();
    const productId = qvBtn.getAttribute("data-product-id");
    if (productId) openQuickView(productId);
    return;
  }

  const targetImgOrName = e.target.closest(".products_img, .products_name");
  if (targetImgOrName) {
    const card = targetImgOrName.closest(".products_card, .featured_card");
    if (card) {
      const productId = card.getAttribute("data-product-id");
      if (productId) openQuickView(productId);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
