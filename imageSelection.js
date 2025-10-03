let currentType = null;
let selectedSrc = null;

const modal = document.getElementById("image-modal");
const modalGallery = document.getElementById("modal-gallery");
const modalTitle = document.getElementById("modal-title");

// Hilfsfunktion: Alle Bilder aus allen Kategorien sammeln (einzigartige Pfade)
function getAllImages(data) {
  const imagesSet = new Set(); // Set für eindeutige Pfade
  for (const category in data) {
    if (data[category].files && Array.isArray(data[category].files)) {
      data[category].files.forEach((src) => imagesSet.add(src));
    }
  }
  return Array.from(imagesSet);
}

function openModal(type) {
  currentType = type;
  modalTitle.textContent = `Bildauswahl für ${type}`;
  modalGallery.innerHTML = "";
  selectedSrc = null;

  fetch(chrome.runtime.getURL("images.json"))
    .then((res) => res.json())
    .then((data) => {
      const images = getAllImages(data); // alle eindeutigen Bilder sammeln
      const fragment = document.createDocumentFragment(); // effizienter Container

      // IntersectionObserver für Lazy Loading
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src; // echtes Bild laden
              obs.unobserve(img);
            }
          });
        },
        { root: modalGallery, rootMargin: "50px", threshold: 0.1 }
      );

      images.forEach((src) => {
        const option = document.createElement("div");
        option.className = "image-option";
        option.dataset.src = src;

        const img = document.createElement("img");
        img.alt = "";
        img.dataset.src = chrome.runtime.getURL(src); // URL erstmal in dataset
        img.src = "placeholder.jpg"; // optionaler Platzhalter
        img.loading = "lazy"; // native lazy loading zusätzlich
        option.appendChild(img);

        // Observer registrieren
        observer.observe(img);

        option.addEventListener("click", () => {
          modalGallery
            .querySelectorAll(".image-option")
            .forEach((el) => el.classList.remove("selected"));
          option.classList.add("selected");
          selectedSrc = src;
        });

        fragment.appendChild(option);
      });

      modalGallery.appendChild(fragment); // alles auf einmal einfügen
    });

  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
  currentType = null;
  selectedSrc = null;
}

// Modal Buttons
document.getElementById("modal-save").addEventListener("click", () => {
  if (currentType && selectedSrc) {
    chrome.storage.local.set({ [currentType]: selectedSrc });
    document.getElementById(`${currentType}-preview`).src =
      chrome.runtime.getURL(selectedSrc);
  }
  closeModal();
});

document.getElementById("modal-none").addEventListener("click", () => {
  if (currentType) {
    chrome.storage.local.remove(currentType);
    document.getElementById(`${currentType}-preview`).src = "default.jpg";
  }
  closeModal();
});

document.getElementById("modal-cancel").addEventListener("click", closeModal);

// Klick auf image-option oder image-selector öffnet Modal
document.querySelectorAll(".image-selector, .image-option").forEach((el) => {
  el.addEventListener("click", (e) => {
    const type = e.target.closest(".image-option")?.dataset.type;
    if (type) openModal(type);
  });
});
