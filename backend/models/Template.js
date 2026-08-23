import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["saas", "blog", "ecommerce", "portfolio", "restaurant", "landing-page", "dashboard", "other"],
    default: "other"
  },
  thumbnail: { type: String, default: "" },

  // Visual identity for the template card preview
  theme: {
    primaryColor:   { type: String, default: "#6366f1" },
    secondaryColor: { type: String, default: "#818cf8" },
    bgColor:        { type: String, default: "#0f172a" },
    accentColor:    { type: String, default: "#f59e0b" },
    fontStyle:      { type: String, default: "modern" },
    previewGradient:{ type: String, default: "135deg, #1e1b4b 0%, #312e81 100%" }
  },

  // Key features shown on the template card
  features: [{ type: String }],

  // Tags for search
  tags: [{ type: String }],

  // Information architecture — sections this template contains
  sections: [{ type: String }],

  // Website type label shown in builder
  builderType: { type: String, default: "" },

  components: [{
    id:         { type: String, required: true },
    type:       { type: String, required: true },
    properties: { type: mongoose.Schema.Types.Mixed, default: {} },
    styles:     { type: mongoose.Schema.Types.Mixed, default: {} },
    position:   { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } }
  }],

  settings: {
    theme:  { type: String, default: "light" },
    layout: { type: String, default: "responsive" }
  },

  isActive:   { type: Boolean, default: true },
  usageCount: { type: Number,  default: 0 }
}, { timestamps: true });

export default mongoose.model("Template", TemplateSchema);