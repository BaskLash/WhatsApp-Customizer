// content.js (major changes: use MutationObserver to handle dynamic loading, default to hidden, apply on load and changes)
function initBurgerMenu() {
  const containerSelector =
    ".x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1cy8zhl.x1277o0a";
  const toggleTargetSelector =
    "._aigw._as6h.x9f619.x1n2onr6.x5yr21d.x17dzmu4.x1i1dayz.x2ipvbc.x1w8yi2h.x78zum5.xdt5ytf.x12xzxwr.x1plvlek.xryxfnj.x14bqcqg.x18dvir5.xxljpkc.xwfak60.x18pi947";

  // Funktion zum Initialisieren des Burger Menüs
  function tryInit() {
    const container = document.querySelector(containerSelector);
    const toggleTarget = document.querySelector(toggleTargetSelector);

    if (container && toggleTarget) {
      if (document.querySelector(".custom-burger-menu")) return;

      const burgerButton = document.createElement("button");
      burgerButton.className = "custom-burger-menu";
      burgerButton.title = "Disable Side Nav";
      burgerButton.innerHTML = `<span></span><span></span><span></span>`;

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

      burgerButton.addEventListener("click", () => {
        // Section Parts
        const status = document.querySelector("div[title='Status']");
        const channels = document.querySelector("div[title='Channels']");
        const communities = document.querySelector("div[title='Communities']");

        // Definiere separate currentDisplay-Werte für jedes Element
        let currentDisplayStatus = status
          ? window.getComputedStyle(status).display
          : null;
        let currentDisplayChannels = channels
          ? window.getComputedStyle(channels).display
          : null;
        let currentDisplayCommunities = communities
          ? window.getComputedStyle(communities).display
          : null;

        // Wenn eines der Elemente nicht existiert, wenden wir die normale Anzeigeänderung an
        if (!status && !channels && !communities) {
          // Wenn mindestens eines fehlt, togglen wir das `toggleTarget`
          const currentDisplay = window.getComputedStyle(toggleTarget).display;
          toggleTarget.style.display =
            currentDisplay === "none" ? "block" : "none";
        } else {
          // Nur das zugehörige Element toggeln, wenn es existiert
          if (channels) {
            document.querySelector(
              "div[aria-label='Channel tab drawer']"
            ).style.display =
              currentDisplayChannels === "none" ? "block" : "none";
          }
          if (status) {
            document.querySelector(
              "div[aria-label='Status tab drawer']"
            ).style.display =
              currentDisplayStatus === "none" ? "block" : "none";
          }
          if (communities) {
            document.querySelector(
              "div[aria-label='Community tab drawer']"
            ).style.display =
              currentDisplayCommunities === "none" ? "block" : "none";
          }
        }

        // Burger Button Title anpassen, basierend auf dem aktuellen Display-Zustand von `toggleTarget`
        const currentDisplay = window.getComputedStyle(toggleTarget).display;
        burgerButton.title =
          currentDisplay === "none" ? "Enable Side Nav" : "Disable Side Nav";
      });

      container.insertBefore(burgerButton, container.firstChild);
    }
  }

  // Polling-Mechanismus, um sicherzustellen, dass die Elemente geladen sind
  const maxAttempts = 20; // Erhöht für bessere Zuverlässigkeit
  let attemptCount = 0;

  const interval = setInterval(() => {
    tryInit();

    if (
      document.querySelector(containerSelector) &&
      document.querySelector(toggleTargetSelector)
    ) {
      clearInterval(interval);
    }

    attemptCount++;
    if (attemptCount >= maxAttempts) {
      clearInterval(interval);
      console.warn(
        "Burger Menü konnte nicht initialisiert werden: Maximale Versuche erreicht."
      );
    }
  }, 500);
}

let visibilityOptions = {
  status: false,
  channels: false,
  communities: false,
  lockedChats: false,
  archived: false,
}; // Global to store options

function applyVisibility() {
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
        divChildren[index].style.display = visibilityOptions[key]
          ? "block"
          : "none";
      }
    }
  }

  // Handle Locked Chats and Archived
  const side = document.getElementById("side");
  if (side) {
    const notificationBanner = document.querySelector(
      "button[aria-label='Close']"
    );
    if (notificationBanner) {
      notificationBanner.click();
    }
    const paneSide = document.getElementById("pane-side");
    if (paneSide) {
      const lockedChats = paneSide.querySelector(
        "button[aria-label='Locked chats']"
      );
      const archived = paneSide.querySelector(
        "button[aria-label^='Archived']" // Improved selector to match "Archived" or "Archived chats" etc.
      );

      if (lockedChats) {
        lockedChats.style.display = visibilityOptions.lockedChats
          ? "block"
          : "none";
      }

      if (archived) {
        archived.style.display = visibilityOptions.archived ? "block" : "none";
      }
    }
  }
}

function loadAndApplyVisibilityOptions() {
  chrome.storage.local.get(["visibilityOptions"], (data) => {
    visibilityOptions = data.visibilityOptions || {
      status: false,
      channels: false,
      communities: false,
      lockedChats: false,
      archived: false,
    };
    applyVisibility();
  });
}

// MutationObserver to detect dynamic changes in WhatsApp Web (SPA)
function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    // Throttle to avoid too many calls
    if (
      mutations.some(
        (mutation) =>
          mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0
      )
    ) {
      applyVisibility();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function runAll() {
  initBurgerMenu();
  loadAndApplyVisibilityOptions();
  observeDOMChanges(); // Start observing for changes
}

// Run on load
document.addEventListener("DOMContentLoaded", runAll);
window.addEventListener("load", runAll);
setTimeout(runAll, 3000); // Fallback

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyVisibility") {
    visibilityOptions = message.options;
    applyVisibility();
  }
});
