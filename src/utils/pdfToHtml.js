import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

const LIST_MARKER_PATTERN = /^(\s*)([-*\u2022]|[0-9]+[.)]|[A-Za-z][.)])\s+/;

const escapeHTML = (value) =>
      value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

const median = (values, fallback = 12) => {
      const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
      if (!sorted.length) return fallback;

      const middle = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

const getFontSize = (item) => {
      const transform = item.transform || [];
      const verticalScale = Math.hypot(transform[2] || 0, transform[3] || 0);
      const horizontalScale = Math.hypot(transform[0] || 0, transform[1] || 0);

      return verticalScale || horizontalScale || item.height || 12;
};

const getTextItems = (items) =>
      items
            .filter((item) => typeof item.str === "string" && item.str.trim())
            .map((item) => ({
                  text: item.str.replace(/\s+/g, " "),
                  x: item.transform?.[4] || 0,
                  y: item.transform?.[5] || 0,
                  width: item.width || 0,
                  fontSize: getFontSize(item),
                  fontName: item.fontName || "",
            }))
            .sort((a, b) => b.y - a.y || a.x - b.x);

const itemIsBold = (item) => /bold|black|heavy|semibold|demi/i.test(item.fontName);

const itemIsItalic = (item) => /italic|oblique/i.test(item.fontName);

const mergeLineItems = (items) => {
      const ordered = [...items].sort((a, b) => a.x - b.x);
      const averageFontSize = median(
            ordered.map((item) => item.fontSize),
            12,
      );

      let text = "";
      let previousItem = null;

      for (const item of ordered) {
            const segment = item.text.trim();
            if (!segment) continue;

            const gap = previousItem ? item.x - (previousItem.x + previousItem.width) : 0;
            const needsSpace = text && gap > averageFontSize * 0.18 && !/^[,.;:!?)]/.test(segment) && !/[\s([{]$/.test(text);

            text += `${needsSpace ? " " : ""}${segment}`;
            previousItem = item;
      }

      return text.replace(/\s+/g, " ").trim();
};

const groupItemsIntoLines = (items) => {
      const lines = [];

      for (const item of items) {
            const tolerance = Math.max(2, item.fontSize * 0.45);
            const line = lines.find((candidate) => Math.abs(candidate.y - item.y) <= tolerance);

            if (line) {
                  line.items.push(item);
                  line.y = (line.y + item.y) / 2;
                  continue;
            }

            lines.push({ y: item.y, items: [item] });
      }

      return lines
            .map((line) => {
                  const fontSizes = line.items.map((item) => item.fontSize);
                  const text = mergeLineItems(line.items);

                  return {
                        text,
                        x: Math.min(...line.items.map((item) => item.x)),
                        y: line.y,
                        fontSize: median(fontSizes),
                        bold: line.items.some(itemIsBold),
                        italic: line.items.some(itemIsItalic),
                  };
            })
            .filter((line) => line.text)
            .sort((a, b) => b.y - a.y || a.x - b.x);
};

const isHeading = (line, bodyFontSize) => {
      if (LIST_MARKER_PATTERN.test(line.text)) return false;
      if (line.text.length > 140) return false;

      const isLarge = line.fontSize >= bodyFontSize * 1.22;
      const isShortBoldLine = line.bold && line.fontSize >= bodyFontSize * 1.08 && line.text.length <= 90;

      return isLarge || isShortBoldLine;
};

const headingLevel = (line, bodyFontSize) => {
      if (line.fontSize >= bodyFontSize * 1.75) return "h1";
      if (line.fontSize >= bodyFontSize * 1.38) return "h2";
      return "h3";
};

const lineGap = (previousLine, line) => previousLine.y - line.y;

const shouldBreakParagraph = (previousLine, line) => {
      if (!previousLine) return false;

      const fontSize = Math.max(previousLine.fontSize, line.fontSize, 12);
      const indentChanged = Math.abs(previousLine.x - line.x) > fontSize * 2.2;

      return lineGap(previousLine, line) > fontSize * 1.65 || indentChanged;
};

const formatText = (text, line = {}) => {
      let html = escapeHTML(text);

      if (line.italic) html = `<em>${html}</em>`;
      if (line.bold) html = `<strong>${html}</strong>`;

      return html;
};

const joinParagraphLines = (lines) =>
      lines.reduce((html, line) => {
            const lineHTML = formatText(line.text, line);
            if (!html) return lineHTML;
            if (html.endsWith("-")) return `${html.slice(0, -1)}${lineHTML}`;
            return `${html} ${lineHTML}`;
      }, "");

const flushParagraph = (paragraphLines, htmlParts) => {
      if (!paragraphLines.length) return;

      htmlParts.push(`<p>${joinParagraphLines(paragraphLines)}</p>`);
      paragraphLines.length = 0;
};

const flushList = (listItems, listType, htmlParts) => {
      if (!listItems.length || !listType) return;

      htmlParts.push(`<${listType}>${listItems.map((item) => `<li>${formatText(item.text, item)}</li>`).join("")}</${listType}>`);
      listItems.length = 0;
};

const linesToHtml = (lines, bodyFontSize) => {
      const htmlParts = [];
      const paragraphLines = [];
      const listItems = [];
      let currentListType = null;

      for (const line of lines) {
            const listMatch = line.text.match(LIST_MARKER_PATTERN);

            if (isHeading(line, bodyFontSize)) {
                  flushParagraph(paragraphLines, htmlParts);
                  flushList(listItems, currentListType, htmlParts);
                  currentListType = null;

                  const tagName = headingLevel(line, bodyFontSize);
                  htmlParts.push(`<${tagName}>${escapeHTML(line.text)}</${tagName}>`);
                  continue;
            }

            if (listMatch) {
                  flushParagraph(paragraphLines, htmlParts);

                  const marker = listMatch[2];
                  const listType = /^[0-9A-Za-z]/.test(marker) ? "ol" : "ul";

                  if (currentListType && currentListType !== listType) {
                        flushList(listItems, currentListType, htmlParts);
                  }

                  currentListType = listType;
                  listItems.push({ ...line, text: line.text.replace(LIST_MARKER_PATTERN, "") });
                  continue;
            }

            flushList(listItems, currentListType, htmlParts);
            currentListType = null;

            const previousLine = paragraphLines.at(-1);
            if (shouldBreakParagraph(previousLine, line)) {
                  flushParagraph(paragraphLines, htmlParts);
            }

            paragraphLines.push(line);
      }

      flushParagraph(paragraphLines, htmlParts);
      flushList(listItems, currentListType, htmlParts);

      return htmlParts.join("");
};

export const pdfFileToHtml = async (file, onProgress) => {
      if (!file) {
            throw new Error("Select a PDF file first.");
      }

      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
            throw new Error("Only PDF files can be imported.");
      }

      let pdfDocument;
      const loadingTask = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });

      try {
            pdfDocument = await loadingTask.promise;
            const pages = [];
            const lineFontSizes = [];

            for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
                  onProgress?.({ pageNumber, pageCount: pdfDocument.numPages });

                  const page = await pdfDocument.getPage(pageNumber);
                  const textContent = await page.getTextContent();
                  const lines = groupItemsIntoLines(getTextItems(textContent.items));

                  pages.push(lines);
                  lineFontSizes.push(...lines.map((line) => line.fontSize));
            }

            const bodyFontSize = median(lineFontSizes, 12);
            const html = pages.map((lines) => linesToHtml(lines, bodyFontSize)).join("");

            if (!html.trim()) {
                  throw new Error("No readable text was found in this PDF.");
            }

            return html;
      } finally {
            await pdfDocument?.destroy?.();
      }
};
