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
import "./styles.scss";

const MagicLoginPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector(selectAuth);
  // const userResetPassword = localStorage.getItem("reset_password");

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
      handleUserRedirect();
    }
  }, [status, user]);

  const handleUserRedirect = () => {
    console.log("Processing redirect for user:", user);

    if (user.role === 3) {
      handleAdminRedirect();
    } else if (user.role === 2) {
      handleAdminRedirect();
    } else if (user.role === 1) {
      handleUserPortalRedirect();
    }
  };

  const handleAdminRedirect = () => {
    console.log('ADMIN REDIRECT');
    
    dispatch(setCurrentFirm({ name: "All" }));
    navigate("/admin/portal");
  };

  const handleUserPortalRedirect = () => {
    const activeAccess = user.access.find((access) => access.value === true);
    if (activeAccess) {
      dispatch(setCurrentFirm(activeAccess.firm));
    }
    navigate("/user/portal");
  };

  const renderContent = () => {
    if (status === "loading") {
      return <Loader />;
    }

    if (error) {
      return (
        <div className="error-container">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <p>Please try again or contact support.</p>
        </div>
      );
    }

    if (status === "succeeded") {
      return (
        <div className="success-container">
          <h2>Authentication Successful!</h2>
          <p>Redirecting to your dashboard...</p>
        </div>
      );
    }

    return (
      <div className="invalid-container">
        <h2>Invalid Authentication Link</h2>
        <p>Please check your email for a valid magic link.</p>
      </div>
    );
  };

  return <div className="magic-login-container">{renderContent()}</div>;
};

export default MagicLoginPage;
