import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Zap, PlusCircle, Check, Building } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserGlobalData } from "../../store/orbitSlice";
import orbitProvider from "../../backend/OrbitProvider";
import { Workspace } from "../../types";
import { motion, AnimatePresence } from "framer-motion";

const WorkspaceSwitcher: React.FC = () => {
  const userGlobalData = useSelector(selectUserGlobalData);
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const navigate = useNavigate();
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (userGlobalData?.user) {
        const userWorkspaces = await orbitProvider.getWorkspacesForUser(
          userGlobalData.user.uid
        );
        setWorkspaces(userWorkspaces);
      }
    };
    fetchWorkspaces();
  }, [userGlobalData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSwitchWorkspace = async (workspaceId: string) => {
    if (userGlobalData?.user) {
      await orbitProvider.updateActiveWorkspace(
        userGlobalData.user.uid,
        workspaceId
      );
      window.location.reload();
    }
  };

  const activeWorkspace = userGlobalData?.workspace;

  return (
    <div className="relative" ref={switcherRef}>
      <div
        className="flex items-center cursor-pointer px-2 py-1.5 rounded-lg
                    bg-white/70 
                    hover:bg-white/90 
                    border border-slate-200/60 
                    hover:border-slate-300/80 
                    shadow-sm hover:shadow-md 
                    transition-all duration-200 backdrop-blur-sm active:scale-98
                    min-w-0 max-w-[180px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="w-7 h-7
                      bg-gradient-to-br from-blue-500/80 via-indigo-500/80 to-purple-600/80 
                      rounded-lg 
                      flex items-center justify-center 
                      mr-2
                      shadow-sm ring-1 ring-white/10
                      flex-shrink-0"
        >
          {activeWorkspace?.imageUrl ? (
            <img
              src={activeWorkspace.imageUrl}
              alt={activeWorkspace.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Zap className="w-3 h-3 text-white drop-shadow-sm" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-medium text-slate-800 truncate leading-tight">
            {activeWorkspace?.name || "My Workspace"}
          </h2>
          <p className="text-[10px] text-slate-500 font-normal truncate">
            {activeWorkspace?.description || "Personal"}
          </p>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1 p-0.5 rounded-md hover:bg-slate-100/60 transition-colors flex-shrink-0"
        >
          <ChevronDown className="w-3 h-3 text-slate-400 hover:text-slate-600" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 bg-white/95
                       border border-slate-200/70
                       rounded-lg shadow-lg backdrop-blur-sm z-10
                       w-[280px]"
            onClick={() => setIsOpen(false)}
          >
            <div className="p-2">
              <button
                className="w-full flex items-center p-2 rounded-md text-sm font-medium
                           text-slate-700
                           hover:bg-slate-100/70 
                           transition-colors"
                onClick={() => navigate("/onboarding")}
              >
                <PlusCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Add New Workspace</span>
              </button>
            </div>
            <div className="border-t border-slate-200/60 my-1" />
            <div className="p-2 max-h-60 overflow-y-auto">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="flex items-center justify-between p-2 rounded-md cursor-pointer
                             hover:bg-slate-100/70
                             transition-colors
                             min-w-0"
                  onClick={() => handleSwitchWorkspace(workspace.id)}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div
                      className="w-7 h-7 rounded-md bg-slate-200/60
                                    flex items-center justify-center mr-3 flex-shrink-0"
                    >
                      {workspace.imageUrl ? (
                        <img
                          src={workspace.imageUrl}
                          alt={workspace.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <Building className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {workspace.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {workspace.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {activeWorkspace?.id === workspace.id && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceSwitcher;