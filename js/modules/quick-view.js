/**
 * Quick View Modal Module
 * Displays detailed cookie overview with live quantity steppers, allergens,
 * nutritional calories, live subtotal computation, and wishlist toggle.
 */

import { getProductById } from "../data/products.js";
import { addToCart, triggerFlyToCart } from "./cart.js";
import { isInWishlist, toggleWishlist } from "./wishlist.js";
import { showToast } from "./toast.js";

let currentProduct = null;
let quantity = 1;

export const openQuickView = (productId) => {
  const product = getProductById(productId);
  if (!product) return;

  currentProduct = product;
  quantity = 1;

  const quickViewModal = document.getElementById("quickview-modal");
  const imgEl = document.getElementById("quickview-img");
  const badgeEl = document.getElementById("quickview-badge");
  const titleEl = document.getElementById("quickview-title");
  const priceEl = document.getElementById("quickview-price");
  const calEl = document.getElementById("quickview-calories");
  const descEl = document.getElementById("quickview-description") || document.getElementById("quickview-desc");
  const allergensEl = document.getElementById("quickview-allergens");
  const wishlistBtn = document.getElementById("quickview-wishlist-btn") || document.getElementById("quickview-wishlist");

  if (imgEl) {
    imgEl.src = product.image;
    imgEl.alt = product.alt || product.name;
  }
  if (badgeEl) badgeEl.textContent = product.badge;
  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = `$ ${product.price.toFixed(2)}`;
  if (calEl) calEl.innerHTML = `<i class="ri-fire-line" aria-hidden="true"></i> <span>${product.calories}</span>`;
  if (descEl) descEl.textContent = product.description;
  if (allergensEl) {
    allergensEl.innerHTML = `<strong>Allergens:</strong> ${product.allergens}`;
  }

  updateQuickViewCalculation();

  // Sync wishlist button state
  const isWishlisted = isInWishlist(product.id);
  if (wishlistBtn) {
    wishlistBtn.classList.toggle("active", isWishlisted);
    const icon = wishlistBtn.querySelector("i");
    if (icon) {
      icon.className = isWishlisted ? "ri-heart-fill" : "ri-heart-line";
    }
  }

  if (quickViewModal) {
    quickViewModal.classList.add("show");
    document.body.classList.add("modal-open");
  }
};

export const closeQuickView = () => {
  const quickViewModal = document.getElementById("quickview-modal");
  if (!quickViewModal) return;
  quickViewModal.classList.remove("show");
  if (!document.querySelector(".modal.show, .drawer.show:not(#quickview-modal)")) {
    document.body.classList.remove("modal-open");
  }
};

const updateQuickViewCalculation = () => {
  if (!currentProduct) return;
  const qtyEl = document.getElementById("quickview-qty");
  const subtotalEl = document.getElementById("quickview-subtotal") || document.getElementById("quickview-total");

  if (qtyEl) qtyEl.textContent = quantity;
  if (subtotalEl) {
    const total = (currentProduct.price * quantity).toFixed(2);
    subtotalEl.textContent = `$ ${total}`;
  }
};

export const initQuickView = () => {
  const quickViewClose = document.getElementById("quickview-close");
  const quickViewOverlay = document.getElementById("quickview-overlay");
  const qtyMinus = document.getElementById("quickview-qty-minus");
  const qtyPlus = document.getElementById("quickview-qty-plus");
  const addCartBtn = document.getElementById("quickview-add-cart");
  const wishlistBtn = document.getElementById("quickview-wishlist-btn") || document.getElementById("quickview-wishlist");

  if (qtyMinus) {
    qtyMinus.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        updateQuickViewCalculation();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener("click", () => {
      quantity++;
      updateQuickViewCalculation();
    });
  }

  if (addCartBtn) {
    addCartBtn.addEventListener("click", () => {
      if (!currentProduct) return;
      const modalImg = document.getElementById("quickview-img");
      triggerFlyToCart(modalImg, currentProduct.image);
      addToCart(currentProduct.id, quantity);
      showToast({
        title: currentProduct.name,
        message: `Added ${quantity} to your cart!`,
        image: currentProduct.image,
      });
      closeQuickView();
    });
  }

  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
      if (!currentProduct) return;
      const added = toggleWishlist(currentProduct.id);
      wishlistBtn.classList.toggle("active", added);
      const icon = wishlistBtn.querySelector("i");
      if (icon) {
        icon.className = added ? "ri-heart-fill" : "ri-heart-line";
      }
      showToast({
        title: currentProduct.name,
        message: added ? "Added to your wishlist!" : "Removed from your wishlist",
        image: currentProduct.image,
        icon: added ? "ri-heart-fill" : "ri-heart-line",
      });
    });
  }

  if (quickViewClose) quickViewClose.addEventListener("click", closeQuickView);
  if (quickViewOverlay) quickViewOverlay.addEventListener("click", closeQuickView);
};

