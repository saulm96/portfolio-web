import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./HomeNavigator.css";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/stack", label: "Stack" },
  { href: "/contact", label: "Contact" },
];

interface HomeNavigatorProps {
  isEnabled?: boolean;
}

const HomeNavigator: React.FC<HomeNavigatorProps> = ({ isEnabled = true }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isEnabled && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [isEnabled, shouldAnimate]);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isEnabled) return;
    // Reload page to restart animation
    window.location.reload();
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (!isEnabled) {
      e.preventDefault();
      return;
    }
  };

  // Calculate delay so all borders expand together
  const lastTextFinishTime = (navigationLinks.length - 1) * 0.2 + 0.8;
  const borderStartDelay = lastTextFinishTime + 0.2;

  // Animation variants for even items (from right)
  const evenItemVariants = {
    hidden: { 
      x: "100vw",
      opacity: 0,
      "--border-width": "0vw"
    },
    visible: (index: number) => ({ 
      x: "35vw",
      opacity: 1,
      "--border-width": "40vw",
      transition: {
        x: {
          duration: 0.8,
          ease: "easeOut",
          delay: index * 0.2
        },
        opacity: {
          duration: 2,
          ease: "easeOut",
          delay: index * 0.2 + 0.6
        },
        "--border-width": {
          duration: 0.8,
          ease: "easeOut",
          delay: borderStartDelay
        }
      }
    })
  };

  // Animation variants for odd items (from left)
  const oddItemVariants = {
    hidden: { 
      x: "-100vw",
      opacity: 0,
      "--border-width": "0vw"
    },
    visible: (index: number) => ({ 
      x: "-35vw",
      opacity: 1,
      "--border-width": "40vw",
      transition: {
        x: {
          duration: 0.8,
          ease: "easeOut",
          delay: index * 0.2
        },
        opacity: {
          duration: 2,
          ease: "easeOut",
          delay: index * 0.2 + 0.6
        },
        "--border-width": {
          duration: 0.8,
          ease: "easeOut",
          delay: borderStartDelay
        }
      }
    })
  };

  return (
    <nav className="home-navigator">
      <motion.ul 
        className="home-navigator-list"
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
      >
        {navigationLinks.map((link, index) => (
          <motion.li 
            key={link.href} 
            className="home-navigator-item"
            variants={index % 2 === 0 ? oddItemVariants : evenItemVariants}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            custom={index}
          >
            {link.href === "/" ? (
              <Link 
                to={link.href}
                onClick={handleHomeClick}
                className={`home-navigator-link ${!isEnabled ? 'disabled' : ''}`}
              >
                {link.label}
              </Link>
            ) : (
              <Link 
                to={link.href} 
                onClick={handleLinkClick}
                className={`home-navigator-link ${!isEnabled ? 'disabled' : ''}`}
              >
                {link.label}
              </Link>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </nav>
  );
};

export default HomeNavigator;
