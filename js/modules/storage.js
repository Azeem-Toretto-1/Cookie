/**
 * Storage Module
 * LocalStorage abstraction for Cart, Wishlist, and Order persistence.
 */

import { safeJSONParse } from "../utils/helpers.js";

export const STORAGE_KEYS = {
  CART: "cookie_cart_v1",
  WISHLIST: "cookie_wishlist_v1",
  ORDER: "cookie_last_order_v1",
};

export const loadCart = () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.CART), []);

export const saveCart = (cartData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartData));
  } catch (err) {
    console.error("Cart save error:", err);
  }
};

export const loadWishlist = () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.WISHLIST), []);

export const saveWishlist = (wishlistData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistData));
  } catch (err) {
    console.error("Wishlist save error:", err);
  }
};

export const loadLastOrder = () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.ORDER), null);

export const saveLastOrder = (orderData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDER, JSON.stringify(orderData));
  } catch (err) {
    console.error("Order save error:", err);
  }
};

