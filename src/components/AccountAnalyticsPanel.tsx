import React from "react";
import {
  X,
  BarChart2,
  Users,
  MessageSquare,
  Heart,
  Eye,
  Calendar,
} from "lucide-react";

interface AccountAnalyticsPanelProps {
  account: any;
  onClose: () => void;
}

const AccountAnalyticsPanel: React.FC<AccountAnalyticsPanelProps> = ({
  account,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg font-bold text-slate-900">
          Analytics for {account.username}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-medium text-slate-500">Followers</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {account.followersCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart2 className="w-5 h-5 text-green-500" />
              <h3 className="text-sm font-medium text-slate-500">Posts</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {account.postsCount || "N/A"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-medium text-slate-500">
                Engagement Rate
              </h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {account.engagementRate}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-medium text-slate-500">
                Impressions
              </h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {account.impressions || "N/A"}
            </p>
          </div>
        </div>

        {/* Engagement Trend Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Engagement Trend
          </h3>
          <div className="h-64 bg-slate-100 rounded-md flex items-center justify-center">
            <p className="text-slate-500">Engagement Trend Chart Placeholder</p>
          </div>
        </div>

        {/* Followers Trend Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Followers Trend
          </h3>
          <div className="h-64 bg-slate-100 rounded-md flex items-center justify-center">
            <p className="text-slate-500">
              Followers Trend Chart Placeholder (Static)
            </p>
          </div>
        </div>

        {/* Other Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm font-medium text-slate-500">
                Comment Replies
              </h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {account.comments || "N/A"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-medium text-slate-500">
                Last Post Date
              </h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {new Date(account.lastTimePosted * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountAnalyticsPanel;
