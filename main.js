(function () {
  "use strict";

  var WA_NUMBER = "201022632662";
  var EMAIL = "ykhamis81@gmail.com";

  /**
   * Extra portfolio files (your real filenames — not only 1.jpg, 2.jpg).
   * Hero picks random from this + numbered files. Portrait (5), logo (6), product-cover, hero excluded below.
   */
  var EXTRA_PORTFOLIO = [
    "assets/4564.jpg",
    "assets/4984.jpg",
    "assets/DSC01231.JPG",
    "assets/DSC01363.JPG",
    "assets/DSC02770.jpg",
    "assets/DSC02804.jpg",
    "assets/DSC02810.jpg",
    "assets/DSC02841.jpg",
    "assets/DSC02880.jpg",
    "assets/DSC02888.jpg",
    "assets/DSC02896.jpg",
    "assets/DSC03007.JPG",
    "assets/DSC06661.JPG",
    "assets/DSC07881.JPG",
    "assets/DSC07889.JPG",
    "assets/DSC07926.JPG",
    "assets/DSC09233.JPG",
    "assets/DSC09245.JPG",
    "assets/DSC09961.JPG",
    "assets/DSC09970.JPG",
    "assets/JOO03194.jpg",
    "assets/JOO03205.jpg",
    "assets/JOO03590.jpg",
    "assets/JOO03739.jpg",
    "assets/JOO03809.jpg",
    "assets/JOO03848.jpg",
    "assets/JOO05245.jpg",
    "assets/JOO05269.jpg",
    "assets/JOO_3873.jpg",
    "assets/JOO_3938.jpg",
    "assets/JOO_4690.jpg",
    "assets/JOO_4973.jpg",
  ];

  /** Numbers 1–20 except 5 (you) and 6 (logo). */
  function portfolioIds() {
    var out = [];
    var n;
    for (n = 1; n <= 20; n++) {
      if (n === 5 || n === 6) continue;
      out.push(n);
    }
    return out;
  }

  /** Try png before jpg — matches how your files are saved. */
  var EXT = ["png", "jpg", "jpeg", "webp"];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  /** All candidate URLs for hero (random each page load). */
  function buildHeroCandidateUrls() {
    var urls = [];
    var n;
    var e;
    urls.push("assets/hero.png", "assets/hero.jpg", "assets/1.png", "assets/1.jpg");
    portfolioIds().forEach(function (num) {
      EXT.forEach(function (ext) {
        urls.push("assets/" + num + "." + ext);
      });
    });
    EXTRA_PORTFOLIO.forEach(function (u) {
      urls.push(u);
    });
    return shuffle(urls);
  }

  function wireHeroRandom() {
    var hero = document.getElementById("hero-img");
    if (!hero) return;

    var pool = buildHeroCandidateUrls();
    var i = 0;

    function tryNext() {
      if (i >= pool.length) {
        chainImageFallback(hero, [
          "assets/hero.png",
          "assets/1.png",
          "assets/1.jpg",
          "assets/product-cover.png",
        ]);
        return;
      }
      var src = pool[i];
      var probe = new Image();
      probe.onload = function () {
        hero.src = src;
        hero.classList.remove("is-placeholder");
      };
      probe.onerror = function () {
        i += 1;
        tryNext();
      };
      probe.src = src;
    }

    tryNext();
  }

  function chainImageFallback(img, urls, onAllFail) {
    if (!img || !urls.length) return;
    var idx = 0;
    function onErr() {
      idx += 1;
      if (idx >= urls.length) {
        img.removeEventListener("error", onErr);
        img.classList.add("is-placeholder");
        if (onAllFail) onAllFail();
        return;
      }
      img.src = urls[idx];
    }
    img.addEventListener("error", onErr);
    img.src = urls[0];
  }

  var PRODUCT_URLS = [
    "assets/product-cover.png",
    "assets/product-cover.jpg",
    "assets/product-cover.jpeg",
    "assets/product-cover.webp",
  ];

  var LOGO_URLS = ["assets/6.png", "assets/6.jpg", "assets/6.jpeg", "assets/6.webp"];

  var PORTRAIT_URLS = [
    "assets/5.JPG",
    "assets/5.jpg",
    "assets/5.jpeg",
    "assets/5.png",
    "assets/5.webp",
  ];

  function buildPortfolioSlots() {
    var slots = [];
    portfolioIds().forEach(function (num) {
      var base = "assets/" + num;
      slots.push([base + ".png", base + ".jpg", base + ".jpeg", base + ".webp"]);
    });
    EXTRA_PORTFOLIO.forEach(function (path) {
      slots.push([path]);
    });
    return slots;
  }

  function wirePortfolio() {
    var grid = document.getElementById("portfolio-grid");
    if (!grid) return;
    buildPortfolioSlots().forEach(function (urls) {
      var fig = document.createElement("figure");
      fig.className = "portfolio-item";
      var img = document.createElement("img");
      img.alt = "Wedding photography — uozersif Studios";
      img.loading = "lazy";
      img.decoding = "async";
      var j = 0;
      function onErr() {
        j += 1;
        if (j >= urls.length) {
          img.removeEventListener("error", onErr);
          fig.remove();
          return;
        }
        img.src = urls[j];
      }
      img.addEventListener("error", onErr);
      img.src = urls[0];
      fig.appendChild(img);
      grid.appendChild(fig);
    });
  }

  function wireProduct() {
    var el = document.getElementById("product-img");
    if (!el) return;
    chainImageFallback(el, PRODUCT_URLS);
  }

  function wirePortrait() {
    var el = document.getElementById("portrait-img");
    if (!el) return;
    chainImageFallback(el, PORTRAIT_URLS);
  }

  function wireLogos() {
    document.querySelectorAll(".logo-img").forEach(function (img) {
      chainImageFallback(img, LOGO_URLS, function () {
        img.style.display = "none";
        var next = img.nextElementSibling;
        if (next && next.classList.contains("logo-fallback")) next.hidden = false;
      });
    });
    document.querySelectorAll(".footer-logo-img").forEach(function (img) {
      chainImageFallback(img, LOGO_URLS, function () {
        img.style.display = "none";
        var next = img.nextElementSibling;
        if (next && next.classList.contains("footer-logo-fallback")) next.hidden = false;
      });
    });
  }

  function wireNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function buildBookingBody(data) {
    return [
      "Wedding booking — uozersif Studios",
      "",
      "Name: " + data.name,
      "Event date: " + data.eventDate,
      "What I need: " + data.request,
      "",
      "Message:",
      data.message || "(none)",
    ].join("\n");
  }

  function getFormData() {
    return {
      name: ((document.getElementById("full-name") || {}).value || "").trim(),
      eventDate: (document.getElementById("event-date") || {}).value || "",
      request: ((document.getElementById("request") || {}).value || "").trim(),
      message: ((document.getElementById("message") || {}).value || "").trim(),
    };
  }

  function validateBooking(data) {
    if (!data.name) return "Please enter your name.";
    if (!data.eventDate) return "Please choose your event date.";
    if (!data.request) return "Please tell us what you need.";
    return null;
  }

  function sendWhatsApp() {
    var data = getFormData();
    var err = validateBooking(data);
    if (err) {
      alert(err);
      return;
    }
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(buildBookingBody(data));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function sendEmail() {
    var data = getFormData();
    var err = validateBooking(data);
    if (err) {
      alert(err);
      return;
    }
    var subject = encodeURIComponent("Wedding booking — " + data.name);
    window.location.href =
      "mailto:" + EMAIL + "?subject=" + subject + "&body=" + encodeURIComponent(buildBookingBody(data));
  }

  function wireBooking() {
    var waBtn = document.getElementById("send-whatsapp");
    var emBtn = document.getElementById("send-email");
    if (waBtn) waBtn.addEventListener("click", sendWhatsApp);
    if (emBtn) emBtn.addEventListener("click", sendEmail);
  }

  function setYear() {
    document.querySelectorAll("#year").forEach(function (y) {
      y.textContent = String(new Date().getFullYear());
    });
  }

  wireHeroRandom();
  wirePortfolio();
  wireProduct();
  wirePortrait();
  wireLogos();
  wireNav();
  wireBooking();
  setYear();
})();
