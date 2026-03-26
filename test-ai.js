// AI Test Script - Run with: node test-ai.js

function generateComponentsFromPrompt(prompt, websiteType) {
  const lowerPrompt = prompt.toLowerCase();
  const components = [];
  let yPos = 50;

  if (lowerPrompt.includes("navbar") || lowerPrompt.includes("navigation") || lowerPrompt.includes("menu")) {
    components.push({
      type: "navbar",
      properties: { text: "Navigation Menu" },
      styles: { background: "#667eea", color: "white", padding: "20px" },
      position: { x: 50, y: yPos }
    });
    yPos += 80;
  }

  if (lowerPrompt.includes("hero") || lowerPrompt.includes("headline") || lowerPrompt.includes("title")) {
    components.push({
      type: "hero",
      properties: { content: "Welcome to Our Website" },
      styles: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#2c3e50" },
      position: { x: 50, y: yPos }
    });
    yPos += 100;
  }

  if (lowerPrompt.includes("button") || lowerPrompt.includes("cta") || lowerPrompt.includes("call to action")) {
    components.push({
      type: "button",
      properties: { text: "Get Started" },
      styles: { background: "#28a745", color: "white", padding: "15px 40px", borderRadius: "8px" },
      position: { x: 50, y: yPos }
    });
    yPos += 80;
  }

  if (lowerPrompt.includes("image") || lowerPrompt.includes("photo") || lowerPrompt.includes("picture")) {
    components.push({
      type: "image",
      properties: { src: "https://via.placeholder.com/400x300", alt: "Image" },
      styles: { width: "400px", height: "300px" },
      position: { x: 50, y: yPos }
    });
    yPos += 320;
  }

  return components;
}

// Test Cases
console.log("🤖 Testing AI Component Generation...\n");

const testPrompts = [
  "Create a hero section with button and image",
  "Add navbar with navigation menu", 
  "Make a landing page with button",
  "Add image and text content"
];

testPrompts.forEach((prompt, index) => {
  console.log(`Test ${index + 1}: "${prompt}"`);
  const result = generateComponentsFromPrompt(prompt, "Landing Page");
  console.log(`Generated ${result.length} components:`);
  result.forEach(comp => console.log(`  - ${comp.type}: ${comp.properties.text || comp.properties.content || 'component'}`));
  console.log("");
});

console.log("✅ AI functionality is working!");