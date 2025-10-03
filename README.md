# WhatsApp-SidenNav-Ergonomy

## Das Problem:
Man sieht beim schreiben immer nur alle Chats und wenn man natürlich sehr viel mehr Text schreibt dann stöhrt diese Seitennavigation erheblich. Das Braucht es so nicht und lässt die Webseite mit den Chats auch etwas mehr ergonomischer und flexibler anfühlen oder anbeträchtlichen was natürlich besser ist für die User Experience als auch für die Übersicht und die Nachrichten die man schreibt, insofern man sehr viele Texte verschickt und man es einfach alles in einem und nicht etwas zusammengequetschteren Eindruck erhält.

## Ideenstellung:
Bitte füge mir ein button element in das Element hinzu. Es soll ein Mit CSS gut gestaltetes BUrger menü sein und wenn man darauf klickt, dann soll es ein bestimmtes document querySelector von display auf none setzten und dann wieder zurück, je nach dem ob es schon auf block oder none ist:

Element für das HInzufügen des BurgerMenüs als erstes Element:
> document.querySelector(".x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1cy8zhl.x1277o0a")

Das soll ein oder ausgeblendet werden mittels display:
> document.querySelector("._aigw._as6h.x9f619.x1n2onr6.x5yr21d.x17dzmu4.x1i1dayz.x2ipvbc.x1w8yi2h.x78zum5.xdt5ytf.x12xzxwr.x1plvlek.xryxfnj.x14bqcqg.x18dvir5.xxljpkc.xwfak60.x18pi947").style.display="block";

## Skript:

```javascript
// Ziel-Container für das Burger-Menü
const container = document.querySelector(".x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1cy8zhl.x1277o0a");

// Ziel-Element, das ein-/ausgeblendet werden soll
const toggleTarget = document.querySelector("._aigw._as6h.x9f619.x1n2onr6.x5yr21d.x17dzmu4.x1i1dayz.x2ipvbc.x1w8yi2h.x78zum5.xdt5ytf.x12xzxwr.x1plvlek.xryxfnj.x14bqcqg.x18dvir5.xxljpkc.xwfak60.x18pi947");

// Sicherheits-Check
if (container && toggleTarget) {
  // Burger-Button erstellen
  const burgerButton = document.createElement("button");
  burgerButton.className = "custom-burger-menu";
  burgerButton.title = "Disable Side Nav";
  burgerButton.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  // CSS direkt einfügen
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

  // Klick-Funktion (toggle display)
  burgerButton.addEventListener("click", () => {
  const currentDisplay = window.getComputedStyle(toggleTarget).display;

  if (currentDisplay === "none") {
    toggleTarget.style.display = "block";
    burgerButton.title = "Disable Side Nav";
  } else {
    toggleTarget.style.display = "none";
    burgerButton.title = "Enable Side Nav";
  }
});

  // Als erstes Element einfügen
  container.insertBefore(burgerButton, container.firstChild);
} else {
  console.warn("Eines der Ziel-Elemente wurde nicht gefunden.");
}
```
Für die Hintergrundauswahl kann man dann auswählen, welches Bild man für die Welcome Page haben möchte, welches Bild für die seitennavigation und welches bild für den chat hauptbereich. Dabei sollte man die Möglichkeit haben von einer vielzahl an Bildern, GIF's Memes, alles schön kategorisiert und leicht auffindbar.


https://jsfiddle.net/3u8v5axs/