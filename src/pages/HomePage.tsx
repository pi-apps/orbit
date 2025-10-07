import React, { useEffect, useState } from "react";
import AutomationModal from "../components/AutomationModal";

const HomePage: React.FC = () => {
  const [showAutomationModal, setShowAutomationModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const hasSeenModal = localStorage.getItem("hasSeenAutomationModal");
    if (!hasSeenModal) {
      setShowAutomationModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowAutomationModal(false);
    localStorage.setItem("hasSeenAutomationModal", "true");
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      {showAutomationModal && <AutomationModal onClose={handleCloseModal} />}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center">Home Page</h1>
      </div>
    </div>
  );
};

export default HomePage;