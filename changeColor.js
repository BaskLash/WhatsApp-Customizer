// 2. Funktion, die neue Elemente prüft und den Effekt hinzufügt
function applyGlowingEffect() {
  const main = document.querySelector("div[tabindex='0'][data-tab='8']");

  // 1. CSS-Animation Styles EINMALIG hinzufügen
  if (main && !document.getElementById("glowingBorderStyle")) {
    const style = document.createElement("style");
    style.id = "glowingBorderStyle";
    style.innerHTML = `
    @keyframes glowingBorder {
      0%   { box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff; }
      50%  { box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff; }
      100% { box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff; }
    }

    .glowing-border {
      border: 2px solid transparent; 
      border-radius: 8px;
      animation: glowingBorder 2s infinite alternate;
    }
  `;
    document.head.appendChild(style);
  }
  console.log("Apply effects");
  if (!main) return;

  const chats = main.querySelectorAll('div[tabindex="-1"][role="row"]');

  chats.forEach((chat, chatIndex) => {
    const messageContainer = chat.querySelector("div.message-in");

    if (messageContainer) {
      const submessages = messageContainer.querySelectorAll("._amk6, ._amk4");

      submessages.forEach((submessage, subIndex) => {
        // Nur hinzufügen, wenn die Klasse noch nicht vorhanden ist
        if (!submessage.classList.contains("glowing-border")) {
          submessage.classList.add("glowing-border");
          console.log(
            `(Chat-Index: ${chatIndex}, Submessage-Index: ${subIndex})`
          );
        }
      });
    }
  });
}

// 3. Interval setzen, das jede Sekunde prüft
setInterval(applyGlowingEffect, 1000);
