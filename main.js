(function () {
  "use strict";

  var WA_NUMBER = "201022632662";
  var EMAIL = "ykhamis81@gmail.com";
  var CDN = "https://res.cloudinary.com/dp83zpjpj/image/upload/";

  var EXTRA_PORTFOLIO = [
    CDN + "4564.jpg",
    CDN + "4984.jpg",
    CDN + "DSC01231.JPG",
    CDN + "DSC01363.JPG",
    CDN + "DSC02770.jpg",
    CDN + "DSC02804.jpg",
    CDN + "DSC02810.jpg",
    CDN + "DSC02841.jpg",
    CDN + "DSC02880.jpg",
    CDN + "DSC02888.jpg",
    CDN + "DSC02896.jpg",
    CDN + "DSC03007.JPG",
    CDN + "DSC06661.JPG",
    CDN + "DSC07881.JPG",
    CDN + "DSC07889.JPG",
    CDN + "DSC07926.JPG",
    CDN + "DSC09233.JPG",
    CDN + "DSC09245.JPG",
    CDN + "DSC09961.JPG",
    CDN + "DSC09970.JPG",
    CDN + "JOO03194.jpg",
    CDN + "JOO03205.jpg",
    CDN + "JOO03590.jpg",
    CDN + "JOO03739.jpg",
    CDN + "JOO03809.jpg",
    CDN + "JOO03848.jpg",
    CDN + "JOO05245.jpg",
    CDN + "JOO05269.jpg",
    CDN + "JOO_3873.jpg",
    CDN + "JOO_3938.jpg",
    CDN + "JOO_4690.jpg",
    CDN + "JOO_4973.jpg",
  ];

  function portfolioIds() {
    var out = [];
    var n;
    for (n = 1; n <= 20; n++) {
      if (n === 5 || n === 6) continue;
      out.push(n);
    }
    return out;
  }

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

  function buildHeroCandidateUrls() {
    var urls = [];
    urls.push(CDN + "hero.png", CDN + "hero.jpg", CDN + "1.png", CDN + "1.jpg");
    portfolioIds().forEach(function (num) {
      EXT.forEach(function (ext) {
        urls.push(CDN + num + "." + ext);
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
          CDN + "hero.png",
          CDN + "1.png",
          CDN + "1.jpg",
          CDN + "product-cover.png",
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
    CDN + "product-cover.png",
    CDN + "product-cover.jpg",
    CDN + "product-cover.jpeg",
    CDN + "product-cover.webp",
  ];

  var LOGO_URLS = [
    CDN + "6.png",
    CDN + "6.jpg",
    CDN + "6.jpeg",
    CDN + "6.webp",
  ];

  var PORTRAIT_URLS = [
    CDN + "5.JPG",
    CDN + "5.jpg",
    CDN + "5.jpeg",
    CDN + "5.png",
    CDN + "5.webp",
  ];

  function buildPortfolioSlots() {
    var slots = [];
    portfolioIds().forEach(function (num) {
      var base = CDN + num;
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
    if (err) { alert(err); return; }
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(buildBookingBody(data));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function sendEmail() {
    var data = getFormData();
    var err = validateBooking(data);
    if (err) { alert(err); return; }
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
