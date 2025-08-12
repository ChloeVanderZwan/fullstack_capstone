import { useState } from "react";

function AdminControls({ item, itemType, onDelete, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${itemType}?`)) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3002/api/${itemType}s/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete item");
      }

      onDelete(item.id);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-controls">
      {error && <div className="error-message">{error}</div>}
      <div className="admin-buttons">
        {onEdit && (
          <button
            onClick={() => onEdit(item)}
            className="edit-button"
            style={{
              background: "#ffc107",
              color: "#000",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "0.5rem",
              fontSize: "0.9rem"
            }}>
            Edit
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="delete-button"
          style={{
            background: "#dc3545",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: isDeleting ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            opacity: isDeleting ? 0.6 : 1
          }}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default AdminControls;
