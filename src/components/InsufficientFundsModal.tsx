import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import eventBus from "../utils/eventBus";
import { X, Wallet, AlertTriangle } from "lucide-react";

const InsufficientFundsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    eventBus.on("showInsufficientFundsModal", handleOpen);
    return () => {
      eventBus.off("showInsufficientFundsModal", handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleGoToWallet = () => {
    navigate("/wallet");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Insufficient Funds
          </h2>
          <p className="text-base text-gray-600 mb-6">
            You do not have enough Pi in your wallet to complete this action.
            Please top up your balance.
          </p>

          <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row-reverse sm:gap-4">
            <button
              onClick={handleGoToWallet}
              className="w-full inline-flex justify-center rounded-lg shadow-sm px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all sm:w-auto"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Go to Wallet
            </button>
            <button
              onClick={handleClose}
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-5 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientFundsModal;