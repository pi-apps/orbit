import React, { useEffect } from "react";
import eventBus from "../utils/eventBus";
import {
  X,
  Trash2,
  Share2,
  Copy,
  Edit,
  Pin,
  Flag,
  BarChart3,
} from "lucide-react";

interface PostActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  isMobile?: boolean;
}

const PostActionsModal: React.FC<PostActionsModalProps> = ({
  isOpen,
  onClose,
  onAction,
  isMobile = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      eventBus.emit("fullscreen:enter");
      return () => {
        eventBus.emit("fullscreen:exit");
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "analytics",
      label: "View Analytics",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "hover:bg-blue-50",
    },
    {
      id: "edit",
      label: "Edit Post",
      icon: Edit,
      color: "text-green-600",
      bgColor: "hover:bg-green-50",
    },
    {
      id: "pin",
      label: "Pin Post",
      icon: Pin,
      color: "text-purple-600",
      bgColor: "hover:bg-purple-50",
    },
    {
      id: "share",
      label: "Share Post",
      icon: Share2,
      color: "text-indigo-600",
      bgColor: "hover:bg-indigo-50",
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Copy,
      color: "text-gray-600",
      bgColor: "hover:bg-gray-50",
    },
    {
      id: "report",
      label: "Report Post",
      icon: Flag,
      color: "text-orange-600",
      bgColor: "hover:bg-orange-50",
    },
    {
      id: "delete",
      label: "Delete Post",
      icon: Trash2,
      color: "text-red-600",
      bgColor: "hover:bg-red-50",
      destructive: true,
    },
  ];

  const handleAction = (actionId: string) => {
    onAction(actionId);
    onClose();
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 z[70] flex items-end">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full bg-white rounded-t-2xl shadow-xl transform transition-transform">
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Post Actions
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${action.bgColor} ${
                  action.destructive ? "border border-red-200" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full bg-white shadow-sm ${action.destructive ? "bg-red-50" : ""}`}
                >
                  <action.icon size={18} className={action.color} />
                </div>
                <span
                  className={`font-medium ${action.destructive ? "text-red-600" : "text-gray-900"}`}
                >
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          {/* Safe area for mobile */}
          <div className="h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl transform transition-transform">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Post Actions
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 space-y-2 max-h-96 overflow-y-auto">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${action.bgColor} ${
                action.destructive ? "border border-red-200" : ""
              }`}
            >
              <div
                className={`p-2 rounded-full bg-white shadow-sm ${action.destructive ? "bg-red-50" : ""}`}
              >
                <action.icon size={18} className={action.color} />
              </div>
              <span
                className={`font-medium ${action.destructive ? "text-red-600" : "text-gray-900"}`}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostActionsModal;
