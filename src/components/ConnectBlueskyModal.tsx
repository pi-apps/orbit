import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface ConnectBlueskyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (handle: string, appPassword: string) => Promise<void>;
}

const ConnectBlueskyModal: React.FC<ConnectBlueskyModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [handle, setHandle] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsConnecting(true);
    try {
      await onConnect(handle, appPassword);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to connect. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Connect to Bluesky</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">
                Handle
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
                <input
                  id="handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="yourname.bsky.social"
                  className="pl-7 pr-3 py-2 border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">For example: yourname.bsky.social</p>
            </div>

            <div className="mb-6">
              <label htmlFor="appPassword"  className="block text-sm font-medium text-gray-700 mb-1">
                Bluesky App Password
              </label>
              <div className="relative">
                <input
                  id="appPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  className="pr-10 pl-3 py-2 border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use an app password to connect safely. This is not your account password.
                <a href="https://bsky.app/settings/app-passwords" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  Generate one here.
                </a>
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnectBlueskyModal;