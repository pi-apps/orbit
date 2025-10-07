import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, X } from "lucide-react";

interface AutomationModalProps {
  onClose: () => void;
}

const AutomationModal: React.FC<AutomationModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/automation");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Discover Automations!
        </h2>
        <p className="text-gray-600 mb-6">
          Let our AI handle your social media presence, so you can focus on what matters.
        </p>
        <button
          onClick={handleNavigate}
          className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Explore Automations
        </button>
      </div>
    </div>
  );
};

export default AutomationModal;