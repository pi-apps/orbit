"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Template } from "../types";
import orbitProvider from "../backend/OrbitProvider";
import {
  X,
  Copy,
  Edit3,
  Play,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle as Reddit,
} from "lucide-react";
import eventBus from "../utils/eventBus";

const platformIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  reddit: Reddit,
};

const platformColors = {
  twitter: "text-blue-400",
  linkedin: "text-blue-600",
  instagram: "text-pink-500",
  facebook: "text-blue-700",
  youtube: "text-red-500",
  reddit: "text-orange-500",
};

interface TemplateDetailsPanelProps {
  templateId: string;
  onClose: () => void;
}

export default function TemplateDetailsPanel({
  templateId,
  onClose,
}: TemplateDetailsPanelProps) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    eventBus.emit("fullscreen:enter");

    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const fetchedTemplate = await orbitProvider.getTemplate(templateId);
        setTemplate(fetchedTemplate);
      } catch (error) {
        console.error("Error fetching template details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleEdit = () => {
    navigate(`/templates/edit/${templateId}`);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-0">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Template Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-6 overflow-y-auto">
          {loading ? (
            <p>Loading...</p>
          ) : template ? (
            <div className="space-y-6">
              {/* Name and Description */}
              <div>
                <h3 className="text-2xl font-bold">{template.name}</h3>
                <p className="text-gray-500 mt-1">{template.description}</p>
              </div>

              {/* Media */}
              {template.mediaUrls && template.mediaUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {template.mediaUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Template media ${index + 1}`}
                      className="rounded-lg object-cover w-full h-40"
                    />
                  ))}
                </div>
              )}

              {/* Default Text */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Default Content</h4>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="whitespace-pre-wrap">{template.defaultText}</p>
                </div>
              </div>

              {/* Platform Overrides */}
              {template.platformOverrides &&
                Object.keys(template.platformOverrides).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      Platform-Specific Content
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(template.platformOverrides).map(
                        ([platform, text]) => {
                          const Icon =
                            platformIcons[
                              platform as keyof typeof platformIcons
                            ];
                          if (!Icon || !text) return null;
                          return (
                            <div key={platform}>
                              <div className="flex items-center gap-2 mb-1">
                                <Icon
                                  className={`h-5 w-5 ${
                                    platformColors[
                                      platform as keyof typeof platformColors
                                    ]
                                  }`}
                                />
                                <h5 className="font-medium capitalize">
                                  {platform}
                                </h5>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-lg border">
                                <p className="whitespace-pre-wrap">{text}</p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <p>Template not found.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border hover:bg-gray-100 flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Copy
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
            <Play className="h-4 w-4" />
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}
