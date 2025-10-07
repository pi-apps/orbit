"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles, Zap, Shield, Code } from "lucide-react";

export default function RegisterPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();

  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocking an async registration
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("isSignedIn", "true");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 font-sans text-white"></div>
  );
}
