import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import {
  checkMagicLink,
  clearAuthError,
  getProfile,
  selectAuth,
} from '../../store/slices/authSlice';
import { setCurrentFirm } from '../../store/slices/firmSlice';
import logoBig from '../../assets/images/logo-big.png';
import logoLightBig from '../../assets/images/logo-light-big.png';
import forgotPasswordNotificationIcon from '../../assets/icons/red-done-circle-icon.svg';

import './styles.scss';

const MagicLoginPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentTheme = document.body.getAttribute('data-theme-mode');
  const { user, status, error } = useSelector(selectAuth);

  useEffect(() => {
    const verifyMagicToken = async () => {
      try {
        dispatch(clearAuthError());

        if (!token) {
          throw new Error('Missing authentication token');
        }

        await dispatch(checkMagicLink({ token })).unwrap();

        await dispatch(getProfile()).unwrap();
      } catch (err) {
        console.error('Magic link verification failed:', err);
      }
    };

    if (token) {
      verifyMagicToken();
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (status === 'succeeded' && user) {
      if (user.role === 3) {
        navigate('/admin/portal');
        dispatch(setCurrentFirm({ name: 'All' }));
      } else if (user.role === 2) {
        navigate('/admin/portal');
        const activeAccess = user.access.find(
          (access) => access.value === true
        );
        if (activeAccess) {
          dispatch(setCurrentFirm(activeAccess.firm));
        }
      } else if (user.role === 1) {
        const activeAccess = user.access.find(
          (access) => access.value === true
        );
        if (activeAccess) {
          dispatch(setCurrentFirm(activeAccess.firm));
        }

        navigate('/user/portal');
      }
    }
  }, [status, user, navigate]);

  const renderContent = () => {
    if (status === 'loading') {
      return <Loader />;
    }

    if (error) {
      return (
        <>
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
              Authentication error! Please try again or{' '}
              <a href='mailto:info@redkeyresearch.com' className='text-red'>
                contact support
              </a>
            </p>
          </div>
        </>
      );
    }

    return (
      <>
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
            Invalid Authentication link. Please check your email for a valid
            magic link.
          </p>
        </div>{' '}
      </>
    );
  };

  return <div className='magic-login-container'>{renderContent()}</div>;
};

export default MagicLoginPage;
