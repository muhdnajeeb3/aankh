import React from "react";
import logo from "./../../assets/logofont.svg";
import "./navbar.css";

const NavLinks = () => (
  <>
    <p>
      <a href="/">Blog</a>
    </p>
    <p>
      <a href="/">Product</a>
    </p>
    <p>
      <a href="/">Community</a>
    </p>
    <p>
      <a href="/">Pricing</a>
    </p>
    <p>
      <a href="/">Contact Us</a>
    </p>
    <p>
      {localStorage.getItem("user_name") ? (
        localStorage.getItem("user_name")
      ) : (
        <a href="/login">Login</a>
      )}
    </p>
  </>
);

const Navbar = () => {
  return (
    <div className="landing-navbar">
      <div className="landing-navbar-logo">
        <img src='https://www.schneideit.com/wp-content/uploads/2020/12/schneide-logo.svg' alt="schneidiet-logo" />
      </div>
      <div className="landing-navbar-links">
        <NavLinks />
      </div>
    </div>
  );
};

export default Navbar;
