// Beim Laden des Popups gespeicherte Bilder setzen
document.addEventListener("DOMContentLoaded", () => {
  const previewIds = ["welcome", "sidenav", "chatview"];
  
  chrome.storage.local.get(previewIds, (result) => {
    previewIds.forEach((id) => {
      const previewImg = document.getElementById(`${id}-preview`);
      if (result[id]) {
        previewImg.src = chrome.runtime.getURL(result[id]);
      } else {
        previewImg.src = "default.jpg";
      }
    });
  });
});


let currentType = null;
let selectedSrc = null;
const imageCache = new Map(); // Cache für geladene Bilder

const modal = document.getElementById("image-modal");
const modalGallery = document.getElementById("modal-gallery");
const modalTitle = document.getElementById("modal-title");

// Alle eindeutigen Bilder aus allen Kategorien sammeln
function getAllImages(data) {
  const imagesSet = new Set();
  for (const category in data) {
    if (data[category].files && Array.isArray(data[category].files)) {
      data[category].files.forEach((src) => imagesSet.add(src));
    }
  }
  return Array.from(imagesSet);
}

// Bild aus Cache laden oder neu erstellen
function getCachedImage(src) {
  if (imageCache.has(src)) {
    return imageCache.get(src); // schon geladenes Image zurückgeben
  }

  const img = new Image();
  img.src = chrome.runtime.getURL(src);
  imageCache.set(src, img); // direkt ins Cache setzen
  return img;
}

function openModal(type) {
  currentType = type;
  modalTitle.textContent = `Image selection for ${type}`;
  modalGallery.innerHTML = "";
  selectedSrc = null;

  fetch(chrome.runtime.getURL("images.json"))
    .then((res) => res.json())
    .then((data) => {
      const images = getAllImages(data);
      const fragment = document.createDocumentFragment();

      for (const src of images) {
        const option = document.createElement("div");
        option.className = "image-option";
        option.dataset.src = src;

        // Bild direkt aus Cache oder neu
        const img = getCachedImage(src).cloneNode();
        img.alt = "";
        img.loading = "lazy"; // native lazy loading
        option.appendChild(img);

        option.addEventListener("click", () => {
          modalGallery
            .querySelectorAll(".image-option")
            .forEach((el) => el.classList.remove("selected"));
          option.classList.add("selected");
          selectedSrc = src;
        });

        fragment.appendChild(option);
      }

      modalGallery.appendChild(fragment);
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
