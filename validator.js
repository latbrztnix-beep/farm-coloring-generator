"use strict";

window.FarmValidator = (() => {
  function validate(page) {
    const errors = [];
    const warnings = [];

    if (!page || typeof page.svg !== "string") {
      return { valid: false, errors: ["Missing SVG content."], warnings };
    }

    let doc;

    try {
      doc = new DOMParser().parseFromString(page.svg, "image/svg+xml");
    } catch {
      return { valid: false, errors: ["Could not parse SVG."], warnings };
    }

    if (doc.querySelector("parsererror")) {
      errors.push("SVG contains invalid XML.");
    }

    const svg = doc.documentElement;

    if (!svg || svg.localName !== "svg") {
      errors.push("Root SVG element is missing.");
      return { valid: false, errors, warnings };
    }

    if (svg.getAttribute("width") !== "8.5in") {
      errors.push("Width must be 8.5in.");
    }

    if (svg.getAttribute("height") !== "11in") {
      errors.push("Height must be 11in.");
    }

    if (svg.getAttribute("viewBox") !== "0 0 612 792") {
      errors.push("ViewBox must be 0 0 612 792.");
    }

    if (svg.querySelector("image, script, foreignObject")) {
      errors.push("External images, scripts or foreign objects are not allowed.");
    }

    const textNodes = [...svg.querySelectorAll("text")];

    if (textNodes.length === 0) {
      warnings.push("Page has no text labels.");
    }

    if (!svg.querySelector("path, circle, ellipse, rect, line, polygon, polyline")) {
      errors.push("No vector drawing elements found.");
    }

    if (svg.querySelector('[stroke-width="0"], [stroke-width="-1"]')) {
      warnings.push("A drawing element may have an invalid stroke width.");
    }

    const fill = svg.querySelector("rect");

    if (!fill || fill.getAttribute("fill") !== "#ffffff") {
      warnings.push("White page background could not be confirmed.");
    }

    // Validate SVG geometry in the browser when getBBox is supported.
    // The page frame itself is intentionally ignored.
    const host = document.createElement("div");
    host.style.cssText =
      "position:fixed;left:-10000px;top:0;width:612px;height:792px;visibility:hidden";
    document.body.appendChild(host);

    try {
      const clone = document.importNode(svg, true);
      clone.style.width = "612px";
      clone.style.height = "792px";
      host.appendChild(clone);

      const shapes = [...clone.querySelectorAll("path,circle,ellipse,line,polygon,polyline,rect")];

      for (const shape of shapes) {
        if (shape.tagName.toLowerCase() === "rect" &&
            shape.getAttribute("x") === "24" &&
            shape.getAttribute("y") === "24") {
          continue;
        }

        if (typeof shape.getBBox !== "function") continue;

        try {
          const b = shape.getBBox();

          if (![b.x, b.y, b.width, b.height].every(Number.isFinite)) {
            errors.push("A vector element has invalid geometry.");
            break;
          }

          if (b.x < -1 || b.y < -1 ||
              b.x + b.width > 613 || b.y + b.height > 793) {
            warnings.push("Some drawing geometry may extend outside the page.");
            break;
          }
        } catch {
          warnings.push("Browser could not inspect every vector element.");
          break;
        }
      }
    } finally {
      host.remove();
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  return { validate };
})();
