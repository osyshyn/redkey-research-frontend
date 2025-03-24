// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getProfile,
//   loginUser,
//   selectAuth,
//   clearAuthError,
// } from "../../store/slices/authSlice";
// import Loader from "../../components/Loader/Loader";
// import { setCurrentFirm } from "../../store/slices/firmSlice";
// import { checkMagicLink } from "../../store/slices/authSlice";
// import CustomInput from "../../components/CustomInput/CustomInput";
// import CustomButton from "../../components/CustomButton/CustomButton";
// import logoBig from "../../assets/images/logo-big.png";
// import logoLightBig from "../../assets/images/logo-light-big.png";

// import "./styles.scss";

// const MagicLoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//     const [tokenResponse, setTokenResponse] = useState(null);
//       const [isTokenValid, setIsTokenValid] = useState(null);

//   const token = new URLSearchParams(window.location.search).get("token");

//   const currentTheme = document.body.getAttribute("data-theme-mode");

//   const userResetPassword = localStorage.getItem("reset_password");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, status, error } = useSelector(selectAuth);

//     useEffect(() => {
//       dispatch(clearAuthError());

//       if (token) {
//         checkMagicLink(token)
//           .then((response) => {
//             setTokenResponse(response);
//             setIsTokenValid(true);
//           })
//           .catch(() => setIsTokenValid(false));
//       } else {
//         setIsTokenValid(false);
//       }
//     }, [dispatch, token]);

//   // useEffect(() => {
//   //   if (status === "succeeded") {
//   //     dispatch(getProfile());
//   //   }
//   // }, [status, dispatch]);

//   useEffect(() => {
//     if (status === "succeeded" && user) {
//       console.log("UUUUUU", user, userResetPassword);

//       if (user.role !== 3 && userResetPassword === "true") {
//         navigate("/set-your-password");
//       } else if (user.role === 3) {
//         navigate("/admin/portal");
//         dispatch(setCurrentFirm({ name: "All" }));
//       } else if (user.role === 2 && userResetPassword === "false") {
//         navigate("/admin/portal");
//         dispatch(setCurrentFirm({ name: "All" }));
//       } else if (user.role === 1 && userResetPassword === "false") {
//         const activeAccess = user.access.find(
//           (access) => access.value === true
//         );
//         if (activeAccess) {
//           dispatch(setCurrentFirm(activeAccess.firm));
//         }

//         navigate("/user/portal");
//       }
//     }
//   }, [status, user, navigate, userResetPassword]);

//   const handleLogin = async () => {
//     try {
//       await dispatch(loginUser({ email, password })).unwrap();
//       await dispatch(getProfile()).unwrap();
//     } catch (err) {
//       console.error("Login error:", err);
//     }
//   };

//   return (
//     <div className="login-page">
//       <Loader />

//     </div>
//   );
// };

// export default MagicLoginPage;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import {
  checkMagicLink,
  clearAuthError,
  getProfile,
  selectAuth,
} from "../../store/slices/authSlice";
import { setCurrentFirm } from "../../store/slices/firmSlice";

import forgotPasswordNotificationIcon from "../../assets/icons/red-done-circle-icon.svg";

import "./styles.scss";

const MagicLoginPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector(selectAuth);

  useEffect(() => {
    const verifyMagicToken = async () => {
      try {
        dispatch(clearAuthError());

        if (!token) {
          throw new Error("Missing authentication token");
        }

        await dispatch(checkMagicLink({ token })).unwrap();

        await dispatch(getProfile()).unwrap();
      } catch (err) {
        console.error("Magic link verification failed:", err);
      }
    };

    if (token) {
      verifyMagicToken();
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (status === "succeeded" && user) {
      if (user.role === 3) {
        navigate("/admin/portal");
        dispatch(setCurrentFirm({ name: "All" }));
      } else if (user.role === 2) {
        navigate("/admin/portal");
        dispatch(setCurrentFirm({ name: "All" }));
      } else if (user.role === 1) {
        const activeAccess = user.access.find(
          (access) => access.value === true
        );
        if (activeAccess) {
          dispatch(setCurrentFirm(activeAccess.firm));
        }

        navigate("/user/portal");
      }
    }
  }, [status, user, navigate]);

  const renderContent = () => {
    if (status === "loading") {
      return <Loader />;
    }

    if (error) {
      return (
        <div className="notification">
          <img
            className="notification-icon"
            src={forgotPasswordNotificationIcon}
            alt="Notification Icon"
          />
          <p className="notification-text">
            Authentication Error Please try again or{" "}
            <a href="mailto:info@redkeyresearch.com" className="text-red">
              contact support
            </a>
          </p>
        </div>
      );
    }

    return (
      <div className="notification">
        <img
          className="notification-icon"
          src={forgotPasswordNotificationIcon}
          alt="Notification Icon"
        />
        <p className="notification-text">
          Invalid Authentication Link. Please check your email for a valid magic
          link.
        </p>
      </div>
    );
  };

  return <div className="magic-login-container">{renderContent()}</div>;
};

export default MagicLoginPage;
