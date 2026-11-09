/**
 * Shopping Cart Module
 * Manages cart drawer state, items, quantity adjustments, badge updates,
 * and the flying cookie clone animation.
 */

import { getProductById } from "../data/products.js";
import { loadCart, saveCart } from "./storage.js";
import { showToast } from "./toast.js";

let cart = loadCart();

export const getCart = () => cart;

export const clearCart = () => {
  cart = [];
  saveCart(cart);
  updateCartBadge();
  renderCart();
};

export const bounceBadge = (badge) => {
  if (!badge) return;
  badge.classList.add("badge-bounce");
  setTimeout(() => badge.classList.remove("badge-bounce"), 350);
};

export const updateCartBadge = () => {
  const badge = document.getElementById("cart-badge");
  const countPill = document.getElementById("cart-drawer-count");
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (badge) badge.textContent = totalItems;
  if (countPill) countPill.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"}`;
};

export const triggerFlyToCart = (sourceElement, imageSrc) => {
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

export const openCart = () => {
  const cartDrawer = document.getElementById("cart-drawer");
  if (!cartDrawer) return;
  renderCart();
  cartDrawer.classList.add("show");
  document.body.classList.add("modal-open");
};

export const closeCart = () => {
  const cartDrawer = document.getElementById("cart-drawer");
  if (!cartDrawer) return;
  cartDrawer.classList.remove("show");
  if (!document.querySelector(".modal.show, .drawer.show:not(#cart-drawer)")) {
    document.body.classList.remove("modal-open");
  }
};

export const addToCart = (productId, quantity = 1, customBoxData = null) => {
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
  const cartDrawer = document.getElementById("cart-drawer");
  if (cartDrawer && cartDrawer.classList.contains("show")) {
    renderCart();
  }
};

export const updateCartItemQuantity = (cartItemId, newQuantity) => {
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

export const removeCartItem = (cartItemId) => {
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

export const renderCart = () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartEmptyState = document.getElementById("cart-empty");
  const cartFooter = document.getElementById("cart-footer");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartTotalEl = document.getElementById("cart-total");

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    if (cartEmptyState) cartEmptyState.style.display = "flex";
    cartItemsContainer.style.display = "none";
    if (cartFooter) cartFooter.style.display = "none";
    return;
  }

  if (cartEmptyState) cartEmptyState.style.display = "none";
  cartItemsContainer.style.display = "flex";
  if (cartFooter) cartFooter.style.display = "block";

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

export const initCart = () => {
  const cartClose = document.getElementById("cart-close");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItemsContainer = document.getElementById("cart-items");
  const headerCartBtn = document.getElementById("cart-btn");
  const cartEmptyShopBtn = document.getElementById("cart-empty-shop") || document.getElementById("cart-browse-btn");

  if (headerCartBtn) headerCartBtn.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
  if (cartEmptyShopBtn) {
    cartEmptyShopBtn.addEventListener("click", () => {
      closeCart();
    });
  }

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

  updateCartBadge();
};

