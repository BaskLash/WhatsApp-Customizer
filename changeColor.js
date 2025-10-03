// Funktion, die neue Elemente prüft und den Glowing-Effekt anwendet
function applyGlowingEffect(colors) {
  const main = document.querySelector("div[tabindex='0'][data-tab='8']");
  if (!main) return;

  // Falls nur eine Farbe als String vorliegt, in Array umwandeln
  if (!Array.isArray(colors)) colors = [colors];

  // Keyframe-Animation erstellen
  let style = document.getElementById("glowingBorderStyle");
  let keyframes = colors
    .map((c, i) => {
      const percent = Math.floor((i / colors.length) * 100);
      return `${percent}% { box-shadow: 0 0 5px ${c}, 0 0 10px ${c}; }`;
    })
    .join("\n");
  keyframes += `\n100% { box-shadow: 0 0 5px ${
    colors[colors.length - 1]
  }, 0 0 10px ${colors[colors.length - 1]}; }`;

  const styleContent = `
    @keyframes glowingBorder {
      ${keyframes}
    }

    .glowing-border {
      border: 2px solid transparent;
      border-radius: 8px;
      animation: glowingBorder 2s infinite alternate;
    }
  `;

  if (!style) {
    style = document.createElement("style");
    style.id = "glowingBorderStyle";
    style.innerHTML = styleContent;
    document.head.appendChild(style);
  } else if (style.innerHTML !== styleContent) {
    style.innerHTML = styleContent;
    console.log("Glowing-Farbe(n) aktualisiert:", colors);
  }

  // Chats aktualisieren
  const chats = main.querySelectorAll('div[tabindex="-1"][role="row"]');
  chats.forEach((chat, chatIndex) => {
    const messageContainer = chat.querySelector("div.message-in");
    if (!messageContainer) return;

    const submessages = messageContainer.querySelectorAll("._amk6, ._amk4");
    submessages.forEach((submessage, subIndex) => {
      if (!submessage.classList.contains("glowing-border")) {
        submessage.classList.add("glowing-border");
        console.log(
          `(Chat-Index: ${chatIndex}, Submessage-Index: ${subIndex})`
        );
      }
    });
  });
}

// 1️⃣ Initialfarbe aus chrome.storage.local holen
chrome.storage.local.get(["color"], (result) => {
  const color = result.color || "#ff00ff";
  applyGlowingEffect(color);
});

// 2️⃣ Listener für Änderungen in chrome.storage.local
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.color) {
    const newColor = changes.color.newValue;
    applyGlowingEffect(newColor);
  }
});

// 3️⃣ Interval für neue Chat-Elemente
setInterval(() => {
  chrome.storage.local.get(["color"], (result) => {
    applyGlowingEffect(result.color || "#ff00ff");
  });
}, 1000);
