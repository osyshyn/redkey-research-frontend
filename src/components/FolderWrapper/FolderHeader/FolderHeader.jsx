import React from "react";
import arrowDown from "../../../assets/icons/arrow-down.svg";
import arrowUp from "../../../assets/icons/arrow-up.svg";
import singleDotIcon from "../../../assets/icons/single-dot-icon.svg";
import moreIcon from "../../../assets/icons/more-icon.svg";

import "./styles.scss";

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
}) => (
  <div className={`folder-header  ${isFolderOpen ? "open" : "closed"}`}>
    <div className="folder-expandable-element" onClick={onFolderToggle}>
      <img
        src={isFolderOpen ? arrowDown : arrowUp}
        alt={isFolderOpen ? "Expand" : "Collapse"}
        className="arrow-icon"
      />
      <p className="title">{title}</p>
    </div>
    <img src={singleDotIcon} className="single-dot-icon" />
    <p className="items-amount">
      {itemsAmount} {itemsAmount.toString() === "1" ? "item" : "items"}
    </p>
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

export default FolderHeader;
