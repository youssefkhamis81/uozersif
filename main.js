(function () {
  "use strict";

  var CLOUD = "dp83zpjpj";
  var BASE = "https://res.cloudinary.com/" + CLOUD + "/image/upload/";
  var WA_NUMBER = "201022632662";
  var EMAIL = "ykhamis81@gmail.com";

  var PORTFOLIO_IDS = [
    "JOO05245_nedk7d",
    "hero_wbr1qt",
    "JOO03194",
    "JOO03205",
    "JOO03590",
    "JOO03739",
    "JOO03809",
    "JOO03848",
    "JOO05269",
    "JOO_3873",
    "JOO_3938",
    "JOO_4690",
    "JOO_4973",
    "DSC01231",
    "DSC01363",
    "DSC02770",
    "DSC02804",
    "DSC02810",
    "DSC02841",
    "DSC02880",
    "DSC02888",
    "DSC02896",
    "DSC03007",
    "DSC06661",
    "DSC07881",
    "DSC07889",
    "DSC07926",
    "DSC09233",
    "DSC09245",
    "DSC09961",
    "DSC09970"
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function cloudUrl(id, w) {
    var t = w ? "w_" + w + ",c_fill,q_auto,f_auto/" : "q_auto,f_auto/";
    return BASE + t + id;
  }

  function wireHeroRandom() {
    var hero = document.getElementById("hero-img");
    if (!hero) return;
    var pool = shuffle(PORTFOLIO_IDS.slice());
    var id = pool[0];
    hero.src = cloudUrl(id, 1920);
    hero.classList.remove("is-placeholder");
  }

  function wirePortfolio() {
    var grid = document.getElementById("portfolio-grid");
    if (!grid) return;
    var ids = shuffle(PORTFOLIO_IDS.slice());
    ids.forEach(function (id) {
      var fig = document.createElement("figure");
      fig.className = "portfolio-item";
      var img = document.createElement("img");
      img.alt = "Wedding photography — uozersif Studios";
      img.loading = "lazy";
      img.decoding = "async";
      img.src = cloudUrl(id, 800);
      img.onerror = function () { fig.remove(); };
      fig.appendChild(img);
      grid.appendChild(fig);
    });
  }

  function wireProduct() {
    var el = document.getElementById("product-img");
    if (!el) return;
    el.src = "https://res.cloudinary.com/" + CLOUD + "/image/upload/q_auto,f_auto/product-cover";
    el.onerror = function () { el.src = "assets/product-cover.png"; };
  }

  function wirePortrait() {
    var el = document.getElementById("portrait-img");
    if (!el) return;
    el.src = "https://res.cloudinary.com/" + CLOUD + "/image/upload/q_auto,f_auto/portrait";
    el.onerror = function () { el.src = "assets/5.JPG"; };
  }

  function wireLogos() {
    var logoUrl = "https://res.cloudinary.com/" + CLOUD + "/image/upload/q_auto,f_auto/logo";
    document.querySelectorAll(".logo-img, .footer-logo-img").forEach(function (img) {
      img.onerror = function () {
        img.src = "assets/6.png";
      };
      img.src = logoUrl;
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
    window.location.href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + encodeURIComponent(buildBookingBody(data));
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
