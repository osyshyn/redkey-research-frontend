import React from "react";
import DatePicker from "react-datepicker";
import calendarIcon from "../../assets/icons/calendar-icon.svg";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.scss";

const CustomDatePicker = ({ label, placeholder, value, onChange }) => {
  return (
    <div className="custom-date-picker">
      <label className="custom-date-label">{label}</label>
      <div className="custom-input-field">
        <img src={calendarIcon} alt="calendar" className="icon" />
        <DatePicker
          selected={value}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          placeholderText={placeholder}
          className="react-datepicker__input"
          showMonthDropdown
          showYearDropdown
          yearDropdownItemNumber={5}
          scrollableYearDropdown
        />
      </div>
    </div>
  );
};

export default CustomDatePicker;
