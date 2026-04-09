/**
 * Mangalam HDPE Product Page
 * Author: Swati
 */

document.addEventListener("DOMContentLoaded", () => {
  setupPriceBanner();
  setupStickyNav();
  setupMobileDrawer();
  setupProductGallery();
  setupFaqAccordion();
  setupProcessStepper();
  setupApplicationsCarousel();
  setupTestimonialCards();
  setupContactForm();
  setupModalDialogs();
});

const ASSET_PATH = "./Assets/";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAROUSEL_SCROLL_STEP = 340;
const STICKY_NAV_THRESHOLD = 0.25; // fraction of viewport height
const MODAL_SUCCESS_DELAY_MS = 2800;
const FORM_RESET_DELAY_MS = 3000;

/** Lock / unlock body scroll. Used by drawer and modals. */
function toggleBodyScroll(shouldLock) {
  document.body.style.overflow = shouldLock ? "hidden" : "";
}

/** True when the element's bottom edge is above the viewport. */
function isAboveViewport(el) {
  return el.getBoundingClientRect().bottom < 0;
}

/** True when the element's top edge is inside the viewport. */
function isTopVisible(el) {
  return el.getBoundingClientRect().top < window.innerHeight;
}

/* ─────────────────────────────────────────────
   0. STICKY PRICE BANNER
   Shows once the hero price-box scrolls out of
   view; hides again when the footer is reached.
   ───────────────────────────────────────────── */
function setupPriceBanner() {
  const banner = document.getElementById("price-sticky-bar");
  const heroPriceBox = document.querySelector(".price-box");
  const pageFooter = document.querySelector(".footer");

  if (!banner || !heroPriceBox) return;

  function refreshVisibility() {
    const priceGone = isAboveViewport(heroPriceBox);
    const footerVisible = pageFooter ? isTopVisible(pageFooter) : false;
    const shouldShow = priceGone && !footerVisible;

    banner.classList.toggle("price-sticky-bar--visible", shouldShow);
    banner.setAttribute("aria-hidden", String(!shouldShow));
  }

  window.addEventListener("scroll", refreshVisibility, { passive: true });
  refreshVisibility();

  // "View Technical Specs" -> smooth-scroll to specs section
  banner
    .querySelector(".price-sticky-bar__btn-outline")
    ?.addEventListener("click", () => {
      document
        .querySelector(".specs-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

/* ─────────────────────────────────────────────
   1. STICKY NAV HEADER
   Hidden on load; slides down once the user
   scrolls past 25 % of the viewport height.
   ───────────────────────────────────────────── */
function setupStickyNav() {
  const stickyBar = document.getElementById("sticky-header");
  if (!stickyBar) return;

  const scrollTrigger = window.innerHeight * STICKY_NAV_THRESHOLD;

  window.addEventListener(
    "scroll",
    () => {
      stickyBar.classList.toggle("show", window.scrollY > scrollTrigger);
    },
    { passive: true },
  );
}

/* ─────────────────────────────────────────────
   2. MOBILE NAV DRAWER
   Slide-in panel with a dimmed backdrop.
   Closes on: close button, backdrop click, Escape.
   ───────────────────────────────────────────── */
function setupMobileDrawer() {
  const drawer = document.getElementById("mobile-menu");
  const drawerBackdrop = document.getElementById("mobile-backdrop");
  const closeBtn = document.getElementById("mobile-close-x");
  const hamburgers = [
    document.getElementById("sticky-hamburger"),
    document.getElementById("main-hamburger"),
  ].filter(Boolean);

  if (!drawer) return;

  let drawerOpen = false;

  function openDrawer() {
    drawerOpen = true;
    drawer.classList.add("open");
    drawerBackdrop.classList.add("active");
    toggleBodyScroll(true);
    hamburgers.forEach((btn) => {
      btn.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    });
  }

  function closeDrawer() {
    drawerOpen = false;
    drawer.classList.remove("open");
    drawerBackdrop.classList.remove("active");
    toggleBodyScroll(false);
    hamburgers.forEach((btn) => {
      btn.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  hamburgers.forEach((btn) =>
    btn.addEventListener("click", () =>
      drawerOpen ? closeDrawer() : openDrawer(),
    ),
  );
  drawerBackdrop.addEventListener("click", closeDrawer);
  closeBtn?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawerOpen) closeDrawer();
  });
}

/* ─────────────────────────────────────────────
   3. PRODUCT IMAGE GALLERY
   Thumbnail strip + prev/next arrows.
   Supports left/right keyboard navigation.
   ───────────────────────────────────────────── */
function setupProductGallery() {
  const productImages = [
    { src: `${ASSET_PATH}product-view-01.png`, caption: "HDPE Pipes" },
    { src: `${ASSET_PATH}product-view-01.png`, caption: "HDPE Pipes" },
    { src: `${ASSET_PATH}product-view-01.png`, caption: "HDPE Pipes" },
    { src: `${ASSET_PATH}product-view-01.png`, caption: "HDPE Pipes" },
    { src: `${ASSET_PATH}product-view-01.png`, caption: "HDPE Pipes" },
  ];

  const mainImage = document.getElementById("main-hero-img");
  const imageCounter = document.getElementById("img-counter");
  const thumbnailStrip = document.getElementById("thumbnails");
  const prevArrow = document.getElementById("carousel-prev");
  const nextArrow = document.getElementById("carousel-next");
  const zoomOverlay = document.getElementById("zoom-panel");

  if (!mainImage) return;

  let activeIndex = 0;

  // Build thumbnail buttons
  productImages.forEach((image, position) => {
    const thumbBtn = document.createElement("button");
    thumbBtn.className = `thumb-btn${position === 0 ? " active" : ""}`;
    thumbBtn.type = "button";
    thumbBtn.setAttribute("role", "listitem");
    thumbBtn.setAttribute("aria-label", `View ${image.caption}`);

    const thumbImg = document.createElement("img");
    thumbImg.src = image.src;
    thumbImg.alt = image.caption;
    thumbImg.loading = "lazy";

    thumbBtn.appendChild(thumbImg);
    thumbBtn.addEventListener("click", () => navigateTo(position));
    thumbnailStrip.appendChild(thumbBtn);
  });

  function navigateTo(index) {
    activeIndex =
      ((index % productImages.length) + productImages.length) %
      productImages.length;
    const target = productImages[activeIndex];

    mainImage.style.opacity = "0.5";
    requestAnimationFrame(() => {
      mainImage.src = target.src;
      mainImage.alt = target.caption;
      mainImage.onload = () => {
        mainImage.style.opacity = "1";
      };

      imageCounter.textContent = `${activeIndex + 1} / ${productImages.length}`;
      zoomOverlay.style.backgroundImage = `url(${target.src})`;

      thumbnailStrip.querySelectorAll(".thumb-btn").forEach((btn, i) => {
        btn.classList.toggle("active", i === activeIndex);
        btn.setAttribute("aria-current", String(i === activeIndex));
      });
    });
  }

  prevArrow.addEventListener("click", () => navigateTo(activeIndex - 1));
  nextArrow.addEventListener("click", () => navigateTo(activeIndex + 1));
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") navigateTo(activeIndex - 1);
    if (e.key === "ArrowRight") navigateTo(activeIndex + 1);
  });

  // Initialise counter and zoom background
  imageCounter.textContent = `1 / ${productImages.length}`;
  zoomOverlay.style.backgroundImage = `url(${productImages[0].src})`;

  // 4. Image zoom is set up here since it shares gallery references
  setupImageZoom(mainImage, zoomOverlay);
}

/* ─────────────────────────────────────────────
   4. IMAGE ZOOM  (wired inside setupProductGallery)
   Pans a zoomed copy of the active image inside
   the overlay panel, tracking the cursor position.
   ───────────────────────────────────────────── */
function setupImageZoom(targetImage, overlayPanel) {
  const zoomCursor = document.getElementById("magnifier-cursor");

  targetImage.addEventListener("mouseenter", () => {
    overlayPanel.style.display = "block";
    if (zoomCursor) zoomCursor.style.display = "flex";
  });
  targetImage.addEventListener("mouseleave", () => {
    overlayPanel.style.display = "none";
    if (zoomCursor) zoomCursor.style.display = "none";
  });
  targetImage.addEventListener("mousemove", (e) => {
    const bounds = targetImage.getBoundingClientRect();
    const xPct = ((e.clientX - bounds.left) / targetImage.width) * 100;
    const yPct = ((e.clientY - bounds.top) / targetImage.height) * 100;
    overlayPanel.style.backgroundPosition = `${xPct}% ${yPct}%`;
    if (zoomCursor) {
      zoomCursor.style.left = `${e.clientX - 40}px`;
      zoomCursor.style.top = `${e.clientY - 40}px`;
    }
  });
}

/* ─────────────────────────────────────────────
   5. FAQ ACCORDION
   Single-open: expanding a new item collapses
   the previously open one. Toggle icon swaps
   between collapsed / expanded SVGs.
   ───────────────────────────────────────────── */
function setupFaqAccordion() {
  const faqContainer = document.getElementById("faq-list");
  if (!faqContainer) return;

  const faqData = [
    {
      question: "What is the purpose of a laser cutter for sheet metal?",
      answer:
        "It is designed to cut various types of sheet metal with precision, allowing for intricate designs and shapes that are essential in manufacturing processes.",
    },
    {
      question:
        "What are the benefits of using aluminum tubing in manufacturing?",
      answer:
        "It is designed to cut various types of sheet metal with precision, allowing for intricate designs and shapes that are essential in manufacturing processes.",
    },
    {
      question: "How is aluminum tubing produced?",
      answer:
        "It is designed to cut various types of sheet metal with precision, allowing for intricate designs and shapes that are essential in manufacturing processes.",
    },
    {
      question: "What are the common applications of aluminum tubing?",
      answer:
        "It is designed to cut various types of sheet metal with precision, allowing for intricate designs and shapes that are essential in manufacturing processes.",
    },
    {
      question: "Can aluminum tubing be customized?",
      answer:
        "It is designed to cut various types of sheet metal with precision, allowing for intricate designs and shapes that are essential in manufacturing processes.",
    },
  ];

  let openItemIndex = null;

  faqData.forEach((entry, index) => {
    const faqRow = document.createElement("div");
    faqRow.className = "faq-item";
    faqRow.innerHTML = `
      <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
        <p class="faq-q-text">${entry.question}</p>
        <img class="faq-toggle-img"
             src="${ASSET_PATH}faq-icon-collapsed.svg"
             alt="" aria-hidden="true" />
      </div>
      <div class="faq-answer"><p>${entry.answer}</p></div>
    `;

    const questionRow = faqRow.querySelector(".faq-q");
    const toggleIcon = faqRow.querySelector(".faq-toggle-img");

    function toggleRow() {
      const willExpand = !faqRow.classList.contains("open");

      // Collapse the currently open item (if different)
      if (openItemIndex !== null && openItemIndex !== index) {
        const prevRow = faqContainer.children[openItemIndex];
        prevRow.classList.remove("open");
        prevRow.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        prevRow.querySelector(".faq-toggle-img").src =
          `${ASSET_PATH}faq-icon-collapsed.svg`;
      }

      faqRow.classList.toggle("open", willExpand);
      questionRow.setAttribute("aria-expanded", String(willExpand));
      toggleIcon.src = willExpand
        ? `${ASSET_PATH}faq-icon-expanded.svg`
        : `${ASSET_PATH}faq-icon-collapsed.svg`;
      openItemIndex = willExpand ? index : null;
    }

    questionRow.addEventListener("click", toggleRow);
    questionRow.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleRow();
      }
    });

    faqContainer.appendChild(faqRow);
  });
}

/* ─────────────────────────────────────────────
   6. MANUFACTURING PROCESS STEPPER
   ───────────────────────────────────────────── */

function setupProcessStepper() {
  const manufacturingSteps = [
    {
      label: "Raw Material",
      heading: "High-Grade Raw Material Selection",
      body: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
      features: [
        "PE100 grade material",
        "Optimal molecular weight distribution",
      ],
      image: `${ASSET_PATH}icon-high-grade.svg`,
    },
  ];

  const desktopChips = document.getElementById("hdpe-chips-desktop");
  const mobileChipLabel = document.getElementById("hdpe-chip-mobile");
  const stepHeading = document.getElementById("hdpe-step-heading");
  const stepBody = document.getElementById("hdpe-step-desc");
  const featureList = document.getElementById("hdpe-feat-list");
  const stepImage = document.getElementById("hdpe-img");

  if (!desktopChips) return;

  // 👇 Render ALL chips (UI same as before)
  const labels = [
    "Raw Material",
    "Extrusion",
    "Cooling",
    "Sizing",
    "Quality Control",
    "Marking",
    "Cutting",
    "Packaging",
  ];

  labels.forEach((label, i) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `step-chip${i === 0 ? " active" : ""}`;
    chip.textContent = label;

    chip.disabled = true;

    desktopChips.appendChild(chip);

    if (i < labels.length - 1) {
      const connector = document.createElement("div");
      connector.className = "step-line";
      desktopChips.appendChild(connector);
    }
  });

  const step = manufacturingSteps[0];

  stepHeading.textContent = step.heading;
  stepBody.textContent = step.body;
  stepImage.src = step.image;

  featureList.innerHTML = "";
  step.features.forEach((text) => {
    const li = document.createElement("li");
    li.className = "hdpe-feat-item";
    li.innerHTML = `
      <img src="${ASSET_PATH}icon-check-circle.svg" />
      ${text}
    `;
    featureList.appendChild(li);
  });
}

/* ─────────────────────────────────────────────
   7. APPLICATIONS CAROUSEL
   ───────────────────────────────────────────── */
function setupApplicationsCarousel() {
  // Apply background images from data-bg attributes
  document.querySelectorAll(".versatile-card[data-bg]").forEach((card) => {
    const src = card.dataset.bg;
    card.style.backgroundImage = `linear-gradient(180deg, rgba(27,38,120,0.65) 0%, rgba(10,14,40,0.88) 100%), url(${src})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
  });
  const carouselTrack = document.getElementById("versatile-carousel");
  if (!carouselTrack) return;

  document.getElementById("versatile-prev")?.addEventListener("click", () =>
    carouselTrack.scrollBy({
      left: -CAROUSEL_SCROLL_STEP,
      behavior: "smooth",
    }),
  );
  document.getElementById("versatile-next")?.addEventListener("click", () =>
    carouselTrack.scrollBy({
      left: CAROUSEL_SCROLL_STEP,
      behavior: "smooth",
    }),
  );
}

/* ─────────────────────────────────────────────
   8. TESTIMONIAL CARDS
   Rendered from a data array so this section can
   later be powered by a real API with minimal
   changes to this file.
   ───────────────────────────────────────────── */
function setupTestimonialCards() {
  const testimonialsContainer = document.getElementById("perf-carousel");
  if (!testimonialsContainer) return;

  const testimonialData = [
    {
      image: `${ASSET_PATH}icon-performance.svg`,
      headline: "Excellent support for specialized applications.",
      body: "The durability and performance of Meera's fishnet processing equipment has significantly improved our marine product quality. Excellent support for specialized applications.",
      author: "Carlos Mendoza",
      role: "Operations Manager",
    },
    {
      image: `${ASSET_PATH}icon-performance.svg`,
      headline: "Excellent support for specialized applications.",
      body: "The durability and performance of Meera's fishnet processing equipment has significantly improved our marine product quality. Excellent support for specialized applications.",
      author: "Carlos Mendoza",
      role: "Operations Manager",
    },
    {
      image: `${ASSET_PATH}icon-performance.svg`,
      headline: "Excellent support for specialized applications.",
      body: "The durability and performance of Meera's fishnet processing equipment has significantly improved our marine product quality. Excellent support for specialized applications.",
      author: "Carlos Mendoza",
      role: "Operations Manager",
    },
    {
      image: `${ASSET_PATH}icon-performance.svg`,
      headline: "Excellent support for specialized applications.",
      body: "The durability and performance of Meera's fishnet processing equipment has significantly improved our marine product quality. Excellent support for specialized applications.",
      author: "Carlos Mendoza",
      role: "Operations Manager",
    },
  ];

  testimonialData.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "perf-card";
    card.innerHTML = `
      <img src="${entry.image}" alt="" class="perf-card-img" loading="lazy" />
      <div>
        <p class="perf-card-heading">${entry.headline}</p>
        <p class="perf-card-content">${entry.body}</p>
      </div>
      <div class="perf-profile">
        <div class="perf-avatar" aria-hidden="true"></div>
        <div>
          <p class="perf-name">${entry.author}</p>
          <p class="perf-role">${entry.role}</p>
        </div>
      </div>
    `;
    testimonialsContainer.appendChild(card);
  });
}

/* ─────────────────────────────────────────────
   9. CONTACT FORM
   Validates name + email on submit.
   Submit button shows a success state, then
   resets the form automatically.
   ───────────────────────────────────────────── */
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameValue = contactForm.fullName.value.trim();
    const emailValue = contactForm.email.value.trim();

    if (!nameValue) {
      alert("Please enter your full name.");
      return;
    }
    if (!EMAIL_REGEX.test(emailValue)) {
      alert("Please enter a valid email address.");
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "✓ Request Sent!";
    submitBtn.disabled = true;
    submitBtn.style.background = "#16a34a";

    setTimeout(() => {
      contactForm.reset();
      submitBtn.textContent = "Request Custom Quote";
      submitBtn.disabled = false;
      submitBtn.style.background = "";
    }, FORM_RESET_DELAY_MS);
  });
}

/* ─────────────────────────────────────────────
   10. MODAL DIALOGS
   Two modals share the same open / close logic.

  Brochure modal  (#brochure-modal-backdrop)
  Quote / Callback modal  (#quote-modal-backdrop)
   ───────────────────────────────────────────── */
function setupModalDialogs() {
  const BROCHURE_MODAL = "brochure-modal-backdrop";
  const QUOTE_MODAL = "quote-modal-backdrop";

  /* --- Core open / close --- */
  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.classList.add("modal--open");
    el.removeAttribute("aria-hidden");
    toggleBodyScroll(true);
    // Shift focus into modal for screen-reader / keyboard users
    const firstField = el.querySelector("input, textarea, button");
    if (firstField) setTimeout(() => firstField.focus(), 50);
  }

  function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.classList.remove("modal--open");
    el.setAttribute("aria-hidden", "true");
    toggleBodyScroll(false);
  }

  /* --- Global close triggers --- */
  [BROCHURE_MODAL, QUOTE_MODAL].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeModal(id);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(BROCHURE_MODAL);
      closeModal(QUOTE_MODAL);
    }
  });

  document
    .getElementById("brochure-modal-close")
    ?.addEventListener("click", () => closeModal(BROCHURE_MODAL));
  document
    .getElementById("quote-modal-close")
    ?.addEventListener("click", () => closeModal(QUOTE_MODAL));

  /* ── Brochure modal triggers ──
     - "Download Full Technical Datasheet" (Specs section, .btn-outline-white)
     - All "Download PDF" resource buttons
     - "Request Catalogue" (FAQ section)                                    */
  const bindBrochure = (el) =>
    el?.addEventListener("click", () => openModal(BROCHURE_MODAL));

  document.querySelectorAll(".btn-outline-white").forEach((btn) => {
    if (btn.textContent.trim().includes("Download Full Technical Datasheet"))
      bindBrochure(btn);
  });
  document.querySelectorAll(".resource-btn").forEach(bindBrochure);
  document.querySelectorAll(".btn-primary").forEach((btn) => {
    if (btn.textContent.trim() === "Request Catalogue") bindBrochure(btn);
  });

  /* ── Quote / Callback modal triggers ──
     - "Request a Quote"   (Features section)
     - "Get Custom Quote"  (Hero CTA + Sticky price bar)
     - "Talk to an Expert" (Solutions CTA)
     - "Contact Us"        (Nav buttons — opens quote form)               */
  const bindQuote = (el) =>
    el?.addEventListener("click", () => openModal(QUOTE_MODAL));

  document.querySelectorAll(".btn-primary, .btn-dark").forEach((btn) => {
    const label = btn.textContent.trim();
    if (
      label === "Get Custom Quote" ||
      label === "Request a Quote" ||
      label.includes("Talk to an Expert") ||
      label.includes("Request Custom Quote")
    )
      bindQuote(btn);
  });

  // "Contact Us" nav buttons → open quote modal
  document.querySelectorAll(".btn-contact").forEach(bindQuote);

  /* --- Brochure form: live validation --- */
  const brochureEmailField = document.getElementById("brochure-email");
  const brochureSubmitBtn = document.getElementById("brochure-submit");

  brochureEmailField?.addEventListener("input", () => {
    if (brochureSubmitBtn)
      brochureSubmitBtn.disabled = !EMAIL_REGEX.test(
        brochureEmailField.value.trim(),
      );
  });

  document.getElementById("brochure-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    renderModalSuccess(
      "brochure-modal",
      BROCHURE_MODAL,
      "Check Your Inbox!",
      "We've sent the catalogue to your email. It should arrive within a few minutes.",
      () => {
        document.getElementById("brochure-form")?.reset();
        if (brochureSubmitBtn) brochureSubmitBtn.disabled = true;
      },
    );
  });

  const quoteNameField = document.getElementById("quote-name");
  const quoteEmailField = document.getElementById("quote-email");
  const quoteSubmitBtn = document.getElementById("quote-submit");

  [quoteNameField, quoteEmailField].forEach((el) =>
    el?.addEventListener("input", () => {
      if (!quoteNameField || !quoteEmailField || !quoteSubmitBtn) return;
      quoteSubmitBtn.disabled = !(
        quoteNameField.value.trim().length > 0 &&
        EMAIL_REGEX.test(quoteEmailField.value.trim())
      );
    }),
  );

  document.getElementById("quote-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    renderModalSuccess(
      "quote-modal",
      QUOTE_MODAL,
      "We'll Call You Back!",
      "Our team will reach out to you shortly with a tailored quote.",
      () => {
        document.getElementById("quote-form")?.reset();
        if (quoteSubmitBtn) quoteSubmitBtn.disabled = true;
      },
    );
  });
}

function renderModalSuccess(cardId, backdropId, title, message, onReset) {
  const card = document.getElementById(cardId);
  if (!card) return;

  const formEl = card.querySelector(".modal-form");
  const headerEl = card.querySelector(".modal-header");

  if (formEl) formEl.style.display = "none";
  if (headerEl) headerEl.style.display = "none";

  card.querySelector(".modal-success")?.remove();

  const successEl = document.createElement("div");
  successEl.className = "modal-success";
  successEl.innerHTML = `
    <div class="modal-success-icon">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 14l6 6 10-10" stroke="#16a34a" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <p class="modal-success-title">${title}</p>
    <p class="modal-success-desc">${message}</p>
  `;
  card.appendChild(successEl);

  setTimeout(() => {
    const backdrop = document.getElementById(backdropId);
    if (backdrop) {
      backdrop.classList.remove("modal--open");
      backdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    // Restore form after CSS close animation completes
    setTimeout(() => {
      if (formEl) formEl.style.display = "";
      if (headerEl) headerEl.style.display = "";
      successEl.remove();
      onReset?.();
    }, 350);
  }, MODAL_SUCCESS_DELAY_MS);
}
