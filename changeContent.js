function customThemes() {
  console.log("Starting custom themes...");

  const interval = setInterval(() => {
    const paneSide = document.getElementById("pane-side");
    const main = document.getElementById("main");
    const parent = document.querySelector('div[tabindex="-1"][class^="two"]');
    const grid = document.querySelector('div[role="grid"]');

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
            child.style.opacity = "0.7";
            const innerChild =
              child?.children?.[0]?.children?.[0]?.children?.[0];
            if (innerChild) {
              innerChild.style.border = "2px solid black";
              innerChild.style.borderRadius = "20px";
              innerChild.style.color = "black";
            }
          });
        }
      });
    }
  }, 500);
}

customThemes();
