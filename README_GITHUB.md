# Administracion SE - Web (GitHub Pages)

Esta carpeta contiene archivos listos para publicarse en GitHub Pages.

## Publicar
1. Sube el contenido de dist-github/ al repositorio (rama main).
2. En GitHub: Settings > Pages > Source: Deploy from a branch > Branch: main / dist-github.
3. Espera el deploy. La app es SPA: 404.html hace fallback a index.html.

## Variables
- Configura REACT_APP_VAPID_PUBLIC_KEY antes de compilar si usaras notificaciones push.
