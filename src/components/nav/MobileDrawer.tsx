import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { MOBILE_DRAWER_LINKS } from "../../config/navigation";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const navItems = MOBILE_DRAWER_LINKS;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-[60]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[60] p-6"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between mb-8">
              <img
                src="https://i.imgur.com/0rT90fF.png"
                alt="Logo"
                className="w-8 h-8"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className="flex items-center space-x-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.name}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
