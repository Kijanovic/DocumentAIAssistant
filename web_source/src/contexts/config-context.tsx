import { createContext, useContext, useState, ReactNode } from 'react';

interface ConfigContextType {
  config: ConfigSettings;
  updateConfig: (newConfig: Partial<ConfigSettings>) => void;
  resetConfig: () => void;
}

export interface ConfigSettings {
  apiKey: string;
  defaultModel: 'flash' | 'pro';
  cacheEnabled: boolean;
  maxCacheAgeDays: number;
  autoDocumentSelection: boolean;
  maxDocumentsToSelect: number;
  uiTheme: 'light' | 'dark';
}

const defaultConfig: ConfigSettings = {
  apiKey: '',
  defaultModel: 'flash',
  cacheEnabled: true,
  maxCacheAgeDays: 30,
  autoDocumentSelection: true,
  maxDocumentsToSelect: 5,
  uiTheme: 'light'
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfigSettings>(() => {
    // In a real implementation, we would load from localStorage or cookies
    // For now, just use the default config
    return defaultConfig;
  });

  const updateConfig = (newConfig: Partial<ConfigSettings>) => {
    setConfig(prevConfig => {
      const updatedConfig = { ...prevConfig, ...newConfig };
      
      // In a real implementation, we would save to localStorage or cookies
      // localStorage.setItem('documentai-config', JSON.stringify(updatedConfig));
      
      return updatedConfig;
    });
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    
    // In a real implementation, we would clear from localStorage or cookies
    // localStorage.removeItem('documentai-config');
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
