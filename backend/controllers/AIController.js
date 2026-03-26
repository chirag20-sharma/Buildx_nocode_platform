import { respond } from "../utils/respond.js";

export const generateDesign = async (req, res) => {
  try {
    const { prompt, websiteType } = req.body;

    if (!prompt) {
      return respond(res, "Prompt is required", 400, false);
    }

    // AI-generated component suggestions based on prompt
    const aiComponents = generateComponentsFromPrompt(prompt, websiteType);

    return respond(res, "Design generated successfully", 200, true, {
      components: aiComponents,
      suggestion: `Generated ${aiComponents.length} components for your ${websiteType || 'website'}`
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return respond(res, "Failed to generate design: " + error.message, 500, false);
  }
};

function generateComponentsFromPrompt(prompt, websiteType) {
  const lowerPrompt = prompt.toLowerCase();
  const components = [];
  let yPos = 50;
  let componentId = 1;

  if (lowerPrompt.includes("navbar") || lowerPrompt.includes("navigation") || lowerPrompt.includes("menu")) {
    components.push({
      id: `ai-navbar-${componentId++}`,
      type: "navbar",
      properties: { text: "Navigation Menu" },
      styles: { background: "#667eea", color: "white", padding: "20px" },
      position: { x: 50, y: yPos }
    });
    yPos += 80;
  }

  if (lowerPrompt.includes("hero") || lowerPrompt.includes("headline") || lowerPrompt.includes("title")) {
    components.push({
      id: `ai-hero-${componentId++}`,
      type: "hero",
      properties: { content: extractTitle(prompt) || "Welcome to Our Website" },
      styles: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#2c3e50" },
      position: { x: 50, y: yPos }
    });
    yPos += 100;
  }

  if (lowerPrompt.includes("button") || lowerPrompt.includes("cta") || lowerPrompt.includes("call to action")) {
    const buttonText = extractButtonText(prompt) || "Get Started";
    components.push({
      id: `ai-button-${componentId++}`,
      type: "button",
      properties: { text: buttonText },
      styles: { background: "#28a745", color: "white", padding: "15px 40px", borderRadius: "8px" },
      position: { x: 50, y: yPos }
    });
    yPos += 80;
  }

  if (lowerPrompt.includes("image") || lowerPrompt.includes("photo") || lowerPrompt.includes("picture")) {
    components.push({
      id: `ai-image-${componentId++}`,
      type: "image",
      properties: { src: "https://via.placeholder.com/400x300", alt: "Image" },
      styles: { width: "400px", height: "300px" },
      position: { x: 50, y: yPos }
    });
    yPos += 320;
  }

  if (lowerPrompt.includes("text") || lowerPrompt.includes("paragraph") || lowerPrompt.includes("description")) {
    components.push({
      id: `ai-text-${componentId++}`,
      type: "text",
      properties: { content: "Your content goes here. Edit this text to customize." },
      styles: { fontSize: "18px", color: "#6c757d", lineHeight: "1.6" },
      position: { x: 50, y: yPos }
    });
    yPos += 80;
  }

  if (lowerPrompt.includes("card") || lowerPrompt.includes("feature")) {
    components.push({
      id: `ai-card-${componentId++}`,
      type: "card",
      properties: { title: "Feature Card" },
      styles: { padding: "30px", background: "#f8f9fa", borderRadius: "12px", border: "2px solid #dee2e6" },
      position: { x: 50, y: yPos }
    });
    yPos += 120;
  }

  if (components.length === 0) {
    components.push(
      {
        id: `ai-hero-${componentId++}`,
        type: "hero",
        properties: { content: "Your Website Title" },
        styles: { fontSize: "48px", fontWeight: "bold", textAlign: "center" },
        position: { x: 50, y: 50 }
      },
      {
        id: `ai-text-${componentId++}`,
        type: "text",
        properties: { content: prompt },
        styles: { fontSize: "18px", color: "#6c757d" },
        position: { x: 50, y: 150 }
      },
      {
        id: `ai-button-${componentId++}`,
        type: "button",
        properties: { text: "Learn More" },
        styles: { background: "#667eea", color: "white", padding: "12px 30px", borderRadius: "8px" },
        position: { x: 50, y: 250 }
      }
    );
  }

  return components;
}

function extractTitle(prompt) {
  const titleMatch = prompt.match(/title[:\s]+["']?([^"'\n]+)["']?/i);
  if (titleMatch) return titleMatch[1].trim();
  
  const forMatch = prompt.match(/for\s+(.+?)(?:\s+with|\s+that|\s+website|$)/i);
  if (forMatch) return forMatch[1].trim();
  
  return null;
}

function extractButtonText(prompt) {
  const buttonMatch = prompt.match(/button[:\s]+["']?([^"'\n]+)["']?/i);
  if (buttonMatch) return buttonMatch[1].trim();
  
  const ctaMatch = prompt.match(/cta[:\s]+["']?([^"'\n]+)["']?/i);
  if (ctaMatch) return ctaMatch[1].trim();
  
  return null;
}
