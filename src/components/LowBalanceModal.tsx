import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import eventBus from "../utils/eventBus";
import { X, Wallet, AlertTriangle, Zap } from "lucide-react";
import { CreatePayment } from "../utils/PiIntegration";
import orbitProvider from "../backend/OrbitProvider";
import { useDispatch, useSelector } from "react-redux";
import { selectUserGlobalData, setUserData } from "../store/orbitSlice";

const LowBalanceModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const userData = userGlobalData?.userData;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    eventBus.on("showLowBalanceModal", handleOpen);
    return () => {
      eventBus.off("showLowBalanceModal", handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleGoToWallet = () => {
    navigate("/wallet");
    setIsOpen(false);
  };

  const handlePurchase = async (amount: number) => {
    if (!userData) return;
    setIsProcessing(true);
    try {
      await CreatePayment("", amount, "Orbit Pi payment", async () => {
        const newBalance = (userData.piBalance || 0) + amount;
        await orbitProvider.updateUserData(userData.uid, {
          piBalance: newBalance,
        });
        dispatch(setUserData({ ...userData, piBalance: newBalance }));
        alert(
          "🎉 Purchase successful! Your Pi has been added to your account."
        );
        handleClose();
      });
    } catch (error) {
      console.error("Error purchasing Pi:", error);
      alert("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const topUpOptions = [50, 100, 200, 500];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Low Pi Balance
          </h2>
          <p className="text-base text-gray-600 mb-6">
            Your wallet balance is getting low. Top up now to continue using
            AI features without interruption.
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Quick Top-Up
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topUpOptions.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handlePurchase(amount)}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4" />
                  {amount} Pi
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row-reverse sm:gap-4">
            <button
              onClick={handleGoToWallet}
              className="w-full inline-flex justify-center rounded-lg shadow-sm px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all sm:w-auto"
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

export default LowBalanceModal;