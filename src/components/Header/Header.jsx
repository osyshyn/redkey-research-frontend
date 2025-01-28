import React, { useState, useRef, useEffect } from "react";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import logoHeader from "../../assets/images/logo-header.png";

import "./styles.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuIconRef = useRef(null);

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

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoHeader} alt="Logo" className="logo" />
      </div>
      <div className="menu-icon" onClick={toggleMenu} ref={menuIconRef}></div>
      {isMenuOpen && <DropdownMenu isOpen={isMenuOpen} ref={menuRef} />}
    </header>
  );
};

export default Header;
