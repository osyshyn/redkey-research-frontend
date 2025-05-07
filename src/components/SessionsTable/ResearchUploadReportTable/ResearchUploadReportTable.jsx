import React, { useRef } from 'react';

import useDeviceType from '../../../hooks/useDeviceType';

import './styles.scss';

const ResearchUploadReportTable = ({ tableData }) => {
  const parentContainerRef = useRef(null);

  const currentUserDevice = useDeviceType();

  console.log('tableData', tableData);

  return (
    <>
      {currentUserDevice === 'mobile' && (
        <div className='mobile-user-management-table-header-wrapper'>
          <p className='mobile-user-management-table-header'>
            Research upload report data
          </p>
          {/* <p className='mobile-user-management-table-header'>Uploaded by</p> */}
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
                  <th className='user-management-table-header'>File name</th>
                  <th className='user-management-table-header'>
                    Uploading date
                  </th>
                  <th className='user-management-table-header'>Uploaded by</th>
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
                        <p className='user-management-title'>{item.name}</p>
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
                          <p>
                            {item.user.first_name} {item.user.last_name}
                          </p>
                          <p className='user-management-created-by'>
                            {item.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* mobile*/}
              {currentUserDevice === 'mobile' &&
                tableData.map((item, index) => (
                  <tr key={index} className={`table-data-body-row`}>
                    <td className='table-data-item user-column'>
                      <div className='text-block'>
                        <p>{item.name}</p>
                        <p className='user-management-email'>
                          {new Date(
                            item.created_at || Date.now()
                          ).toLocaleString('en-US')}
                        </p>
                        <p className='user-management-email'>
                          Uploaded by {item.user.first_name}{' '}
                          {item.user.last_name}
                        </p>
                      </div>
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
    </>
  );
};

export default ResearchUploadReportTable;
