import { useEffect } from "react";
import eventBus from "../utils/eventBus";
import toast from "react-hot-toast";

const TokenExpirationNotifier = () => {
  useEffect(() => {
    const handleTokenExpired = () => {
      toast.error(
        "Your session has expired. Please re-authenticate the affected account.",
        {
          duration: 6000,
        }
      );
    };

    eventBus.on("token-expired", handleTokenExpired);

    return () => {
      eventBus.off("token-expired", handleTokenExpired);
    };
  }, []);

  return null;
};

export default TokenExpirationNotifier;