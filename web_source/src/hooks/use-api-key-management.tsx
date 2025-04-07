import { useState, useEffect } from 'react';
import { useConfig } from '@/contexts/config-context';

export function useApiKeyManagement() {
  const { config, updateConfig } = useConfig();
  const [apiKey, setApiKey] = useState<string>(config.apiKey || '');
  const [isValid, setIsValid] = useState<boolean>(!!config.apiKey);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when config changes
  useEffect(() => {
    setApiKey(config.apiKey || '');
    setIsValid(!!config.apiKey);
  }, [config.apiKey]);

  const validateApiKey = async (key: string): Promise<boolean> => {
    if (!key) {
      setError('API key is required');
      setIsValid(false);
      return false;
    }

    setIsValidating(true);
    setError(null);

    try {
      // Make a simple request to validate the API key
      const response = await fetch('/api/gemini/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key
        },
        body: JSON.stringify({ test: true })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate API key');
      }

      setIsValid(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid API key';
      setError(errorMessage);
      setIsValid(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const saveApiKey = async (key: string): Promise<boolean> => {
    // Validate the API key first
    const isKeyValid = await validateApiKey(key);

    if (isKeyValid) {
      // Update the config
      updateConfig({ apiKey: key });
      return true;
    }

    return false;
  };

  const clearApiKey = () => {
    setApiKey('');
    setIsValid(false);
    updateConfig({ apiKey: '' });
  };

  return {
    apiKey,
    isValid,
    isValidating,
    error,
    validateApiKey,
    saveApiKey,
    clearApiKey,
    setApiKey
  };
}
