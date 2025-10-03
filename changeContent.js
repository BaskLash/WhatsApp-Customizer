function customThemes() {
  console.log("Starting custom themes...");

  const interval = setInterval(() => {
    const paneSide = document.getElementById("pane-side");
    const main = document.getElementById("main");
    const parent = document.querySelector('div[tabindex="-1"][class^="two"]');
    const grid = document.querySelector('div[role="grid"]');
    const headerEl = document.querySelector("header[tabindex='0']");

    if (headerEl) {
      chrome.storage.local.get(["navside"], (result) => {
        // Falls lokale Datei in Extension, nutze chrome.runtime.getURL
        const getImageURL = (src) =>
          src && src.startsWith("images/") ? chrome.runtime.getURL(src) : src;

        // result.navside ist der gespeicherte Bildpfad/URL
        const navsideImage = getImageURL(result.navside);

        if (navsideImage) {
          headerEl.style.backgroundImage = `url('${navsideImage}')`;
          headerEl.style.backgroundSize = "cover";
          headerEl.style.backgroundPosition = "center";
        }
      });
    }

    if ((paneSide || grid) && (main || parent)) {
      // Lade gespeicherte Bilder
      chrome.storage.local.get(["welcome", "chatview", "sidenav"], (result) => {
        // Falls lokale Datei in Extension, nutze chrome.runtime.getURL
        const getImageURL = (src) =>
          src && src.startsWith("images/") ? chrome.runtime.getURL(src) : src;

        const welcomeImage = getImageURL(result.welcome);
        const chatviewImage = getImageURL(result.chatview);
        const sidenavImage = getImageURL(result.sidenav);

        // PaneSide / Sidenav
        if (paneSide && sidenavImage) {
          paneSide.style.backgroundImage = `url('${sidenavImage}')`;
          paneSide.style.backgroundSize = "cover";
          paneSide.style.backgroundPosition = "center";
        }

        // Main / Chatview
        if (main && chatviewImage) {
          main.style.backgroundImage = `url('${chatviewImage}')`;
          main.style.backgroundSize = "cover";
          main.style.backgroundPosition = "center";
        }

        // Welcome Page
        if (
          parent &&
          welcomeImage &&
          !document.querySelector("[title='Profile details']")
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
          }
        }

        // Chat list items
        if (grid) {
          Array.from(grid.children).forEach((child) => {
            const innerChild =
              child?.children?.[0]?.children?.[0]?.children?.[0];
            if (innerChild) {
              // Nur den Hintergrund leicht transparent machen
              innerChild.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
              innerChild.style.border = "2px solid black";
              innerChild.style.borderRadius = "20px";

              // Funktion, um rekursiv alle Textelemente auf schwarz + bold zu setzen
              function setTextBlackBold(element) {
                // Prüfen, ob es ein sichtbarer Text ist
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
        }
      });
    }
    console.log("Making header transparent");
    // Select the header
    const header = document.querySelector("div#main > header");

    if (header) {
      // Set the text color to white (important)
      header.style.setProperty("color", "white", "important");

      // Make the background transparent without affecting children
      header.style.background = "none";
    }

    // const topload = document.querySelector("div#side>div._ak9t");
    // if (topload) {
    //   topload.style.background = "red"; // fully transparent
    // }

    // const offload = document.querySelector(
    //   "div#side>div[tabindex='-1'][role='tablist']"
    // );
    // if (offload) {
    //   offload.style.background = "none"; // fully transparent
    // }
  }, 500);
}

customThemes();
