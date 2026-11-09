/**
 * Cookie Shop - Main JavaScript Entry Point (js/script.js)
 * Native ES module bootstrap: coordinates data, physics, animations,
 * cart, wishlist, box builder, quick view, checkout, and toasts.
 */

import { PRODUCTS_DATA, getProductById } from "./data/products.js";
import { initNavigation } from "./modules/navigation.js";
import { initAnimations } from "./modules/animations.js";
import { initPhysics } from "./modules/physics.js";
import {
  initQuickView,
  openQuickView,
  closeQuickView,
} from "./modules/quick-view.js";
import {
  initCart,
  addToCart,
  triggerFlyToCart,
  updateCartBadge,
  closeCart,
} from "./modules/cart.js";
import {
  initWishlist,
  updateWishlistBadge,
  closeWishlist,
} from "./modules/wishlist.js";
import { initBoxBuilder, renderBoxBuilder } from "./modules/box-builder.js";
import { initCheckout, closeCheckout } from "./modules/checkout.js";
import {
  initOrderSummary,
  closeOrderConfirmation,
} from "./modules/order-summary.js";
import { showToast } from "./modules/toast.js";

// Global Escape key listener to dismiss active modals & drawers
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeQuickView();
    closeCart();
    closeWishlist();
    closeCheckout();
    closeOrderConfirmation();
  }
});

// Global click delegation for product cards
document.addEventListener("click", (e) => {
  // Add to cart button on cards
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

  // Quick view triggers
  const qvBtn = e.target.closest(".products_quick-btn, .featured_button");
  if (qvBtn) {
    e.stopPropagation();
    const productId = qvBtn.getAttribute("data-product-id");
    if (productId) openQuickView(productId);
    return;
  }

  // Card image or title click opens Quick View
  const targetImgOrName = e.target.closest(".products_img, .products_name");
  if (targetImgOrName) {
    const card = targetImgOrName.closest(".products_card, .featured_card");
    if (card) {
      const productId = card.getAttribute("data-product-id");
      if (productId) openQuickView(productId);
    }
  }
});

// App initialization when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI features
  initNavigation();
  initCart();
  initWishlist();
  initQuickView();
  initBoxBuilder();
  initCheckout();
  initOrderSummary();

  // Initialize GSAP reveals and Matter.js physics simulation
  initAnimations();
  initPhysics();

  // Ensure initial badges & custom box render
  updateCartBadge();
  updateWishlistBadge();
  renderBoxBuilder();
});

// Expose catalog to window for testing compatibility
if (typeof window !== "undefined") {
  window.PRODUCTS_DATA = PRODUCTS_DATA;
}
