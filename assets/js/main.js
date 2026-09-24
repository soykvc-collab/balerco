/* ============================================================
   BALERCO — interacciones
   ============================================================ */
(function () {
  "use strict";

  /* ---- Scroll suave global (Lenis) ---- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({
      lerp: 0.1,            // suavizado ligero y con respuesta rápida (evita el "lag")
      wheelMultiplier: 1,
      smoothWheel: true
    });
    var rafLenis = function (time) { lenis.raf(time); requestAnimationFrame(rafLenis); };
    requestAnimationFrame(rafLenis);

    // Enlaces internos con desplazamiento suave y compensación del nav fijo
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href === "#") return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -96 });
      });
    });
  }

  /* ---- Año actual en el footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Menú móvil ---- */
  var toggle = document.querySelector(".nav__toggle");
  var mobile = document.getElementById("mobileMenu");
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Abrir menú" : "Cerrar menú");
      mobile.hidden = open;
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        mobile.hidden = true;
      });
    });
  }

  /* ---- Hero: el video se encoge a tarjeta al hacer scroll ---- */
  var hero = document.querySelector(".hero");
  var heroStage = hero && hero.querySelector(".hero__stage");
  var heroVideo = hero && hero.querySelector(".hero__video");
  var prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroVideo) {
    // Asegura la reproducción (autoplay silenciado)
    var tryPlay = heroVideo.play();
    if (tryPlay && tryPlay.catch) tryPlay.catch(function () {});
  }

  if (hero && heroStage) {
    function heroVh() { return window.innerHeight || document.documentElement.clientHeight; }
    function setHeroSp(scrollY) {
      var scrolled = scrollY - hero.offsetTop;
      var range = heroVh() * 0.3;                  // el encogimiento se reparte en ~2 scrolls
      var sp = scrolled / range;
      sp = sp < 0 ? 0 : sp > 1 ? 1 : sp;
      hero.style.setProperty("--sp", sp.toFixed(4));
      if (heroVideo && heroVideo.paused && scrolled < heroVh()) {
        var pp = heroVideo.play();
        if (pp && pp.catch) pp.catch(function () {});
      }
    }
    if (lenis) {
      // Lenis ya suaviza el scroll → mapeo directo, sin segundo suavizado (evita el lag)
      lenis.on("scroll", function (e) { setHeroSp(e.scroll); });
    } else {
      var heroTick = false;
      window.addEventListener("scroll", function () {
        if (heroTick) return; heroTick = true;
        requestAnimationFrame(function () { setHeroSp(window.pageYOffset); heroTick = false; });
      }, { passive: true });
    }
    window.addEventListener("resize", function () { setHeroSp(window.pageYOffset); });
    setHeroSp(window.pageYOffset);
  }

  /* ---- Acordeón de productos ---- */
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var isMobile = function () { return window.matchMedia("(max-width: 960px)").matches; };

  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  // Escritorio: solo uno abierto a la vez
  function openPanel(panel) {
    if (panel.classList.contains("is-open")) return;
    panels.forEach(function (p) {
      p.classList.remove("is-open");
      var b = p.querySelector(".panel__bar");
      var c = p.querySelector(".panel__content");
      if (b) b.setAttribute("aria-expanded", "false");
      if (c) c.hidden = false; // en escritorio el contenido se oculta con opacidad, no con hidden
    });
    panel.classList.add("is-open");
    panel.querySelector(".panel__bar").setAttribute("aria-expanded", "true");
  }

  panels.forEach(function (panel) {
    var bar = panel.querySelector(".panel__bar");
    var content = panel.querySelector(".panel__content");

    // Al pasar el mouse (o al enfocar con teclado) se abre, sin necesidad de clic
    panel.addEventListener("mouseenter", function () {
      if (!isMobile() && canHover.matches) openPanel(panel);
    });
    bar.addEventListener("focus", function () {
      if (!isMobile()) openPanel(panel);
    });

    // Clic / toque: sigue funcionando (pantallas táctiles y móvil)
    bar.addEventListener("click", function () {
      if (isMobile()) {
        // En móvil funciona como acordeón simple (toggle individual)
        var alreadyOpen = panel.classList.contains("is-open");
        panel.classList.toggle("is-open");
        bar.setAttribute("aria-expanded", String(!alreadyOpen));
        if (content) content.hidden = alreadyOpen;
        return;
      }
      openPanel(panel);
    });
  });

  // Asegura estado inicial correcto del contenido según viewport
  function syncPanels() {
    panels.forEach(function (p) {
      var c = p.querySelector(".panel__content");
      if (!c) return;
      if (isMobile()) {
        c.hidden = !p.classList.contains("is-open");
      } else {
        c.hidden = false;
      }
    });
  }
  syncPanels();
  window.addEventListener("resize", syncPanels);

  /* ---- Por qué: las tarjetas salen de un montón al hacer scroll ---- */
  var why = document.querySelector(".why");
  var whyTrack = why && why.querySelector(".why__track");
  var whyStage = why && why.querySelector(".why__stage");
  var values = why ? Array.prototype.slice.call(why.querySelectorAll(".value")) : [];
  if (why && whyTrack && whyStage && values.length) {
    var tilts = [-9, 5, -4, 8];              // grados: se ven como cartas sueltas
    var whyGrid = values[0].parentElement;
    function measureWhy() {
      var gridRect = whyGrid.getBoundingClientRect();
      var cx = gridRect.left + gridRect.width / 2;
      values.forEach(function (v, i) {
        var r = v.getBoundingClientRect();
        v.style.setProperty("--dx", (cx - (r.left + r.width / 2)).toFixed(1) + "px");
        v.style.setProperty("--dy", (i % 2 ? 14 : -10) + "px");
        v.style.setProperty("--rot", tilts[i % tilts.length] + "deg");
      });
    }
    function setWhyP() {
      if (window.matchMedia("(max-width: 960px)").matches) { why.style.setProperty("--p", 1); return; }
      var vh = window.innerHeight;
      var top = whyGrid.getBoundingClientRect().top;
      // apiladas cuando asoman por abajo, abiertas al llegar a media pantalla
      var p = (vh * 0.92 - top) / (vh * 0.42);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      why.style.setProperty("--p", p.toFixed(4));
    }
    measureWhy();
    setWhyP();
    if (lenis) lenis.on("scroll", setWhyP);
    else window.addEventListener("scroll", setWhyP, { passive: true });
    window.addEventListener("resize", function () {
      why.style.setProperty("--p", 1);        // medimos con las tarjetas en su sitio
      measureWhy();
      setWhyP();
    });
  }

  /* ---- Galería: carrusel vertical continuo (dos columnas opuestas) ---- */
  var galleryEl = document.querySelector(".gallery");
  if (galleryEl) {
    var items = Array.prototype.slice.call(galleryEl.querySelectorAll(".gallery__item"));
    if (items.length) {
      var colA = document.createElement("div");
      var colB = document.createElement("div");
      colA.className = "gallery__col";
      colB.className = "gallery__col gallery__col--down";
      items.forEach(function (it, i) { (i % 2 ? colB : colA).appendChild(it); });
      galleryEl.appendChild(colA);
      galleryEl.appendChild(colB);

      function fillColumn(col) {
        var base = Array.prototype.slice.call(col.children);   // juego original
        var need = galleryEl.clientHeight;
        var guard = 0;
        // repetimos el juego hasta cubrir la ventana visible…
        while (col.scrollHeight < need && guard++ < 12) {
          base.forEach(function (child) { col.appendChild(cloneItem(child)); });
        }
        // …y luego duplicamos todo: la animación a -50% cierra el bucle sin salto
        Array.prototype.slice.call(col.children).forEach(function (child) {
          col.appendChild(cloneItem(child));
        });
      }
      function cloneItem(el) {
        var copy = el.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        copy.setAttribute("tabindex", "-1");
        return copy;
      }
      fillColumn(colA);
      fillColumn(colB);
    }
  }

  /* ---- Misión: el texto aparece al entrar en pantalla ---- */
  var mission = document.querySelector(".mission");
  if (mission) {
    if ("IntersectionObserver" in window) {
      var mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          mio.unobserve(e.target);
        });
      }, { threshold: 0.25 });
      mio.observe(mission);
    } else {
      mission.classList.add("is-in");
    }
  }

  /* ---- Contadores de cifras ---- */
  var counters = Array.prototype.slice.call(document.querySelectorAll(".stat__num[data-count]"));
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = 0;
    var dur = 1400;
    var t0 = performance.now();
    function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- Cifras: cuentan de 0 al valor al entrar en pantalla ---- */
  var statsGrid = document.querySelector(".stats__grid");
  if (statsGrid && counters.length) {
    if ("IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          counters.forEach(animateCount);
          sio.unobserve(e.target);
        });
      }, { threshold: 0.3 });
      sio.observe(statsGrid);
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---- Marquesinas de "Para quien" ----
     Se repite el juego de burbujas hasta cubrir la ventana y despues se duplica
     entero: asi el translateX(-50%) del CSS empalma sin salto. Los clones salen
     del arbol accesible. La duracion se fija por ancho para que ambas cintas
     corran a la misma velocidad. ---- */
  var marquees = document.querySelectorAll("[data-marquee]");
  Array.prototype.forEach.call(marquees, function (track) {
    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length) return;

    function copy(node) {
      var c = node.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      return c;
    }

    var guard = 0;
    while (track.scrollWidth < window.innerWidth * 1.25 && guard < 20) {
      originals.forEach(function (li) { track.appendChild(copy(li)); });
      guard++;
    }

    var half = track.scrollWidth;
    Array.prototype.slice.call(track.children).forEach(function (li) {
      track.appendChild(copy(li));
    });

    /* ~46 px por segundo: avanza sin apurar la lectura */
    track.style.setProperty("--mq-dur", Math.round(half / 46) + "s");
  });

  /* ---- "Para quien": la pastilla y el titular entran desplazandose a la
     derecha, ligado al scroll (mismo patron que el hero y las tarjetas). ---- */
  var sectorsMid = document.querySelector(".sectors__mid");
  if (sectorsMid) {
    var setMidP = function () {
      var vh = window.innerHeight;
      var r = sectorsMid.getBoundingClientRect();
      /* arranca cuando asoma por abajo y llega a su sitio al cruzar media pantalla */
      var p = (vh * 0.95 - r.top) / (vh * 0.45);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      sectorsMid.style.setProperty("--p", p.toFixed(4));
    };
    setMidP();
    if (lenis) lenis.on("scroll", setMidP);
    else window.addEventListener("scroll", setMidP, { passive: true });
    window.addEventListener("resize", setMidP);
  }

  var sectors = document.querySelector(".sectors");
  if (sectors) {
    if ("IntersectionObserver" in window) {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          sectors.classList.add("is-in");
          bio.disconnect();
        });
      }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
      bio.observe(sectors);
    } else {
      sectors.classList.add("is-in");
    }
  }

  /* ---- Reveal + disparo de contadores con IntersectionObserver ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(
    ".section-head:not(.sectors__head), .step, .contact__grid, .stats__grid"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Formulario ----
     Si aún no has conectado Formspree (la acción contiene TU_ID_FORMSPREE),
     el envío se hace por correo (mailto) para no perder el mensaje. ---- */
  var form = document.querySelector(".form");
  if (form) {
    var note = form.querySelector(".form__note");
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      var notConnected = action.indexOf("TU_ID_FORMSPREE") !== -1;

      if (notConnected) {
        e.preventDefault();
        var nombre = (form.nombre && form.nombre.value) || "";
        var email = (form.email && form.email.value) || "";
        var tel = (form.telefono && form.telefono.value) || "";
        var msg = (form.mensaje && form.mensaje.value) || "";
        var body =
          "Nombre: " + nombre + "%0D%0A" +
          "Correo: " + email + "%0D%0A" +
          "Teléfono: " + tel + "%0D%0A%0D%0A" +
          "Mensaje:%0D%0A" + encodeURIComponent(msg);
        window.location.href =
          "mailto:contactenos@balerco.com.co?subject=" +
          encodeURIComponent("Nueva solicitud de cotización — " + nombre) +
          "&body=" + body;
        if (note) {
          note.textContent = "Abrimos tu correo para enviar la solicitud. ¡Gracias!";
          note.className = "form__note is-ok";
        }
      }
      // Si Formspree está conectado, se envía normalmente por POST.
    });
  }

  /* ---- Modal de video (sección destacada) ---- */
  var vmodal = document.getElementById("vmodal");
  var playBtn = document.querySelector(".feature__play");
  if (vmodal && playBtn && typeof vmodal.showModal === "function") {
    var vVideo = vmodal.querySelector(".vmodal__video");
    var bgVideo = document.querySelector(".feature__video");
    playBtn.addEventListener("click", function () {
      if (!vVideo.src) vVideo.src = playBtn.getAttribute("data-video");
      vmodal.showModal();
      if (lenis) lenis.stop();
      if (bgVideo) bgVideo.pause();
      vVideo.currentTime = 0;
      var pv = vVideo.play();
      if (pv && pv.catch) pv.catch(function () {});
    });
    vmodal.querySelector(".vmodal__close").addEventListener("click", function () { vmodal.close(); });
    // clic fuera del video cierra
    vmodal.addEventListener("click", function (e) { if (e.target === vmodal) vmodal.close(); });
    // Esc siempre cierra (no dependemos solo del comportamiento nativo del <dialog>)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && vmodal.open) { e.preventDefault(); vmodal.close(); }
    });
    // se ejecuta al cerrar por botón, clic fuera o tecla Esc
    vmodal.addEventListener("close", function () {
      vVideo.pause();
      if (lenis) lenis.start();
      if (bgVideo) { var pb = bgVideo.play(); if (pb && pb.catch) pb.catch(function () {}); }
      playBtn.focus();
    });
  }

  /* ---- Lightbox de la galería ---- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector(".lightbox__img");
    var lbClose = lightbox.querySelector(".lightbox__close");
    var lastFocused = null;

    function openLightbox(full, alt) {
      lastFocused = document.activeElement;
      lbImg.src = full;
      lbImg.alt = alt || "";
      lightbox.hidden = false;
      document.body.classList.add("no-scroll");
      if (lenis) lenis.stop();
      lbClose.focus();
    }
    function closeLightbox() {
      lightbox.hidden = true;
      lbImg.src = "";
      document.body.classList.remove("no-scroll");
      if (lenis) lenis.start();
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    document.addEventListener("click", function (e) {
      var item = e.target.closest ? e.target.closest(".gallery__item") : null;
      if (!item) return;
      var img = item.querySelector("img");
      openLightbox(item.getAttribute("data-full"), img ? img.alt : "");
    });

    lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }
})();
