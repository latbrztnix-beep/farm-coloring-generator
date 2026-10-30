# farm-coloring-generator
Cute Farm Animals Coloring Pages Generator
# Farm Coloring Generator

A browser-based prototype for creating original farm-animal SVG coloring
pages, running basic technical validation, collecting pages, and exporting
a multi-page US Letter PDF.

## Files

- `index.html` — user interface
- `style.css` — responsive layout and preview styling
- `animals.js` — original hand-coded vector drawings
- `generator.js` — creates SVG pages
- `validator.js` — basic SVG and page-size checks
- `pdf.js` — multi-page PDF export
- `app.js` — application controls and collection management

## Run locally

1. Put all seven files in the same folder.
2. Open `index.html` in a modern browser.
3. Choose an animal and click Generate page.
4. Click Validate page.
5. Click Add to collection to add the page.
6. Repeat for other animals.
7. Click Export collection PDF.

If your browser blocks local file behavior, use a local static server
or publish the repository with GitHub Pages.

## Publish with GitHub Pages

1. Upload all seven files to the repository root.
2. Commit the changes to the `main` branch.
3. Open Settings > Pages.
4. Set Source to Deploy from a branch.
5. Select `main` and `/(root)`.
6. Save and wait for the deployment workflow to complete.
7. Open the published URL shown on the Pages settings screen.

## Important limitations

This is an initial prototype, not a finished commercial product.

- The variation number changes decorative details; it does not guarantee
  a completely different animal pose or unique composition.
- Validation checks important structural properties but does not prove
  that every drawing is aesthetically correct or fully inside the page.
- PDF pages contain rasterized renderings of the SVG artwork, not editable
  vector paths. The standalone SVG downloads remain editable.
- Inspect every page at print size before selling.
- Check line quality, clipping, margins, age suitability, and commercial
  rights for every element included in future versions.
- No sales, demand, or income is guaranteed.
