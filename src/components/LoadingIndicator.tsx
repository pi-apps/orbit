import React from "react";
import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  size?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "w-8 h-8",
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center justify-center h-full"
  >
    <div className="text-center">
      <div className="relative">
        <div className={`${size} mx-auto relative`}>
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-500 animate-spin animate-reverse"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default LoadingIndicator;
