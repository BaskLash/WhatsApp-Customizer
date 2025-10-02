function customThemes() {
  console.log("Starting custom themes...");

  // Array of images/GIFs for backgrounds
  const images = [
    chrome.runtime.getURL("images/anime.jpg"),
    chrome.runtime.getURL("images/full-shot-ninja-winter-season.jpg"),
    chrome.runtime.getURL("images/full-shot-ninja-wearing-equipment.jpg"),
    chrome.runtime.getURL("images/pexels-george-desipris-792381.jpg"),
    "https://i.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif",
    "https://media.tenor.com/2roX3uxz_68AAAAC/cat-space.gif",
    "https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif",
    "https://i.ytimg.com/vi/6f0y1Iaorug/maxresdefault.jpg",
    "https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    "https://i.ytimg.com/vi/ibNrPjETR_k/maxresdefault.jpg",
    "https://i.ytimg.com/vi/O5290Sf8zhA/maxresdefault.jpg",
    "https://i.ytimg.com/vi/pXU_GY7hjPc/maxresdefault.jpg",
    "https://i.ytimg.com/vi/204kByp6laY/maxresdefault.jpg",
    "https://i.ytimg.com/vi/AuSm1jj-nuE/maxresdefault.jpg",
    "https://i.ytimg.com/vi/PhrcpFzL-rA/maxresdefault.jpg",
    "https://i.ytimg.com/vi/PLK9AtEDVag/maxresdefault.jpg",
    "https://i.ytimg.com/vi/w92sd_vmzHw/maxresdefault.jpg",
  ];

  // Function to pick a random image from the array
  function getRandomImage() {
    return images[Math.floor(Math.random() * images.length)];
  }

  // Repeatedly try to apply themes until elements exist
  const interval = setInterval(() => {
    const paneSide = document.getElementById("pane-side");
    const grid = document.querySelector('div[role="grid"]');
    const main = document.getElementById("main");
    const parent = document.querySelector('div[tabindex="-1"][class^="two"]');

    // Stop repeating once at least one key element exists
    if ((paneSide || grid) && (main || parent)) {
      // Apply or re-apply background if missing
      if (paneSide && !paneSide.style.backgroundImage) {
        paneSide.style.backgroundImage = `url('${getRandomImage()}')`;
        paneSide.style.backgroundSize = "cover";
        paneSide.style.backgroundPosition = "center";
      }

      if (main && !main.style.backgroundImage) {
        main.style.backgroundImage = `url('${getRandomImage()}')`;
        main.style.backgroundSize = "cover";
        main.style.backgroundPosition = "center";
      }

      // Set opacity for chat list items
      if (grid) {
        Array.from(grid.children).forEach((child) => {
          child.style.opacity = "0.7";
          child = child.children[0].children[0].children[0];
          child.style.border = "2px solid black";
          child.style.borderRadius = "20px";
          child.style.color = "!important black";
        });
      }

      // Customize WhatsApp Web starting page
      if (parent && !document.querySelector("[title='Profile details']")) {
        const child = parent.children[4];
        if (child) {
          // Replace SVG with GIF only if it's not inside a span[data-icon="lock-outline"]
          const svg = child.querySelector("svg");
          if (
            svg &&
            !(
              svg.parentElement.tagName === "SPAN" &&
              svg.parentElement.dataset.icon === "lock-outline"
            )
          ) {
            const img = document.createElement("img");
            img.src =
              "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnhnMnBpbWI4OHYybHBsYXI5czI5NDdqcWxmcTBqMXpiNjg2NnMzbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mCbUi0FyYhHHhutEV8/giphy.gif";
            img.alt = "Random Giphy GIF";
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            svg.replaceWith(img);
          }

          // Update text content
          const header = child.querySelector("h1");
          if (header) header.textContent = "Welcome To WhatsApp Web";

          const paragraph = child.querySelector(".x14mdic9");
          if (paragraph)
            paragraph.textContent = "Thanks for using WhatsApp Web Customizer!";

          const download = child.querySelector(".x1ci5j9l.x78zum5.xl56j7k");
          if (download) download.remove();
        }
      }
    }
  }, 500); // check every 500ms
}

// Start the themes
customThemes();
