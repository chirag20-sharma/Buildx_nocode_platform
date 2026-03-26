import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["landing-page", "portfolio", "blog", "ecommerce", "dashboard", "other"],
    default: "other"
  },
  thumbnail: {
    type: String,
    default: ""
  },
  components: [{
    id: { type: String, required: true },
    type: { type: String, required: true },
    properties: { type: mongoose.Schema.Types.Mixed, default: {} },
    styles: { type: mongoose.Schema.Types.Mixed, default: {} },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    }
  }],
  settings: {
    theme: {
      type: String,
      default: "light"
    },
    layout: {
      type: String,
      default: "responsive"
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model("Template", TemplateSchema);