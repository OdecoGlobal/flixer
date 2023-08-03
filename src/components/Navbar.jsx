import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import burger from "../assets/burgerMenu.svg";
import closeIcon from "../assets/closeIcon.svg";
import searchIcon from "../assets/searchIcon.svg";

export default function Navbar({ isOpen, setIsOpen, toggleMenu, close }) {
  const maxWidth = () => {
    return window.matchMedia("(min-width: 1024px)").matches;
  };

  const setWidth = () => {
    if (isOpen && maxWidth()) {
      setIsOpen(!isOpen);
    }
  };
  setWidth();
  window.addEventListener("resize", setWidth);

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.name}>Flixer</h1>
      <div className={styles.navmenu}>
        <div
          className={`${styles["menu-bar"]} ${isOpen ? styles["open"] : ""}`}
          onClick={close}
        >
          <ul className={styles.menu_item}>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/discover">Discover</NavLink>
            </li>
            <li>
              <NavLink to="/movie">Movie Release</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
          </ul>

          <div className={styles.signin}>
            <NavLink to="/signup">
              <button className={`btn btn_secondary`}>Signup</button>
            </NavLink>
            <NavLink to="login">
              <button className={`btn btn_primary`}>Login</button>
            </NavLink>
          </div>
        </div>

        <div className={styles.menu_icon}>
          <img src={searchIcon} alt="search buton" />
        </div>
      </div>

      {/* Burger Menu */}
      <div
        className={`${styles["burger-menu"]} ${isOpen ? styles["open"] : ""}`}
        onClick={toggleMenu}
      >
        {!isOpen && <img src={burger} alt="burger-menu" />}
        {isOpen && <img src={closeIcon} alt="close-menu" />}
      </div>
    </nav>
  );
}
