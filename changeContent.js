function customThemes() {
  console.log("Starting custom themes...");

  // Hilfsfunktion zum Laden und Setzen der Themes
  function applyThemes() {
    const paneSide = document.getElementById("pane-side");
    const main = document.getElementById("main");
    const parent = document.querySelector('div[tabindex="-1"][class^="two"]');
    const grid = document.querySelector('div[role="grid"]');
    const headerEl = document.querySelector("header[tabindex='0']");

    // 1. Navigation Header Hintergrund setzen
    if (headerEl && !headerEl.dataset.customized) {
      chrome.storage.local.get(["navside"], (result) => {
        const getImageURL = (src) =>
          src && src.startsWith("images/") ? chrome.runtime.getURL(src) : src;
        const navsideImage = getImageURL(result.navside);
        if (navsideImage) {
          headerEl.style.backgroundImage = `url('${navsideImage}')`;
          headerEl.style.backgroundSize = "cover";
          headerEl.style.backgroundPosition = "center";
          headerEl.dataset.customized = "true";
          console.log("Applied navside background");
        }
      });
    }

    // 2. Chatbereiche & Willkommen
    if ((paneSide || grid) && (main || parent)) {
      chrome.storage.local.get(["welcome", "chatview", "sidenav"], (result) => {
        const getImageURL = (src) =>
          src && src.startsWith("images/") ? chrome.runtime.getURL(src) : src;

        const welcomeImage = getImageURL(result.welcome);
        const chatviewImage = getImageURL(result.chatview);
        const sidenavImage = getImageURL(result.sidenav);

        // PaneSide / Sidenav
        if (paneSide && sidenavImage && !paneSide.dataset.customized) {
          paneSide.style.backgroundImage = `url('${sidenavImage}')`;
          paneSide.style.backgroundSize = "cover";
          paneSide.style.backgroundPosition = "center";
          paneSide.dataset.customized = "true";
          console.log("Applied sidenav background");
        }

        // Main / Chatview
        if (main && chatviewImage && !main.dataset.customized) {
          main.style.backgroundImage = `url('${chatviewImage}')`;
          main.style.backgroundSize = "cover";
          main.style.backgroundPosition = "center";
          main.dataset.customized = "true";
          console.log("Applied chatview background");
        }

        // Welcome Page (nur wenn kein Profil sichtbar ist)
        if (
          parent &&
          welcomeImage &&
          !document.querySelector("[title='Profile details']") &&
          !parent.dataset.customized
        ) {
          const child = parent.children[4];
          if (child) {
            const svg = child.querySelector("svg");
            if (
              svg &&
              !(
                svg.parentElement.tagName === "SPAN" &&
                svg.parentElement.dataset.icon === "lock-outline"
              )
            ) {
              const img = document.createElement("img");
              img.src = welcomeImage;
              img.alt = "Welcome Image";
              img.style.maxWidth = "100%";
              img.style.maxHeight = "100%";
              svg.replaceWith(img);
            }

            const header = child.querySelector("h1");
            if (header) header.textContent = "Welcome To WhatsApp Web";

            const paragraph = child.querySelector(".x14mdic9");
            if (paragraph)
              paragraph.textContent =
                "Thanks for using WhatsApp Web Customizer!";

            const download = child.querySelector(".x1ci5j9l.x78zum5.xl56j7k");
            if (download) download.remove();

            parent.dataset.customized = "true";
            console.log("Applied welcome screen customizations");
          }
        }

        // Chat list items (grid)
        if (grid && !grid.dataset.customized) {
          Array.from(grid.children).forEach((child) => {
            const innerChild =
              child?.children?.[0]?.children?.[0]?.children?.[0];
            if (innerChild) {
              innerChild.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
              innerChild.style.border = "2px solid black";
              innerChild.style.borderRadius = "20px";

              // Texte auf Schwarz & Fett setzen
              function setTextBlackBold(element) {
                if (element.nodeType === Node.ELEMENT_NODE) {
                  element.style.setProperty("color", "black", "important");
                  element.style.fontWeight = "bold";
                  element.style.fontSize = "1.2rem";
                  Array.from(element.children).forEach(setTextBlackBold);
                }
              }

              setTextBlackBold(innerChild);
            }
          });

          grid.dataset.customized = "true";
          console.log("Applied grid custom styles");
        }
      });
    }

    // 3. Header transparent machen (nur einmal)
    const chatHeader = document.querySelector("div#main > header");
    if (chatHeader && !chatHeader.dataset.transparent) {
      chatHeader.style.setProperty("color", "white", "important");
      chatHeader.style.background = "none";
      chatHeader.dataset.transparent = "true";
      console.log("Made chat header transparent");
    }
  }

  // MutationObserver initialisieren
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        applyThemes();
        break;
      }
    }
  });

  // Starte Beobachtung auf Body-Level
  const body = document.body;
  if (body) {
    observer.observe(body, {
      childList: true,
      subtree: true,
    });

    console.log("Observer for customThemes started");
  }

  // Falls DOM schon da ist beim Laden
  applyThemes();
}

// Start
customThemes();
