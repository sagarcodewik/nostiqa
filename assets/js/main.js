document.addEventListener("DOMContentLoaded", () => {
  // ===== Header =====
  const header      = document.getElementById("main-header");
  const toggleBtn   = document.getElementById("mobile-menu-toggle");
  const mobileMenu  = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  // ===== Desktop Dropdown =====
  const dropdownBtn     = document.getElementById("products-dropdown-btn");
  const dropdownMenu    = document.getElementById("products-dropdown-menu");
  const dropdownChevron = document.getElementById("products-chevron");
  let dropdownOpen = false;
  // Hover open/close on the wrapper (desktop only)
  const dropdownWrapper = document.getElementById("products-dropdown-wrapper");
  dropdownWrapper?.addEventListener("mouseenter", () => { if (window.innerWidth >= 768) openDropdown(); });
  dropdownWrapper?.addEventListener("mouseleave", () => { if (window.innerWidth >= 768) closeDropdown(); });

  function openDropdown() { dropdownOpen = true; dropdownMenu.classList.remove("opacity-0", "invisible"); dropdownMenu.classList.add("opacity-100", "visible"); dropdownChevron.classList.add("rotate-180"); dropdownBtn.setAttribute("aria-expanded", "true");}
  function closeDropdown() { dropdownOpen = false; dropdownMenu.classList.add("opacity-0", "invisible"); dropdownMenu.classList.remove("opacity-100", "visible"); dropdownChevron.classList.remove("rotate-180"); dropdownBtn.setAttribute("aria-expanded", "false");}

  dropdownBtn?.addEventListener("click", (e) => { e.stopPropagation(); dropdownOpen ? closeDropdown() : openDropdown();});
  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => { if (dropdownOpen && !document.getElementById("products-dropdown-wrapper").contains(e.target)) {closeDropdown(); }
  });

  // Close dropdown on Escape key
  document.addEventListener("keydown", (e) => {if (e.key === "Escape") closeDropdown();});

  // Close dropdown when a dropdown link is clicked
  dropdownMenu?.querySelectorAll("a").forEach((link) => {link.addEventListener("click", closeDropdown);});

  // ===== Mobile Menu Toggle =====
  toggleBtn?.addEventListener("click", (e) => {e.stopPropagation(); mobileMenu?.classList.toggle("hidden");});

  // Close mobile menu when clicking nav links
  mobileLinks.forEach((link) => {link.addEventListener("click", () => mobileMenu?.classList.add("hidden"));});

  // Close mobile menu when clicking outside header
  document.addEventListener("click", (e) => {
    if (mobileMenu && header && !mobileMenu.classList.contains("hidden") && !header.contains(e.target)) {mobileMenu.classList.add("hidden");}
  });

  // Close on scroll / resize
  window.addEventListener("scroll", () => mobileMenu?.classList.add("hidden"));
  window.addEventListener("resize", () => { if (window.innerWidth >= 768) mobileMenu?.classList.add("hidden"); });

  // ===== Mobile Products Accordion =====
  const mobileProdBtn     = document.getElementById("mobile-products-btn");
  const mobileProdMenu    = document.getElementById("mobile-products-menu");
  const mobileProdChevron = document.getElementById("mobile-products-chevron");

  mobileProdBtn?.addEventListener("click", () => {
    const isOpen = !mobileProdMenu.classList.contains("hidden");
    mobileProdMenu.classList.toggle("hidden", isOpen);
    mobileProdMenu.classList.toggle("flex", !isOpen);
    mobileProdChevron.classList.toggle("rotate-180", !isOpen);
  });

  // ===== Header Scroll Effect =====
  // const handleScroll = () => {
  //   if (!header) return;
  //   const scrolled = window.scrollY > 30;
  //   header.classList.toggle("bg-transparent",                      !scrolled);
  //   header.classList.toggle("bg-white/95",                          scrolled);
  //   header.classList.toggle("backdrop-blur-xl",                     scrolled);
  //   header.classList.toggle("shadow-[0_10px_40px_rgba(0,0,0,0.08)]", scrolled);
  //   header.classList.toggle("border-b",                             scrolled);
  //   header.classList.toggle("border-primary/10",                    scrolled);
  // };
  const handleScroll = () => {
  if (!header) return;
  const scrolled = window.scrollY > 30;
  header.classList.add("bg-dark");
  if (scrolled) {
    header.classList.add( "backdrop-blur-xl", "shadow-[0_10px_40px_rgba(0,0,0,0.25)]", "border-b", "border-white/10");
  } else {
    header.classList.remove( "backdrop-blur-xl", "shadow-[0_10px_40px_rgba(0,0,0,0.25)]", "border-b", "border-white/10");
  }
};

handleScroll();
window.addEventListener("scroll", handleScroll);
  handleScroll();
  window.addEventListener("scroll", handleScroll);

  // ===== Active Menu Highlight =====
  const normalizePath = (path) => path.replace(/\/+$/, "") || "/";
  const currentPath   = normalizePath(window.location.pathname);
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#")) return;
    if (normalizePath(href) === currentPath) {
      link.classList.remove("text-dark");
      link.classList.add("text-primary", "font-semibold");
    }
  });

  // ===== Lucide =====
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // ===== Shortlist Swiper =====
  if (
    typeof Swiper !== "undefined" &&
    document.querySelector(".shortlistSwiper")
  ) {
    new Swiper(".shortlistSwiper", {
      spaceBetween: 10,
      pagination: {
        el: ".shortlistSwiper .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: { slidesPerView: 2.6 },
        576: { slidesPerView: 2.5 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 3 },
        1600: { slidesPerView: 4 },
      },
    });
  }

  // ===== Report Swiper =====
  if (
    typeof Swiper !== "undefined" &&
    document.querySelector(".reportSwiper")
  ) {
    new Swiper(".reportSwiper", {
      slidesPerView: 1,
      spaceBetween: 15,
      navigation: {
        nextEl: ".report-next",
        prevEl: ".report-prev",
      },
      pagination: {
        el: ".reportSwiper .swiper-pagination",
        clickable: true,
      },
    });
  }

  // ===== Cards Swiper =====
  if (
    typeof Swiper !== "undefined" &&
    document.querySelector(".cardsSwiper")
  ) {
    new Swiper(".cardsSwiper", {
      spaceBetween: 10,
      pagination: {
        el: ".cardsSwiper .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        576: { slidesPerView: 1.1 },
        768: { slidesPerView: 1.6 },
        1024: { slidesPerView: 2.2 },
        1600: { slidesPerView: 3 },
      },
    });
  }

  // ===== Brands Marquee =====
  if (
    typeof Swiper !== "undefined" &&
    document.querySelector(".brandsSwiper")
  ) {
    new Swiper(".brandsSwiper", {
      slidesPerView: "auto",
      spaceBetween: 80,
      loop: true,
      freeMode: false,
      allowTouchMove: false,
      grabCursor: false,

      speed: 6000,

      autoplay: {
        delay: 1,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
    });
  }

  // ===== Pricing Switcher =====
  const plans = {
    nano: {
      followers: "Under 50K followers",
      price: "₹1,999",
      delivery: "Per creator report · Delivered within 24 hours",
    },
    micro: {
      followers: "50K - 250K followers",
      price: "₹4,999",
      delivery: "Per creator report · Delivered within 48 hours",
    },
    mid: {
      followers: "250K - 1M followers",
      price: "₹9,999",
      delivery: "Detailed audit · Delivered within 72 hours",
    },
    macro: {
      followers: "1M+ followers",
      price: "Custom Pricing",
      delivery: "Enterprise-grade creator intelligence",
    },
  };

  const planButtons = document.querySelectorAll(".plan-btn");

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const plan = plans[button.dataset.plan];
      if (!plan) return;

      document.getElementById("followersText").textContent = plan.followers;
      document.getElementById("priceText").textContent = plan.price;
      document.getElementById("deliveryText").textContent = plan.delivery;

      planButtons.forEach((btn) => {
        btn.classList.remove("bg-primary", "text-white");
        btn.classList.add("border", "border-gray/30", "text-dark");
      });

      button.classList.add("bg-primary", "text-white");
      button.classList.remove("border", "border-gray/30", "text-dark");
    });
  });
});