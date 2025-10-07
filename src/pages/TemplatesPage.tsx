"use client";

import { QueryDocumentSnapshot } from "firebase/firestore";
import {
  Copy,
  Facebook,
  Grid3X3,
  Instagram,
  Linkedin,
  List,
  MoreHorizontal,
  Play,
  Plus,
  MessageCircle as Reddit,
  Search,
  Sparkles,
  Twitter,
  Youtube,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import orbitProvider from "../backend/OrbitProvider";
import TemplateDetailsPanel from "../components/TemplateDetailsPanel";
import { selectUserGlobalData } from "../store/orbitSlice";
import { Template } from "../types";
import eventBus from "../utils/eventBus";

const categories = [
  "All",
  "Campaign",
  "Content",
  "Social Proof",
  "Thought Leadership",
  "Educational",
  "Events",
  "Motivational",
  "Product",
];
const platforms = [
  "all",
  "twitter",
  "linkedin",
  "instagram",
  "facebook",
  "youtube",
  "reddit",
];
const sortOptions = ["Most Recent", "Most Used", "Highest Engagement"];

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

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(
    null
  );
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const userGlobalData = useSelector(selectUserGlobalData);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleClosePanel = () => {
    eventBus.emit("fullscreen:exit");

    setSelectedTemplateId(null);
  };

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
      setHasMore(false); // Stop fetching on error
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, userGlobalData?.user, lastVisible]);

  useEffect(() => {
    // Initial fetch
    if (userGlobalData?.user) {
      fetchTemplates();
    }
  }, [userGlobalData?.user, fetchTemplates]);

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

  const filteredTemplates = useMemo(() => {
    let sortedTemplates = [...templates];
    // Note: Sorting logic is simplified as we don't have performance data from the template object itself yet.
    // This can be expanded later if performance metrics are added to the Template type.
    if (sortBy === "Most Recent") {
      sortedTemplates.sort((a, b) => b.createdAt - a.createdAt);
    }

    return sortedTemplates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Since we don't have category in the Template type, this filter is disabled for now.
      // const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;

      const hasOverrides =
        template.platformOverrides &&
        Object.keys(template.platformOverrides).length > 0;
      const matchesPlatform =
        selectedPlatform === "all" ||
        (hasOverrides &&
          Object.keys(template.platformOverrides!).includes(selectedPlatform));

      return matchesSearch && matchesPlatform;
    });
  }, [templates, searchQuery, selectedPlatform, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto px-2 sm:px-2 lg:px-3 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                Templates
              </h1>
              <p className="text-muted-foreground mt-2 text-balance">
                Your creative arsenal - Stop starting from scratch, build once
                and post forever
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-background border border-border rounded-lg px-4 py-2">
                <div className="text-2xl font-bold text-foreground">
                  {templates.length}
                </div>
                <div className="text-sm text-muted-foreground">Templates</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions Banner */}
      <div className="bg-gradient-to-r from-primary/5 to-chart-1/5 border-b border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  AI Template Suggestions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on your recent high-performing posts
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/create-template")}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate Template
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Platforms</option>
              {platforms.slice(1).map((platform) => (
                <option key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredTemplates.length} of {templates.length} templates
          </p>
          <button
            onClick={() => navigate("/create-template")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Template
          </button>
        </div>

        {/* Templates Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredTemplates.map((template, index) => {
            const ref =
              index === filteredTemplates.length - 1
                ? lastTemplateElementRef
                : null;
            return (
              <div
                ref={ref}
                key={template.id}
                onClick={() => handleTemplateClick(template.id)}
              >
                {viewMode === "grid" ? (
                  <TemplateCard template={template} />
                ) : (
                  <TemplateListItem template={template} />
                )}
              </div>
            );
          })}
        </div>

        {loading && (
          <p className="text-center py-4">Loading more templates...</p>
        )}

        {!loading && templates.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No templates found
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first template to get started.
            </p>
            <button
              onClick={() => navigate("/create-template")}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Template
            </button>
          </div>
        )}
      </div>

      {selectedTemplateId && (
        <TemplateDetailsPanel
          templateId={selectedTemplateId}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}

// Template Card Component
function TemplateCard({ template }: { template: Template }) {
  const platforms = template.platformOverrides
    ? Object.keys(template.platformOverrides)
    : [];
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={
            template.mediaUrls?.[0] ||
            `https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?cs=srgb&dl=pexels-francesco-ungaro-281260.jpg&fm=jpg`
          }
          alt={template.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg transition-colors">
            <Play className="h-4 w-4" />
          </button>
          <button className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg transition-colors">
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-pretty line-clamp-1">
              {template.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {template.description}
            </p>
          </div>
          <div className="ml-2">
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-2 mb-3">
          {platforms.map((platform) => {
            const Icon = platformIcons[platform as keyof typeof platformIcons];
            if (!Icon) return null;
            return (
              <div
                key={platform}
                className={`${platformColors[platform as keyof typeof platformColors]}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            );
          })}
          {platforms.length > 0 && (
            <span className="text-xs text-muted-foreground ml-1">
              {platforms.length} platform override
              {platforms.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Preview Content */}
        <div className="bg-muted/30 rounded-lg p-3 mb-3">
          <p className="text-sm text-foreground line-clamp-2">
            {template.defaultText}
          </p>
        </div>
      </div>
    </div>
  );
}

// Template List Item Component
function TemplateListItem({ template }: { template: Template }) {
  const platforms = template.platformOverrides
    ? Object.keys(template.platformOverrides)
    : [];
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={
              template.mediaUrls?.[0] ||
              `https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?cs=srgb&dl=pexels-francesco-ungaro-281260.jpg&fm=jpg`
            }
            alt={template.name}
            className="w-24 h-16 object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center gap-1">
                <Play className="h-3 w-3" />
                Use
              </button>
              <button className="border border-border text-foreground px-3 py-1.5 rounded-md text-sm hover:bg-muted/50 transition-colors">
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Platforms and Metrics */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-3">
              {platforms.map((platform) => {
                const Icon =
                  platformIcons[platform as keyof typeof platformIcons];
                if (!Icon) return null;
                return (
                  <div
                    key={platform}
                    className={`${platformColors[platform as keyof typeof platformColors]}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                );
              })}
              {platforms.length > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  {platforms.length} platform override
                  {platforms.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
