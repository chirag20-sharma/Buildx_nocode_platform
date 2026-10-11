import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TemplatePreview from "./TemplatePreview";
import { API_BASE as API } from "./api.js";

export default function TemplatePreviewPage({ template: propTemplate, onClose }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(propTemplate || null);

  useEffect(() => {
    if (!template && id) {
      fetch(`${API}/templates/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.payload?.template) {
            setTemplate(data.payload.template);
          }
        })
        .catch(() => {});
    }
  }, [id, template]);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  const handleUse = () => {
    if (onClose) onClose();
    navigate("/dashboard");
  };

  return <TemplatePreview template={template} onUse={handleUse} onClose={handleClose} />;
}

