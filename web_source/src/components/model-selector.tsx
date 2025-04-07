import React from 'react';
import { useConfig } from '@/contexts/config-context';
import { useGemini } from '@/contexts/gemini-context';

export function ModelSelector() {
  const { config, updateConfig } = useConfig();
  const { currentModel, setCurrentModel, isProcessing } = useGemini();
  
  const handleModelChange = (model: 'flash' | 'pro') => {
    if (isProcessing) return; // Prevent changing model during processing
    
    setCurrentModel(model);
    updateConfig({ defaultModel: model });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Gemini Model</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleModelChange('flash')}
            disabled={isProcessing}
            className={`py-3 px-4 rounded-lg text-center ${
              currentModel === 'flash'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">Gemini Flash</div>
            <div className="text-xs mt-1">Faster responses</div>
          </button>
          
          <button
            onClick={() => handleModelChange('pro')}
            disabled={isProcessing}
            className={`py-3 px-4 rounded-lg text-center ${
              currentModel === 'pro'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">Gemini Pro</div>
            <div className="text-xs mt-1">More detailed</div>
          </button>
        </div>
        
        <p className="text-xs text-gray-500">
          {currentModel === 'flash' 
            ? 'Gemini Flash provides faster responses with good accuracy for most queries.'
            : 'Gemini Pro provides more detailed and nuanced responses for complex queries.'}
        </p>
      </div>
    </div>
  );
}
