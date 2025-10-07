import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserGlobalData, setUserData } from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import { CreatePayment } from "../utils/PiIntegration";

const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const userData = userGlobalData?.userData;
  const [isProcessing, setIsProcessing] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const piOffers = [
    {
      amount: 10,
      price: 10,
      label: "Starter",
      popular: false,
      savings: null,
      description: "Perfect for trying out AI features",
    },
    {
      amount: 100,
      price: 100,
      label: "Growth",
      popular: true,
      savings: "10%",
      description: "Best for regular content creators",
    },
    {
      amount: 1000,
      price: 1000,
      label: "Pro",
      popular: false,
      savings: "20%",
      description: "For power users and agencies",
    },
    {
      amount: 5000,
      price: 5000,
      label: "Enterprise",
      popular: false,
      savings: "30%",
      description: "Maximum value for teams",
    },
  ];

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
      });
    } catch (error) {
      console.error("Error purchasing Pi:", error);
      alert("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomPurchase = async () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (amount < 1) {
      alert("Minimum purchase amount is 1 Pi");
      return;
    }
    if (amount > 10000) {
      alert("Maximum purchase amount is 10,000 Pi");
      return;
    }
    await handlePurchase(amount);
    setCustomAmount("");
  };

  const currentBalance = userData?.piBalance || 0;
  const balanceStatus =
    currentBalance < 10 ? "low" : currentBalance < 50 ? "medium" : "high";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Profile
            </button>

            {/* Pi Logo in Header */}
            <div className="flex items-center">
              <img
                src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                alt="Pi Network"
                className="w-8 h-8"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Balance Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
              alt="Pi Network"
              className="w-12 h-12 mr-3"
            />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Your Pi Wallet
            </h1>
          </div>
          <p className="text-gray-600 mb-6">
            Fuel your content creation with AI-powered tools
          </p>

          <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 to-purple-100 rounded-full -mr-16 -mt-16"></div>
            {/* Pi Logo in Balance Card */}
            <div className="absolute top-4 right-4 opacity-20">
              <img
                src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                alt="Pi Network"
                className="w-16 h-16"
              />
            </div>
            <div className="relative">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 rounded-full mr-2 bg-green-400"></div>
                <span className="text-sm font-medium text-gray-600">
                  Current Balance
                </span>
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-1 flex items-center justify-center">
                {currentBalance.toFixed(2)}
                <div className="flex items-center ml-2">
                  <img
                    src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                    alt="Pi"
                    className="w-8 h-8 mr-1"
                  />
                  <span className="text-2xl lg:text-3xl text-indigo-600">
                    Pi
                  </span>
                </div>
              </div>
              {balanceStatus === "low" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-orange-800">
                    <strong>⚠️ Low Balance:</strong> Top up now to keep using AI
                    features!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Purchase Section */}
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <img
                src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                alt="Pi Network"
                className="w-6 h-6 mr-2"
              />
              <h2 className="text-xl font-bold text-gray-900">Quick Top-Up</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Enter any amount to add Pi to your wallet
            </p>

            <div className="flex flex-col space-y-3">
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount (1 - 10,000)"
                  min="1"
                  max="10000"
                  step="0.01"
                  className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium text-center"
                  disabled={isProcessing}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                  <img
                    src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                    alt="Pi"
                    className="w-5 h-5 mr-1"
                  />
                  <span className="text-indigo-600 font-semibold">Pi</span>
                </div>
              </div>

              <button
                onClick={handleCustomPurchase}
                disabled={
                  isProcessing || !customAmount || parseFloat(customAmount) <= 0
                }
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Pi to Wallet
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500 text-center">
              Secure payment • Instant delivery
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Features Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                  alt="Pi Network"
                  className="w-8 h-8 mr-3"
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  Unlock Premium Features with Pi
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      AI Content Generator
                    </h3>
                    <p className="text-sm text-gray-600">
                      Generate viral posts, captions, and hashtags instantly
                    </p>
                    <div className="flex items-center mt-1">
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                        alt="Pi"
                        className="w-3 h-3 mr-1"
                      />
                      <span className="text-xs text-indigo-600 font-medium">
                        2-5 Pi per use
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Smart Scheduling
                    </h3>
                    <p className="text-sm text-gray-600">
                      Auto-post at optimal times for maximum engagement
                    </p>
                    <div className="flex items-center mt-1">
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                        alt="Pi"
                        className="w-3 h-3 mr-1"
                      />
                      <span className="text-xs text-purple-600 font-medium">
                        1 Pi per scheduled post
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Advanced Analytics
                    </h3>
                    <p className="text-sm text-gray-600">
                      Deep insights and performance tracking
                    </p>
                    <span className="text-xs text-green-600 font-medium">
                      Premium feature
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Premium Templates
                    </h3>
                    <p className="text-sm text-gray-600">
                      Access 500+ professional templates
                    </p>
                    <div className="flex items-center mt-1">
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                        alt="Pi"
                        className="w-3 h-3 mr-1"
                      />
                      <span className="text-xs text-orange-600 font-medium">
                        Unlimited with Pi
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              {/* Pi Logo Background */}
              <div className="absolute top-2 right-2 opacity-10">
                <img
                  src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                  alt="Pi Network"
                  className="w-20 h-20"
                />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-xl font-bold mb-2">Join 50+ Creators</h3>
                  <p className="text-indigo-100">
                    Who are already using Pi to grow their online presence
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm text-indigo-200">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <img
                  src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                  alt="Pi Network"
                  className="w-6 h-6 mr-2"
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  Choose Your Plan
                </h2>
              </div>
              <p className="text-gray-600 text-sm">
                Get more Pi, save more money
              </p>
            </div>

            {piOffers.map((offer, index) => (
              <div
                key={offer.amount}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  offer.popular
                    ? "ring-2 ring-indigo-500 scale-105"
                    : "hover:scale-102"
                }`}
              >
                {offer.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    🔥 MOST POPULAR
                  </div>
                )}

                {/* Pi Logo in Pricing Cards */}
                <div className="absolute top-4 right-4 opacity-10">
                  <img
                    src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                    alt="Pi Network"
                    className="w-12 h-12"
                  />
                </div>

                <div
                  className={`p-6 ${offer.popular ? "pt-12" : ""} relative z-10`}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        {offer.label}
                      </span>
                      {offer.savings && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                          Save {offer.savings}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">
                          {offer.amount}
                        </span>
                        <div className="flex items-center ml-2">
                          <img
                            src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                            alt="Pi"
                            className="w-6 h-6 mr-1"
                          />
                          <span className="text-lg text-indigo-600">Pi</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-700">
                          {offer.price.toFixed(2)}
                        </span>
                        <img
                          src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                          alt="Pi"
                          className="w-5 h-5 ml-1"
                        />
                      </div>
                      <div className="text-xs text-gray-500 flex items-center justify-center">
                        <img
                          src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                          alt="Pi"
                          className="w-3 h-3 mr-1"
                        />
                        Pi {(offer.price / offer.amount).toFixed(3)} per Pi
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {offer.description}
                    </p>

                    <button
                      onClick={() => handlePurchase(offer.amount)}
                      disabled={isProcessing}
                      className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 ${
                        offer.popular
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 hover:border-gray-300"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        `Buy ${offer.label}`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Security Badge */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-xs text-gray-500 mr-2">Secured by the</p>
                <img
                  src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                  alt="Pi Network"
                  className="w-4 h-4 mr-1"
                />
                <p className="text-xs text-gray-500">Pi Blockchain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
