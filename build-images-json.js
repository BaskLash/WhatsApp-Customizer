// build-images-json.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "images");

function scanDir(dir, base = "images") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let result = {};

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Unterordner -> rekursiv scannen
      result[entry.name] = scanDir(
        path.join(dir, entry.name),
        base + "/" + entry.name
      );
    } else if (entry.isFile()) {
      // Datei -> Pfad einfügen
      if (!result.files) result.files = [];
      result.files.push(base + "/" + entry.name);
    }
  }
  return result;
}

const json = scanDir(root);

fs.writeFileSync(
  path.join(__dirname, "images.json"),
  JSON.stringify(json, null, 2)
);

console.log("✅ images.json aktualisiert");
