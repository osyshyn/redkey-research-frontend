import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDeviceType from "../../hooks/useDeviceType";
import { requestGetAccess } from "../../store/slices/authSlice";
import arrowDown from "../../assets/icons/arrow-down.svg";
import singleDotIcon from "../../assets/icons/single-dot-icon.svg";
import BigLockIcon from "../../assets/icons/big-lock-icon.svg?react";
import redDoneCircleIcon from "../../assets/icons/red-done-circle-icon.svg";
import moreIcon from "../../assets/icons/more-icon.svg";

import "./styles.scss";

const UserSubscriptionModal = () => {
  const [isAccessRequested, setIsAccessRequested] = useState(false);

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const currentFirm = useSelector((state) => state.firm.currentFirm);
  const currentUserDevice = useDeviceType();

  const handleRequestAccess = () => {
    dispatch(requestGetAccess(currentFirm))
      .unwrap()
      .then(() => {
        setIsAccessRequested(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
              {currentUserDevice === "desktop" && (
                <thead>
                  <tr>
                    <th className="skeleton-folder-table-header">Research</th>
                    <th className="skeleton-folder-table-header">Date</th>
                    <th className="skeleton-folder-table-header"></th>
                  </tr>
                </thead>
              )}

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
                    {currentUserDevice === "desktop" && (
                      <td className="skeleton-table-data">
                        <p className="skeleton-line"></p>
                      </td>
                    )}
                    <td className="skeleton-table-data-item">
                      <div className="skeleton-actions-column">
                        {currentUserDevice === "desktop" && (
                          <>
                            <div className="skeleton-admin-portal-action-btn">
                              View
                            </div>
                            <div className="skeleton-admin-portal-action-btn">
                              Download
                            </div>
                          </>
                        )}
                        {currentUserDevice === "mobile" && (
                          <img src={moreIcon} className="more-icon" />
                        )}
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
          <BigLockIcon className="big-lock-icon" />

          <div className="skeleton-modal-text-content">
            <p className="skeleton-modal-description">
              You are not subscribed to this service. Click below to request
              access.
            </p>
            <button
              className="skeleton-modal-request-button"
              onClick={handleRequestAccess}
            >
              Request Access
            </button>
          </div>
        </div>
        {isAccessRequested && (
          <div className="skeleton-access-message">
            <img src={redDoneCircleIcon} />
            Thank you for inquiry. We will reach out to you soon.
          </div>
        )}
      </div>
    </>
  );
};

export default UserSubscriptionModal;
