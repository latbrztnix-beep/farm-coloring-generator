"use strict";

(() => {
  const $ = id => document.getElementById(id);

  const animal = $("animal");
  const title = $("title");
  const seed = $("seed");
  const preview = $("preview");
  const status = $("status");
  const collection = $("collection");
  const count = $("count");

  let currentPage = null;
  let pages = [];

  function setStatus(message) {
    status.textContent = message;
  }

  function createPage() {
    return window.FarmGenerator.create({
      animal: animal.value,
      title: title.value,
      seed: seed.value
    });
  }

  function renderPreview() {
    try {
      currentPage = createPage();
      preview.replaceChildren();

      const doc = new DOMParser().parseFromString(
        currentPage.svg,
        "image/svg+xml"
      );

      if (doc.querySelector("parsererror")) {
        throw new Error("Generated SVG is invalid.");
      }

      preview.appendChild(document.importNode(doc.documentElement, true));
      setStatus("Page generated. Run validation before exporting.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function validateCurrent() {
    if (!currentPage) renderPreview();

    const result = window.FarmValidator.validate(currentPage);

    if (!result.valid) {
      setStatus("Validation failed: " + result.errors.join(" "));
      return false;
    }

    const message = result.warnings.length
      ? "Passed basic checks. Warnings: " + result.warnings.join(" ")
      : "Passed basic technical checks.";

    setStatus(message);
    return true;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function safeFilename(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "coloring-page";
  }

  function renderCollection() {
    collection.replaceChildren();
    count.textContent = `${pages.length} page${pages.length === 1 ? "" : "s"}`;

    if (pages.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Your selected pages will appear here.";
      collection.appendChild(empty);
      return;
    }

    pages.forEach((page, index) => {
      const card = document.createElement("article");
      card.className = "collection-item";

      const doc = new DOMParser().parseFromString(
        page.svg,
        "image/svg+xml"
      );

      card.appendChild(document.importNode(doc.documentElement, true));

      const label = document.createElement("p");
      label.textContent = `${index + 1}. ${page.animalName} · variation ${page.seed}`;
      card.appendChild(label);

      const remove = document.createElement("button");
      remove.className = "secondary";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        pages.splice(index, 1);
        renderCollection();
        setStatus("Page removed from collection.");
      });

      card.appendChild(remove);
      collection.appendChild(card);
    });
  }

  $("generate").addEventListener("click", renderPreview);

  $("validate").addEventListener("click", validateCurrent);

  $("add").addEventListener("click", () => {
    if (!currentPage) renderPreview();
    if (!validateCurrent()) return;

    pages.push({ ...currentPage });
    renderCollection();
    setStatus("Page added to collection.");
  });

  $("download").addEventListener("click", () => {
    if (!currentPage) renderPreview();
    if (!validateCurrent()) return;

    downloadBlob(
      new Blob([currentPage.svg], {
        type: "image/svg+xml;charset=utf-8"
      }),
      `${safeFilename(currentPage.animalName)}-${currentPage.seed}.svg`
    );

    setStatus("SVG download requested.");
  });

  $("export").addEventListener("click", async () => {
    if (pages.length === 0) {
      setStatus("Add at least one page before exporting a PDF.");
      return;
    }

    const button = $("export");
    button.disabled = true;
    button.textContent = "Building PDF...";

    try {
      const pdf = await window.FarmPDF.build(pages);
      downloadBlob(pdf, "farm-coloring-collection.pdf");
      setStatus(`PDF created with ${pages.length} page(s).`);
    } catch (error) {
      setStatus("PDF export failed: " + error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Export collection PDF";
    }
  });

  $("clear").addEventListener("click", () => {
    pages = [];
    renderCollection();
    setStatus("Collection cleared.");
  });

  animal.addEventListener("change", renderPreview);
  title.addEventListener("input", renderPreview);
  seed.addEventListener("change", renderPreview);

  renderPreview();
  renderCollection();
})();
