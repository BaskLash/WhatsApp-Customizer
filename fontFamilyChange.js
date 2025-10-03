const fontSelector = document.getElementById("fontSelector");
let styleTag = null;
let fontLink = null;

// Hilfsfunktion: Schriftart anwenden
function applyFont(font) {
  // Wenn keine Auswahl ("Nothing"), Standard-Schrift
  if (!font) {
    if (!styleTag) {
      styleTag = document.createElement("style");
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      * {
        font-family: sans-serif !important;
      }
    `;
    // Falls vorher ein Google Font Link existiert, entfernen
    if (fontLink) {
      fontLink.remove();
      fontLink = null;
    }
    return;
  }

  // Google Font dynamisch laden
  if (!fontLink) {
    fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
  }
  fontLink.href = `https://fonts.googleapis.com/css2?family=${font}&display=swap`;

  // Style-Tag aktualisieren / erstellen
  if (!styleTag) {
    styleTag = document.createElement("style");
    document.head.appendChild(styleTag);
  }
  styleTag.innerHTML = `
    * {
      font-family: '${font.replace(/\+/g, " ")}', sans-serif !important;
    }
  `;
}

// Event Listener für Änderung
fontSelector.addEventListener("change", () => {
  const selectedFont = fontSelector.value;
  applyFont(selectedFont);

  // Auswahl speichern
  chrome.storage.local.set({ fontStyle: selectedFont });
});

// Beim Laden prüfen, ob schon ein Font gespeichert wurde
chrome.storage.local.get(["fontStyle"], (result) => {
  const savedFont = result.fontStyle || "";
  fontSelector.value = savedFont; // Vorauswahl setzen
  applyFont(savedFont); // Direkt anwenden
});
