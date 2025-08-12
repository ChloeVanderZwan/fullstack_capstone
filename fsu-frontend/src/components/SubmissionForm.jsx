import { useState } from "react";

function SubmissionForm({ type, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderBalletForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Ballet Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="composer">Composer *</label>
        <input
          type="text"
          id="composer"
          name="composer"
          value={formData.composer || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="choreographer">Choreographer *</label>
        <input
          type="text"
          id="choreographer"
          name="choreographer"
          value={formData.choreographer || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="year_premiered">Year Premiered</label>
        <input
          type="number"
          id="year_premiered"
          name="year_premiered"
          value={formData.year_premiered || ""}
          onChange={handleChange}
          min="1500"
          max="2024"
        />
      </div>

      <div className="form-group">
        <label htmlFor="difficulty_level">Difficulty Level</label>
        <select
          id="difficulty_level"
          name="difficulty_level"
          value={formData.difficulty_level || ""}
          onChange={handleChange}>
          <option value="">Select difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="duration_minutes">Duration (minutes)</label>
        <input
          type="number"
          id="duration_minutes"
          name="duration_minutes"
          value={formData.duration_minutes || ""}
          onChange={handleChange}
          min="1"
          max="300"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="4"
        />
      </div>
    </form>
  );

  const renderStepForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Step Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="difficulty">Difficulty *</label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty || ""}
          onChange={handleChange}
          required>
          <option value="">Select difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
    </form>
  );

  const renderEquipmentForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Equipment Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          required>
          <option value="">Select category</option>
          <option value="Footwear">Footwear</option>
          <option value="Attire">Attire</option>
          <option value="Training Equipment">Training Equipment</option>
          <option value="Facility">Facility</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
    </form>
  );

  const getTitle = () => {
    switch (type) {
      case "ballet":
        return "Submit New Ballet";
      case "step":
        return "Submit New Step";
      case "equipment":
        return "Submit New Equipment";
      default:
        return "Submit New Item";
    }
  };

  const renderForm = () => {
    switch (type) {
      case "ballet":
        return renderBalletForm();
      case "step":
        return renderStepForm();
      case "equipment":
        return renderEquipmentForm();
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{getTitle()}</h2>
        {error && <div className="error-message">{error}</div>}

        {renderForm()}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1 }}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              background: "#6c757d",
              color: "white",
              border: "none",
              padding: "0.8rem",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmissionForm;
