import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserGlobalData } from "../store/orbitSlice";
import { Automation } from "../types";
import orbitProvider from "../backend/OrbitProvider";
import LoadingIndicator from "../components/LoadingIndicator";
import PiIcon from "../components/PiIcon";

const AutomationPage: React.FC = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userGlobalData = useSelector(selectUserGlobalData);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAutomations = async () => {
      if (userGlobalData?.workspace?.id) {
        try {
          const fetchedAutomations = await orbitProvider.getAutomations(
            userGlobalData.workspace.id
          );
          setAutomations(fetchedAutomations);
        } catch (error) {
          console.error("Error fetching automations:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchAutomations();
  }, [userGlobalData?.workspace?.id]);

  const { dailyCost, oneTimeCost } = useMemo(() => {
    const runningAutomations = automations;
    // .filter(
    //   (a) => a.status === "running"
    // );

    const daily = runningAutomations
      .filter((a) => a.endDate === "infinite")
      .reduce((sum, a) => sum + a.totalCost, 0);

    const oneTime = runningAutomations
      .filter((a) => a.endDate !== "infinite")
      .reduce((sum, a) => sum + a.totalCost, 0);

    return { dailyCost: daily, oneTimeCost: oneTime };
  }, [automations]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Automations
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Manage and monitor your automated workflows
            </p>
          </div>
          <Link
            to="/create-automation"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Automation
          </Link>
        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Total Daily Cost
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <PiIcon className="w-8 h-8 text-yellow-500" />
              <span className="text-4xl font-bold text-slate-800">
                {dailyCost.toFixed(2)}
              </span>
              <span className="text-lg font-medium text-slate-500">
                Pi / day
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              For automations running indefinitely.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Active One-Time Costs
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <PiIcon className="w-8 h-8 text-yellow-500" />
              <span className="text-4xl font-bold text-slate-800">
                {oneTimeCost.toFixed(2)}
              </span>
              <span className="text-lg font-medium text-slate-500">Pi</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              For automations with a set end date.
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingIndicator />
          </div>
        ) : automations.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white">
            <div className="max-w-md mx-auto px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                No Automations Yet
              </h3>
              <p className="text-slate-600 mb-6">
                Create your first automation to streamline your workflow
              </p>
              <Link
                to="/create-automation"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {automations.map((automation) => (
              <Link
                to={`/automation/${automation.id}`}
                key={automation.id}
                className="group relative bg-gradient-to-br from-white to-slate-50/50 rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="p-4">
                  {/* Title Section */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 pr-2">
                        {automation.name}
                      </h3>
                      {automation.status === "running" ? (
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-snug">
                      {automation.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-3"></div>

                  {/* Info Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                          Status
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            automation.status === "running"
                              ? "text-emerald-600"
                              : "text-slate-600"
                          }`}
                        >
                          {automation.status.charAt(0).toUpperCase() +
                            automation.status.slice(1)}
                        </span>
                      </div>
                      <div className="w-px h-10 bg-slate-200"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                          Frequency
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          {automation.frequency}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Cost
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                          {automation.totalCost}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          Pi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomationPage;
