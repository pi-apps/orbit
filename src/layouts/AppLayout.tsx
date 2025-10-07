import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CreateFAB from "../components/CreateFAB";
import DesktopHeader from "../components/nav/DesktopHeader";
import DesktopNav from "../components/nav/DesktopNav";
import MobileNav from "../components/nav/MobileNav";
import MobileTopNav from "../components/nav/MobileTopNav";
import { EXCLUDED_ROUTES } from "../config/navigation";
import useMediaQuery from "../hooks/useMediaQuery";
import eventBus from "../utils/eventBus";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const enterFullscreen = () => {
      setIsFullscreen(true);
    };
    const exitFullscreen = () => {
      setIsFullscreen(false);
    };

    eventBus.on("fullscreen:enter", enterFullscreen);
    eventBus.on("fullscreen:exit", exitFullscreen);

    return () => {
      eventBus.off("fullscreen:enter", enterFullscreen);
      eventBus.off("fullscreen:exit", exitFullscreen);
    };
  }, []);

  const mobileFullscreen = !isDesktop && isFullscreen; // ✅ fullscreen only for mobile
  const shouldShowNav = !EXCLUDED_ROUTES.includes(location.pathname);

  if (!shouldShowNav) return <>{children}</>;

  return (
    <div
      className={`flex min-h-screen ${
        mobileFullscreen ? "overflow-hidden" : ""
      }`}
    >
      {/* Desktop sidebar (only shown when desktop & not fullscreen) */}
      {isDesktop && (
        <aside className="w-60 flex-shrink-0 hidden md:block">
          <DesktopNav />
        </aside>
      )}

      {/* MAIN: flexible, fills remaining space */}
      <main
        className={`flex-1 flex flex-col min-h-screen w-full ${
          !isDesktop && !mobileFullscreen ? "pt-16 pb-28" : ""
        }`}
      >
        {isDesktop && <DesktopHeader />}
        <div className="w-full h-full min-h-screen">{children}</div>
      </main>

      {/* Mobile navs (hidden on desktop or fullscreen mobile) */}
      {!isDesktop && !mobileFullscreen && (
        <div className="md:hidden">
          <MobileTopNav />
          <CreateFAB />
          <MobileNav />
        </div>
      )}
    </div>
  );
};

export default AppLayout;
