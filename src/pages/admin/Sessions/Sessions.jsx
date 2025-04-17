import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getSessions } from '../../../store/slices/sessionSlice';

import useDeviceType from '../../../hooks/useDeviceType';
import Header from '../../../components/Header/Header';
import SessionsTable from '../../../components/SessionsTable/SessionsTable';
import Pagination from '../../../components/Pagination/Pagination';
import ActionBar from '../../../components/ActionBar/ActionBar';
import Loader from '../../../components/Loader/Loader';
import CustomButton from '../../../components/CustomButton/CustomButton';
import CustomModal from '../../../components/CustomModal/CustomModal';
import MobileModalWrapper from '../../../components/MobileModalWrapper/MobileModalWrapper';

import FileUploadIcon from '../../../assets/icons/file-upload-icon.svg?react';
import MobileActionAddIcon from '../../../assets/icons/mobile-action-add-button.svg?react';
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
  const [mobileActionAddData, setMobileActionAddData] = useState({
    options: [],
  });
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [exportType, setExportType] = useState(null); // 'active' | 'ended'
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const dispatch = useDispatch();
  const currentUserDevice = useDeviceType();

  const { sessions, loading, error } = useSelector((state) => state.session);

  const { user } = useSelector((state) => state.auth);
  const currentTheme = document.body.getAttribute('data-theme-mode');

  console.log('sessions', sessions);

  const exportToCSV = () => {
    const sessionsToExport =
      exportType === 'active' ? activeSessions : endedSessions;
    const fileNameType = exportType === 'active' ? 'active' : 'ended';

    const csvContent = [
      ['Email', 'Entry time', 'Browser', 'Location', 'IP Address', 'Status'],
      ...sessionsToExport.map((session) => [
        session.email || 'N/A',
        new Date(session.created_at).toLocaleString(),
        session.browser || 'N/A',
        session.location || 'N/A',
        session.ip || 'N/A',
        session.status === 1 ? 'Active' : 'Archive',
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileNameType}-sessions-log.csv`;
    link.click();
  };

  const exportToXLS = () => {
    const sessionsToExport =
      exportType === 'active' ? activeSessions : endedSessions;
    const fileNameType = exportType === 'active' ? 'active' : 'ended';

    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(
        sessionsToExport.map((session) => ({
          Email: session.email || 'N/A',
          'Entry time': new Date(session.created_at).toLocaleString(),
          Browser: session.browser || 'N/A',
          Location: session.location || 'N/A',
          'IP Address': session.ip || 'N/A',
          Status: session.status === 1 ? 'Active' : 'Archive',
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      XLSX.writeFile(workbook, `${fileNameType}-sessions-log.xlsx`);
    });
  };

  const handleExportButtonClick = (type) => {
    setExportType(type);
    setIsExportModalOpen(true);
  };

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

  const handleOpenMobileModal = () => {
    // e.stopPropagation();

    setMobileActionAddData({
      options: [
        {
          optionName: 'Export ended',
          icon: <FileUploadIcon className='mobile-dropdown-menu-icon' />,
          onOptionClick: () => {
            setIsMobileModalOpen(false);
            handleExportButtonClick('ended');
          },
        },
        {
          optionName: 'Export active',
          icon: <FileUploadIcon className='mobile-dropdown-menu-icon' />,

          onOptionClick: () => {
            setIsMobileModalOpen(false);
            handleExportButtonClick('active');
          },
        },
      ],
    });

    setIsMobileModalOpen(true);
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
        buttons={[
          {
            label: 'Export ended',
            style: 'red-outline',

            onClick: () => handleExportButtonClick('ended'),
          },
          {
            label: 'Export active',
            style: 'red-shadow',
            onClick: () => handleExportButtonClick('active'),
          },
        ]}
        mobileButton={{
          label: <MobileActionAddIcon className='action-bar-plus-icon' />,
          style: 'red-shadow',
          onClick: handleOpenMobileModal,
        }}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          {' '}
          <h1 className='session-title'>Active Sessions</h1>
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
      <CustomModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        modalTitle={`Export ${
          exportType === 'active' ? 'active' : 'ended'
        } sessions`}
      >
        <div className='export-options'>
          <CustomButton
            label='Export to CSV'
            style='red-shadow'
            onClick={exportToCSV}
          />
          <CustomButton
            label='Export to Excel (XLS)'
            style='red-shadow'
            onClick={exportToXLS}
          />
        </div>
      </CustomModal>

      {currentUserDevice === 'mobile' && (
        <MobileModalWrapper
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        >
          <div className='mobile-options-list'>
            {mobileActionAddData.options?.map((option) => (
              <div
                key={option.optionName}
                className={`mobile-option-item ${
                  option.optionName === 'Delete' ? 'delete-option' : ''
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

export default Sessions;
