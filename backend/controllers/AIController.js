import { GoogleGenerativeAI } from "@google/generative-ai";
import { respond } from "../utils/respond.js";

const ALLOWED_COMPONENT_TYPES = new Set([
  "section",
  "container",
  "columns",
  "text",
  "heading",
  "button",
  "divider",
  "spacer",
  "image",
  "imagegrid",
  "video",
  "navbar",
  "footer",
  "card",
  "badge",
  "alert",
  "tabs",
  "input",
  "textarea",
  "select",
  "checkbox",
  "loginform",
  "formblock",
  "hero",
  "productcard",
  "pricingcard",
  "testimonial",
  "blogcard",
  "statcard",
  "productgrid",
]);

const MAX_COMPONENTS = 12;

function inferWebsiteType(prompt) {
  const text = String(prompt || "").toLowerCase();
  if (/restaurant|cafe|food|menu|dining/.test(text)) return "restaurant";
  if (/portfolio|designer|photographer|developer|resume|about me/.test(text)) return "portfolio";
  if (/ecommerce|shop|store|buy|product|cart/.test(text)) return "ecommerce";
  if (/blog|article|news|magazine/.test(text)) return "blog";
  if (/guitar|music|instrument|band/.test(text)) return "guitar store";
  if (/real estate|property|listing/.test(text)) return "real estate";
  if (/travel|hotel|vacation|tour/.test(text)) return "travel";
  return "website";
}

export function validateAiComponents(rawComponents) {
  if (!Array.isArray(rawComponents)) {
    throw new Error("AI output is invalid: expected a JSON array of components.");
  }

  if (rawComponents.length === 0) {
    throw new Error("AI output is invalid: no components were generated.");
  }

  if (rawComponents.length > MAX_COMPONENTS) {
    throw new Error("AI output is invalid: generated too many components.");
  }

  return rawComponents.map((component, index) => {
    if (!component || typeof component !== "object" || Array.isArray(component)) {
      throw new Error(`AI output is invalid: component #${index + 1} is malformed.`);
    }

    const type = String(component.type || "").trim().toLowerCase();
    if (!ALLOWED_COMPONENT_TYPES.has(type)) {
      throw new Error(`AI output is invalid: unsupported component type "${component.type}".`);
    }

    const properties = component.properties && typeof component.properties === "object" && !Array.isArray(component.properties)
      ? component.properties
      : {};

    const styles = component.styles && typeof component.styles === "object" && !Array.isArray(component.styles)
      ? component.styles
      : {};

    const position = component.position && typeof component.position === "object" && !Array.isArray(component.position)
      ? {
          x: Number.isFinite(Number(component.position.x)) ? Number(component.position.x) : 40 + (index * 20),
          y: Number.isFinite(Number(component.position.y)) ? Number(component.position.y) : 40 + (index * 80),
        }
      : { x: 40 + (index * 20), y: 40 + (index * 80) };

    return {
      id: String(component.id || `ai-${type}-${index + 1}`).trim() || `ai-${type}-${index + 1}`,
      type,
      properties,
      styles,
      position,
    };
  });
}

function parseStructuredJson(rawText) {
  if (!rawText || !String(rawText).trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  const text = String(rawText).trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : text;

  try {
    const parsed = JSON.parse(candidate);
    if (parsed && Array.isArray(parsed.components)) {
      return parsed.components;
    }
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && typeof parsed === "object" && parsed.type) {
      return [parsed];
    }
    throw new Error("AI output is invalid: expected a component array.");
  } catch (error) {
    throw new Error("AI output is invalid: Gemini response was not valid JSON.");
  }
}

async function generateComponentsFromGemini(prompt, websiteType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error("Gemini API key is not configured on the backend. Set GEMINI_API_KEY before trying AI generation.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL_NAME || "gemini-3.6-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const typeName = websiteType || inferWebsiteType(prompt);
  const instruction = `You are BuildX AI. Generate only a JSON array of BuildX page components.
Rules:
- Return strict JSON only, no markdown fences, no HTML, no JavaScript, no commentary.
- Use BuildX types only: ${[...ALLOWED_COMPONENT_TYPES].join(", ")}.
- Each component must match this structure: { "id": "string", "type": "string", "properties": { ... }, "styles": { ... }, "position": { "x": number, "y": number } }.
- Keep the layout realistic for a ${typeName} website.
- Prefer section, navbar, hero, text, heading, image, imagegrid, card, button, footer, productcard, testimonial, blogcard, formblock, input, textarea, pricingcard.
- Include realistic content tailored to the prompt and website type.
- Do not include random script tags, inline CSS strings, HTML fragments, or unsupported components.
- Ensure x/y values are numbers and the overall result is visually coherent.
User prompt: ${prompt}`;

  const result = await model.generateContent(instruction);
  const response = await result.response;
  const text = response.text();
  const parsed = parseStructuredJson(text);
  return validateAiComponents(parsed);
}

export const generateDesign = async (req, res) => {
  try {
    const { prompt, websiteType } = req.body;

    if (!prompt || !String(prompt).trim()) {
      return respond(res, "Prompt is required", 400, false);
    }

    const normalizedPrompt = String(prompt).trim();
    const detectedType = websiteType || inferWebsiteType(normalizedPrompt);
    const aiComponents = await generateComponentsFromGemini(normalizedPrompt, detectedType);

    return respond(res, "Design generated successfully", 200, true, {
      components: aiComponents,
      suggestion: `Generated ${aiComponents.length} BuildX components for your ${detectedType} website.`
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return respond(res, error.message || "Failed to generate design", 500, false);
  }
};
