"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  Type,
  MessageSquare,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle as Reddit,
  Paperclip,
  Save,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectUserGlobalData } from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import { Template } from "../types";

const platformDetails = {
  twitter: { icon: Twitter, name: "Twitter" },
  instagram: { icon: Instagram, name: "Instagram" },
  linkedin: { icon: Linkedin, name: "LinkedIn" },
  youtube: { icon: Youtube, name: "YouTube" },
  reddit: { icon: Reddit, name: "Reddit" },
};

const CreateTemplatePage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const userGlobalData = useSelector(selectUserGlobalData);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultText, setDefaultText] = useState("");
  const [platformOverrides, setPlatformOverrides] = useState<{
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    reddit?: string;
  }>({});
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) {
      const fetchTemplate = async () => {
        try {
          const template = await orbitProvider.getTemplate(templateId);
          if (template) {
            setName(template.name);
            setDescription(template.description);
            setDefaultText(template.defaultText);
            setPlatformOverrides(template.platformOverrides || {});
          }
        } catch (e) {
          setError("Failed to fetch template data.");
          console.error(e);
        }
      };
      fetchTemplate();
    }
  }, [templateId]);

  const handlePlatformTextChange = (platform: string, text: string) => {
    setPlatformOverrides((prev) => ({ ...prev, [platform]: text }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMediaFiles(Array.from(event.target.files));
    }
  };

  const handleSaveTemplate = async () => {
    if (!userGlobalData || !name.trim() || !defaultText.trim()) {
      setError("Name and default text are required.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const placeholders =
      defaultText.match(/{(.*?)}/g)?.map((p) => p.slice(1, -1)) || [];

    try {
      if (templateId) {
        await orbitProvider.updateTemplate(templateId, {
          name,
          description,
          defaultText,
          platformOverrides,
          placeholders,
          mediaFiles,
        });
        setSuccess("Template updated successfully!");
      } else {
        await orbitProvider.createTemplate({
          userId: userGlobalData.user.uid,
          name,
          description,
          defaultText,
          platformOverrides,
          placeholders,
          mediaFiles,
        });
        setSuccess("Template created successfully!");
      }

      setTimeout(() => navigate("/templates"), 1500);
    } catch (e) {
      setError(
        `Failed to ${templateId ? "update" : "create"} template. Please try again.`
      );
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              {/* <span className="font-medium">Back to Templates</span> */}
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {templateId ? "Edit Template" : "Create New Template"}
            </h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Template Name and Description */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Template Details
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="template-name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Template Name
                </label>
                <input
                  type="text"
                  id="template-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., 'Weekly Product Update'"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="template-description"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="template-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="A short description of what this template is for."
                  className="w-full p-2 border border-slate-300 rounded-lg resize-y focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Default Content */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Default Content
              </h2>
            </div>
            <textarea
              value={defaultText}
              onChange={(e) => setDefaultText(e.target.value)}
              rows={8}
              placeholder="Write your main content here. Use {placeholders} for dynamic text, like {productName} or {date}. Hashtags can be added here too."
              className="w-full p-2 border border-slate-300 rounded-lg resize-y focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-500 mt-2">
              Use curly braces for placeholders, e.g., ` {`{productName}`}`.
            </p>
          </div>

          {/* Platform Overrides */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Platform-Specific Variations (Optional)
            </h2>
            <div className="space-y-4">
              {Object.entries(platformDetails).map(
                ([key, { icon: Icon, name }]) => (
                  <div key={key}>
                    <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                      <Icon className="w-5 h-5" />
                      <span>{name}</span>
                    </label>
                    <textarea
                      value={
                        platformOverrides[
                          key as keyof typeof platformOverrides
                        ] || ""
                      }
                      onChange={(e) =>
                        handlePlatformTextChange(key, e.target.value)
                      }
                      rows={4}
                      placeholder={`If you need a different text for ${name}, write it here. Otherwise, the default text will be used.`}
                      className="w-full p-2 border border-slate-300 rounded-lg resize-y focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Media Attachments */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Paperclip className="w-6 h-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Media Attachments (Optional)
              </h2>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {mediaFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700">
                  Selected files:
                </p>
                <ul className="list-disc list-inside text-sm text-slate-600">
                  {mediaFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveTemplate}
              disabled={isSaving || !name.trim() || !defaultText.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:bg-slate-400"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{templateId ? "Save Changes" : "Save Template"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplatePage;
