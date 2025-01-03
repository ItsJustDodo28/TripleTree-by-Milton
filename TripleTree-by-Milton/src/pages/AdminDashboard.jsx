import { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";
import Modal from "../components/DashboardModal";
import Analytics from "../components/Analytics";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("reservations");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null); // For editing or creating entries
  const navigate = useNavigate();
  // Fetch data dynamically based on the active section
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/${activeSection}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeSection]);

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter displayed data based on search query
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Open modal for adding/editing data
  const openModal = (entry = null) => {
    setModalData(entry);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalData(null);
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/');
  };

  // Handle form submission inside modal
  const handleFormSubmit = async (formData) => {
    try {
      const method = modalData ? "PUT" : "POST";
      const url = modalData
        ? `http://localhost:5000/api/${activeSection}/${modalData.id}`
        : `http://localhost:5000/api/${activeSection}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeModal();
        setData(await response.json()); // Refresh data
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  const handleDelete = async (item) => {
    try {
      const response = await fetch(`http://localhost:5000/api/${activeSection}/${item[0]}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        setData(data.filter((i) => i.id !== item[0])); // Remove the deleted item from the state
      } else {
        console.error("Error deleting item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-dashboard-sidebar">
        <h2 className="admin-dashboard-sidebar-title">Admin Dashboard</h2>
        <ul className="admin-dashboard-sidebar-list">
          {["reservations", "guests", "employees", "rooms", "services", "analytics"].map(
            (section) => (
              <li
                key={section}
                onClick={() => setActiveSection(section)}
                className={`admin-dashboard-sidebar-item ${activeSection === section ? "active" : ""
                  }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </li>
            )
          )}
          <li onClick={() => handleLogout()}
            className={`admin-dashboard-sidebar-item`}>
            Logout
          </li>
        </ul>
      </aside>

      <main className="admin-dashboard-content">
        <header className="admin-dashboard-header">
          <h1 className="admin-dashboard-header-title">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
          <div className="admin-dashboard-header-actions">
            <input
              type="text"
              className="admin-dashboard-search"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <button
              className="admin-dashboard-add-button"
              onClick={() => openModal()}
            >
              Add New
            </button>
          </div>
        </header>
        {activeSection === "analytics" ? (
          <Analytics />
        ) : (

          <section className="admin-dashboard-data-table">
            <table className="admin-dashboard-table">
              <thead className="admin-dashboard-table-header">
                <tr>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <th key={key} className="admin-dashboard-table-header-cell">
                        {key}
                      </th>
                    ))}
                  <th className="admin-dashboard-table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="admin-dashboard-table-body">
                {filteredData.map((item, index) => (
                  <tr key={index} className="admin-dashboard-table-row">
                    {Object.values(item).map((value, idx) => (
                      <td key={idx} className="admin-dashboard-table-cell">
                        {value}
                      </td>
                    ))}
                    <td className="admin-dashboard-table-cell">
                      <button
                        className="admin-dashboard-edit-button"
                        onClick={() => openModal(item)}
                      >
                        Edit
                      </button>
                      <button className="admin-dashboard-delete-button" onClick={() => handleDelete(item)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>)}
      </main>

      {isModalOpen && (
        <Modal
          section={activeSection}
          data={modalData}
          onClose={closeModal}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
