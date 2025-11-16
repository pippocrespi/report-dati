
// L'URL che il Service Worker deve ignorare
const SCRIPT_URL_DA_IGNORARE = 'https://script.google.com/macros/s/';

self.addEventListener('fetch', event => {
  
  // Controlla se la richiesta è per lo script Google
  if (event.request.url.startsWith(SCRIPT_URL_DA_IGNORARE)) {
    
    // È lo script Google: ignoriamo la cache e andiamo
    // dritti alla rete. DEVI usare event.respondWith().
    event.respondWith(fetch(event.request));

  } else {
    
    // È TUTTO IL RESTO (index.html, style.css, app.js):
    // Per ora, mandiamo tutto alla rete. 
    // (In futuro, qui potresti aggiungere la logica di cache)
    event.respondWith(fetch(event.request));
  }
  
});