import React from "react";
import { Template } from "../types";
import { X, Twitter, Instagram, Linkedin, Youtube, Paperclip } from "lucide-react";

interface TemplateDetailsModalProps {
  template: Template | null;
  onClose: () => void;
}

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

const TemplateDetailsModal: React.FC<TemplateDetailsModalProps> = ({ template, onClose }) => {
  if (!template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-slate-900">{template.name}</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-1">{template.description}</p>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Default Text</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap">
              {template.defaultText}
            </div>
          </div>

          {template.platformOverrides && Object.keys(template.platformOverrides).length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Platform Variations</h3>
              <div className="space-y-4">
                {Object.entries(template.platformOverrides).map(([platform, text]) => {
                  const Icon = platformIcons[platform as keyof typeof platformIcons];
                  return (
                    <div key={platform}>
                      <div className="flex items-center space-x-2 mb-1">
                        {Icon && <Icon className="w-5 h-5 text-slate-500" />}
                        <span className="font-medium text-slate-700 capitalize">{platform}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap">
                        {text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {template.mediaUrls && template.mediaUrls.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Media Attachments</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {template.mediaUrls.map((url, index) => (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`media ${index + 1}`} className="rounded-lg object-cover h-32 w-full" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {template.placeholders && template.placeholders.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Placeholders</h3>
                <div className="flex flex-wrap gap-2">
                    {template.placeholders.map((placeholder, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {`{${placeholder}}`}
                        </span>
                    ))}
                </div>
            </div>
          )}

        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsModal;
