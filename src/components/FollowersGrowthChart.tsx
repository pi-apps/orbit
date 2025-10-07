import React from "react";
import { TrendingUp } from "lucide-react";

const Card = ({
  children,
  className = "",
  gradient = false,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}) => (
  <div
    className={`${
      gradient ? "bg-gradient-to-br from-white to-slate-50" : "bg-white"
    } rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-slate-300 ${className}`}
  >
    {children}
  </div>
);

const FollowersGrowthChart = () => {
  return (
    <Card gradient className="lg:col-span-1">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-2 rounded-xl text-white">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Followers Growth
              </h3>
              <p className="text-xs text-slate-600">Growth over time</p>
            </div>
          </div>
        </div>
        <div className="h-64 bg-slate-100 rounded-md flex items-center justify-center">
          <p className="text-slate-500">
            Followers Growth Chart Placeholder (Static)
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FollowersGrowthChart;
