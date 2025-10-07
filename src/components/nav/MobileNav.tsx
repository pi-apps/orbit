"use client";

import type React from "react";
import { MOBILE_NAV_LINKS } from "../../config/navigation";
import NavItem from "./NavItem";
import { motion } from "framer-motion";

const MobileNav: React.FC = () => {
  const regularItems = MOBILE_NAV_LINKS;
  return (
    <motion.div
      // UPDATED CLASSES HERE
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg z-50"
      style={{
        paddingBottom: "22px",
        paddingTop: "8px", // Good for iOS home indicator spacing
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-4">
        {regularItems.map((link) => (
          <NavItem key={link.href} {...link} />
        ))}
      </div>
    </motion.div>
  );
};

export default MobileNav;
