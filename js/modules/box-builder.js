/**
 * Custom Cookie Box Builder Module
 * Allows users to choose a box capacity (4, 6, 12), fill interactive slots,
 * calculate price dynamically based on selected cookies, and add box to cart.
 */

import { PRODUCTS_DATA, getProductById } from "../data/products.js";
import { addToCart, triggerFlyToCart } from "./cart.js";
import { showToast } from "./toast.js";

export const boxBuilderState = {
  size: 6,
  price: 0,
  selections: {},
};

export const getTotalBoxSelected = () => {
  return Object.values(boxBuilderState.selections).reduce((a, b) => a + b, 0);
};

export const calculateBoxPrice = () => {
  let subtotal = 0;
  Object.entries(boxBuilderState.selections).forEach(([prodId, count]) => {
    const prod = getProductById(prodId);
    if (prod && count > 0) {
      subtotal += prod.price * count;
    }
  });
  return subtotal;
};

export const renderBoxBuilder = () => {
  const boxSlotsContainer = document.getElementById("box-slots-container");
  const boxFlavorsGrid = document.getElementById("box-flavors-grid");
  const boxSelectedCountEl = document.getElementById("box-selected-count");
  const boxMaxCountEl = document.getElementById("box-max-count");
  const boxRemainingBadgeEl = document.getElementById("box-remaining-badge");
  const boxMeterFillEl = document.getElementById("box-meter-fill");
  const boxCapacityLabelEl = document.getElementById("box-capacity-label");
  const boxSummaryPriceEl = document.getElementById("box-summary-price");
  const boxSummaryHintEl = document.getElementById("box-summary-hint");
  const boxAddCartBtn = document.getElementById("box-add-cart-btn");

  if (!boxSlotsContainer || !boxFlavorsGrid) return;

  const totalSelected = getTotalBoxSelected();
  const maxCapacity = boxBuilderState.size;
  const remaining = maxCapacity - totalSelected;

  boxBuilderState.price = calculateBoxPrice();

  if (boxSelectedCountEl) boxSelectedCountEl.textContent = totalSelected;
  if (boxMaxCountEl) boxMaxCountEl.textContent = maxCapacity;
  if (boxCapacityLabelEl) boxCapacityLabelEl.textContent = `Capacity: ${maxCapacity} Cookies`;

  if (boxRemainingBadgeEl) {
    if (remaining === 0) {
      boxRemainingBadgeEl.textContent = "Box is full!";
      boxRemainingBadgeEl.style.backgroundColor = "var(--first-color)";
      boxRemainingBadgeEl.style.color = "var(--first-color-lighten)";
    } else {
      boxRemainingBadgeEl.textContent = `${remaining} ${remaining === 1 ? "slot" : "slots"} left`;
      boxRemainingBadgeEl.style.backgroundColor = "var(--first-color-lighten)";
      boxRemainingBadgeEl.style.color = "var(--first-color)";
    }
  }

  if (boxMeterFillEl) {
    const percentage = Math.min(100, (totalSelected / maxCapacity) * 100);
    boxMeterFillEl.style.width = `${percentage}%`;
  }

  boxSlotsContainer.innerHTML = "";
  const slotCookies = [];
  Object.entries(boxBuilderState.selections).forEach(([prodId, count]) => {
    for (let i = 0; i < count; i++) {
      slotCookies.push(prodId);
    }
  });

  for (let i = 0; i < maxCapacity; i++) {
    const slot = document.createElement("div");
    if (i < slotCookies.length) {
      const prodId = slotCookies[i];
      const prod = getProductById(prodId);
      slot.className = "box_slot filled";
      slot.innerHTML = `
        <img src="${prod.image}" alt="${prod.name}" class="box_slot-img" title="${prod.name}">
        <button type="button" class="box_slot-remove" data-id="${prodId}" title="Remove cookie" aria-label="Remove ${prod.name}">
          &times;
        </button>
      `;
    } else {
      slot.className = "box_slot";
      slot.innerHTML = `<i class="ri-add-line box_slot-empty-icon"></i>`;
    }
    boxSlotsContainer.appendChild(slot);
  }

  const availableFlavors = PRODUCTS_DATA.slice(0, 6);
  boxFlavorsGrid.innerHTML = "";

  availableFlavors.forEach((prod) => {
    const count = boxBuilderState.selections[prod.id] || 0;
    const itemEl = document.createElement("div");
    itemEl.className = "box_flavor-item";
    itemEl.innerHTML = `
      <div class="box_flavor-info">
        <img src="${prod.image}" alt="${prod.name}" class="box_flavor-img">
        <div>
          <h4 class="box_flavor-name">${prod.shortName}</h4>
          <span class="box_flavor-price">$ ${prod.price.toFixed(2)} each</span>
        </div>
      </div>
      <div class="box_flavor-stepper">
        <button type="button" class="stepper_btn" data-action="minus-flavor" data-id="${prod.id}" ${count === 0 ? "disabled" : ""} aria-label="Decrease ${prod.shortName}">
          <i class="ri-subtract-line"></i>
        </button>
        <span class="stepper_count">${count}</span>
        <button type="button" class="stepper_btn" data-action="plus-flavor" data-id="${prod.id}" ${remaining === 0 ? "disabled" : ""} aria-label="Increase ${prod.shortName}">
          <i class="ri-add-line"></i>
        </button>
      </div>
    `;
    boxFlavorsGrid.appendChild(itemEl);
  });

  if (boxSummaryPriceEl) {
    boxSummaryPriceEl.textContent = `$ ${boxBuilderState.price.toFixed(2)}`;
  }

  if (boxAddCartBtn) {
    const isComplete = totalSelected === maxCapacity;
    boxAddCartBtn.disabled = !isComplete;
    if (boxSummaryHintEl) {
      boxSummaryHintEl.textContent = isComplete
        ? "Box is fully packed and ready to bake!"
        : `Please select ${remaining} more ${remaining === 1 ? "cookie" : "cookies"} to complete your box`;
    }
  }
};

export const initBoxBuilder = () => {
  const boxSizesGrid = document.querySelector(".box_sizes-grid");
  const boxFlavorsGrid = document.getElementById("box-flavors-grid");
  const boxSlotsContainer = document.getElementById("box-slots-container");
  const boxAddCartBtn = document.getElementById("box-add-cart-btn");

  if (boxSizesGrid) {
    boxSizesGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".box_size-card");
      if (!btn) return;

      const newSize = parseInt(btn.dataset.boxSize, 10);
      boxSizesGrid.querySelectorAll(".box_size-card").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      boxBuilderState.size = newSize;

      let total = getTotalBoxSelected();
      if (total > newSize) {
        const keys = Object.keys(boxBuilderState.selections);
        for (const k of keys) {
          while (boxBuilderState.selections[k] > 0 && total > newSize) {
            boxBuilderState.selections[k]--;
            total--;
          }
          if (boxBuilderState.selections[k] === 0) {
            delete boxBuilderState.selections[k];
          }
        }
      }

      renderBoxBuilder();
    });
  }

  if (boxFlavorsGrid) {
    boxFlavorsGrid.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;
      const prodId = btn.dataset.id;
      if (!action || !prodId) return;

      const currentCount = boxBuilderState.selections[prodId] || 0;
      const totalSelected = getTotalBoxSelected();

      if (action === "plus-flavor") {
        if (totalSelected < boxBuilderState.size) {
          boxBuilderState.selections[prodId] = currentCount + 1;
          renderBoxBuilder();
        }
      } else if (action === "minus-flavor") {
        if (currentCount > 0) {
          boxBuilderState.selections[prodId] = currentCount - 1;
          if (boxBuilderState.selections[prodId] === 0) {
            delete boxBuilderState.selections[prodId];
          }
          renderBoxBuilder();
        }
      }
    });
  }

  if (boxSlotsContainer) {
    boxSlotsContainer.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".box_slot-remove");
      if (!removeBtn) return;

      const prodId = removeBtn.dataset.id;
      if (prodId && boxBuilderState.selections[prodId] > 0) {
        boxBuilderState.selections[prodId]--;
        if (boxBuilderState.selections[prodId] === 0) {
          delete boxBuilderState.selections[prodId];
        }
        renderBoxBuilder();
      }
    });
  }

  if (boxAddCartBtn) {
    boxAddCartBtn.addEventListener("click", () => {
      const totalSelected = getTotalBoxSelected();
      if (totalSelected !== boxBuilderState.size) return;

      const calculatedPrice = calculateBoxPrice();

      const flavorParts = [];
      Object.entries(boxBuilderState.selections).forEach(([prodId, count]) => {
        const p = getProductById(prodId);
        if (p && count > 0) {
          flavorParts.push(`${count}x ${p.shortName}`);
        }
      });
      const details = flavorParts.join(", ");

      if (boxSlotsContainer) {
        triggerFlyToCart(boxSlotsContainer, "./assets/img/home-bag.png");
      }

      addToCart(null, 1, {
        size: boxBuilderState.size,
        price: calculatedPrice,
        details: details,
        selections: { ...boxBuilderState.selections },
      });

      showToast({
        title: `Custom Box (${boxBuilderState.size} Cookies)`,
        message: `$ ${calculatedPrice.toFixed(2)} - Added to your cart!`,
        image: "./assets/img/home-bag.png",
      });

      boxBuilderState.selections = {};
      renderBoxBuilder();
    });
  }

  renderBoxBuilder();
};

