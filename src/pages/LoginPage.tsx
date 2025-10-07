"use client";
import { useState, useEffect } from "react";
import { ChevronRight, Orbit, Pi, Eye } from "lucide-react";
import orbitProvider from "../backend/OrbitProvider";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [animate, setAnimate] = useState(false);
  const [piLoading, setPiLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  useEffect(() => {
    setAnimate(true);
  }, []);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setPiLoading(true);
    setError(null);
    try {
      const { isNewUser, userData } = await orbitProvider.signInWithPi();
      localStorage.setItem("isSignedIn", "true");
      const isFirstTime = localStorage.getItem("isFirstTime");
      if (isFirstTime !== "false" && !userData?.activeWorkspaceId) {
        navigate("/onboarding");
        return;
      }
      if (isNewUser) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setPiLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const { isNewUser } = await orbitProvider.signInWithPi(true);
      localStorage.setItem("isSignedIn", "true");
      if (isNewUser) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to access demo.");
    } finally {
      setDemoLoading(false);
    }
  };

  const images = [
    {
      src: "https://cdni.iconscout.com/illustration/premium/thumb/businessman-working-in-office-illustration-svg-download-png-2929000.png",
      alt: "Orbit workspace",
    },
  ];

  return (
    <div className="flex min-h-screen max-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-ping delay-2000"></div>
      </div>

      {/* Creative Visual Section */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 p-6 relative z-10 max-h-screen overflow-hidden">
        <div className="w-full h-full">
          {images.length === 1 ? (
            // Single image fills entire space
            <div
              className="w-full h-full rounded-2xl overflow-hidden relative group cursor-pointer transform transition-all duration-500 ease-out hover:scale-[1.02] hover:rotate-1"
              onMouseEnter={() => setHoveredImage(0)}
              onMouseLeave={() => setHoveredImage(null)}
              style={{
                animation: animate ? "fadeInUp 0.8s ease-out forwards" : "none",
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
              <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <img
                src={images[0].src || "/placeholder.svg"}
                alt={images[0].alt}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  hoveredImage === 0
                    ? "scale-110 brightness-110 saturate-125"
                    : "scale-100"
                }`}
              />
              {/* Glassmorphism overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-white/30 to-transparent backdrop-blur-sm rounded-2xl transition-all duration-500 ${
                  hoveredImage === 0 ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              {/* Sparkle effect */}
              <div
                className={`absolute top-6 right-6 transition-all duration-300 ${
                  hoveredImage === 0
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
              >
                <Orbit size={24} className="text-gray-700/80" />
              </div>
            </div>
          ) : (
            <div className="columns-4 gap-3 h-screen">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden h-1000 mb-3 break-inside-avoid relative group cursor-pointer transform transition-all duration-500 ease-out hover:scale-105 hover:rotate-1"
                  onMouseEnter={() => setHoveredImage(index)}
                  onMouseLeave={() => setHoveredImage(null)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: animate
                      ? "fadeInUp 0.8s ease-out forwards"
                      : "none",
                    opacity: animate ? 1 : 0,
                    transform: animate ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                  <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                      hoveredImage === index
                        ? "scale-110 brightness-110 saturate-125"
                        : "scale-100"
                    }`}
                  />
                  {/* Glassmorphism overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-white/30 to-transparent backdrop-blur-sm rounded-2xl transition-all duration-500 ${
                      hoveredImage === index ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                  {/* Sparkle effect */}
                  <div
                    className={`absolute top-3 right-3 transition-all duration-300 ${
                      hoveredImage === index
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75"
                    }`}
                  >
                    <Orbit size={14} className="text-gray-700/80" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Login Section */}
      <div className="flex flex-1 lg:w-3/5 xl:w-1/2 relative z-10 max-h-screen overflow-hidden">
        <div className="flex flex-col justify-center w-full px-6 py-8 lg:px-8 max-h-screen overflow-hidden">
          {/* Glassmorphism container */}
          <div className="backdrop-blur-2xl bg-white/80 border border-gray-200/50 rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg backdrop-blur-sm">
                  <Orbit size={24} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent">
                  Orbit
                </h1>
              </div>
            </div>

            <div
              className={`transition-all duration-700 ease-out ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-balance leading-tight">
                  Welcome to your workspace
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Write once, share everywhere, track growth, and automate with
                  AI workflows. Your all-in-one social media management tool.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl backdrop-blur-sm">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Main Pi Network Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={piLoading || demoLoading}
                  className="group relative w-full h-16 text-base font-semibold bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-400 hover:via-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-500 disabled:opacity-50 backdrop-blur-sm border border-blue-200/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative flex items-center justify-center">
                    {piLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                          <Pi
                            size={18}
                            className="group-hover:rotate-12 transition-transform duration-300"
                          />
                        </div>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          Continue with Pi Network
                        </span>
                        <ChevronRight
                          size={20}
                          className="ml-3 group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </>
                    )}
                  </div>
                </button>

                {/* Demo Account Button */}
                <button
                  onClick={handleDemoLogin}
                  disabled={piLoading || demoLoading}
                  className="group relative w-full h-14 text-base font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 disabled:opacity-50 backdrop-blur-xl border border-gray-200 hover:border-gray-300 overflow-hidden"
                >
                  {/* Subtle shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                  <div className="relative flex items-center justify-center">
                    {demoLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin mr-3"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center mr-3 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                          <Eye
                            size={14}
                            className="text-gray-600 group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                          Explore with Demo Account
                        </span>
                        <ChevronRight
                          size={18}
                          className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </>
                    )}
                  </div>
                </button>

                {/* Features */}
                <div className="pt-8 space-y-4">
                  {[
                    {
                      color: "bg-green-500",
                      text: "Link your social accounts",
                    },
                    {
                      color: "bg-blue-500",
                      text: "Save time and see what works",
                    },
                    { color: "bg-purple-500", text: "Streamlined workflows" },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600 group cursor-default"
                      style={{
                        animationDelay: `${(index + 1) * 200}ms`,
                        animation: animate
                          ? "fadeInLeft 0.6s ease-out forwards"
                          : "none",
                        opacity: animate ? 1 : 0,
                      }}
                    >
                      <div
                        className={`w-2.5 h-2.5 ${feature.color} rounded-full mr-4 group-hover:scale-125 group-hover:shadow-lg transition-all duration-300`}
                      ></div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By continuing, you agree to our{" "}
                <a
                  href="/tos"
                  className="text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/pp"
                  className="text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Enhanced glassmorphism effects */
        .backdrop-blur-2xl {
          backdrop-filter: blur(40px);
        }

        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
        }

        /* Custom shadow effects */
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
