import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./dropdownMenu.css"; 

interface MenuItem {
  href: string;
  label: string;
}

const DropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null); 
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); 

  const menuItems: MenuItem[] = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/stack", label: "Stack" },
    { href: "/contact", label: "Contact" },
  ];

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };
   const handleLinkClick = () => {
    setIsOpen(false); 
  };

 useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen &&
          menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


 return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className={`dropdown-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        type="button"
      >
        <div className="bars" id="bar1"></div>
        <div className="bars" id="bar2"></div>
        <div className="bars" id="bar3"></div>
      </button>

      {isOpen && (
        <div className="dropdown-menu" ref={menuRef} role="menu">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} role="menuitem">
                <Link
                  to={item.href} // Usa 'to' para el componente Link
                  // Añade la clase 'active-dropdown-item' si la ruta actual coincide
                  className={location.pathname === item.href ? "active-dropdown-item" : ""}
                  onClick={handleLinkClick} // Cierra el menú al hacer clic
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;