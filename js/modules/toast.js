/**
 * Toast Notification System
 * Non-blocking accessible alert messages for cart and wishlist interactions.
 */

export const showToast = ({ title, message, image, icon = "ri-check-line" }) => {
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

  const closeBtn = toast.querySelector(".toast_close");
  if (closeBtn) closeBtn.addEventListener("click", dismiss);
  setTimeout(dismiss, 3800);
};

