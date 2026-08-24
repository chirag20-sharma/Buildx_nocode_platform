import TemplatePreview from "./TemplatePreview";

export default function TemplatePreviewPage({ template, onClose }) {
  const handleUse = () => {
    // After using the template, close the preview (could navigate to builder later)
    if (onClose) onClose();
  };

  return <TemplatePreview template={template} onUse={handleUse} onClose={onClose} />;
}

