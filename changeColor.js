// Cache last applied glowing colors to avoid unnecessary updates
let lastAppliedColors = null;

// Utility: Apply transparency to the header once
function makeHeaderTransparent() {
  const header = document.querySelector("header"); // Replace with actual header selector
  if (header && header.style.background !== "transparent") {
    header.style.background = "transparent";
    console.log("Making header transparent");
  }
}

// Apply glowing effect to chat message elements
function applyGlowingEffect(colors) {
  const main = document.querySelector("div[tabindex='0'][data-tab='8']");
  if (!main) return;

  // Normalize to array
  if (!Array.isArray(colors)) colors = [colors];

  // Skip if colors haven't changed
  const colorSignature = colors.join(",");
  if (lastAppliedColors === colorSignature) return;
  lastAppliedColors = colorSignature;

  // Create keyframes for animation
  const keyframes = colors
    .map((c, i) => {
      const percent = Math.floor((i / colors.length) * 100);
      return `${percent}% { box-shadow: 0 0 5px ${c}, 0 0 10px ${c}; }`;
    })
    .join("\n") + `
100% { box-shadow: 0 0 5px ${colors[colors.length - 1]}, 0 0 10px ${colors[colors.length - 1]}; }`;

  // CSS for glowing border
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

  // Inject or update style tag
  let style = document.getElementById("glowingBorderStyle");
  if (!style) {
    style = document.createElement("style");
    style.id = "glowingBorderStyle";
    document.head.appendChild(style);
  }
  if (style.innerHTML !== styleContent) {
    style.innerHTML = styleContent;
    console.log("Glowing colors updated:", colors);
  }

  // Apply glow to chat message elements
  const chats = main.querySelectorAll('div[tabindex="-1"][role="row"]');
  chats.forEach((chat, chatIndex) => {
    const messageContainer = chat.querySelector("div.message-in");
    if (!messageContainer) return;

    const submessages = messageContainer.querySelectorAll("._amk6, ._amk4");
    submessages.forEach((submessage, subIndex) => {
      if (!submessage.classList.contains("glowing-border")) {
        submessage.classList.add("glowing-border");
        console.log(`Applied glow to (Chat ${chatIndex}, Submessage ${subIndex})`);
      }
    });
  });
}

// Observe DOM for new chat messages
function observeChatDOM() {
  const main = document.querySelector("div[tabindex='0'][data-tab='8']");
  if (!main) return;

  const observer = new MutationObserver(() => {
    chrome.storage.local.get(["color"], (result) => {
      applyGlowingEffect(result.color || "#ff00ff");
    });
  });

  observer.observe(main, {
    childList: true,
    subtree: true
  });

  console.log("Chat DOM observer initialized");
}

// Initialize on load
function initGlowingFeature() {
  makeHeaderTransparent(); // Only apply if needed

  // 1️⃣ Get initial color and apply
  chrome.storage.local.get(["color"], (result) => {
    applyGlowingEffect(result.color || "#ff00ff");
  });

  // 2️⃣ Watch for color updates in storage
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.color) {
      const newColor = changes.color.newValue;
      applyGlowingEffect(newColor);
    }
  });

  // 3️⃣ Watch DOM for new chat messages
  observeChatDOM();
}

// ✅ Run it!
initGlowingFeature();
