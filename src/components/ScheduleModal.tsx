import React from "react";
import { Calendar, Clock, X } from "lucide-react";
import PiIcon from "./PiIcon";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: () => void;
  scheduleDate: string;
  setScheduleDate: (date: string) => void;
  scheduleTime: string;
  setScheduleTime: (time: string) => void;
  isScheduling: boolean;
  cost: number;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  isScheduling,
  cost,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900">Schedule Post</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Time
            </label>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onSchedule}
            disabled={isScheduling || !scheduleDate || !scheduleTime}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 flex items-center"
          >
            {isScheduling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Scheduling...</span>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Confirm Schedule</span>
                <div className="flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded-full">
                  <PiIcon size="w-3 h-3" className="text-white" />
                  <span className="text-xs font-bold">{cost.toFixed(1)}</span>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;