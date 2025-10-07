import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface PlaceholderModalProps {
  isOpen: boolean;
  placeholders: string[];
  onClose: () => void;
  onContinue: (values: { [key: string]: string }) => void;
}

const PlaceholderModal: React.FC<PlaceholderModalProps> = ({
  isOpen,
  placeholders,
  onClose,
  onContinue,
}) => {
  const [values, setValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      // Initialize values state when modal opens
      const initialValues: { [key: string]: string } = {};
      placeholders.forEach(p => {
        initialValues[p] = "";
      });
      setValues(initialValues);
    }
  }, [isOpen, placeholders]);

  const handleValueChange = (placeholder: string, value: string) => {
    setValues(prev => ({ ...prev, [placeholder]: value }));
  };

  const handleContinue = () => {
    onContinue(values);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Fill in the Blanks</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {placeholders.map(placeholder => (
            <div key={placeholder}>
              <label htmlFor={placeholder} className="block text-sm font-medium text-slate-700 capitalize">
                {placeholder.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                id={placeholder}
                value={values[placeholder] || ""}
                onChange={(e) => handleValueChange(placeholder, e.target.value)}
                className="mt-1 w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
        <div className="bg-slate-50 px-4 py-3 flex justify-end">
          <button
            onClick={handleContinue}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderModal;
