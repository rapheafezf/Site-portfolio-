# Portfolio — Raphaël Bourguet

Site statique (HTML/CSS/JS, sans build). Polices auto-hébergées (Caveat, Manrope).

## Lancer en local

```sh
cd ~/portfolio-raphael
python3 -m http.server 8080 --bind 127.0.0.1
# puis ouvrir http://127.0.0.1:8080/
```

Le formulaire ne s'envoie pas réellement en local (Netlify Forms ne fonctionne qu'en ligne).

## À remplacer (rechercher « À compléter », « À remplacer », « votre-domaine »)

| Élément | Où |
|---|---|
| Domaine `https://votre-domaine.fr/` | `index.html` (canonical, hreflang, OG, JSON-LD), `en/index.html`, `robots.txt`, `sitemap.xml`, `netlify.toml` |
| E-mail `contact@votre-domaine.fr` | `index.html` (section Contact) et `CONTACT_EMAIL` dans `js/main.js` |
| Liens (LinkedIn, etc.) | Section Contact : ajouter un `<li><a class="social" href="…">` à côté de GitHub |
| Photo | Section À propos : remplacer le bloc « Photo à fournir » par un `<img>` (≈ 800×1000, JPG/WebP, avec `alt`) |
| Logo | Pastille « R » dans le header, `favicon.svg`, `assets/img/apple-touch-icon.png` |
| Parcours | Paragraphe `todo-block` de la section À propos |
| Sites internet | Section `#sites` : nom, description, capture, lien « Voir le site », puis retirer le badge `todo` |
| Mentions légales | `mentions-legales.html` (éditeur, hébergeur, données) |
| Image de partage | `assets/img/og-image.jpg` (1200×630) si besoin |

Après modification : mettre à jour `lastmod` dans `sitemap.xml`.

## Déploiement

**Netlify (recommandé)** : glisser le dossier sur app.netlify.com ou relier un dépôt Git.
- `_headers` : HSTS, CSP et en-têtes de sécurité.
- `netlify.toml` : redirections HTTPS et www en 301. Adapter le domaine.
- Formulaire : Netlify Forms est détecté automatiquement (`data-netlify`). Activer les notifications e-mail dans l'interface.

**Formspree (autre hébergeur)** : créer un formulaire sur formspree.io, puis mettre l'URL dans `FORM_ENDPOINT` (`js/main.js`). La CSP autorise déjà `formspree.io`. Sur un hébergeur autre que Netlify, reproduire les en-têtes de `_headers` dans sa configuration.

Anti-spam : champ piège invisible (`site_web`) et délai minimal de remplissage de 3 s.

## Version anglaise

`en/index.html` est une page d'attente en `noindex`. Pour la traduire : copier `index.html`, traduire les textes, passer `lang="en"`, retirer `noindex` et ajouter l'URL au sitemap.
