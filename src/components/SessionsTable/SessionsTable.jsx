import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { changeSessionStatus } from '../../store/slices/sessionSlice';

import useDeviceType from '../../hooks/useDeviceType';
import MobileModalWrapper from '../MobileModalWrapper/MobileModalWrapper';
import { getSessionStatusName } from '../../utils/sessionHelpers';

import moreIcon from '../../assets/icons/more-icon.svg';
import DeleteIconRed from '../../assets/icons/delete-icon-red.svg?react';

import './styles.scss';

const SessionsTable = ({ tableData }) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mobileMoreIconData, setMobileMoreIconData] = useState({
    options: [],
  });

  const parentContainerRef = useRef(null);

  const currentUserDevice = useDeviceType();

  const dispatch = useDispatch();

  const getDropdownOptions = (item) => [
    {
      optionName: 'End session',
      icon: <DeleteIconRed className='dropdown-menu-icon-red' />,
      onOptionClick: () => {
        handleEndUserSession(item);
      },
    },
  ];

  console.log('tableData', tableData);

  const handleEndUserSession = (item) => {
    console.log('end sessions item', item);
    dispatch(changeSessionStatus({ sessionId: item.id, sessionNewStatus: 2 }));
  };

  const handleMoreClick = (e, item, index) => {
    console.log('e, item, index', e, item, index);

    if (currentUserDevice === 'mobile') {
      e.stopPropagation();

      setMobileMoreIconData({
        options: getDropdownOptions(item),
      });

      setIsMobileModalOpen(true);
    }
  };

  return (
    <>
      {currentUserDevice === 'mobile' && (
        <div className='mobile-user-management-table-header-wrapper'>
          <p className='mobile-user-management-table-header'>
            User session data
          </p>
          <p className='mobile-user-management-table-header'>Actions</p>
        </div>
      )}
      {tableData.length > 0 ? (
        <div
          className='user-management-table-container'
          ref={parentContainerRef}
        >
          <table className='user-management-table'>
            {currentUserDevice === 'desktop' && (
              <thead>
                <tr>
                  <th className='user-management-table-header'>Email</th>
                  <th className='user-management-table-header'>Entry time</th>
                  <th className='user-management-table-header'>
                    IP and Geolocation
                  </th>
                  <th className='user-management-table-header'>Browser</th>
                  <th className='user-management-table-header'>
                    Session status
                  </th>
                  <th className='user-management-table-header'></th>
                </tr>
              </thead>
            )}

            <tbody>
              {/* desktop */}
              {currentUserDevice === 'desktop' &&
                tableData.map((item, index) => (
                  <tr key={index} className={`table-data-body-row`}>
                    <td className='table-data-item'>
                      <div className='text-block'>
                        <p className='user-management-title'>{item.email}</p>
                      </div>
                    </td>

                    <td className='table-data-item'>
                      {new Date(item.created_at || Date.now()).toLocaleString(
                        'en-US'
                      )}
                    </td>

                    <td className='table-data-item'>
                      <div className='user-column'>
                        <div className='text-block'>
                          <p>{item.ip}</p>
                          <p className='user-management-created-by'>
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className='table-data-item'>{item.browser}</td>
                    <td className='table-data-item'>
                      <p
                        className={`session-status ${getSessionStatusName(
                          item.status
                        )}`}
                      >
                        {getSessionStatusName(item.status)}
                      </p>
                    </td>

                    <td className='table-data-item'>
                      {item.status === 1 && (
                        <div className='actions-column'>
                          <div
                            className='admin-portal-action-btn'
                            onClick={() => handleEndUserSession(item)}
                          >
                            End session
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

              {/* mobile*/}
              {currentUserDevice === 'mobile' &&
                tableData.map((item, index) => (
                  <tr key={index} className={`table-data-body-row`}>
                    <td className='table-data-item user-column'>
                      <div className='text-block'>
                        <p>{item.email}</p>
                        <p className='user-management-email'>
                          {new Date(
                            item.created_at || Date.now()
                          ).toLocaleString('en-US')}
                        </p>
                        <p className='user-management-email'>
                          {item.location} IP:{item.ip}
                        </p>

                        <p
                          className={`session-status ${getSessionStatusName(
                            item.status
                          )}`}
                        >
                          {getSessionStatusName(item.status)}
                        </p>
                      </div>
                    </td>
                    <td className='table-data-item'>
                      {item.status === 1 && (
                        <div className='actions-column'>
                          <img
                            src={moreIcon}
                            className='more-icon'
                            onClick={(e) => handleMoreClick(e, item, index)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='user-management-table-empty'>
        <p>No sessions found matching your search.</p>
        </div>
      )}

      {currentUserDevice === 'mobile' && (
        <MobileModalWrapper
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        >
          <div className='mobile-options-list'>
            {mobileMoreIconData.options?.map((option) => (
              <div
                key={option.optionName}
                className={`mobile-option-item ${
                  option.optionName === 'End session' ? 'delete-option' : ''
                }`}
                onClick={option.onOptionClick}
              >
                {option.icon}
                <span>{option.optionName}</span>
              </div>
            ))}
          </div>
        </MobileModalWrapper>
      )}
    </>
  );
};

export default SessionsTable;
