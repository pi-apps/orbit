import React, { useState, useEffect, useCallback, useRef } from "react";
import { Template } from "../types";
import orbitProvider from "../backend/OrbitProvider";
import { useSelector } from "react-redux";
import { selectUserGlobalData } from "../store/orbitSlice";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { X, Search } from "lucide-react";
import eventBus from "../utils/eventBus";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(
    null
  );
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const userGlobalData = useSelector(selectUserGlobalData);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTemplates = useCallback(async () => {
    if (loading || !hasMore || !userGlobalData?.user) return;

    setLoading(true);
    try {
      const { templates: newTemplates, lastVisible: newLastVisible } =
        await orbitProvider.getTemplates(
          userGlobalData.user.uid,
          lastVisible || undefined
        );

      setTemplates((prev) => [...prev, ...newTemplates]);
      setLastVisible(newLastVisible);
      if (!newLastVisible) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, userGlobalData?.user, lastVisible]);

  useEffect(() => {
    if (isOpen) {
      // Reset and fetch when modal opens
      setTemplates([]);
      setLastVisible(null);
      setHasMore(true);
      fetchTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      eventBus.emit("fullscreen:enter");
      return () => {
        eventBus.emit("fullscreen:exit");
      };
    }
  }, [isOpen]);

  const lastTemplateElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchTemplates();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchTemplates]
  );

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">
            Choose a Template
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="space-y-3">
            {filteredTemplates.map((template, index) => {
              const ref =
                index === filteredTemplates.length - 1
                  ? lastTemplateElementRef
                  : null;
              return (
                <div
                  ref={ref}
                  key={template.id}
                  className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer"
                  onClick={() => onSelectTemplate(template)}
                >
                  <h3 className="font-semibold text-slate-800">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              );
            })}
            {loading && <p className="text-center">Loading...</p>}
            {!loading && templates.length === 0 && (
              <p className="text-center text-slate-500">No templates found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionModal;
