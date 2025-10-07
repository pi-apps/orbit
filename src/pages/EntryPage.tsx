import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserGlobalData } from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import LoadingIndicator from "../components/LoadingIndicator";

const EntryPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginState = async () => {
      const isSignedIn = localStorage.getItem("isSignedIn");
      if (isSignedIn === "true") {
        setLoading(true);
        try {
          const userGlobalData = await orbitProvider.signInWithPi();
          if (userGlobalData.isNewUser===true) {
              navigate("/login");
          }else{
            dispatch(setUserGlobalData(userGlobalData));
            navigate("/dashboard");

          }
        } catch (error) {
          console.error("Auto sign-in failed", error);
          localStorage.removeItem("isSignedIn");
          navigate("/login");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login");
      }
    };

    checkLoginState();
  }, [navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingIndicator />
    </div>
  );
};

export default EntryPage;
