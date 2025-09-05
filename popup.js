const checkboxIds = ["status", "channels", "communities"];

function loadOptions() {
  chrome.storage.local.get(["visibilityOptions"], (data) => {
    const options = data.visibilityOptions || {
      status: true,
      channels: true,
      communities: true
    };

    checkboxIds.forEach(id => {
      document.getElementById(id).checked = options[id];
    });
  });
}

function saveAndApplyOptions() {
  const options = {};
  checkboxIds.forEach(id => {
    options[id] = document.getElementById(id).checked;
  });

  // Save to storage
  chrome.storage.local.set({ visibilityOptions: options }, () => {
    // Inject directly into content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: applyVisibilityFromPopup,
        args: [options]
      });
    });
  });
}

// Function to inject into content.js context
function applyVisibilityFromPopup(options) {
  const parent = document.querySelector(".x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1cy8zhl.x1277o0a");
  if (!parent) return;

  const divChildren = Array.from(parent.children).filter(child => child.tagName.toLowerCase() === "div");
  const map = { status: 1, channels: 2, communities: 3 };

  for (const key in map) {
    const index = map[key];
    if (divChildren[index]) {
      divChildren[index].style.display = options[key] ? "block" : "none";
    }
  }
}

// Hook up listeners
checkboxIds.forEach(id => {
  document.getElementById(id).addEventListener("change", saveAndApplyOptions);
});

loadOptions();
