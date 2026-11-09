/**
 * Navigation Module
 * Controls mobile drawer menu, sticky header shadow, scroll-up button,
 * and ScrollSpy section active-link indicators.
 */

export const initNavigation = () => {
  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close"),
    navLinks = document.querySelectorAll(".nav_link"),
    header = document.getElementById("header"),
    scrollUpBtn = document.getElementById("scroll-up"),
    sections = document.querySelectorAll("section[id]");

  /* Menu show */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  /* Menu hidden */
  if (navClose && navMenu) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  /* Remove mobile menu when clicking nav link */
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("show-menu");
    });
  });

  /* Change header styles on scroll */
  const onScrollHeader = () => {
    if (!header) return;
    window.scrollY >= 50
      ? header.classList.add("scroll-header")
      : header.classList.remove("scroll-header");
  };
  window.addEventListener("scroll", onScrollHeader);

  /* Show scroll up button */
  const onScrollUp = () => {
    if (!scrollUpBtn) return;
    window.scrollY >= 350
      ? scrollUpBtn.classList.add("show-scroll")
      : scrollUpBtn.classList.remove("show-scroll");
  };
  window.addEventListener("scroll", onScrollUp);

  /* ScrollSpy for active nav link */
  const onScrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const id = section.id,
        top = section.offsetTop - 50,
        height = section.offsetHeight,
        link = document.querySelector(".nav_menu a[href*=" + id + "]");

      if (!link) return;

      link.classList.toggle(
        "active-link",
        scrollY > top && scrollY <= top + height
      );
    });
  };
  window.addEventListener("scroll", onScrollActive);

  // Initial invoke in case page is already scrolled
  onScrollHeader();
  onScrollUp();
  onScrollActive();
};

