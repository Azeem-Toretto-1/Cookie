/**
 * Wishlist Module
 * Manages wishlist state, drawer display, badge counts, and moving items to cart.
 */

import { getProductById } from "../data/products.js";
import { loadWishlist, saveWishlist } from "./storage.js";
import { addToCart, triggerFlyToCart } from "./cart.js";
import { showToast } from "./toast.js";

let wishlist = loadWishlist();

export const getWishlist = () => wishlist;

export const isInWishlist = (productId) => wishlist.includes(productId);

export const updateWishlistBadge = () => {
  const badge = document.getElementById("wishlist-badge");
  const countPill = document.getElementById("wishlist-drawer-count");
  const total = wishlist.length;

  if (badge) badge.textContent = total;
  if (countPill) countPill.textContent = `${total} ${total === 1 ? "item" : "items"}`;
};

export const openWishlist = () => {
  const wishlistDrawer = document.getElementById("wishlist-drawer");
  if (!wishlistDrawer) return;
  renderWishlist();
  wishlistDrawer.classList.add("show");
  document.body.classList.add("modal-open");
};

export const closeWishlist = () => {
  const wishlistDrawer = document.getElementById("wishlist-drawer");
  if (!wishlistDrawer) return;
  wishlistDrawer.classList.remove("show");
  if (!document.querySelector(".modal.show, .drawer.show:not(#wishlist-drawer)")) {
    document.body.classList.remove("modal-open");
  }
};

export const toggleWishlist = (productId) => {
  const index = wishlist.indexOf(productId);
  let isAdded = false;

  if (index > -1) {
    wishlist.splice(index, 1);
    isAdded = false;
  } else {
    wishlist.push(productId);
    isAdded = true;
  }

  saveWishlist(wishlist);
  updateWishlistBadge();

  const wishlistDrawer = document.getElementById("wishlist-drawer");
  if (wishlistDrawer && wishlistDrawer.classList.contains("show")) {
    renderWishlist();
  }
  return isAdded;
};

export const renderWishlist = () => {
  const wishlistItemsContainer = document.getElementById("wishlist-items");
  const wishlistEmptyState = document.getElementById("wishlist-empty");

  if (!wishlistItemsContainer) return;

  if (wishlist.length === 0) {
    if (wishlistEmptyState) wishlistEmptyState.style.display = "flex";
    wishlistItemsContainer.style.display = "none";
    return;
  }

  if (wishlistEmptyState) wishlistEmptyState.style.display = "none";
  wishlistItemsContainer.style.display = "flex";
  wishlistItemsContainer.innerHTML = "";

  wishlist.forEach((productId) => {
    const product = getProductById(productId);
    if (!product) return;

    const itemEl = document.createElement("div");
    itemEl.className = "drawer_item";
    itemEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="drawer_item-img">
      <div class="drawer_item-info">
        <h4 class="drawer_item-title">${product.name}</h4>
        <span class="drawer_item-price">$ ${product.price.toFixed(2)}</span>
      </div>
      <button type="button" class="wishlist_item-add" data-action="add-cart" data-id="${product.id}" title="Add to Cart" aria-label="Add to cart">
        <i class="ri-shopping-bag-3-line"></i>
      </button>
      <button type="button" class="drawer_item-remove" data-action="remove-wishlist" data-id="${product.id}" title="Remove from wishlist" aria-label="Remove from wishlist">
        <i class="ri-delete-bin-line"></i>
      </button>
    `;
    wishlistItemsContainer.appendChild(itemEl);
  });
};

export const initWishlist = () => {
  const wishlistClose = document.getElementById("wishlist-close");
  const wishlistOverlay = document.getElementById("wishlist-overlay");
  const wishlistItemsContainer = document.getElementById("wishlist-items");
  const headerWishlistBtn = document.getElementById("wishlist-btn");
  const wishlistEmptyShopBtn = document.getElementById("wishlist-empty-shop") || document.getElementById("wishlist-browse-btn");

  if (headerWishlistBtn) headerWishlistBtn.addEventListener("click", openWishlist);
  if (wishlistClose) wishlistClose.addEventListener("click", closeWishlist);
  if (wishlistOverlay) wishlistOverlay.addEventListener("click", closeWishlist);
  if (wishlistEmptyShopBtn) {
    wishlistEmptyShopBtn.addEventListener("click", () => {
      closeWishlist();
    });
  }

  if (wishlistItemsContainer) {
    wishlistItemsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;
      const productId = btn.dataset.id;
      if (!action || !productId) return;

      const product = getProductById(productId);
      if (!product) return;

      if (action === "add-cart") {
        const itemImg = btn.closest(".drawer_item")?.querySelector(".drawer_item-img");
        triggerFlyToCart(itemImg, product.image);
        addToCart(product.id, 1);
        showToast({
          title: product.name,
          message: "Added to your cart!",
          image: product.image,
        });
      } else if (action === "remove-wishlist") {
        toggleWishlist(productId);
        showToast({
          title: product.name,
          message: "Removed from your wishlist",
          image: product.image,
          icon: "ri-heart-line",
        });
      }
    });
  }

  updateWishlistBadge();
};

