// === KEEP POPUP ALIVE HACK ===
let keepAliveInterval;

function keepPopupAlive() {
  if (keepAliveInterval) return; // schon aktiv
  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(() => {});
  }, 2000); // alle 2 Sekunden eine "Ping" an die Extension Runtime
}

function stopKeepingPopupAlive() {
  clearInterval(keepAliveInterval);
  keepAliveInterval = null;
}


const imageCache = new Map();
let imageData = null;
let currentType = null;
let selectedSrc = null;
let uploadedImages = []; // Array to store uploaded image metadata {filename, dataUrl}

// DOM Elements
const modal = document.getElementById("image-modal");
const modalGallery = document.getElementById("modal-gallery");
const modalTitle = document.getElementById("modal-title");
const uploadInput = document.getElementById("image-upload-input");

// 1. Preload & build gallery automatically
document.addEventListener("DOMContentLoaded", () => {
  keepPopupAlive(); // 👈 Popup am Leben halten
  const previewIds = ["welcome", "sidenav", "chatview", "navside"];

  // Load previews and uploaded images from storage
  chrome.storage.local.get([...previewIds, "uploadedImages"], (result) => {
    // Set preview images
    previewIds.forEach((id) => {
      const previewImg = document.getElementById(`${id}-preview`);
      previewImg.src = result[id]
        ? result[id].startsWith("data:")
          ? result[id]
          : chrome.runtime.getURL(result[id])
        : "default.jpg";
    });

    // Load uploaded images
    uploadedImages = result.uploadedImages || [];
    console.log("✅ Loaded uploaded images:", uploadedImages.length);

    // Preload image list + cache + render gallery
    fetch(chrome.runtime.getURL("images.json"))
      .then((res) => res.json())
      .then((data) => {
        imageData = data;
        // Add uploaded images to imageData under "uploaded" category
        if (uploadedImages.length > 0) {
          imageData.uploaded = {
            files: uploadedImages.map((img) => img.filename),
          };
        } else {
          imageData.uploaded = { files: [] };
        }

        const allImages = getAllImages(imageData);

        // Cache all predefined and uploaded images
        allImages.forEach((src) => preloadImage(src));
        uploadedImages.forEach((img) => preloadImage(img.dataUrl));
        console.log(`✅ Preloaded ${allImages.length + uploadedImages.length} images.`);

        // Build modal gallery
        renderGallery();
      })
      .catch((err) => console.error("❌ Failed to preload images:", err));
  });

  // Add event listener for upload button
  document.getElementById("modal-upload").addEventListener("click", () => {
    uploadInput.click();
  });

  // Handle file upload
  uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        // Generate a unique filename mimicking images folder structure
        const timestamp = Date.now();
        const extension = file.type.split("/")[1] || "jpg";
        const filename = `images/uploaded/uploaded_image_${timestamp}.${extension}`;

        // Check if image already exists
        if (!uploadedImages.some((img) => img.dataUrl === dataUrl)) {
          const imageMeta = { filename, dataUrl };
          uploadedImages.push(imageMeta);

          // Update imageData
          if (!imageData.uploaded) {
            imageData.uploaded = { files: [] };
          }
          imageData.uploaded.files.push(filename);

          // Save to storage
          chrome.storage.local.set({ uploadedImages }, () => {
            console.log("✅ Uploaded image saved:", filename);
            preloadImage(dataUrl);

            // Update preview and preselect
            if (currentType) {
              chrome.storage.local.set({ [currentType]: dataUrl }, () => {
                document.getElementById(`${currentType}-preview`).src = dataUrl;
              });
              selectedSrc = dataUrl;
            }

            renderGallery(); // Re-render gallery to include new image
            selectImageInGallery(dataUrl); // Auto-select the uploaded image
          });
        }
        // Reset file input
        uploadInput.value = "";
      };
      reader.onerror = () => {
        console.error("❌ Failed to read uploaded image");
        uploadInput.value = "";
      };
      reader.readAsDataURL(file);
    } else {
      console.warn("⚠️ Invalid file type. Please upload an image.");
      uploadInput.value = "";
    }
  });
});

// 2. Helpers
function getAllImages(data) {
  const set = new Set();
  for (const cat in data) {
    const files = data[cat].files;
    if (Array.isArray(files)) {
      files.forEach((src) => {
        // For uploaded images, use dataUrl; for others, use src
        const imgSrc = cat === "uploaded" ? uploadedImages.find((img) => img.filename === src)?.dataUrl || src : src;
        set.add(imgSrc);
      });
    }
  }
  return [...set];
}

function preloadImage(src) {
  if (!imageCache.has(src)) {
    const img = new Image();
    img.src = src.startsWith("data:") ? src : chrome.runtime.getURL(src);
    img.loading = "lazy";
    img.onerror = () => console.warn(`⚠️ Failed to preload: ${src}`);
    imageCache.set(src, img);
  }
}

function getCachedImage(src) {
  if (!imageCache.has(src)) preloadImage(src);
  return imageCache.get(src);
}

function selectImageInGallery(src) {
  modalGallery
    .querySelectorAll(".image-option")
    .forEach((el) => el.classList.remove("selected"));
  const option = modalGallery.querySelector(`.image-option[data-src="${src}"]`);
  if (option) {
    option.classList.add("selected");
    selectedSrc = src;
    modalGallery.scrollTo({
      top: option.offsetTop - modalGallery.offsetTop,
      behavior: "smooth",
    });
  }
}

// 3. Build the gallery
function renderGallery() {
  if (!imageData) return;
  modalGallery.innerHTML = ""; // Clear existing gallery
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

  // Highlight the current image if set
  chrome.storage.local.get([type], (result) => {
    if (result[type]) selectImageInGallery(result[type]);
  });
}

function closeModal() {
  modal.style.display = "none";
  currentType = null;
  selectedSrc = null;
}

// 5. Buttons
document.getElementById("modal-save").addEventListener("click", () => {
  if (currentType && selectedSrc) {
    chrome.storage.local.set({ [currentType]: selectedSrc }, () => {
      const previewImg = document.getElementById(`${currentType}-preview`);
      previewImg.src = selectedSrc.startsWith("data:")
        ? selectedSrc
        : chrome.runtime.getURL(selectedSrc);
    });
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

window.addEventListener("unload", () => {
  stopKeepingPopupAlive();
});
