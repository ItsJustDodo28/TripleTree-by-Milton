import { useState, useEffect } from "react";
import "../styles/AdminDashboardModal.css";

const DashboardModal = ({ section, data, onClose, onSubmit }) => {
  // Initialize formData with existing data or empty fields for new entries
  const [formData, setFormData] = useState(data || {});

  // Define default fields for each section
  const sectionFields = {
    reservations: {
      room_id: "",
      guest_id: "",
      check_in_date: "",
      check_out_date: "",
      total_price: "",
      status: "Pending",
    },
    guests: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
    employees: {
      first_name: "",
      last_name: "",
      position: "",
      salary: "",
    },
    rooms: {
      hotel_id: "",
      room_type: "",
      rates: "",
      status: "Available",
    },
    services: {
      name: "",
      description: "",
      price: "",
    },
  };

  // Populate formData with default fields if it's a new entry
  useEffect(() => {
    if (!data) {
      setFormData(sectionFields[section] || {});
    }
  }, [section, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="admin-dashboard-modal">
      <div className="admin-dashboard-modal-content">
        <button
          type="button"
          className="admin-dashboard-modal-close"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="admin-dashboard-modal-title">
          {data ? `Edit ${section}` : `Add New ${section}`}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="admin-dashboard-modal-form"
          autoComplete="off"
        >
          {Object.keys(formData).map((key) => (
            <div key={key} className="admin-dashboard-modal-form-group">
              <label
                htmlFor={key}
                className="admin-dashboard-modal-label"
              >
                {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
              </label>
              <input
                type={
                  key.includes("date")
                    ? "date"
                    : key.includes("price") || key.includes("id") || key.includes("price")
                    ? "number"
                    : "text"
                }
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="admin-dashboard-modal-input"
              />
            </div>
          ))}
          <div className="admin-dashboard-modal-actions">
            <button type="submit" className="admin-dashboard-save-button">
              Save
            </button>
            <button
              type="button"
              className="admin-dashboard-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardModal;
