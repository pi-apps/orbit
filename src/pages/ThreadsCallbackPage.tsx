import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ThreadsCallbackPage: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading"
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    if (statusParam === "success") {
      setStatus("success");
      setTimeout(() => {
        window.open("/accounts", "_blank", "noopener,noreferrer");
      }, 2000);
    } else if (statusParam === "error") {
      setStatus("error");
    }
  }, [location]);

  if (status === "loading") {
    return (
      <div
        style={{
          fontFamily: "sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          margin: 0,
          backgroundColor: "#f0f2f5",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: "white",
          }}
        >
          <h1 style={{ color: "#333" }}>Connecting to Threads...</h1>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          backgroundColor: "white",
        }}
      >
        {status === "success" ? (
          <>
            <h1 style={{ color: "#000000" }}>Threads Connected</h1>
            <p style={{ color: "#333" }}>
              Your Threads account has been successfully linked.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ color: "#e0245e" }}>Connection Failed</h1>
            <p style={{ color: "#333" }}>
              There was an error connecting your Threads account. Please try
              again.
            </p>
          </>
        )}
        <a
          href="/accounts"
          style={{ color: "#000000", textDecoration: "none" }}
        >
          Go to Accounts
        </a>
      </div>
    </div>
  );
};

export default ThreadsCallbackPage;
