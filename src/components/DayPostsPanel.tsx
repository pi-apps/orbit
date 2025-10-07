import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PlusCircle, MessageSquareQuote } from "lucide-react";
import { PostData } from "../types";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";
import eventBus from "../utils/eventBus";

interface DayPostsPanelProps {
  posts: PostData[];
  onClose: () => void;
  selectedDate: Date;
}

const DayPostsPanel: React.FC<DayPostsPanelProps> = ({
  posts,
  onClose,
  selectedDate,
}) => {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const isFutureOrToday = selected >= today;

  const handleCreatePost = () => {
    eventBus.emit("fullscreen:exit");
    navigate("/create", { state: { date: selectedDate.toISOString() } });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-full md:w-1/3 bg-white shadow-lg z-50 flex flex-col"
      >
        {/* Fixed header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold">
            Posts for {selectedDate.toLocaleDateString()}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-4">
          {posts.length === 0 ? (
            <div className="text-center mt-8">
              {isFutureOrToday ? (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 flex flex-col items-center">
                  <PlusCircle className="w-12 h-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    No posts scheduled for this day
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Seize the opportunity to engage your audience.
                  </p>
                  <button
                    onClick={handleCreatePost}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Schedule a Post</span>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6 flex flex-col items-center">
                  <MessageSquareQuote className="w-12 h-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    The past is written
                  </h3>
                  <p className="text-slate-600">
                    Post every day to keep your community engaged and growing.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DayPostsPanel;
