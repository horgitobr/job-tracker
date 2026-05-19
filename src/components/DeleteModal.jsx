import { useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteModal({ title, description, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <Trash2 size={18} color="var(--danger)" strokeWidth={1.75} />
        </div>
        <div className="modal-title" id="modal-title">{title}</div>
        <p className="modal-desc">{description}</p>
        <div className="modal-actions">
          <button className="btn-sec" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} autoFocus>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
