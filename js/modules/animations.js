/**
 * Animations Module (GSAP + ScrollTrigger)
 * Orchestrates entrance transitions, staggered reveals, and ScrollTrigger triggers.
 */

export const initAnimations = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // The elements fall from the top when they enter the screen
  const reveal = (elements, vars = {}, trigger = elements) => {
    gsap.from(elements, {
      y: -100,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      ...vars,
      scrollTrigger: { trigger, start: "top 85%" },
    });
  };

  // Cards that fall one by one, each one with its image (with a small turn)
  const revealCards = (cards, image) => {
    gsap.set(cards, { y: -100, opacity: 0 });
    if (image) gsap.set(image, { y: -60, rotation: -30, opacity: 0 });

    ScrollTrigger.batch(cards, {
      start: "top 85%",
      once: true,
      onEnter: (batch) => {
        const timeline = gsap.timeline();

        batch.forEach((card, index) => {
          timeline.to(
            card,
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              clearProps: "all",
            },
            index * 0.15
          ); // Clears GSAP styles so the hover works

          if (image) {
            timeline.to(
              card.querySelector(image),
              {
                y: 0,
                rotation: 0,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.7)",
                clearProps: "all",
              },
              index * 0.15 + 0.5
            );
          }
        });
      },
    });
  };

  /* Section titles */
  reveal(".featured :is(.section_subtitle, .section_title)", {
    stagger: 0.2,
  });
  reveal(".products :is(.section_subtitle, .section_title)", {
    stagger: 0.2,
  });
  reveal(".contact :is(.section_subtitle, .section_title)", { stagger: 0.2 });

  /* Featured: the card comes up, its content appears and the cookie lands later */
  gsap.utils.toArray(".featured_card").forEach((card) => {
    gsap
      .timeline({ scrollTrigger: { trigger: card, start: "top 85%" } })
      .from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all",
      }) // Clears GSAP styles so the hover works
      .from(
        card.querySelectorAll(":scope > :not(.featured_img)"),
        { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 },
        "-=0.4"
      );
  });

  /* About */
  reveal(".about_img");
  reveal(".about_data > *", { stagger: 0.15, delay: 0.3 }, ".about_data");

  /* Products */
  revealCards(".products_card", ".products_img");

  /* Box Builder */
  reveal(".box-builder :is(.section_subtitle, .section_title)", {
    stagger: 0.2,
  });

  /* Contact */
  revealCards(".contact_card");
  reveal(".contact_button");
  reveal(".contact_map", { delay: 0.3 });

  /* Footer */
  reveal(".footer_group > *", { stagger: 0.2 }, ".footer");
  reveal(".footer_data", { stagger: 0.2 }, ".footer_content");
};

