const status = document.getElementById("status");
const form = document.getElementById("checklist-form");

// Invia dati al Web App
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "⏳ Invio dati…";
  status.style.color = "#004e98";

  const formData = new FormData(form);
  const data = {};
  formData.forEach((v, k) => data[k] = v);

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxzSm5WfVtnPOYmM3xNOnMJVhauo0hdSprV00PonfGeH5aHElsI3TIyHypfWoiCQsWu/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Risposta Web App:", result);

    if (result.success) {
      status.textContent = `✅ Dati salvati in ${result.sheet}, riga ${result.row}, colonna ${result.col}`;
      status.style.color = "green";
      form.reset();
    } else {
      status.textContent = "❌ Errore Web App: " + result.error;
      status.style.color = "red";
    }

  } catch(err) {
    console.error("Errore fetch:", err);
    status.textContent = "❌ Errore di rete: " + err.message;
    status.style.color = "red";
  }
});
