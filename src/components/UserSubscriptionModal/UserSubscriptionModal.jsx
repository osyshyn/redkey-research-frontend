import React, { useState } from "react";
import arrowDown from "../../assets/icons/arrow-down.svg";
import singleDotIcon from "../../assets/icons/single-dot-icon.svg";
import bigLockIcon from "../../assets/icons/big-lock-icon.svg";
import redDoneCircleIcon from "../../assets/icons/red-done-circle-icon.svg";

import "./styles.scss";

const UserSubscriptionModal = () => {
  const [isAccessRequested, setIsAccessRequested] = useState(false);
  return (
    <>
      <div className="skeleton-folder-wrapper">
        <div className="skeleton-folder-header">
          <div className="skeleton-folder-expandable-element">
            <img src={arrowDown} className="skeleton-arrow-icon" />
            <p className="skeleton-title"></p>
          </div>
          <img src={singleDotIcon} className="skeleton-single-dot-icon" />
          <p className="skeleton-items-amount">4 items</p>
        </div>

        <div className="skeleton-folder-contents">
          <div className="skeleton-folder-inner-list">
            <table className="skeleton-folder-table">
              <thead>
                <tr>
                  <th className="skeleton-folder-table-header">Research</th>
                  <th className="skeleton-folder-table-header">Date</th>
                  <th className="skeleton-folder-table-header"></th>
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className={`skeleton-table-data-body-row`}>
                    <td className="skeleton-table-data-item">
                      <div className="skeleton-research-column">
                        <div className="skeleton-custom-folder-checkbox">
                          <input type="checkbox" id={`checkbox-${index}`} />
                          <label htmlFor={`checkbox-${index}`}></label>
                        </div>
                        <p className="skeleton-line"></p>
                      </div>
                    </td>

                    <td className="skeleton-table-data">
                      <p className="skeleton-line"></p>
                    </td>
                    <td className="skeleton-table-data-item">
                      <div className="skeleton-actions-column">
                        <div className="skeleton-admin-portal-action-btn">
                          View
                        </div>
                        <div className="skeleton-admin-portal-action-btn">
                          Download
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="skeleton-subscription-modal-backdrop">
        <div
          className="skeleton-subscription-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={bigLockIcon} />

          <div className="skeleton-modal-text-content">
            <p className="skeleton-modal-description">
              Your are not subscribed to this service. Click below to request
              access.
            </p>
            <button
              className="skeleton-modal-request-button"
              onClick={() => setIsAccessRequested(true)}
            >
              Request Access
            </button>
          </div>

          {isAccessRequested && (
            <div className="skeleton-access-message">
              <img src={redDoneCircleIcon} />
              Thank you for inquiry. We will reach out to you soon.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSubscriptionModal;
