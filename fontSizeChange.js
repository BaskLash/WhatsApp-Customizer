document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("font-scale-slider");
  const percentInput = document.getElementById("scale-percent-input");
  const resetBtn = document.getElementById("reset-scale");

  const DEFAULT_SCALE = 1;
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 1.5;

  // --- Helpers ---
  const scaleToPercent = (scale) => Math.round(scale * 100);
  const percentToScale = (percent) => percent / 100;

  const applyUI = (scale) => {
    slider.value = scale;
    percentInput.value = scaleToPercent(scale);
  };

  const saveScale = (scale) => {
    chrome.storage.local.set({ "wa-custom-scale": scale });
  };

  // 1. Load saved value
  chrome.storage.local.get(["wa-custom-scale"], (result) => {
    const savedScale = Number(result["wa-custom-scale"] ?? DEFAULT_SCALE);
    applyUI(savedScale);
  });

  // 2. Slider → Input + Storage
  slider.addEventListener("input", (e) => {
    const scale = Number(e.target.value);
    percentInput.value = scaleToPercent(scale);
    saveScale(scale);
  });

  // 3. Percent Input → Slider + Storage
  percentInput.addEventListener("input", (e) => {
    let percent = Number(e.target.value);

    if (isNaN(percent)) return;

    percent = Math.min(150, Math.max(50, percent));
    const scale = percentToScale(percent);

    slider.value = scale;
    saveScale(scale);
  });

  // 4. Reset Button
  resetBtn.addEventListener("click", () => {
    applyUI(DEFAULT_SCALE);
    saveScale(DEFAULT_SCALE);
  });
});
