import { Link, useLocation } from "react-router-dom";

import LanguageToggleButton from "../ToggleLanguageButton/ToggleLanguageButton";
import DropdownMenuButton from "../MobileDropdownMenuButton/DropdownMenuButton";
import useViewport from "../../hooks/useViewport";

import "./navBar.css";
import NavBarAvatar from "../../assets/avatarOP.png";

const desktopNavLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/stack", label: "Stack" },
  { href: "/contact", label: "Contact" },
];

const NavBar: React.FC = () => {
  const { isMobile } = useViewport(768);
  const location = useLocation();
  return (
    <>
      <nav className="nav-bar">
        <div className="navBarWrapper">
          <img src={NavBarAvatar} alt="avatar" className="navBarAvatar" />
          {!isMobile && (
            <div className="navBar-link-section">
              <ul className="desktop-nav-links">
                {desktopNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={
                        location.pathname === link.href ? "active-link" : ""
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="navbar-right-section">
            {isMobile && <DropdownMenuButton />}
            <LanguageToggleButton />
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
