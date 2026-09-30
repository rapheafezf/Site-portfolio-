/* Chargé en synchrone dans <head> : applique le thème choisi avant l'affichage (évite le flash) */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) { /* stockage indisponible : on suit le thème du système */ }
})();
