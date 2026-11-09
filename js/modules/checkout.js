/**
 * Checkout Module
 * Handles simulated checkout modal, form validation, order summary calculations,
 * and order generation.
 */

import { getCart, clearCart, closeCart } from "./cart.js";
import { saveLastOrder } from "./storage.js";
import { openOrderConfirmation } from "./order-summary.js";
import { showToast } from "./toast.js";

export const openCheckout = () => {
  const cart = getCart();
  if (cart.length === 0) {
    showToast({
      title: "Cart is empty",
      message: "Add some cookies before checking out!",
      icon: "ri-error-warning-line",
    });
    return;
  }

  closeCart();
  renderCheckoutSummary();
  const checkoutModal = document.getElementById("checkout-modal");
  if (checkoutModal) {
    checkoutModal.classList.add("show");
    document.body.classList.add("modal-open");
  }
};

export const closeCheckout = () => {
  const checkoutModal = document.getElementById("checkout-modal");
  if (!checkoutModal) return;
  checkoutModal.classList.remove("show");
  if (!document.querySelector(".modal.show:not(#checkout-modal), .drawer.show")) {
    document.body.classList.remove("modal-open");
  }
};

export const renderCheckoutSummary = () => {
  const checkoutSummaryItems = document.getElementById("checkout-summary-items");
  const checkoutSubtotal = document.getElementById("checkout-subtotal");
  const checkoutTotal = document.getElementById("checkout-total");
  const cart = getCart();

  if (!checkoutSummaryItems) return;
  checkoutSummaryItems.innerHTML = "";

  let subtotal = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement("div");
    row.className = "checkout_summary-item";
    row.innerHTML = `
      <span class="checkout_summary-item-name">${item.quantity}x ${item.name}</span>
      <span class="checkout_summary-item-price">$ ${itemTotal.toFixed(2)}</span>
    `;
    checkoutSummaryItems.appendChild(row);
  });

  const formatted = `$ ${subtotal.toFixed(2)}`;
  if (checkoutSubtotal) checkoutSubtotal.textContent = formatted;
  if (checkoutTotal) checkoutTotal.textContent = formatted;
};

const validateField = (inputEl, errorEl, validator, errorMsg) => {
  if (!inputEl) return true;
  const value = inputEl.value.trim();
  const isValid = validator(value);
  if (!isValid) {
    inputEl.classList.add("input-error");
    if (errorEl) errorEl.textContent = errorMsg;
    return false;
  } else {
    inputEl.classList.remove("input-error");
    if (errorEl) errorEl.textContent = "";
    return true;
  }
};

export const initCheckout = () => {
  const cartCheckoutBtn = document.getElementById("cart-checkout-btn");
  const checkoutClose = document.getElementById("checkout-close");
  const checkoutOverlay = document.getElementById("checkout-overlay");
  const checkoutForm = document.getElementById("checkout-form");
  const placeOrderBtn = document.getElementById("place-order-btn") || document.getElementById("checkout-submit-btn");

  if (cartCheckoutBtn) cartCheckoutBtn.addEventListener("click", openCheckout);
  if (checkoutClose) checkoutClose.addEventListener("click", closeCheckout);
  if (checkoutOverlay) checkoutOverlay.addEventListener("click", closeCheckout);

  if (checkoutForm) {
    const nameInput = document.getElementById("checkout-name");
    const emailInput = document.getElementById("checkout-email");
    const phoneInput = document.getElementById("checkout-phone");
    const addressInput = document.getElementById("checkout-address");
    const cityInput = document.getElementById("checkout-city");
    const postalInput = document.getElementById("checkout-postal");

    nameInput?.addEventListener("blur", () => {
      validateField(nameInput, document.getElementById("error-name"), (v) => v.length >= 2, "Please enter your full name");
    });
    emailInput?.addEventListener("blur", () => {
      validateField(emailInput, document.getElementById("error-email"), (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Please enter a valid email address");
    });
    phoneInput?.addEventListener("blur", () => {
      validateField(phoneInput, document.getElementById("error-phone"), (v) => v.replace(/\D/g, "").length >= 7, "Please enter a valid phone number");
    });
    addressInput?.addEventListener("blur", () => {
      validateField(addressInput, document.getElementById("error-address"), (v) => v.length >= 5, "Please enter your delivery street address");
    });
    cityInput?.addEventListener("blur", () => {
      validateField(cityInput, document.getElementById("error-city"), (v) => v.length >= 2, "Please enter city");
    });
    postalInput?.addEventListener("blur", () => {
      validateField(postalInput, document.getElementById("error-postal"), (v) => v.length >= 3, "Please enter a valid postal code");
    });

    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, document.getElementById("error-name"), (v) => v.length >= 2, "Please enter your full name");
      const isEmailValid = validateField(emailInput, document.getElementById("error-email"), (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Please enter a valid email address");
      const isPhoneValid = validateField(phoneInput, document.getElementById("error-phone"), (v) => v.replace(/\D/g, "").length >= 7, "Please enter a valid phone number");
      const isAddressValid = validateField(addressInput, document.getElementById("error-address"), (v) => v.length >= 5, "Please enter your delivery street address");
      const isCityValid = cityInput ? validateField(cityInput, document.getElementById("error-city"), (v) => v.length >= 2, "Please enter city") : true;
      const isPostalValid = postalInput ? validateField(postalInput, document.getElementById("error-postal"), (v) => v.length >= 3, "Please enter a valid postal code") : true;

      if (!isNameValid || !isEmailValid || !isPhoneValid || !isAddressValid || !isCityValid || !isPostalValid) {
        return;
      }

      if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = `Baking your order... <i class="ri-loader-4-line"></i>`;
      }

      setTimeout(() => {
        if (placeOrderBtn) {
          placeOrderBtn.disabled = false;
          placeOrderBtn.innerHTML = `Place Order <i class="ri-check-line"></i>`;
        }

        const cart = getCart();
        const orderId = `#CK-${Math.floor(10000 + Math.random() * 90000)}`;
        const orderDate = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const customerInfo = {
          name: nameInput ? nameInput.value.trim() : "Valued Customer",
          email: emailInput ? emailInput.value.trim() : "",
          phone: phoneInput ? phoneInput.value.trim() : "",
          address: addressInput ? addressInput.value.trim() : "",
          city: cityInput ? cityInput.value.trim() : "Lima",
          postal: postalInput ? postalInput.value.trim() : "",
          notes: document.getElementById("checkout-notes")?.value.trim() || "",
        };

        const finalSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const completedOrder = {
          id: orderId,
          date: orderDate,
          customer: customerInfo,
          items: [...cart],
          subtotal: finalSubtotal,
          total: finalSubtotal,
        };

        saveLastOrder(completedOrder);
        clearCart();
        closeCheckout();
        openOrderConfirmation(completedOrder);

        showToast({
          title: "Order Placed!",
          message: `Order ${orderId} has been simulated successfully!`,
          icon: "ri-check-double-line",
        });
      }, 800);
    });
  }
};

