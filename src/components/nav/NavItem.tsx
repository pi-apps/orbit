import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface NavItemProps {
  href: string;
  name: string;
  icon: React.ElementType;
  isCentral?: boolean;
  isDesktop?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  name,
  icon: Icon,
  isCentral = false,
  isDesktop = false,
}) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  // This part is for a sidebar, updated assuming a light theme sidebar
  if (isDesktop) {
    return (
      <Link
        style={{ paddingBottom: "2px" }}
        to={href}
        // REMOVED: hover:text-indigo-600 hover:bg-gray-100
        className="relative flex items-center justify-start w-full px-4 py-3 my-1 text-gray-600 rounded-lg transition-colors duration-200"
      >
        <Icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : ""}`} />
        <span
          className={`ml-4 text-sm font-medium ${
            isActive ? "text-indigo-600 font-semibold" : "" // Made active text bold
          }`}
        >
          {name}
        </span>
        {isActive && (
          <motion.div
            className="absolute left-0 w-1 h-full bg-indigo-600 rounded-r-full"
            layoutId="active-pill"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    );
  }

  const handleMobileNavClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // The central button usually has a strong brand color, which works
  // on both light and dark backgrounds, so it remains unchanged.
  if (isCentral) {
    return (
      <Link to={href} className="relative" onClick={handleMobileNavClick}>
        <motion.div
          className="flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full shadow-lg -translate-y-6 text-white"
          // REMOVED: whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
      </Link>
    );
  }

  // Mobile Nav Item
  return (
    <Link
      to={href}
      // REMOVED: hover:text-indigo-600
      className="relative flex flex-col items-center justify-center flex-1 text-gray-500 transition-colors duration-200"
      onClick={handleMobileNavClick}
    >
      <Icon
        className={`w-5 h-5 mb-0.5 transition-colors duration-200 ${
          isActive ? "text-indigo-600" : ""
        }`}
      />
      <span
        className={`text-[11px] transition-colors duration-200 ${
          isActive ? "text-indigo-600" : ""
        }`}
      >
        {name}
      </span>
      {isActive && (
        <motion.div
          layoutId="active-pill-mobile"
          className="absolute -bottom-1 w-6 h-0.5 bg-indigo-600 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

export default NavItem;
