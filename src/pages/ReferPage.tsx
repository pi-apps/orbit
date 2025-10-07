import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserGlobalData } from "../store/orbitSlice";

const ReferPage: React.FC = () => {
  const navigate = useNavigate();
  const userGlobalData = useSelector(selectUserGlobalData);
  const userData = userGlobalData?.userData;
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const referralLink = `https://tryorbit.web.app/register?ref=${userData?.username}`;
  const bonusAmount = 0.0; // Updated from 0.0 to make it more attractive
  const referralStats = {
    totalReferrals: 0 || 0,
    totalEarned: 0 || 0,
    pendingReferrals: 0 || 0,
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareMessage = `🚀 Join me on Orbit - the ultimate content creation platform! Get ${bonusAmount} free Pi when you sign up with my link: ${referralLink}`;

  const handleSocialShare = (platform: string) => {
    setShareMethod(platform);
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareMessage)}`;
        break;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Earn{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {bonusAmount} Pi
            </span>{" "}
            for Every Friend
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share Orbit with your friends and both get rewarded! The more you
            refer, the more you earn.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Referral Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Referrals</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {referralStats.totalReferrals}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Earned</span>
                  <span className="text-2xl font-bold text-green-600">
                    {referralStats.totalEarned} Pi
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="text-lg font-semibold text-orange-600">
                    {referralStats.pendingReferrals}
                  </span>
                </div>
              </div>
            </div>

            {/* Rewards Tier */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">
                🎯 Bonus Milestones
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>5 referrals</span>
                  <span className="font-semibold">+50 Pi bonus</span>
                </div>
                <div className="flex justify-between">
                  <span>10 referrals</span>
                  <span className="font-semibold">+150 Pi bonus</span>
                </div>
                <div className="flex justify-between">
                  <span>25 referrals</span>
                  <span className="font-semibold">+500 Pi bonus</span>
                </div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{
                    width: `${Math.min((referralStats.totalReferrals / 5) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs mt-2 text-purple-100">
                {5 - referralStats.totalReferrals > 0
                  ? `${5 - referralStats.totalReferrals} more referrals to next bonus!`
                  : "Bonus unlocked! 🎉"}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Referral Link Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Personal Referral Link
              </h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-transparent text-gray-700 text-sm lg:text-base focus:outline-none"
                  />
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    {copied ? (
                      <>
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="hidden sm:inline">Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Share on Social Media
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    {
                      name: "WhatsApp",
                      icon: "💬",
                      color: "bg-green-500 hover:bg-green-600",
                      key: "whatsapp",
                    },
                    {
                      name: "Twitter",
                      icon: "🐦",
                      color: "bg-blue-400 hover:bg-blue-500",
                      key: "twitter",
                    },
                    {
                      name: "Facebook",
                      icon: "📘",
                      color: "bg-blue-600 hover:bg-blue-700",
                      key: "facebook",
                    },
                    {
                      name: "LinkedIn",
                      icon: "💼",
                      color: "bg-blue-700 hover:bg-blue-800",
                      key: "linkedin",
                    },
                    {
                      name: "Telegram",
                      icon: "✈️",
                      color: "bg-blue-500 hover:bg-blue-600",
                      key: "telegram",
                    },
                  ].map((social) => (
                    <button
                      key={social.key}
                      onClick={() => handleSocialShare(social.key)}
                      className={`${social.color} text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 flex flex-col items-center space-y-1`}
                    >
                      <span className="text-2xl">{social.icon}</span>
                      <span className="text-xs font-medium">{social.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Share Your Link
                    </h3>
                    <p className="text-gray-600">
                      Copy your personal referral link and share it with friends
                      via social media, email, or messaging apps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Friend Signs Up
                    </h3>
                    <p className="text-gray-600">
                      Your friend clicks your link, creates a new Orbit account,
                      and completes their profile setup.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Both Earn Rewards
                    </h3>
                    <p className="text-gray-600">
                      You both receive{" "}
                      <span className="font-bold text-indigo-600">
                        {bonusAmount} Pi instantly
                      </span>{" "}
                      once they verify their account. Plus, earn milestone
                      bonuses as you refer more friends!
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ready to Start Earning?
                </h3>
                <p className="text-gray-600 mb-4">
                  Share your link now and watch your Pi balance grow!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleCopyToClipboard}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    {copied ? "✅ Link Copied!" : "📋 Copy Link Again"}
                  </button>
                  <button
                    onClick={() => handleSocialShare("whatsapp")}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    💬 Share on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="max-w-4xl mx-auto mt-8 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📋 Referral Terms
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • Both you and your friend must have verified accounts to receive
              rewards
            </li>
            <li>
              • Referral bonuses are credited within 24 hours of successful
              signup
            </li>
            <li>
              • Self-referrals and fake accounts are prohibited and will result
              in account suspension
            </li>
            <li>
              • Milestone bonuses are awarded automatically when you reach the
              required number of referrals
            </li>
            <li>
              • Orbit reserves the right to modify referral rewards at any time
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferPage;
