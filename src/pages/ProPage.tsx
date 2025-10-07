import React, { useEffect, useState } from "react";
import OrbitProModal from "../components/OrbitProModal";
import { useNavigate } from "react-router-dom";

const ProPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/dashboard"); // Redirect to dashboard after closing modal
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center">Orbit Pro</h1>
        <p className="text-center text-lg mt-4">
          Unlock the full potential of Orbit.
        </p>
      </div>
      <OrbitProModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ProPage;
