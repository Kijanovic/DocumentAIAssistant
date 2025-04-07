import React from 'react';
import { useConfig } from '@/contexts/config-context';
import { useApiKeyManagement } from '@/hooks/use-api-key-management';

export function ApiKeyManager() {
  const { config } = useConfig();
  const { apiKey, isValid, isValidating, error, validateApiKey, saveApiKey, clearApiKey, setApiKey } = useApiKeyManagement();
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(!config.apiKey);

  const handleSave = async () => {
    const success = await saveApiKey(apiKey);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setApiKey(config.apiKey);
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Gemini API Key</h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 pr-10 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your Gemini API key"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isValidating || !apiKey}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                isValidating || !apiKey
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isValidating ? 'Validating...' : 'Save API Key'}
            </button>
            
            {config.apiKey && (
              <button
                onClick={handleCancel}
                className="py-2 px-4 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              {isValid ? (
                <p className="text-sm text-green-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valid API Key
                </p>
              ) : (
                <p className="text-sm text-red-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Invalid API Key
                </p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="py-1 px-3 text-sm rounded font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Edit
              </button>
              
              <button
                onClick={clearApiKey}
                className="py-1 px-3 text-sm rounded font-medium bg-red-100 text-red-700 hover:bg-red-200"
              >
                Clear
              </button>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            Your API key is securely stored and used only for communicating with the Gemini API.
          </p>
        </div>
      )}
    </div>
  );
}
