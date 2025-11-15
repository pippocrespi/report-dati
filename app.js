// URL del Web App Google Apps Script (sostituisci con la tua)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxas2U9_4798Y5Unq72JOOfB7p-20N7jqx0mt5YbUgg7LLj17WKEVouqfCd7jM1HPpM/exec";

// Riferimenti DOM
const form = document.getElementById("checklist-form");
const status = document.getElementById("status");

// Variabili toggle pranzo/cena
let pranzo = false;
let cena = false;

// Toggle pranzo/cena
document.getElementById("btnPranzo")?.addEventListener("click", () => {
  pranzo = !pranzo;
  document.getElementById("btnPranzo").classList.toggle("active", pranzo);
});
document.getElementById("btnCena")?.addEventListener("click", () => {
  cena = !cena;
  document.getElementById("btnCena").classList.toggle("active", cena);
});

// Submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "⏳ Invio dati...";
  status.style.color = "#004e98";

  // Raccoglie i dati dal form
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  // Aggiunge toggle pranzo/cena
  data.pranzo = pranzo;
  data.cena = cena;

  // Controlli base
  if (!data.sede) { alert("Seleziona una sede"); return; }
  if (!data.numero_postazione) { alert("Inserisci il numero della postazione"); return; }

  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Risposta Web App:", result);

    if (result.success) {
      status.textContent = "✅ Dati salvati nel foglio: " + result.sheet;
      status.style.color = "green";
      form.reset();
      pranzo = false;
      cena = false;
      document.getElementById("btnPranzo")?.classList.remove("active");
      document.getElementById("btnCena")?.classList.remove("active");
    } else {
      status.textContent = "❌ Errore Web App: " + result.error;
      status.style.color = "red";
    }
  } catch (err) {
    console.error("Errore fetch:", err);
    status.textContent = "❌ Errore di rete: " + err.message;
    status.style.color = "red";
  }
});
