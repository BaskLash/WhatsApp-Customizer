function initBurgerMenu() {
  const container = document.querySelector(
    ".x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1cy8zhl.x1277o0a"
  );
  const toggleTarget = document.querySelector(
    "._aigw._as6h.x9f619.x1n2onr6.x5yr21d.x17dzmu4.x1i1dayz.x2ipvbc.x1w8yi2h.x78zum5.xdt5ytf.x12xzxwr.x1plvlek.xryxfnj.x14bqcqg.x18dvir5.xxljpkc.xwfak60.x18pi947"
  );

  if (container && toggleTarget) {
    if (document.querySelector(".custom-burger-menu")) return;

    const burgerButton = document.createElement("button");
    burgerButton.className = "custom-burger-menu";
    burgerButton.title = "Disable Side Nav";
    burgerButton.innerHTML = `<span></span><span></span><span></span>`;

    const style = document.createElement("style");
    style.textContent = `
      .custom-burger-menu {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 36px;
        background: #444;
        border: none;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        z-index: 9999;
        transition: transform 0.2s ease, background-color 0.3s ease;
      }
      .custom-burger-menu span {
        display: block;
        width: 24px;
        height: 3px;
        background: #fff;
        border-radius: 2px;
        margin: 3px 0;
        transition: background-color 0.3s ease, transform 0.3s ease;
      }
      .custom-burger-menu:hover {
        background-color: #666;
        transform: scale(1.05);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }
      .custom-burger-menu:hover span {
        background-color: #fff;
        transform: scaleX(1.1);
      }
    `;
    document.head.appendChild(style);

    burgerButton.addEventListener("click", () => {
      const currentDisplay = window.getComputedStyle(toggleTarget).display;
      toggleTarget.style.display = currentDisplay === "none" ? "block" : "none";
      burgerButton.title =
        currentDisplay === "none" ? "Disable Side Nav" : "Enable Side Nav";
    });

    container.insertBefore(burgerButton, container.firstChild);
  } else {
    console.warn("Target elements not found.");
  }
}

function applyVisibilityOptions() {
  chrome.storage.local.get(["visibilityOptions"], (data) => {
    const options = data.visibilityOptions || {
      status: true,
      channels: true,
      communities: true,
      lockedChats: true,
      archived: true,
    };

    const parent = document.querySelector(
      ".x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1cy8zhl.x1277o0a"
    );
    if (parent) {
      const divChildren = Array.from(parent.children).filter(
        (child) => child.tagName.toLowerCase() === "div"
      );
      const map = { status: 1, channels: 2, communities: 3 };

      for (const key in map) {
        const index = map[key];
        if (divChildren[index]) {
          divChildren[index].style.display = options[key] ? "block" : "none";
        }
      }
    }

    // Handle Locked Chats and Archived
    const paneSide = document.getElementById("pane-side");
    if (paneSide) {
      const lockedChats = paneSide.querySelector(
        "button[aria-label='Locked chats']"
      );
      const archived = paneSide.querySelector("button[aria-label='Archived ']");

      if (lockedChats) {
        lockedChats.style.display = options.lockedChats ? "block" : "none";
      }

      if (archived) {
        archived.style.display = options.archived ? "block" : "none";
      }
    }
  });
}

function runAll() {
  initBurgerMenu();
  applyVisibilityOptions();
}

document.addEventListener("DOMContentLoaded", runAll);
window.addEventListener("load", runAll);
setTimeout(runAll, 3000); // Fallback after slow load

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyVisibility") {
    applyVisibilityOptions();
  }
});
