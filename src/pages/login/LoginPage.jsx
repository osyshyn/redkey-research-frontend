import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfile,
  loginUser,
  selectAuth,
  clearAuthError,
} from '../../store/slices/authSlice';
import { setCurrentFirm } from '../../store/slices/firmSlice';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import logoBig from '../../assets/images/logo-big.png';
import logoLightBig from '../../assets/images/logo-light-big.png';
import forgotPasswordNotificationIcon from '../../assets/icons/red-done-circle-icon.svg';

import './styles.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const currentTheme = document.body.getAttribute('data-theme-mode');

  // const userResetPassword = localStorage.getItem("reset_password");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleLogin = async () => {
    setNotificationVisible(false);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // await dispatch(getProfile()).unwrap();
      setNotificationVisible(true);
    } catch (err) {
      console.error('Login error:', err);
      setNotificationVisible(false);
    }
  };

  return (
    <div className='login-page'>
      <img
        className='logo-big'
        src={
          currentTheme === 'dark' || currentTheme === null
            ? logoBig
            : logoLightBig
        }
        alt='Logo'
      />
      <h1 className='title'>Log in to your account</h1>
      <div className='form'>
        <CustomInput
          label='Email'
          placeholder='example@mail.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error ? true : false}
        />
        {/* <CustomInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ? true : false}
        /> */}
        {error && <p className='error-text'>Error: {error}</p>}
        <div className='login-continue-button-wrapper'>
          <CustomButton
            label='Continue'
            style='red-shadow'
            onClick={handleLogin}
            disabled={status === 'loading'}
          />
        </div>
      </div>{' '}
      {isNotificationVisible && (
        <div className='notification'>
          <img
            className='notification-icon'
            src={forgotPasswordNotificationIcon}
            alt='Notification Icon'
          />
          <p className='notification-text'>
            A link has been sent to your email, allowing you to log in to the
            application. If you haven't received the email, please{' '}
            <a href='mailto:info@redkeyresearch.com' className='text-red'>
              contact support
            </a>
          </p>
        </div>
      )}
      <div className='login-footer'>
        <p className='support-text'>
          Having trouble logging in?{' '}
          <a href='mailto:info@redkeyresearch.com' className='text-red'>
            Contact support.
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
