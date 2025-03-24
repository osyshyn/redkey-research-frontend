import React from "react";
import useDeviceType from "../../../hooks/useDeviceType";
import arrowDown from "../../../assets/icons/arrow-down.svg";
import arrowUp from "../../../assets/icons/arrow-up.svg";
import singleDotIcon from "../../../assets/icons/single-dot-icon.svg";
import moreIcon from "../../../assets/icons/more-icon.svg";

import "./styles.scss";

const WORD_WRAP_THRESHOLD = 15;

const FolderHeader = ({
  title,
  itemsAmount,
  currentStatus,
  onFolderToggle,
  onStatusClick,
  onMoreClick,
  isFolderOpen,
  statusRef,
  folderMoreIconRef,
  componentType,
  stockTicker,
  earliestResearchDate,
}) => {
  const hasVeryLongWord = title
    .split(" ")
    .some((word) => word.length > WORD_WRAP_THRESHOLD);

  const currentUserDevice = useDeviceType();

  return (
    <div className={`folder-header ${isFolderOpen ? "open" : "closed"}`}>
      <div className="folder-expandable-element" onClick={onFolderToggle}>
        <img
          src={isFolderOpen ? arrowDown : arrowUp}
          alt={isFolderOpen ? "Expand" : "Collapse"}
          className="arrow-icon"
        />
        <p
          className={`title ${hasVeryLongWord ? "truncate" : "multi-line"}`}
          title={title}
        >
          {title}
        </p>
      </div>
      {currentUserDevice === "desktop" && (
        <>
          <img src={singleDotIcon} className="single-dot-icon" />
          <p className="items-amount">
            {itemsAmount} {itemsAmount.toString() === "1" ? "item" : "items"}
          </p>
        </>
      )}
      {stockTicker && (
        <>
          <img src={singleDotIcon} className="single-dot-icon" />
          <p className="items-amount">{stockTicker}</p>{" "}
        </>
      )}
      {currentUserDevice === "desktop" && (
        <>
          <img src={singleDotIcon} className="single-dot-icon" />
          <p className="items-amount">{earliestResearchDate}</p>
        </>
      )}
      <img src={singleDotIcon} className="single-dot-icon" />
      <p
        ref={statusRef}
        className={`status ${currentStatus}`}
        onClick={onStatusClick}
      >
        {currentStatus}
      </p>
      {componentType === "admin_portal" && (
        <img
          ref={folderMoreIconRef}
          src={moreIcon}
          className="more-icon"
          onClick={onMoreClick}
        />
      )}
    </div>
  );
};

export default FolderHeader;
