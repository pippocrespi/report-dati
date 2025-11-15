// Seleziona il form
const form = document.getElementById("checklist-form");

// URL del Web App Google Sheets (sostituire con il tuo)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwV_ac77WPTthaldJpLZmZWbOh8KLsgr0aWKe6dD3--Eh4KZ3ZvaCWrd12aHr5vrZW0/exec";

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // blocca invio standard

  // Raccoglie i dati del form
  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value; // costruisce oggetto {nome_campo: valore}
  });

  // Controlli base
  if (!data.sede) {
    alert("Seleziona una sede");
    return;
  }
  if (!data.numero_postazione) {
    alert("Inserisci il numero della postazione");
    return;
  }

  try {
    // Invio dati al Web App
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.text();

    // Feedback utente
    alert(result);

    // Eventuale reset del form
    form.reset();

  } catch (error) {
    console.error("Errore invio dati:", error);
    alert("Errore invio dati: " + error);
  }
});
