"use strict";

window.FarmGenerator = (() => {
  function escapeXML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    })[char]);
  }

  function create(options = {}) {
    const animalId = options.animal || "cow";
    const seed = Math.max(1, Math.min(9999, Number(options.seed) || 1));
    const title = String(options.title || "My Happy Farm").slice(0, 45);
    const animal = window.FarmAnimals.getAnimal(animalId);

    // Seed affects decorative details, so a variation changes more than the filename.
    const flowerX = 115 + (seed * 37 % 35);
    const flowerY = 555 + (seed * 13 % 18);
    const starX = 475 - (seed * 17 % 35);
    const starY = 175 + (seed * 11 % 18);

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="8.5in" height="11in" viewBox="0 0 612 792"
     role="img" aria-label="${escapeXML(animal.name)} coloring page">
  <rect width="612" height="792" fill="#ffffff"/>
  <g fill="none" stroke="#222222" stroke-width="3.5"
     stroke-linecap="round" stroke-linejoin="round">
    <rect x="24" y="24" width="564" height="744" rx="18"/>
    <path d="M110 110 Q306 124 502 110" stroke-width="2"/>
    <path d="M105 570 Q306 588 507 570" stroke-width="2"/>
    <circle cx="${flowerX}" cy="${flowerY}" r="9"/>
    <circle cx="${flowerX - 11}" cy="${flowerY - 8}" r="7"/>
    <circle cx="${flowerX + 11}" cy="${flowerY - 8}" r="7"/>
    <circle cx="${flowerX - 11}" cy="${flowerY + 8}" r="7"/>
    <circle cx="${flowerX + 11}" cy="${flowerY + 8}" r="7"/>
    <path d="M${flowerX} ${flowerY + 9} v25"/>
    <path d="M${flowerX} ${flowerY + 24} q-17 -12 -18 0 q12 10 18 0"/>
    <path d="M${starX} ${starY - 13} l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1 Z"/>
  </g>
  <g fill="#ffffff" stroke="#222222" stroke-width="5"
     stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(0 30)">
      ${animal.drawing}
    </g>
  </g>
  <g fill="#222222" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
    <text x="306" y="78" font-size="25" font-weight="700">${escapeXML(title)}</text>
    <text x="306" y="620" font-size="20" font-weight="700">${escapeXML(animal.name)}</text>
    <text x="306" y="650" font-size="14">Color your farm friend!</text>
    <text x="306" y="732" font-size="11">FARM COLORING STUDIO</text>
  </g>
</svg>`.trim();

    return {
      animal: animalId,
      animalName: animal.name,
      title,
      seed,
      svg
    };
  }

  return { create, escapeXML };
})();
