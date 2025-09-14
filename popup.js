// popup.js (minor adjustments for consistency and to ensure immediate apply)
const checkboxIds = [
  "status",
  "channels",
  "communities",
  "lockedChats",
  "archived",
];

function loadOptions() {
  chrome.storage.local.get(["visibilityOptions"], (data) => {
    const options = data.visibilityOptions || {
      status: false, // Changed default to false (hidden) as per your description
      channels: false,
      communities: false,
      lockedChats: false,
      archived: false,
    };

    checkboxIds.forEach((id) => {
      document.getElementById(id).checked = options[id];
    });
  });
}

function saveAndApplyOptions() {
  const options = {};
  checkboxIds.forEach((id) => {
    options[id] = document.getElementById(id).checked;
  });

  // Save to storage
  chrome.storage.local.set({ visibilityOptions: options }, () => {
    // Send message to content script to apply changes
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "applyVisibility",
        options: options,
      });
    });
  });
}

// Hook up listeners
checkboxIds.forEach((id) => {
  document.getElementById(id).addEventListener("change", saveAndApplyOptions);
});

loadOptions();
