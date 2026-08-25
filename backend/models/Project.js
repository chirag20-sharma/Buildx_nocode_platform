import mongoose from "mongoose";

const ComponentSchema = new mongoose.Schema({
  id:         { type: String },
  type:       { type: String, required: true },
  properties: { type: mongoose.Schema.Types.Mixed, default: {} },
  styles:     { type: mongoose.Schema.Types.Mixed, default: {} },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  }
});

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Project name is required"],
    trim: true,
    minlength: [2, "Project name must be at least 2 characters"],
    maxlength: [100, "Project name cannot exceed 100 characters"]
  },
  description: {
    type: String,
    maxlength: [500, "Description cannot exceed 500 characters"],
    default: ""
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"]
  },
  components: [ComponentSchema],
  settings: {
    theme:  { type: String, enum: ["light", "dark", "custom"], default: "light" },
    layout: { type: String, enum: ["fixed", "responsive"], default: "responsive" }
  },
  isPublished:  { type: Boolean, default: false },
  slug:         { type: String, trim: true, lowercase: true, default: null },
  publishedUrl: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
