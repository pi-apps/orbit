import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import orbitProvider from "../backend/OrbitProvider";
import AppLayout from "../layouts/AppLayout"; // Import the AppLayout component
import { selectUserGlobalData, setUserGlobalData } from "../store/orbitSlice";
import { AppDispatch } from "../store/store";
import LoadingIndicator from "./LoadingIndicator";

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const userGlobalData = useSelector(selectUserGlobalData);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setLoading] = React.useState(
    userGlobalData?.userData?.uid ? false : true
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginState = async () => {
      const isSignedIn = localStorage.getItem("isSignedIn");
      if (isSignedIn === "true") {
        setLoading(true);
        try {
          const { isNewUser, ...userGlobalData } =
            await orbitProvider.signInWithPi();
          dispatch(setUserGlobalData(userGlobalData));

          if (isNewUser) {
            const isFirstTime = localStorage.getItem("isFirstTime");
            if (
              isFirstTime !== "false" &&
              !userGlobalData?.userData?.activeWorkspaceId
            ) {
              navigate("/onboarding");
              return;
            }
          }
          setLoading(false);
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
    if (!userGlobalData?.userData?.uid) checkLoginState();
  }, [navigate, dispatch]);

  return isLoading ? (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoadingIndicator />
    </div>
  ) : (
    <AppLayout>{children}</AppLayout>
  ); // Wrap children with AppLayout
};

export default AuthRoute;
