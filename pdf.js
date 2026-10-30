"use strict";

window.FarmPDF = (() => {
  const PAGE_W = 612;
  const PAGE_H = 792;
  const SCALE = 2;

  function bytes(text) {
    return new TextEncoder().encode(text);
  }

  function join(parts) {
    const length = parts.reduce((sum, part) => sum + part.length, 0);
    const output = new Uint8Array(length);
    let offset = 0;

    for (const part of parts) {
      output.set(part, offset);
      offset += part.length;
    }

    return output;
  }

  function streamObject(dictionary, data) {
    return join([
      bytes(`${dictionary}\nstream\n`),
      data,
      bytes("\nendstream")
    ]);
  }

  function imageFromSVG(svgText) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgText], {
        type: "image/svg+xml;charset=utf-8"
      });
      const url = URL.createObjectURL(blob);
      const image = new Image();

      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = PAGE_W * SCALE;
          canvas.height = PAGE_H * SCALE;

          const context = canvas.getContext("2d", {
            alpha: false
          });

          if (!context) throw new Error("Canvas is unavailable.");

          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(blobOut => {
            URL.revokeObjectURL(url);

            if (!blobOut) {
              reject(new Error("Could not encode page image."));
              return;
            }

            blobOut.arrayBuffer()
              .then(buffer => resolve({
                data: new Uint8Array(buffer),
                width: canvas.width,
                height: canvas.height
              }))
              .catch(reject);
          }, "image/jpeg", 0.95);
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Could not render an SVG page."));
      };

      image.src = url;
    });
  }

  async function build(pages) {
    if (!Array.isArray(pages) || pages.length === 0) {
      throw new Error("Add at least one page to the collection.");
    }

    const images = [];

    for (const page of pages) {
      const result = window.FarmValidator.validate(page);

      if (!result.valid) {
        throw new Error(
          `Invalid page "${page.title}": ${result.errors.join(" ")}`
        );
      }

      images.push(await imageFromSVG(page.svg));
    }

    const objects = [];
    const pageIds = [];
    const imageIds = [];

    // Object 1 is the catalog; object 2 is the page tree.
    objects[1] = bytes("<< /Type /Catalog /Pages 2 0 R >>");

    for (let i = 0; i < images.length; i++) {
      pageIds.push(3 + i * 3);
      imageIds.push(4 + i * 3);
    }

    const kids = pageIds.map(id => `${id} 0 R`).join(" ");

    objects[2] = bytes(
      `<< /Type /Pages /Count ${images.length} /Kids [${kids}] >>`
    );

    for (let i = 0; i < images.length; i++) {
      const pageId = pageIds[i];
      const imageId = imageIds[i];
      const contentId = pageId + 2;
      const image = images[i];

      objects[pageId] = bytes(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /XObject << /Im0 ${imageId} 0 R >> >> ` +
        `/Contents ${contentId} 0 R >>`
      );

      objects[imageId] = streamObject(
        `<< /Type /XObject /Subtype /Image /Width ${image.width} ` +
        `/Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 ` +
        `/Filter /DCTDecode /Length ${image.data.length} >>`,
        image.data
      );

      const content = bytes(
        `q\n${PAGE_W} 0 0 ${PAGE_H} 0 0 cm\n/Im0 Do\nQ`
      );

      objects[contentId] = streamObject(
        `<< /Length ${content.length} >>`,
        content
      );
    }

    const chunks = [bytes("%PDF-1.4\n%FarmStudio\n")];
    const offsets = [0];
    let currentOffset = chunks[0].length;

    for (let id = 1; id < objects.length; id++) {
      offsets[id] = currentOffset;

      const start = bytes(`${id} 0 obj\n`);
      const end = bytes("\nendobj\n");

      chunks.push(start, objects[id], end);
      currentOffset += start.length + objects[id].length + end.length;
    }

    const xrefOffset = currentOffset;
    const xref = [
      `xref\n0 ${objects.length}\n`,
      "0000000000 65535 f \n"
    ];

    for (let id = 1; id < objects.length; id++) {
      xref.push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
    }

    const trailer = bytes(
      xref.join("") +
      `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\n` +
      `startxref\n${xrefOffset}\n%%EOF`
    );

    chunks.push(trailer);

    return new Blob([join(chunks)], {
      type: "application/pdf"
    });
  }

  return { build };
})();
