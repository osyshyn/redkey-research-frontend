import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getSessions } from '../../../store/slices/sessionSlice';

import useDeviceType from '../../../hooks/useDeviceType';
import Header from '../../../components/Header/Header';
import SessionsTable from '../../../components/SessionsTable/SessionsTable';
import Pagination from '../../../components/Pagination/Pagination';
import ActionBar from '../../../components/ActionBar/ActionBar';
import Loader from '../../../components/Loader/Loader';

import forgotPasswordNotificationIcon from '../../../assets/icons/red-done-circle-icon.svg';
import logoBig from '../../../assets/images/logo-big.png';
import logoLightBig from '../../../assets/images/logo-light-big.png';

import './styles.scss';

const Sessions = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageEndedSessions, setCurrentPageEndedSessions] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [itemsPerPageEndedSessions, setItemsPerPageEndedSessions] =
    useState(50);

  const dispatch = useDispatch();
  const currentUserDevice = useDeviceType();

  const { sessions, loading, error } = useSelector((state) => state.session);

  const { user } = useSelector((state) => state.auth);
  const currentTheme = document.body.getAttribute('data-theme-mode');

  console.log('sessions', sessions);

  const searchInSessions = searchValue
    ? sessions.filter((session) => {
        const normalizedSearch = searchValue.toLowerCase();

        return (
          (session.email &&
            session.email.toLowerCase().includes(normalizedSearch)) ||
          (session.browser &&
            session.browser.toLowerCase().includes(normalizedSearch))
        );
      })
    : sessions;

  const activeSessions = searchInSessions.filter(
    (session) => session.status === 1
  );
  const endedSessions = searchInSessions.filter(
    (session) => session.status === 2
  );

  const indexOfLastActive = currentPage * itemsPerPage;
  const indexOfFirstActive = indexOfLastActive - itemsPerPage;
  const currentActiveSessions = activeSessions.slice(
    indexOfFirstActive,
    indexOfLastActive
  );

  const indexOfLastEnded = currentPageEndedSessions * itemsPerPageEndedSessions;
  const indexOfFirstEnded = indexOfLastEnded - itemsPerPageEndedSessions;
  const currentEndedSessions = endedSessions.slice(
    indexOfFirstEnded,
    indexOfLastEnded
  );

  useEffect(() => {
    dispatch(getSessions());
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handlePageChangeEndedSessions = (newPage) => {
    setCurrentPageEndedSessions(newPage);
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };
  const handleItemsPerPageChangeEndedSessions = (newSize) => {
    setItemsPerPageEndedSessions(newSize);
    setCurrentPageEndedSessions(1);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  if (user?.role === 1 || user?.role === 2) {
    return (
      <div className='user-management-error-container'>
        <img
          className='logo-big'
          src={
            currentTheme === 'dark' || currentTheme === null
              ? logoBig
              : logoLightBig
          }
          alt='Logo'
        />
        <div className='notification'>
          <img
            className='notification-icon'
            src={forgotPasswordNotificationIcon}
            alt='Notification Icon'
          />
          <p className='notification-text'>
            Unfortunately, you do not have the necessary permissions to access
            this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header componentType={'user_sessions'} />
      <ActionBar
        title='Activity Log'
        componentType={'user_sessions'}
        searchPanelProps={{
          onSearchChange: handleSearchChange,
        }}
      />
      {loading ? (
        <Loader />
      ) : (
        <>      <h1 className='session-title'>Active Sessions</h1>
          <div className='session-table-wrapper'>
       
            <SessionsTable tableData={currentActiveSessions} />

            {activeSessions.length > 0 && currentUserDevice === 'desktop' && (
              <Pagination
                currentPage={currentPage}
                totalItems={activeSessions.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[25, 50, 100]}
              />
            )}
          </div>
          <h1 className='session-title'>Ended Sessions</h1>
          <div className='session-table-wrapper'>
    
            <SessionsTable tableData={currentEndedSessions} />

            {endedSessions.length > 0 && currentUserDevice === 'desktop' && (
              <Pagination
                currentPage={currentPageEndedSessions}
                totalItems={endedSessions.length}
                itemsPerPage={itemsPerPageEndedSessions}
                onPageChange={handlePageChangeEndedSessions}
                onItemsPerPageChange={handleItemsPerPageChangeEndedSessions}
                itemsPerPageOptions={[25, 50, 100]}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Sessions;
