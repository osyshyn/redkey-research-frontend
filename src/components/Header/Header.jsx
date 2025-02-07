// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser, getProfile } from "../../store/slices/authSlice";
// import DropdownMenu from "../DropdownMenu/DropdownMenu";
// import ProfileSettingsModal from "../ProfileSettingsModal/ProfileSettingsModal";
// import logoHeader from "../../assets/images/logo-header.png";

// import "./styles.scss";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

//   const menuRef = useRef(null);
//   const menuIconRef = useRef(null);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user, status, error } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!user) {
//       dispatch(getProfile());
//     }
//   }, [dispatch, user]);

//   const toggleMenu = () => {
//     setIsMenuOpen((prev) => !prev);
//   };

//   const closeMenu = (e) => {
//     if (
//       menuRef.current &&
//       !menuRef.current.contains(e.target) &&
//       menuIconRef.current &&
//       !menuIconRef.current.contains(e.target)
//     ) {
//       setIsMenuOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("click", closeMenu);

//     return () => {
//       document.removeEventListener("click", closeMenu);
//     };
//   }, []);

//   const handleProfileClick = () => {
//     setIsProfileModalOpen(true);
//     setIsMenuOpen(false);
//   };

//   const handleLogoutClick = async () => {
//     console.log("Logout clicked");
//     try {
//       await dispatch(logoutUser()).unwrap();
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   return (
//     <header className="header">
//       <div className="logo-container">
//         <img src={logoHeader} alt="Logo" className="logo" />
//       </div>
//       <div className="menu-icon" onClick={toggleMenu} ref={menuIconRef}></div>

//       {isMenuOpen && (
//         <DropdownMenu
//           isOpen={isMenuOpen}
//           ref={menuRef}
//           onProfileClick={handleProfileClick}
//           onLogoutClick={handleLogoutClick}
//         />
//       )}

//       {isProfileModalOpen && (
//         <ProfileSettingsModal
//           isOpen={isProfileModalOpen}
//           onClose={() => setIsProfileModalOpen(false)}
//           initialProfile={{
//             first_name: user.first_name,
//             last_name: user.last_name,
//             email: user.email,
//           }}
//         />
//       )}
//     </header>
//   );
// };

// export default Header;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, getProfile } from "../../store/slices/authSlice";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import ProfileSettingsModal from "../ProfileSettingsModal/ProfileSettingsModal";
import logoHeader from "../../assets/images/logo-header.png";

import "./styles.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const menuRef = useRef(null);
  const menuIconRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      menuIconRef.current &&
      !menuIconRef.current.contains(e.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoHeader} alt="Logo" className="logo" />
      </div>

      <nav className="nav-links">
        <span
          className={`nav-link ${
            location.pathname === "/admin/portal" ? "active" : ""
          }`}
          onClick={() => navigate("/admin/portal")}
        >
          Research files
        </span>
        <span
          className={`nav-link ${
            location.pathname === "/admin/user-management" ? "active" : ""
          }`}
          onClick={() => navigate("/admin/user-management")}
        >
          User management
        </span>
      </nav>

      <div className="menu-icon" onClick={toggleMenu} ref={menuIconRef}></div>

      {isMenuOpen && (
        <DropdownMenu
          isOpen={isMenuOpen}
          ref={menuRef}
          onProfileClick={handleProfileClick}
          onLogoutClick={handleLogoutClick}
        />
      )}

      {isProfileModalOpen && (
        <ProfileSettingsModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          initialProfile={{
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          }}
        />
      )}
    </header>
  );
};

export default Header;
