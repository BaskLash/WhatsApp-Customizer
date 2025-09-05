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

function saveOptions() {
  const options = {};
  checkboxIds.forEach(id => {
    options[id] = document.getElementById(id).checked;
  });

  chrome.storage.local.set({ visibilityOptions: options }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          // re-run apply logic inside content.js
          chrome.runtime.sendMessage({ action: "applyVisibility" });
        }
      });
    });
  });
}

checkboxIds.forEach(id => {
  document.getElementById(id).addEventListener("change", saveOptions);
});

loadOptions();
