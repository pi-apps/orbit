import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OauthConfirmPage = () => {
  const location = useLocation();

  useEffect(() => {
    // In a real application, you would parse the query parameters from the URL,
    // send them to your backend to exchange for an access token,
    // and then store the token securely.
    console.log("OAuth callback received:", location.search);
  }, [location]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Finalizing Connection...
        </h1>
        <p className="text-gray-600">
          Please wait while we securely connect your account.
        </p>
      </div>
    </div>
  );
};

export default OauthConfirmPage;
