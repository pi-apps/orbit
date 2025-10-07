"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Plus, Send, ImageIcon, Video, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import eventBus from "../utils/eventBus";

interface FabConfig {
  icon: string;
  text?: string;
  action: () => void;
}

type GeneratorType = "image" | "video" | "image-editing";

interface GeneratorOption {
  type: GeneratorType;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const CreateFAB: React.FC = () => {
  const [config, setConfig] = useState<FabConfig | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isCreatePage =
    location.pathname === "/create" ||
    location?.pathname === "/create-automation";

  const defaultConfig: FabConfig = {
    icon: "Plus",
    action: () => navigate("/create"), // Direct navigation to /create
  };

  useEffect(() => {
    const handleConfig = (newConfig: FabConfig) => setConfig(newConfig);
    const handleReset = () => setConfig(null);

    eventBus.on("fab:config", handleConfig);
    eventBus.on("fab:reset", handleReset);

    return () => {
      eventBus.off("fab:config", handleConfig);
      eventBus.off("fab:reset", handleReset);
    };
  }, []);

  const currentConfig = config && isCreatePage ? config : defaultConfig;

  const fabContent = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 400, damping: 15 },
  };

  const renderIcon = () => {
    switch (currentConfig.icon) {
      case "Send":
      case "generate":
        return <Send className="w-6 h-6 text-white" />;
      default:
        return <Plus className="w-8 h-8 text-white" />;
    }
  };

  const FabButton = () => (
    <motion.button
      onClick={currentConfig.action}
      className={`${currentConfig.text ? "w-auto px-6" : "w-16"} h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {renderIcon()}
      {currentConfig.text && (
        <span className="ml-2 text-white font-semibold">
          {currentConfig.text}
        </span>
      )}
    </motion.button>
  );

  return (
    <motion.div
      className="md:hidden fixed bottom-24 right-6 z-20"
      variants={fabContent}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <AnimatePresence mode="wait">
        return (
        <motion.div
          className="md:hidden fixed bottom-24 right-6 z-20"
          variants={fabContent}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <AnimatePresence mode="wait">
            {!isCreatePage && <FabButton />}
          </AnimatePresence>
        </motion.div>
        );
      </AnimatePresence>
    </motion.div>
  );
};

export default CreateFAB;
