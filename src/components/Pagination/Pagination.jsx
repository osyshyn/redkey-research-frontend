import React from "react";
import arrowLeftIcon from "../../assets/icons/arrow-left-icon.svg";
import arrowRightIcon from "../../assets/icons/arrow-right-icon.svg";
import "./styles.scss";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [1, "...", currentPage, "...", totalPages];
      }
    }
  };

  const visiblePages = getVisiblePages();

  const handleItemsPerPageChange = (e) => {
    onItemsPerPageChange(Number(e.target.value));
  };

  return (
    <div className="pagination-container">
      <div className="items-per-page">
        <div className="select-wrapper">
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="per-page-select"
          >
            <option value={3}>3 per page</option>
            <option value={6}>6 per page</option>
            <option value={10}>10 per page</option>
          </select>
        </div>
      </div>

      <div className="page-numbers">
        <button
          className="page-arrow"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <img src={arrowLeftIcon} alt="Previous" className="arrow-icon" />
        </button>

        {visiblePages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`page-number ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="page-arrow"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <img src={arrowRightIcon} alt="Next" className="arrow-icon" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
