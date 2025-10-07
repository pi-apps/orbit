import React, { useState } from "react";
import { X } from "lucide-react";

interface RedditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; subreddit: string }) => void;
}

const RedditPostModal: React.FC<RedditPostModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [subreddit, setSubreddit] = useState("");

  const handleSave = () => {
    onSave({ title, subreddit });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Reddit Post Details</h2>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="subreddit"
              className="block text-sm font-medium text-gray-700"
            >
              Subreddit (e.g., "pics", "reactjs")
            </label>
            <input
              type="text"
              id="subreddit"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="p-4 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedditPostModal;
