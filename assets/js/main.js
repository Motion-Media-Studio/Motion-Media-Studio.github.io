(function () {
  "use strict";

  window.addEventListener("load", function () {
    var preloader = document.getElementById("preloader");
    if (preloader) preloader.classList.add("done");
  });

  var menuBtn = document.getElementById("cornerMenuBtn");
  var navOverlay = document.getElementById("navOverlay");

  var menuIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  var closeIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

  function closeNavOverlay() {
    if (navOverlay) navOverlay.classList.remove("open");
    if (menuBtn) menuBtn.innerHTML = menuIcon;
    document.body.style.overflow = "";
  }

  if (menuBtn && navOverlay) {
    menuBtn.innerHTML = menuIcon;
    menuBtn.addEventListener("click", function () {
      var willOpen = !navOverlay.classList.contains("open");
      navOverlay.classList.toggle("open", willOpen);
      menuBtn.innerHTML = willOpen ? closeIcon : menuIcon;
      document.body.style.overflow = willOpen ? "hidden" : "";
    });

    navOverlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNavOverlay);
    });
  }

  var SECTION_IDS = ["hero", "about", "services", "portfolio", "pricing", "contact"];
  var sections = SECTION_IDS.map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);

  var overlayLinks = document.querySelectorAll(".nav-overlay a");

  var heroEl = document.getElementById("hero");
  var ctaEl = document.querySelector(".cta");
  var cornerLogo = document.getElementById("cornerLogo");

  function onScroll() {
    var mid = window.scrollY + window.innerHeight / 2;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= mid) current = sec;
    });

    overlayLinks.forEach(function (link) {
      var li = link.closest("li");
      if (!li) return;
      li.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
    });

    var overDark = false;
    [heroEl, ctaEl].forEach(function (el) {
      if (el && mid >= el.offsetTop && mid <= el.offsetTop + el.offsetHeight) overDark = true;
    });
    if (cornerLogo) cornerLogo.classList.toggle("on-dark", overDark);
    if (menuBtn) menuBtn.classList.toggle("on-dark", overDark);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  var filterButtons = document.querySelectorAll(".portfolio-filters button");
  var portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");
      portfolioItems.forEach(function (item) {
        var show = filter === "*" || item.classList.contains(filter.slice(1));
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  var pricingTabs = document.querySelectorAll(".pricing-tabs button");
  var pricingPanels = document.querySelectorAll(".pricing-panel");

  pricingTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      pricingTabs.forEach(function (t) { t.classList.remove("active"); });
      pricingPanels.forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      var target = document.getElementById(tab.getAttribute("data-tab"));
      if (target) target.classList.add("active");
    });
  });

  var modal = document.querySelector(".video-modal");
  var modalInner = modal ? modal.querySelector(".video-modal-inner") : null;

  function openVideoModal(youtubeId) {
    if (!modal || !modalInner) return;
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1&rel=0";
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    modalInner.innerHTML = "";
    modalInner.appendChild(iframe);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeVideoModal() {
    if (!modal || !modalInner) return;
    modal.classList.remove("open");
    modalInner.innerHTML = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-youtube]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openVideoModal(el.getAttribute("data-youtube"));
    });
  });

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".video-modal-close")) {
        closeVideoModal();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeVideoModal();
    });
  }

  var form = document.querySelector(".contact-form form");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector("button[type=submit]");
      var originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            status.textContent = "Thanks — your message has been sent. We'll be in touch soon.";
            status.className = "form-status visible ok";
            form.reset();
          } else {
            status.textContent = "Something went wrong. Please try again or email us directly.";
            status.className = "form-status visible err";
          }
        })
        .catch(function () {
          status.textContent = "Something went wrong. Please try again or email us directly.";
          status.className = "form-status visible err";
        })
        .finally(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  }
})();
