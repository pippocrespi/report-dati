
const SCRIPT_URL_DA_IGNORARE = 'https://script.google.com/macros/s/';

self.addEventListener('fetch', event => {
  
  // Se è lo script Google, ignora completamente il service worker.
  // NON chiamare event.respondWith().
  if (event.request.url.startsWith(SCRIPT_URL_DA_IGNORARE)) {
    return; // <-- QUESTA È LA CORREZIONE FONDAMENTALE
  }
  
  // Per tutto il resto (index.html, style.css),
  // gestisci la richiesta (per ora, vai alla rete).
  event.respondWith(fetch(event.request));
});