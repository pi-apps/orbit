import { motion } from "framer-motion";
import { Menu, User as UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectUserGlobalData } from "../../store/orbitSlice";
import MobileDrawer from "./MobileDrawer";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { DEFAULT_BOT_PLACEHOLDER_IMAGE_URL } from "../../utils/constants";
import PiIcon from "../PiIcon";
import eventBus from "../../utils/eventBus";

const MobileTopNav: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const userGlobalData = useSelector(selectUserGlobalData);
  const [piBalance, setPiBalance] = useState(
    userGlobalData?.userData?.piBalance ?? 0
  );

  useEffect(() => {
    setPiBalance(userGlobalData?.userData?.piBalance ?? 0);
  }, [userGlobalData?.userData?.piBalance]);

  useEffect(() => {
    const handleBalanceUpdate = (newBalance: number) => {
      setPiBalance(newBalance);
    };
    eventBus.on("balanceUpdate", handleBalanceUpdate);
    return () => {
      eventBus.off("balanceUpdate", handleBalanceUpdate);
    };
  }, []);
  const navigate = useNavigate()
  const avatarUrl = userGlobalData?.userData?.avatarUrl || userGlobalData?.user?.photoURL;
const goToWalletPage = ()=>{
  navigate("/wallet")
}
  return (
    <>
      <motion.div
        className="md:hidden w-full fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm shadow-md z-50 flex items-center justify-between px-4 gap-3"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button onClick={() => setIsDrawerOpen(true)} className="flex-shrink-0">
          <Menu className="w-6 h-6 text-black" strokeWidth={1.5} />
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-2">
          <WorkspaceSwitcher />
        </div>

        <div onClick={goToWalletPage} className="flex items-center gap-1 bg-slate-100 rounded-full px-2.5 py-1 border border-slate-200 flex-shrink-0">
          <PiIcon size="w-4 h-4" />
          <span className="font-semibold text-slate-700 text-xs whitespace-nowrap">
            {piBalance?.toFixed(2)}
          </span>
        </div>

        <Link to="/profile" className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : userGlobalData?.user ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-gray-500" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          )}
        </Link>
      </motion.div>
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default MobileTopNav;