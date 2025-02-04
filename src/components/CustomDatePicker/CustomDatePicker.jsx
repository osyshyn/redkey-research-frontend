import React, { useState } from "react";
import DatePicker from "react-datepicker";
import calendarIcon from "../../assets/icons/calendar-icon.svg";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.scss";

const CustomDatePicker = ({
  label,
  placeholder,
  value,
  onChange,
  showLabel = "",
  isRange = false,
}) => {
  const [range, setRange] = useState([null, null]); // Локальный стейт для диапазона
  const [startDate, endDate] = range;

  const handleChange = (dates) => {
    if (isRange) {
      setRange(dates);
      onChange(dates);
    } else {
      onChange(dates);
    }
  };

  return (
    <div className="custom-date-picker">
      <label className={`custom-date-label ${showLabel}`}>{label}</label>
      <div className="custom-input-field">
        <img src={calendarIcon} alt="calendar" className="icon" />
        <DatePicker
          // selected={value}
          // onChange={onChange}
          selected={isRange ? startDate : value}
          onChange={handleChange}
          startDate={isRange ? startDate : undefined}
          endDate={isRange ? endDate : undefined}
          selectsRange={isRange}
          dateFormat="dd/MM/yy"
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
