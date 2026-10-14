import { generateHTML } from "./codeGenerator.js";

export function escapeHTML(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

describe("codeGenerator - Nested Hierarchy & Layouts", () => {
  test("generates section and container with nested children in stack mode", () => {
    const project = {
      name: "Test Layout",
      components: [
        {
          id: "sec-1",
          type: "section",
          properties: { bg: "#f1f5f9", layout: "stack", gap: 20 },
        },
        {
          id: "cont-1",
          type: "container",
          parentId: "sec-1",
          properties: { bg: "#ffffff", layout: "stack", maxWidth: "1200px" },
        },
        {
          id: "heading-1",
          type: "heading",
          parentId: "cont-1",
          properties: { text: "Hello BuildX" },
        },
        {
          id: "btn-1",
          type: "button",
          parentId: "cont-1",
          properties: { text: "Click Here" },
        },
      ],
    };

    const html = generateHTML(project);
    expect(html).toContain("bx-section-wrapper");
    expect(html).toContain("bx-container-wrapper");
    expect(html).toContain("Hello BuildX");
    expect(html).toContain("Click Here");
    expect(html).toContain("max-width: 1200px");
  });

  test("generates row and grid container layouts", () => {
    const project = {
      name: "Grid Layout",
      components: [
        {
          id: "cont-grid",
          type: "container",
          properties: { layout: "grid", cols: 3, gap: 16 },
        },
        {
          id: "card-1",
          type: "card",
          parentId: "cont-grid",
          properties: { title: "Feature 1" },
        },
        {
          id: "card-2",
          type: "card",
          parentId: "cont-grid",
          properties: { title: "Feature 2" },
        },
      ],
    };

    const html = generateHTML(project);
    expect(html).toContain("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr))");
    expect(html).toContain("Feature 1");
    expect(html).toContain("Feature 2");
  });
});

