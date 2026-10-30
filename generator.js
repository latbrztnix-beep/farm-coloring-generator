
"use strict";

window.FarmGenerator = (() => {
  const W = 612;
  const H = 792;

  function escapeXML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    })[c]);
  }

  // Repeatable pseudo-random numbers based on the seed.
  function randomFactory(seed) {
    let state = (Number(seed) >>> 0) || 1;

    return () => {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function choose(items, random) {
    return items[Math.floor(random() * items.length)];
  }

  function flower(x, y, scale = 1) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})"
         fill="white" stroke="#222" stroke-width="3"
         stroke-linecap="round" stroke-linejoin="round">
        <circle cx="0" cy="-12" r="9"/>
        <circle cx="12" cy="-2" r="9"/>
        <circle cx="7" cy="12" r="9"/>
        <circle cx="-7" cy="12" r="9"/>
        <circle cx="-12" cy="-2" r="9"/>
        <circle cx="0" cy="0" r="7"/>
        <path d="M0 19 V50 M0 38 Q-23 17 -25 37 Q-10 48 0 38
                 M0 43 Q23 24 25 42 Q12 51 0 43"
              fill="none"/>
      </g>`;
  }

  function butterfly(x, y) {
    return `
      <g transform="translate(${x} ${y})"
         stroke="#222" stroke-width="3" fill="white"
         stroke-linejoin="round" stroke-linecap="round">
        <path d="M0 0 C-40 -42 -56 10 -7 15
                 C-43 48 -10 61 0 20
                 C10 61 43 48 7 15
                 C56 10 40 -42 0 0 Z"/>
        <path d="M0 0 V23 M-3 0 L-13 -12 M3 0 L13 -12"
              fill="none"/>
        <circle cx="-23" cy="2" r="5"/>
        <circle cx="23" cy="2" r="5"/>
      </g>`;
  }

  function sun(x, y) {
    let rays = "";

    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const x1 = (Math.cos(a) * 29).toFixed(2);
      const y1 = (Math.sin(a) * 29).toFixed(2);
      const x2 = (Math.cos(a) * 43).toFixed(2);
      const y2 = (Math.sin(a) * 43).toFixed(2);

      rays += `<path d="M${x1} ${y1} L${x2} ${y2}"/>`;
    }

    return `
      <g transform="translate(${x} ${y})"
         fill="white" stroke="#222" stroke-width="3"
         stroke-linecap="round">
        <circle r="23"/>
        ${rays}
        <path d="M-10 1 v2 M10 1 v2 M-8 11 Q0 18 8 11"
              fill="none"/>
      </g>`;
  }

  function cloud(x, y, scale = 1) {
    return `
      <path transform="translate(${x} ${y}) scale(${scale})"
        d="M-45 15 Q-58 -2 -38 -14
           Q-31 -37 -9 -27
           Q11 -49 30 -27
           Q56 -30 57 -7
           Q73 15 45 19 H-30 Q-42 19 -45 15 Z"
        fill="white" stroke="#222" stroke-width="3"
        stroke-linejoin="round"/>`;
  }

  function grass(x, y) {
    return `<path d="M${x-18} ${y}
      q-8 -15 -15 -17
      M${x-18} ${y} q8 -25 18 -30
      M${x-18} ${y} q17 -17 32 -12"
      fill="none" stroke="#222" stroke-width="3"
      stroke-linecap="round"/>`;
  }

  function heart(x, y, scale = 1) {
    return `
      <path transform="translate(${x} ${y}) scale(${scale})"
        d="M0 25 C-42 -5 -18 -31 0 -11
           C18 -31 42 -5 0 25 Z"
        fill="white" stroke="#222" stroke-width="3"
        stroke-linejoin="round"/>`;
  }

  function bow(x, y) {
    return `
      <g transform="translate(${x} ${y})"
         fill="white" stroke="#222" stroke-width="3"
         stroke-linejoin="round">
        <path d="M0 0 Q-42 -32 -43 0 Q-43 31 0 7
                 Q43 31 43 0 Q42 -32 0 0 Z"/>
        <circle cx="0" cy="4" r="9"/>
      </g>`;
  }

  function hat(x, y) {
    return `
      <g transform="translate(${x} ${y})"
         fill="white" stroke="#222" stroke-width="3"
         stroke-linejoin="round">
        <path d="M-52 10 H52 Q62 20 40 23 H-40 Q-62 20 -52 10 Z"/>
        <path d="M-29 10 L-21 -43 H21 L29 10 Z"/>
        <path d="M-25 -5 H25" fill="none"/>
      </g>`;
  }

  function scarf(x, y) {
    return `
      <g transform="translate(${x} ${y})"
         fill="white" stroke="#222" stroke-width="3"
         stroke-linejoin="round">
        <path d="M-49 -8 Q0 12 49 -8 L42 13
                 Q0 35 -42 13 Z"/>
        <path d="M23 14 L37 69 L15 61 L5 21 Z"/>
        <path d="M17 54 L34 59" fill="none"/>
      </g>`;
  }

  function accessories(animal, style) {
    // Accessory placement is specific to the existing animal drawings.
    const positions = {
      cow:   { top: 205, neck: 455 },
      chick: { top: 203, neck: 410 },
      pig:   { top: 202, neck: 423 },
      lamb:  { top: 215, neck: 437 },
      foal:  { top: 178, neck: 383 }
    };

    const p = positions[animal];

    if (style === "bow") return bow(345, p.top);
    if (style === "hat") return hat(305, p.top);
    if (style === "scarf") return scarf(305, p.neck);

    return "";
  }

  function scenery(style, random) {
    let output = `
      <path d="M80 575 Q306 594 532 575"
        fill="none" stroke="#222" stroke-width="3"/>
    `;

    if (style === "garden") {
      output += flower(125, 520, .85);
      output += flower(490, 520, .7);
      output += grass(205, 570);
      output += grass(435, 570);
    }

    if (style === "sunny") {
      output += sun(485, 165);
      output += cloud(130, 180, .6);
      output += grass(120, 565);
      output += grass(470, 565);
    }

    if (style === "butterfly") {
      output += butterfly(470, 230);
      output += flower(135, 520, .8);
      output += grass(460, 565);
    }

    if (style === "hearts") {
      output += heart(135, 235, .9);
      output += heart(480, 195, .65);
      output += grass(125, 565);
      output += grass(480, 565);
    }

    if (style === "meadow") {
      output += cloud(130, 175, .55);
      output += cloud(470, 175, .5);
      output += grass(120, 560);
      output += grass(180, 565);
      output += grass(445, 565);
      output += grass(495, 560);
    }

    // Small extra decoration based on the seed.
    if (random() > .55) {
      output += flower(115 + Math.floor(random() * 35), 525, .45);
    }

    return output;
  }

  function create(options = {}) {
    const animalId = options.animal || "cow";
    const seed = Math.max(
      1,
      Math.min(9999, Math.floor(Number(options.seed) || 1))
    );

    const title = String(options.title || "My Happy Farm")
      .slice(0, 45);

    const animal = window.FarmAnimals.getAnimal(animalId);
    const random = randomFactory(seed);

    const sceneStyles = [
      "garden", "sunny", "butterfly", "hearts", "meadow"
    ];

    const accessoryStyles = [
      "none", "bow", "hat", "scarf"
    ];

    // Use the seed to create repeatable combinations.
    const scene = sceneStyles[(seed - 1) % sceneStyles.length];
    const accessory = accessoryStyles[
      Math.floor((seed - 1) / sceneStyles.length) %
      accessoryStyles.length
    ];

    const mirrored = Math.floor(
      (seed - 1) / (sceneStyles.length * accessoryStyles.length)
    ) % 2 === 1;

    const tilt = choose([-4, -2, 0, 2, 4], random);
    const size = choose([.96, .98, 1, 1.02], random);

    // Keep the animal inside a controlled drawing area.
    const flip = mirrored ? -1 : 1;

    const animalTransform =
      `translate(306 365) rotate(${tilt}) ` +
      `scale(${flip * size} ${size}) translate(-306 -365)`;

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="8.5in" height="11in"
     viewBox="0 0 ${W} ${H}"
     role="img"
     aria-label="${escapeXML(animal.name)} coloring page">

  <rect width="${W}" height="${H}" fill="#ffffff"/>

  <g fill="none" stroke="#222" stroke-width="2.5"
     stroke-linecap="round" stroke-linejoin="round">
    <rect x="24" y="24" width="564" height="744" rx="18"/>
    <path d="M100 105 Q306 117 512 105"/>
  </g>

  <g fill="#222" font-family="Arial,Helvetica,sans-serif"
     text-anchor="middle">
    <text x="306" y="76" font-size="25"
          font-weight="bold">${escapeXML(title)}</text>
  </g>

  <g>${scenery(scene, random)}</g>

  <g transform="translate(0 18)">
    <g transform="${animalTransform}"
       fill="#ffffff" stroke="#222"
       stroke-width="5" stroke-linecap="round"
       stroke-linejoin="round">
      ${animal.drawing}
    </g>

    <g>${accessories(animalId, accessory)}</g>
  </g>

  <g fill="#222" font-family="Arial,Helvetica,sans-serif"
     text-anchor="middle">
    <text x="306" y="635" font-size="19"
          font-weight="bold">${escapeXML(animal.name)}</text>
    <text x="306" y="662" font-size="14">
      Color your farm friend!
    </text>
    <text x="306" y="738" font-size="11">
      FARM COLORING STUDIO
    </text>
  </g>
</svg>`.trim();

    return {
      animal: animalId,
      animalName: animal.name,
      title,
      seed,
      scene,
      accessory,
      svg
    };
  }

  return { create, escapeXML };
})();
