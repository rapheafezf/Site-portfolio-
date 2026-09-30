/* =========================================================
   Portfolio Raphaël Bourguet — interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---- Réglages à personnaliser ---- */
  // Adresse affichée en secours si l'envoi du formulaire échoue.
  var CONTACT_EMAIL = 'bourguetraphae57@gmail.com';
  // Laisser vide pour Netlify Forms. Pour Formspree : 'https://formspree.io/f/VOTRE_ID'
  var FORM_ENDPOINT = '';
  // Délai minimum (ms) entre l'affichage et l'envoi : un humain met plus de 3 s à écrire.
  var MIN_FILL_TIME = 3000;

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Année du pied de page ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- En-tête : ombre au défilement ---- */
  var header = document.querySelector('.site-header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Menu mobile ---- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('menu');
  var setMenu = function (open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('is-open', open);
  };
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a[href^="#"]')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); burger.focus(); }
  });

  /* ---- Thème clair / sombre ---- */
  var toggle = document.querySelector('.theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  toggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* non bloquant */ }
  });

  /* ---- Tracé des SVG : longueur réelle de chaque trait ---- */
  document.querySelectorAll('.draw').forEach(function (el) {
    if (typeof el.getTotalLength === 'function') {
      el.style.setProperty('--len', Math.ceil(el.getTotalLength() + 2));
    }
  });

  /* ---- Apparition au défilement + tracé des SVG ---- */
  var reveals = document.querySelectorAll('.reveal');
  var drawables = [];
  document.querySelectorAll('.draw').forEach(function (el) {
    var svg = el.ownerSVGElement || el;
    if (drawables.indexOf(svg) === -1) drawables.push(svg);
  });

  var showAll = function () {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    drawables.forEach(function (el) { el.classList.add('is-drawn'); });
  };

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add(el.classList.contains('reveal') ? 'is-visible' : 'is-drawn');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    // Léger décalage en cascade pour les éléments d'une même grille
    document.querySelectorAll('.grid').forEach(function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        child.style.transitionDelay = (i % 4) * 80 + 'ms';
      });
    });

    reveals.forEach(function (el) { io.observe(el); });
    drawables.forEach(function (el) { io.observe(el); });
  }
  reduceMotion.addEventListener && reduceMotion.addEventListener('change', function (e) { if (e.matches) showAll(); });

  /* ---- Lien de navigation actif ---- */
  var links = {};
  document.querySelectorAll('.nav__list a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---- Formulaire de contact ---- */
  var form = document.querySelector('.form');
  if (!form) return;

  var status = form.querySelector('.form__status');
  var tsField = form.querySelector('[name="_ts"]');
  var startedAt = Date.now();
  tsField.value = String(startedAt);

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var rules = {
    nom: function (v) { return v.trim().length >= 2 || 'Indiquez votre nom (2 caractères minimum).'; },
    email: function (v) { return EMAIL_RE.test(v.trim()) || 'Indiquez une adresse e-mail valide.'; },
    message: function (v) { return v.trim().length >= 10 || 'Votre message doit faire au moins 10 caractères.'; },
    rgpd: function (v, el) { return el.checked || 'Merci de cocher cette case pour que je puisse vous répondre.'; }
  };

  var validateField = function (el) {
    var rule = rules[el.name];
    if (!rule) return true;
    var result = rule(el.value, el);
    var error = document.getElementById(el.getAttribute('aria-describedby'));
    var ok = result === true;
    el.setAttribute('aria-invalid', String(!ok));
    if (error) error.textContent = ok ? '' : result;
    return ok;
  };

  Object.keys(rules).forEach(function (name) {
    var el = form.elements[name];
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'blur', function () { validateField(el); });
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') validateField(el); });
  });

  var setStatus = function (msg, type) {
    status.textContent = msg;
    status.className = 'form__status' + (type ? ' is-' + type : '');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('', '');

    var invalid = Object.keys(rules).map(function (n) { return form.elements[n]; }).filter(function (el) { return !validateField(el); });
    if (invalid.length) { invalid[0].focus(); setStatus('Merci de corriger les champs indiqués.', 'error'); return; }

    // Anti-spam : champ piège rempli ou envoi trop rapide → on ignore en silence
    var honeypot = form.elements.site_web.value;
    if (honeypot || Date.now() - startedAt < MIN_FILL_TIME) {
      setStatus('Merci ! Votre message a bien été envoyé.', 'ok');
      form.reset();
      return;
    }

    var data = new FormData(form);
    var request = FORM_ENDPOINT
      ? fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      : fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() });

    form.classList.add('is-sending');
    setStatus('Envoi en cours…', '');

    request.then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      setStatus('Merci ! Votre message a bien été envoyé. Je vous réponds au plus vite.', 'ok');
      form.reset();
      startedAt = Date.now();
      tsField.value = String(startedAt);
      form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    }).catch(function () {
      setStatus('L’envoi a échoué. Vous pouvez m’écrire directement à ' + CONTACT_EMAIL + '.', 'error');
    }).finally(function () {
      form.classList.remove('is-sending');
    });
  });
})();
