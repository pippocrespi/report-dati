const status = document.getElementById("status");
const btnPranzo = document.getElementById("btnPranzo");
const btnCena = document.getElementById("btnCena");
let pranzo = false;
let cena = false;

// toggle pranzo/cena
btnPranzo.addEventListener("click", () => {
  pranzo = !pranzo;
  btnPranzo.classList.toggle("active", pranzo);
});
btnCena.addEventListener("click", () => {
  cena = !cena;
  btnCena.classList.toggle("active", cena);
});

// suggerimenti orari
document.querySelectorAll(".suggestions span").forEach(span => {
  span.addEventListener("click", () => {
    const targetId = span.dataset.target;
    const time = span.dataset.time;
    document.getElementById(targetId).value = time;
  });
});

// setta automaticamente la data odierna
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (mm < 10) mm = "0" + mm;
  if (dd < 10) dd = "0" + dd;
  document.getElementById("dataIngresso").value = `${yyyy}-${mm}-${dd}`;
});

  // All'inizio, crea un riferimento alla scritta "Ultimo orario inserito"
const ultimoOrario = document.getElementById("ultimoOrario");

// --- Mostra subito l'ultimo inserimento salvato in locale ---
window.addEventListener("DOMContentLoaded", () => {
  const ultimo = localStorage.getItem("ultimoOrario");
  if (ultimo) {
    ultimoOrario.textContent = "Ultimo orario inserito: " + ultimo;
  } else {
    ultimoOrario.textContent = "Ultimo orario inserito: Caricamento...";
  }
});

// invio dati
document.getElementById("btnInvia").addEventListener("click", () => {
  const formData = new FormData();
  formData.append("dataIngresso", document.getElementById("dataIngresso").value);
  formData.append("oraEntrata", document.getElementById("oraEntrata").value);
  formData.append("oraUscita", document.getElementById("oraUscita").value);
  formData.append("pranzo", pranzo);
  formData.append("cena", cena);

  fetch("https://script.google.com/macros/s/AKfycbyN0RarYLCOrw8K3Q75fbx6JeY9m74xIZn3l6oL2Wg1-YQQvfr2Zz2cvLHTApZSTpvK/exec", {
    method: "POST",
    body: formData
  })
  .then(r => r.json())
  .then(res => {
    if(res.success){
      status.textContent = "✅ Dati salvati nel foglio " + res.sheet;
      pranzo = false; cena = false;
      btnPranzo.classList.remove("active");
      btnCena.classList.remove("active");
      document.getElementById("mealForm").reset();
      // reset data a oggi
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1;
      let dd = today.getDate();
      if (mm < 10) mm = "0" + mm;
      if (dd < 10) dd = "0" + dd;
      document.getElementById("dataIngresso").value = `${yyyy}-${mm}-${dd}`;

      // --- SALVA IN LOCALE LA DATA INSERITA ---
      const dataInserita = document.getElementById("dataIngresso").value;
      const dataLocale = new Date(dataInserita);
      const giornoFormattato = dataLocale.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
      localStorage.setItem("ultimoOrario", giornoFormattato);

      // --- AGGIORNA LA SCRITTA ---
      ultimoOrario.textContent = "Ultimo orario inserito: " + giornoFormattato;
      
    } else {
      status.textContent = "❌ Errore: " + res.error;
    }
  })
  .catch(err => {
    status.textContent = "❌ Errore di rete: " + err.message;
  });
});

  //script esportare PDF
 document.getElementById("btnPDF").addEventListener("click", () => {
  // Prendi i valori dai select
  const mese = document.getElementById("mese").value;
  const anno = document.getElementById("anno").value;

  // URL del tuo Web App di Google Apps Script
  const scriptUrl = "https://script.google.com/macros/s/AKfycbyN0RarYLCOrw8K3Q75fbx6JeY9m74xIZn3l6oL2Wg1-YQQvfr2Zz2cvLHTApZSTpvK/exec";

  // Apri il PDF in una nuova scheda che parte con il download
  window.open(`${scriptUrl}?mese=${encodeURIComponent(mese)}&anno=${encodeURIComponent(anno)}`, "_blank");
});
