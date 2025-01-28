import React, { useState } from "react";

const FilterModal = ({ isOpen, onClose, onSave }) => {
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(filters);
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal">
      <div className="modal-content">
        <h3>Filter Options</h3>
        <div className="filter-group">
          <label>
            Status:
            <select
              name="status"
              value={filters.status}
              onChange={handleInputChange}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
        <div className="filter-group">
          <label>
            Date Range:
            <input
              type="date"
              name="dateRange"
              value={filters.dateRange}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
