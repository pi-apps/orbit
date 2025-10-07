"use client";

import { ChevronRight, Zap } from "lucide-react";
import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { DESKTOP_NAV_LINKS } from "../../config/navigation";

const NavItemComponent: React.FC<{
  href: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick?: () => void;
}> = ({ href, name, icon: Icon, isActive, onClick }) => {
  return (
    <div>
      <Link
        to={href}
        onClick={onClick}
        className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-200 
                   relative overflow-hidden border ${
                     isActive
                       ? // simplified active state to use blue on white
                         "text-black bg-blue-50 border-blue-200 shadow-sm"
                       : // improved hover state with better contrast
                         "text-gray-700 hover:text-black hover:bg-gray-100 border-transparent hover:border-gray-200"
                   }`}
      >
        <Icon
          className={`w-4 h-4 mr-3 transition-colors duration-200 ${
            isActive
              ? // blue icon for active state
                "text-blue-600"
              : // darker icon colors for better visibility
                "text-gray-500 group-hover:text-black"
          }`}
        />

        <span className="font-medium text-sm flex-1">{name}</span>

        <ChevronRight
          className={`w-4 h-4 transform transition-all duration-200 ${
            isActive
              ? // blue chevron for active state
                "opacity-60 translate-x-1 text-blue-600"
              : // improved chevron visibility on hover
                "opacity-0 group-hover:opacity-70 group-hover:translate-x-1 text-gray-600"
          }`}
        />

        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
        )}
      </Link>
    </div>
  );
};

const DesktopNav: React.FC = () => {
  const location = useLocation();

  const navLinks = DESKTOP_NAV_LINKS;

  return (
    <>
      <div
        className="hidden md:flex flex-col w-60 h-screen 
                 bg-white text-gray-900 p-4 fixed z-30
                 border-r border-gray-200 shadow-sm"
      >
        <div className="flex items-center mb-8 cursor-pointer p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-600">Orbit</h1>
            <p className="text-xs text-gray-500 font-medium">
              Post once, share everywhere
            </p>
          </div>
        </div>

        <nav className="flex flex-col flex-grow space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavItemComponent
              key={link.href}
              href={link.href}
              name={link.name}
              icon={link.icon}
              isActive={location.pathname === link.href}
            />
          ))}
        </nav>
      </div>
    </>
  );
};

export default DesktopNav;
