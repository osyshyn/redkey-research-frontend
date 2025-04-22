import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import redkeyLogoIcon from '../../assets/homepage-icons/Redkey_Logo.svg';
import arrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import './styles.scss';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const pathname = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <div className='privacy-page-header'>
        <div
          className='privacy-back-button-wrapper'
          onClick={() => navigate('/')}
        >
          <img src={arrowLeftIcon} className='privacy-back-button-icon' />
          <p className='privacy-back-button-text'>Back to Home Page</p>
        </div>

        <img src={redkeyLogoIcon} className='privacy-redkey-logo-icon' />
      </div>
      <div className='privacy-policy-container'>
        <h1>Privacy Policy</h1>
        <p>
          At <strong>Redkey Research</strong>, we value your privacy and are
          committed to protecting your personal information. This Privacy Policy
          outlines how we collect, use, and safeguard your data when you access
          our website or services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> When you request access to
            our services or contact us, we may collect your name, email address,
            phone number, and any other personal details you provide.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect information about how
            you access and use our website, including your IP address, browser
            type, and browsing activity.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>To provide and improve our services.</li>
          <li>To respond to your inquiries and requests.</li>
          <li>
            To send you important updates and information regarding our
            services.
          </li>
          <li>To monitor and analyze usage trends for our website.</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We take reasonable precautions to protect your personal information
          from unauthorized access, use, or disclosure. However, no method of
          internet transmission or electronic storage is 100% secure, and we
          cannot guarantee absolute security.
        </p>

        <h2>4. Third-Party Services</h2>
        <p>
          We may share your information with third-party service providers to
          perform functions on our behalf, such as hosting our website,
          analyzing data, or providing customer support. These service providers
          are only allowed to use your information for specific purposes and
          must adhere to privacy and confidentiality obligations.
        </p>

        <h2>5. Cookies</h2>
        <p>
          We may use cookies to enhance your experience on our website. Cookies
          are small data files that are stored on your device. You can control
          cookie settings through your browser, but disabling cookies may affect
          some features of our website.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access, correct, or delete your personal information.</li>
          <li>Opt-out of marketing communications at any time.</li>
          <li>Request more information about how we use your data.</li>
        </ul>
        <p>
          To exercise these rights, please contact us at{' '}
          <a href='mailto:info@redkeyresearch.com'>info@redkeyresearch.com</a>
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated effective date. We encourage
          you to review this policy periodically.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or wish to
          exercise your rights, please contact us at:
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href='mailto:info@redkeyresearch.com'>info@redkeyresearch.com</a>
        </p>
        <p>
          <strong>Phone:</strong> 646-631-0560
        </p>

        <p>© 2025 Redkey Research</p>
      </div>{' '}
    </>
  );
};

export default PrivacyPolicy;
