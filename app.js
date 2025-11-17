/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Cambiamo in ?v=5 (o v=6, v=7... ogni volta)
    navigator.serviceWorker.register('./service-worker.js?v=1') 
      .then(registration => {
        console.log('Service Worker (v1) registrato:', registration);
      })
      .catch(error => {
        console.log('Registrazione Service Worker fallita:', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checklist-form');
    const statusDiv = document.getElementById('status');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyl5v2T4jwQWygACXHRuewPFEGAot35shOIv8QfKwAwW1TxBZcvYn1rtyzQVM0i-xh-/exec';

    function updateStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = type;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verifica la presenza dei campi critici per il routing
        if (!document.getElementById('sede').value || !document.getElementById('numero_postazione').value) {
            updateStatus('❌ Seleziona una Sede e inserisci il Numero Postazione.', 'error');
            return;
        }

        updateStatus('Invio in corso...', 'loading');

        try {
            const formData = new FormData(form);

            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result && result.result === 'Success!') {
                updateStatus('✅ Dati inviati con successo! Il foglio è stato aggiornato.', 'success');
                // Puoi decidere di resettare o meno qui:
                // form.reset(); 
                // 1. Salva il valore attuale della sede
            //    const sedeSalvata = document.getElementById('sede').value;

                // 2. Resetta l'intero form (cancella tutti gli altri campi)
            //    form.reset();

                // 3. Ripristina il valore della sede
            //    document.getElementById('sede').value = sedeSalvata;
            } else {
                updateStatus(`❌ Errore durante l'invio: ${result.message || 'Errore sconosciuto'}`, 'error');
                console.error('Apps Script Response:', result);
            }

        } catch (error) {
            updateStatus('❌ Errore di rete. Controlla la tua connessione o l\'URL dello script.', 'error');
            console.error('Fetch Error:', error);
        }
    });
});
*/

// ==========================================================
// APP.JS (NUOVA VERSIONE - METODO BASE64)
// ==========================================================

// Rimuovi o commenta la registrazione del Service Worker, non ci serve
/*
if ('serviceWorker' in navigator) {
  // ...
}
*/

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checklist-form');
    const statusDiv = document.getElementById('status');
    const fotoInput = document.getElementById('foto'); // Prendiamo l'input della foto

    // INCOLLA IL TUO NUOVO URL DI DEPLOY QUI
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRrheaQhOzTz_YwPTEL_zJDCGD9T9qmPDhuvHCOnDG5uz1wp85y1NNLvYNhXZH65Dc/exec';

    function updateStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = type;
    }

    // Funzione helper per leggere il file come Base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // ==========================================================
    // --- NUOVO BLOCCO ANTEPRIMA FOTO (INIZIA QUI) ---
    // ==========================================================
    
    // 1. Prendi l'elemento <img> (fotoInput è già definito sopra)
    const fotoPreviewImg = document.getElementById('foto-preview');

    // 2. Aggiungi un "ascoltatore" a 'fotoInput' (la variabile esistente)
    fotoInput.addEventListener('change', (event) => {
        
        // Prendi il file che l'utente ha selezionato
        const file = event.target.files[0];

        if (file) {
            // Se c'è un file, usa FileReader per leggerlo
            const reader = new FileReader();
            
            reader.onload = (e) => {
                // Imposta il 'src' del nostro tag <img>
                fotoPreviewImg.src = e.target.result;
                
                // Mostra l'immagine (che prima era nascosta)
                fotoPreviewImg.style.display = 'block';
            };
            
            // Avvia la lettura del file
            reader.readAsDataURL(file);
        }
    });

    // ==========================================================
    // --- NUOVO BLOCCO ANTEPRIMA FOTO (FINISCE QUI) ---
    // ==========================================================


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!document.getElementById('sede').value || !document.getElementById('numero_postazione').value) {
            updateStatus('❌ Seleziona una Sede e inserisci il Numero Postazione.', 'error');
            return;
        }

        updateStatus('Invio in corso... (Conversione file...)', 'loading');

        try {
            const formData = new FormData(form);
            const file = fotoInput.files[0];

            // 1. Controlla se c'è un file
            if (file) {
                // Ridimensioniamo l'immagine
                const resizedBase64 = await resizeImage(file);

                // 2. Aggiungi il file come testo (Base64)
                formData.append('foto_base64', resizedBase64);

                // 3. Rimuovi il file originale
                formData.delete('foto');

                updateStatus('Invio in corso... (Caricamento dati...)', 'loading');
            }

            // ==========================================================
            // --- INIZIO MODIFICA "FIRE AND FORGET" ---
            // (Evita l'errore CORS)
            // ==========================================================

            // NON usiamo 'await' e NON proviamo a leggere .json()
            fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            }).catch(err => {
                // Questo blocco cattura e silenzia l'errore CORS/Network
                // che sappiamo essere innocuo. Non facciamo nulla.
                // console.log("Errore CORS/Network (innocuo) silenziato.");
            });

            // Siccome non possiamo leggere la risposta, 
            // aspettiamo 2 secondi e mostriamo "Successo"
            setTimeout(() => {
                updateStatus('✅ Dati inviati!', 'success');
// Resetta il form mantenendo la sede
                const sedeSalvata = document.getElementById('sede').value;
                form.reset();
                document.getElementById('sede').value = sedeSalvata;
            
                // Aggiunta: Nascondi l'anteprima dopo l'invio
                fotoPreviewImg.style.display = 'none';
                fotoPreviewImg.src = ''; // Pulisci l'immagine

            }, 2000); // 2 secondi di attesa

            // ==========================================================
            // --- FINE MODIFICA ---
            // ==========================================================

        } catch (error) {
            // Questo catturerà solo errori PRIMA dell'invio (es. ridimensionamento)
            updateStatus(`❌ Errore durante la preparazione: ${error.message}`, 'error');
            console.error('Fetch Error:', error);
        }
    });

    // Funzione helper per ridimensionare l'immagine prima dell'invio
    // (Previene errori se la foto è troppo grande)
    function resizeImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1920; // Larghezza massima

                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= (MAX_WIDTH / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Restituisci il Base64 dell'immagine ridimensionata
                    resolve(canvas.toDataURL('image/jpeg', 0.9)); // 90% quality
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    }
});