/**
 * Order Summary & Confirmation Modal Module
 * Displays completed simulated order receipt with tracking ID, customer info,
 * items list, and launches celebration rainbow confetti.
 */

import { triggerRainbowConfetti, stopRainbowConfetti } from "./confetti.js";

export const openOrderConfirmation = (orderData) => {
  const orderConfirmModal = document.getElementById("order-confirm-modal");
  if (!orderConfirmModal || !orderData) return;

  const idEl = document.getElementById("confirm-order-id");
  const dateEl = document.getElementById("confirm-order-date");
  const nameEl = document.getElementById("confirm-customer-name");
  const addressEl = document.getElementById("confirm-customer-address");
  const totalEl = document.getElementById("confirm-total-amount");
  const itemsContainer = document.getElementById("confirm-items-list");

  if (idEl) idEl.textContent = orderData.id;
  if (dateEl) dateEl.textContent = orderData.date;
  if (nameEl) nameEl.textContent = orderData.customer.name;
  if (addressEl) {
    const city = orderData.customer.city ? `, ${orderData.customer.city}` : "";
    addressEl.textContent = `${orderData.customer.address}${city}`;
  }
  if (totalEl) totalEl.textContent = `$ ${orderData.total.toFixed(2)}`;

  if (itemsContainer) {
    itemsContainer.innerHTML = "";
    orderData.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "order_item-row";
      row.innerHTML = `
        <span>${item.quantity}x ${item.name}</span>
        <strong>$ ${(item.price * item.quantity).toFixed(2)}</strong>
      `;
      itemsContainer.appendChild(row);
    });
  }

  orderConfirmModal.classList.add("show");
  document.body.classList.add("modal-open");

  // Launch celebration rainbow confetti
  triggerRainbowConfetti();
};

export const closeOrderConfirmation = () => {
  const orderConfirmModal = document.getElementById("order-confirm-modal");
  if (!orderConfirmModal) return;
  orderConfirmModal.classList.remove("show");
  document.body.classList.remove("modal-open");
  stopRainbowConfetti();
};

export const initOrderSummary = () => {
  const orderConfirmClose = document.getElementById("order-confirm-close");
  const orderConfirmOverlay = document.getElementById("order-confirm-overlay");
  const confirmContinueBtn = document.getElementById("confirm-continue-btn");

  if (orderConfirmClose) orderConfirmClose.addEventListener("click", closeOrderConfirmation);
  if (orderConfirmOverlay) orderConfirmOverlay.addEventListener("click", closeOrderConfirmation);
  if (confirmContinueBtn) confirmContinueBtn.addEventListener("click", closeOrderConfirmation);
};

