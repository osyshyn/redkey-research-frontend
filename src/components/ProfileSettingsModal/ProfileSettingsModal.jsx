import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import useDeviceType from '../../hooks/useDeviceType';
import CustomModal from '../CustomModal/CustomModal';
import CustomInput from '../CustomInput/CustomInput';
import CustomButton from '../CustomButton/CustomButton';
import { changePassword, changeProfile } from '../../store/slices/authSlice';
import DefaultResearchIcon from '../../assets/icons/default-research-icon.svg?react';
import MailIcon from '../../assets/icons/mail-icon.svg?react';
import UsersIcon from '../../assets/icons/users-icon.svg?react';
import StatusFilterIcon from '../../assets/icons/status-filter-icon.svg?react';

import './styles.scss';

const ProfileSettingsModal = ({
  isOpen = false,
  onClose = () => {},
  initialProfile = { first_name: '', last_name: '', email: '' },
}) => {
  const [mode, setMode] = useState('profile');
  const [profileData, setProfileData] = useState(initialProfile);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileDataError, setProfileDataError] = useState('');

  const currentUserDevice = useDeviceType();
  const { user } = useSelector((state) => state.auth);
  const modalRoot = document.getElementById('modal-root');
  const dispatch = useDispatch();

  const handleSaveProfile = () => {
    dispatch(changeProfile(profileData))
      .unwrap()
      .then(() => {
        setProfileDataError('');
        onClose();
      })
      .catch((error) => {
        setProfileDataError(error);
      });
  };

  const handleSavePassword = () => {
    const passwordData = {
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    dispatch(changePassword(passwordData))
      .unwrap()
      .then(() => {
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setMode('profile');
      })
      .catch((error) => {
        setPasswordError(error);
      });
  };

  return (
    <>
      {modalRoot &&
        ReactDOM.createPortal(
          <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            modalTitle={
              mode === 'profile' ? 'Profile' : 'Change Password'
            }
          >
            {mode === 'profile' ? (
              // ======== PROFILE SETTINGS =========
              user?.role === 3 ? (
                <>
                  <div
                    className={
                      currentUserDevice === 'desktop'
                        ? 'profile-first-last-name'
                        : ''
                    }
                  >
                    <CustomInput
                      label='Name'
                      placeholder='First name'
                      value={profileData.first_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          first_name: e.target.value,
                        })
                      }
                      disabled={user.role === 1 || user.role === 2}
                    />
                    <CustomInput
                      label='Last Name'
                      placeholder='Last name'
                      value={profileData.last_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          last_name: e.target.value,
                        })
                      }
                      showLabel={
                        currentUserDevice === 'desktop'
                          ? 'input-hide-label'
                          : ''
                      }
                      disabled={user.role === 1 || user.role === 2}
                    />
                  </div>
                  <CustomInput
                    label='Email'
                    placeholder='example@mail.com'
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    disabled={user.role === 1 || user.role === 2}
                  />
                  {profileDataError && (
                    <p className='profile-data-error-message'>
                      {profileDataError}
                    </p>
                  )}
                  <p className='change-password-link'>
                    {/* Change Password */}
                  </p>
                  <CustomButton
                    label='Save Changes'
                    style='red-shadow'
                    onClick={handleSaveProfile}
                    disabled={user.role === 1 || user.role === 2}
                  />
                </>
              ) : (
                <>
                  <div className='profile-data-section'>
                    <p className='profile-data-label'>Name</p>
                    <div className='profile-data-info-wrapper'>
                      <UsersIcon className='mobile-home-menu-icon' />
                      <p className='profile-data-text'>
                        {profileData.first_name} {profileData.last_name}
                      </p>
                    </div>
                  </div>
                  <div className='profile-data-section'>
                    <p className='profile-data-label'>Firm Name</p>
                    <div className='profile-data-info-wrapper'>
                      <StatusFilterIcon className='mobile-home-menu-icon' />
                      <p className='profile-data-text'>{user?.company}</p>
                    </div>
                  </div>
                  <div className='profile-data-section'>
                    <p className='profile-data-label'>Subscriptions</p>
                    {user?.access?.map((item, index) => {
                      if (item.value) {
                        return (
                          <p key={index} className='profile-data-text icon'>
                            <DefaultResearchIcon className='mobile-home-menu-icon' />
                            {item.firm?.name}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <div className='profile-data-section'>
                    <p className='profile-data-label'>Email</p>
                    <div className='profile-data-info-wrapper'>
                      <MailIcon className='mobile-home-menu-icon' />
                      <p className='profile-data-text'>{profileData.email}</p>
                    </div>
                  </div>
                </>
              )
            ) : (
              // ======== CHANGE PASSWORD =========
              <>
                <CustomInput
                  label='New Password'
                  placeholder='Enter new password'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={!!passwordError}
                />
                <CustomInput
                  label='Re-enter Password'
                  placeholder='Confirm new password'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!passwordError}
                />
                {passwordError && (
                  <p className='password-error-message'>{passwordError}</p>
                )}
                <div className='modal-actions-button'>
                  <CustomButton
                    label='Save New Password'
                    style='red-shadow'
                    onClick={handleSavePassword}
                  />
                </div>
              </>
            )}
          </CustomModal>,
          modalRoot
        )}
    </>
  );
};

export default ProfileSettingsModal;
