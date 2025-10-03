function applyGlowingEffect(color) {
  const main = document.querySelector("div[tabindex='0'][data-tab='8']");
  if (!main) return;

  // 1️⃣ CSS-Animation Styles EINMALIG hinzufügen / aktualisieren
  let style = document.getElementById("glowingBorderStyle");
  const styleContent = `
    @keyframes glowingBorder {
      0%   { box-shadow: 0 0 5px ${color}, 0 0 10px ${color}; }
      50%  { box-shadow: 0 0 20px ${color}, 0 0 40px ${color}; }
      100% { box-shadow: 0 0 5px ${color}, 0 0 10px ${color}; }
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
    console.log("Glowing-Farbe aktualisiert:", color);
  }

  // 2️⃣ Chats durchgehen
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
  const color = result.color || "#ff00ff"; // Fallback
  applyGlowingEffect(color);
});

// 2️⃣ Listener für Änderungen in chrome.storage.local
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.color) {
    const newColor = changes.color.newValue;
    console.log("Farbe geändert auf:", newColor);
    applyGlowingEffect(newColor);
  }
});

// 3️⃣ Optional: Interval für neue Elemente
setInterval(() => {
  chrome.storage.local.get(["color"], (result) => {
    const color = result.color || "#ff00ff";
    applyGlowingEffect(color);
  });
}, 1000);
