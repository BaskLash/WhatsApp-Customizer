// Hauptfunktion: Initialisiert das Burger-Menü und die Logik für die Navigation
function initBurgerMenu() {
  // Selektor für den Container, in dem das Burger-Menü eingefügt wird
  const containerSelector =
    ".x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1cy8zhl.x1277o0a";

  // Selektor für die Home-Chat-Übersicht
  const homeChatSelector = ".two > :nth-child(4)";

  // Funktion zum Initialisieren des Burger-Menüs
  function tryInit() {
    const container = document.querySelector(containerSelector);
    if (!container) return; // Beende, wenn Container nicht gefunden
    if (document.querySelector(".custom-burger-menu")) return; // Beende, wenn Burger-Menü bereits existiert

    // Erstelle den Burger-Menü-Button
    const burgerButton = document.createElement("button");
    burgerButton.className = "custom-burger-menu";
    burgerButton.title = "Navigation ein-/ausblenden";
    burgerButton.innerHTML = `<span></span><span></span><span></span>`;

    // Füge Styling für den Burger-Button hinzu
    const style = document.createElement("style");
    style.textContent = `
      .custom-burger-menu {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 36px;
        background: #444;
        border: none;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        z-index: 9999;
        transition: transform 0.2s ease, background-color 0.3s ease;
      }
      .custom-burger-menu span {
        display: block;
        width: 24px;
        height: 3px;
        background: #fff;
        border-radius: 2px;
        margin: 3px 0;
        transition: background-color 0.3s ease, transform 0.3s ease;
      }
      .custom-burger-menu:hover {
        background-color: #666;
        transform: scale(1.05);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }
      .custom-burger-menu:hover span {
        background-color: #fff;
        transform: scaleX(1.1);
      }
    `;
    document.head.appendChild(style);

    // Funktion zum Abrufen des gespeicherten Display-Status aus chrome.storage
    const getSavedDisplayState = async (key) => {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] || "block"); // Standard: sichtbar, wenn nicht gespeichert
        });
      });
    };

    // Funktion zum Speichern des Display-Status in chrome.storage
    const saveDisplayState = (key, value) => {
      chrome.storage.local.set({ [key]: value });
    };

    // Funktion zum Ein-/Ausblenden von Elementen und Speichern des Zustands
    const toggleDisplay = (element, homeChatElement, key) => {
      if (!element || !homeChatElement) return;
      const currentDisplay = window.getComputedStyle(element).display;
      const newDisplay = currentDisplay === "none" ? "block" : "none";
      element.style.display = newDisplay;
      homeChatElement.style.display = newDisplay; // Synchronisiere Home-Chat-Übersicht
      saveDisplayState(key, newDisplay);
    };

    // Funktion zum Anwenden des gespeicherten Zustands
    const applySavedState = async (
      elementSelector,
      storageKey,
      homeChatElement
    ) => {
      const element = document.querySelector(elementSelector);
      if (element && homeChatElement) {
        const savedState = await getSavedDisplayState(storageKey);
        element.style.display = savedState;
        homeChatElement.style.display = savedState; // Synchronisiere Home-Chat
      }
    };

    // Event-Listener für den Burger-Button
    burgerButton.addEventListener("click", async () => {
      const homeChatElement = document.querySelector(homeChatSelector);

      // Prüfe, welcher Button aktiv ist (aria-pressed="true")
      const statusActive = document.querySelector(
        "button[aria-label='Status'][aria-pressed='true']"
      );
      const channelsActive = document.querySelector(
        "button[aria-label='Channels'][aria-pressed='true']"
      );
      const communitiesActive = document.querySelector(
        "button[aria-label='Communities'][aria-pressed='true']"
      );

      // Behandle den aktiven Bereich
      if (statusActive) {
        const statusElement = document.querySelector(
          "div[aria-label='Status tab drawer']"
        );
        toggleDisplay(statusElement, homeChatElement, "statusDisplay");
      } else if (channelsActive) {
        const channelsElement = document.querySelector(
          "div[aria-label='Channel tab drawer']"
        );
        toggleDisplay(channelsElement, homeChatElement, "channelsDisplay");
      } else if (communitiesActive) {
        const communitiesElement = document.querySelector(
          "div[aria-label='Community tab drawer']"
        );
        toggleDisplay(
          communitiesElement,
          homeChatElement,
          "communitiesDisplay"
        );
      } else {
        // Standardfall: Haupt-Navigationsbereich (Chats)
        toggleDisplay(homeChatElement, homeChatElement, "chatsDisplay");
      }
    });

    // Event-Listener für Navigation-Buttons, um gespeicherten Zustand sofort anzuwenden
    const applySavedStateOnClick = (
      buttonSelector,
      elementSelector,
      storageKey
    ) => {
      const button = document.querySelector(buttonSelector);
      if (button) {
        button.addEventListener("click", async () => {
          // Warte kurz, um sicherzustellen, dass WhatsApp Web die DOM-Änderungen vorgenommen hat
          setTimeout(async () => {
            const homeChatElement = document.querySelector(homeChatSelector);
            await applySavedState(elementSelector, storageKey, homeChatElement);
          }, 100); // Kurze Verzögerung für DOM-Updates
        });
      }
    };

    // Initialisiere Event-Listener für alle Navigations-Buttons
    applySavedStateOnClick(
      "button[aria-label='Chats']",
      homeChatSelector,
      "chatsDisplay"
    );
    applySavedStateOnClick(
      "button[aria-label='Status']",
      "div[aria-label='Status tab drawer']",
      "statusDisplay"
    );
    applySavedStateOnClick(
      "button[aria-label='Channels']",
      "div[aria-label='Channel tab drawer']",
      "channelsDisplay"
    );
    applySavedStateOnClick(
      "button[aria-label='Communities']",
      "div[aria-label='Community tab drawer']",
      "communitiesDisplay"
    );

    // Füge den Burger-Button in den Container ein
    container.insertBefore(burgerButton, container.firstChild);

    // Initialisiere den gespeicherten Zustand für alle Bereiche
    const initializeSavedStates = async () => {
      const homeChatElement = document.querySelector(homeChatSelector);
      await applySavedState(homeChatSelector, "chatsDisplay", homeChatElement);
      await applySavedState(
        "div[aria-label='Status tab drawer']",
        "statusDisplay",
        homeChatElement
      );
      await applySavedState(
        "div[aria-label='Channel tab drawer']",
        "channelsDisplay",
        homeChatElement
      );
      await applySavedState(
        "div[aria-label='Community tab drawer']",
        "communitiesDisplay",
        homeChatElement
      );
    };
    initializeSavedStates();
  }

  // Polling-Mechanismus, um auf das Laden der Elemente zu warten
  const maxAttempts = 20;
  let attemptCount = 0;
  const interval = setInterval(() => {
    tryInit();
    if (document.querySelector(containerSelector)) {
      clearInterval(interval);
    }
    attemptCount++;
    if (attemptCount >= maxAttempts) {
      clearInterval(interval);
      console.warn(
        "Burger-Menü konnte nicht initialisiert werden: Maximale Versuche erreicht."
      );
    }
  }, 500);
}

// MutationObserver: Reagiert auf Änderungen im DOM (für dynamisches Laden)
function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    if (
      mutations.some(
        (mutation) =>
          mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0
      )
    ) {
      initBurgerMenu(); // Versuche, das Menü neu zu initialisieren
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function applyVisibilityOptions() {
  chrome.storage.local.get(["visibilityOptions"], (data) => {
    const options = data.visibilityOptions || {
      status: false,
      channels: false,
      communities: false,
      lockedChats: false,
      archived: false,
    };

    const parent = document.querySelector(
      ".x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1cy8zhl.x1277o0a"
    );
    if (parent) {
      const divChildren = Array.from(parent.children).filter(
        (child) => child.tagName.toLowerCase() === "div"
      );
      const map = { status: 1, channels: 2, communities: 3 };

      for (const key in map) {
        const index = map[key];
        if (divChildren[index]) {
          divChildren[index].style.display = options[key] ? "block" : "none";
        }
      }
    }

    // Handle Locked Chats and Archived
    const paneSide = document.getElementById("pane-side");
    if (paneSide) {
      const lockedChats = paneSide.querySelector(
        "button[aria-label='Locked chats']"
      );
      const archived = paneSide.querySelector("button[aria-label='Archived ']");

      if (lockedChats) {
        lockedChats.style.display = options.lockedChats ? "block" : "none";
      }

      if (archived) {
        archived.style.display = options.archived ? "block" : "none";
      }
    }
  });
}

// Hauptstartfunktion
function runAll() {
  initBurgerMenu();
  observeDOMChanges();

  // Versuche mehrfach, die Visibility anzuwenden
  let tries = 0;
  const interval = setInterval(() => {
    applyVisibilityOptions();
    tries++;
    if (tries > 10) clearInterval(interval);
  }, 1000);
}

// Starte, wenn die Seite geladen ist
document.addEventListener("DOMContentLoaded", runAll);
window.addEventListener("load", runAll);
window.addEventListener("load", customThemes);
setTimeout(runAll, 3000); // Fallback für verzögertes Laden

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyVisibilityFromPopup") {
    applyVisibilityOptions();
  }
});

// Funktion, die die Schrift global setzt
function applyFont(fontName) {
  let existingLink = document.getElementById("dynamicFontLink");
  let existingStyle = document.getElementById("dynamicFontStyle");

  if (existingLink) existingLink.remove();
  if (existingStyle) existingStyle.remove();

  if (!fontName) return;

  // 1. Google Font Link
  const link = document.createElement("link");
  link.id = "dynamicFontLink";
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
  document.head.appendChild(link);

  // 2. Replace + with space for CSS
  const cssFontName = fontName.replace(/\+/g, " ");

  // 3. Style tag
  const style = document.createElement("style");
  style.id = "dynamicFontStyle";
  style.innerHTML = `
    * {
      font-family: '${cssFontName}', sans-serif !important;
    }
  `;
  document.head.appendChild(style);
}

// 1️⃣ Beim Laden prüfen, ob schon ein Font gespeichert ist
chrome.storage.local.get(["fontStyle"], (result) => {
  const fontName = result.fontStyle || "";
  applyFont(fontName);
});

// 2️⃣ Änderungen an fontStyle direkt anwenden
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.fontStyle) {
    const newFont = changes.fontStyle.newValue || "";
    applyFont(newFont);
  }
});

// --- FONT SCALING LOGIC ---

function applyInterfaceScale(scale) {
  if (!scale) return;
  document.body.style.zoom = scale;
}

// 1. Initial load
chrome.storage.local.get(["wa-custom-scale"], (result) => {
  const savedScale = result["wa-custom-scale"] || 1;
  applyInterfaceScale(savedScale);
});

// 2. Live updates from popup
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes["wa-custom-scale"]) {
    applyInterfaceScale(changes["wa-custom-scale"].newValue);
  }
});
