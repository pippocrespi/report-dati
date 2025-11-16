// REGISTRAZIONE SERVICE WORKER
// ==========================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Service Worker registrato con successo:', registration);
      })
      .catch(error => {
        console.log('Registrazione Service Worker fallita:', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checklist-form');
    const statusDiv = document.getElementById('status');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkG2BqUK0orFxj6xWK__4NlLbUqxuq_Z8X1CvjzdR0mhASlWyjW4202kHNcFl06vYL/exec';

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