/**
 * Convert a TTF/OTF font file to three.js typeface.json format.
 *
 * Usage:
 *   node scripts/ttf-to-typeface.cjs <input.ttf> <output.typeface.json> [charset]
 *
 * The typeface.json format uses commands in the order:
 *   m endX endY
 *   l endX endY
 *   q endX endY  cpX cpY               (note: end first, control second)
 *   b endX endY  cp1X cp1Y  cp2X cp2Y
 *   z
 *
 * Font Y axis is flipped (TTF Y-down → three.js Y-up).
 */
const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?;:'\"-—()[]/&@#";

function convert(inputPath, outputPath, charset = DEFAULT_CHARSET) {
  const buf = fs.readFileSync(inputPath);
  // opentype.parse takes an ArrayBuffer
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const font = opentype.parse(ab);
  const unitsPerEm = font.unitsPerEm;

  const r = (n) => Math.round(n);

  const result = {
    glyphs: {},
    familyName: (font.names && font.names.fontFamily && font.names.fontFamily.en) || "Custom",
    ascender: r(font.ascender),
    descender: r(font.descender),
    underlinePosition: r(font.tables.post.underlinePosition),
    underlineThickness: r(font.tables.post.underlineThickness),
    boundingBox: {
      yMin: r(font.tables.head.yMin),
      xMin: r(font.tables.head.xMin),
      yMax: r(font.tables.head.yMax),
      xMax: r(font.tables.head.xMax),
    },
    resolution: unitsPerEm,
    original_font_information: font.tables.name,
    cssFontWeight: "normal",
    cssFontStyle: "normal",
  };

  let written = 0;
  for (const char of charset) {
    const glyph = font.charToGlyph(char);
    if (!glyph || glyph.index === 0) continue; // missing glyph (.notdef)

    let o = "";
    const p = glyph.getPath(0, 0, unitsPerEm);

    for (const cmd of p.commands) {
      if (cmd.type === "M") {
        o += `m ${r(cmd.x)} ${r(-cmd.y)} `;
      } else if (cmd.type === "L") {
        o += `l ${r(cmd.x)} ${r(-cmd.y)} `;
      } else if (cmd.type === "Q") {
        // typeface order: end_x end_y cp_x cp_y
        o += `q ${r(cmd.x)} ${r(-cmd.y)} ${r(cmd.x1)} ${r(-cmd.y1)} `;
      } else if (cmd.type === "C") {
        // typeface order: end_x end_y cp1_x cp1_y cp2_x cp2_y
        o += `b ${r(cmd.x)} ${r(-cmd.y)} ${r(cmd.x1)} ${r(-cmd.y1)} ${r(cmd.x2)} ${r(-cmd.y2)} `;
      } else if (cmd.type === "Z") {
        o += `z `;
      }
    }

    result.glyphs[char] = {
      ha: r(glyph.advanceWidth),
      x_min: r(glyph.xMin != null ? glyph.xMin : 0),
      x_max: r(glyph.xMax != null ? glyph.xMax : glyph.advanceWidth),
      o: o.trim(),
    };
    written++;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result));
  console.log(`✓ Wrote ${written} glyphs → ${outputPath}`);
  console.log(`  Family: ${result.familyName}  Units: ${unitsPerEm}`);
}

const [, , input, output, charset] = process.argv;
if (!input || !output) {
  console.error("Usage: node scripts/ttf-to-typeface.cjs <input.ttf> <output.json> [charset]");
  process.exit(1);
}
convert(input, output, charset);
