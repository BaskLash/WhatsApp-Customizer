const imageCache = new Map();
let imageData = null;
let currentType = null;
let selectedSrc = null;

// DOM Elements
const modal = document.getElementById("image-modal");
const modalGallery = document.getElementById("modal-gallery");
const modalTitle = document.getElementById("modal-title");

// 1. Preload & build gallery automatically
document.addEventListener("DOMContentLoaded", () => {
  const previewIds = ["welcome", "sidenav", "chatview", "navside"];

  // Load previews from storage
  chrome.storage.local.get(previewIds, (result) => {
    previewIds.forEach((id) => {
      const previewImg = document.getElementById(`${id}-preview`);
      previewImg.src = result[id]
        ? chrome.runtime.getURL(result[id])
        : "default.jpg";
    });
  });

  // Preload image list + cache + render gallery immediately
  fetch(chrome.runtime.getURL("images.json"))
    .then((res) => res.json())
    .then((data) => {
      imageData = data;
      const allImages = getAllImages(data);

      // Cache all
      allImages.forEach((src) => preloadImage(src));
      console.log(`✅ Preloaded ${allImages.length} images.`);

      // Build modal gallery once
      renderGallery();
    })
    .catch((err) => console.error("❌ Failed to preload images:", err));
});

// 2. Helpers
function getAllImages(data) {
  const set = new Set();
  for (const cat in data) {
    const files = data[cat].files;
    if (Array.isArray(files)) files.forEach((src) => set.add(src));
  }
  return [...set];
}

function preloadImage(src) {
  if (!imageCache.has(src)) {
    const img = new Image();
    img.src = chrome.runtime.getURL(src);
    img.loading = "lazy";
    img.onerror = () => console.warn(`⚠️ Failed to preload: ${src}`);
    imageCache.set(src, img);
  }
}

function getCachedImage(src) {
  if (!imageCache.has(src)) preloadImage(src);
  return imageCache.get(src);
}

// 3. Build the gallery once (progressively)
function renderGallery() {
  if (!imageData) return;
  const images = getAllImages(imageData);
  const BATCH_SIZE = 20;
  let index = 0;

  function renderBatch() {
    const fragment = document.createDocumentFragment();
    const end = Math.min(index + BATCH_SIZE, images.length);

    for (let i = index; i < end; i++) {
      const src = images[i];
      const option = document.createElement("div");
      option.className = "image-option";
      option.dataset.src = src;

      const img = getCachedImage(src).cloneNode();
      img.alt = "";
      img.loading = "lazy";
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
    index = end;

    if (index < images.length) {
      requestIdleCallback(renderBatch, { timeout: 100 });
    }
  }

  renderBatch();
}

// 4. Modal logic
function openModal(type) {
  currentType = type;
  modalTitle.textContent = `Image selection for ${type}`;
  
  modal.style.display = "flex";

  // Reset scroll position to top
  modalGallery.scrollTo({ top: 0, behavior: "smooth" });
}

function closeModal() {
  modal.style.display = "none";
  currentType = null;
  selectedSrc = null;
}

// 5. Buttons
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

// 6. Trigger modal
document.addEventListener("click", (e) => {
  const option = e.target.closest(".image-option[data-type]");
  if (option) openModal(option.dataset.type);
});
