import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="#01579b light-blue darken-4">
      <div className="nav-wrapper">
        <Link to={"/"} className="brand-logo">
          Course Finder ChatBot
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-abd-down">
          <li>
            <Link to={"/login"}>Log In</Link>
          </li>
          <li>
            <Link to={"/signup"}>Sign Up</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
