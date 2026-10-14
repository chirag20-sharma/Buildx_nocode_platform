import { respond } from "../utils/respond.js";

const ALLOWED_TYPES = new Set([
  "navbar","hero","header","heading","text","button","image","imagegrid","video",
  "divider","spacer","card","badge","alert","tabs","input","textarea","select",
  "checkbox","formblock","loginform","productcard","pricingcard","testimonial",
  "blogcard","statcard","section","container","columns","footer","productgrid"
]);

function sanitizeComponents(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(c => c && ALLOWED_TYPES.has(String(c.type || "").toLowerCase()))
    .map((c, i) => ({
      id: c.id || `ai-${c.type}-${i}`,
      type: String(c.type).toLowerCase(),
      properties: c.properties && typeof c.properties === "object" ? c.properties : {},
      styles: c.styles && typeof c.styles === "object" ? c.styles : {},
      position: {
        x: Number.isFinite(Number(c.position?.x)) ? Number(c.position.x) : 40,
        y: Number.isFinite(Number(c.position?.y)) ? Number(c.position.y) : 40 + i * 120,
      },
      parentId: c.parentId || null,
    }));
}

async function generateWithGemini(prompt, websiteType) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });

  const systemPrompt = `You are a website builder AI. Return ONLY a valid JSON array of component objects.
Allowed types: ${[...ALLOWED_TYPES].join(", ")}.
Each component must have: id (string), type (from allowed list), properties (object), styles (object), position {x, y}.
Do NOT include markdown, explanation, or any text outside the JSON array.
Website type: ${websiteType || "general"}
User request: ${prompt}`;

  const result = await model.generateContent(systemPrompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const jsonStr = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(jsonStr);
  return sanitizeComponents(parsed);
}

function keywordFallback(prompt, websiteType) {
  const lower = prompt.toLowerCase();
  const components = [];
  let y = 50, id = 1;

  const push = (type, properties, styles = {}) => {
    components.push({ id: `ai-${type}-${id++}`, type, properties, styles, position: { x: 40, y }, parentId: null });
    y += 120;
  };

  if (lower.includes("navbar") || lower.includes("navigation") || lower.includes("menu"))
    push("navbar", { brand: "My Brand", links: "Home, About, Contact", bg: "#0f172a", color: "#f1f5f9" });

  if (lower.includes("hero") || lower.includes("headline") || lower.includes("landing"))
    push("hero", { heading: "Welcome to Our Website", subtext: "The easiest way to build modern websites.", cta: "Get Started", bg: "#0f172a", color: "#f1f5f9" });

  if (lower.includes("feature") || lower.includes("card"))
    push("card", { title: "Feature", body: "Describe your feature here.", bg: "#ffffff", radius: 12 });

  if (lower.includes("button") || lower.includes("cta"))
    push("button", { text: "Get Started", bg: "#6366f1", color: "#ffffff", radius: 8 });

  if (lower.includes("image") || lower.includes("photo"))
    push("image", { src: "", alt: "Image", fit: "cover" });

  if (lower.includes("text") || lower.includes("paragraph"))
    push("text", { text: "Your content goes here.", fontSize: 16, color: "#475569" });

  if (lower.includes("footer"))
    push("footer", { text: `© ${new Date().getFullYear()} All rights reserved.`, bg: "#0f172a", color: "#94a3b8" });

  if (components.length === 0) {
    push("hero", { heading: "Your Website", subtext: prompt.slice(0, 120), cta: "Learn More", bg: "#0f172a", color: "#f1f5f9" });
    push("text", { text: "Edit this section to add your content.", fontSize: 16, color: "#475569" });
    push("button", { text: "Get Started", bg: "#6366f1", color: "#ffffff", radius: 8 });
  }

  return components;
}

export const generateDesign = async (req, res) => {
  try {
    const { prompt, websiteType } = req.body;
    if (!prompt) return respond(res, "Prompt is required", 400, false);

    let components;
    let usedAI = false;

    if (process.env.GEMINI_API_KEY) {
      try {
        components = await generateWithGemini(prompt, websiteType);
        usedAI = true;
      } catch (err) {
        console.warn("[AI] Gemini failed, using keyword fallback:", err.message);
        components = keywordFallback(prompt, websiteType);
      }
    } else {
      components = keywordFallback(prompt, websiteType);
    }

    return respond(res, "Design generated successfully", 200, true, {
      components,
      suggestion: `Generated ${components.length} components${usedAI ? " with Gemini AI" : " (keyword mode)"}`,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return respond(res, "Failed to generate design: " + error.message, 500, false);
  }
};
