import { createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';

export const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/v1/setting');
        if (response.status === 200) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
      if (settings.theme === 3) { // 如果选择“System Preference”
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);
        darkModeMediaQuery.addListener((e) => setIsDarkMode(e.matches));
      } else {
        setIsDarkMode(settings.theme === 2); // 如果选择Dark，则为true
      }
    }, [settings.theme]);

    const toggleGlobalTheme = () => {
      updateSettings('theme', settings.theme === 1 ? 2 : 1);
    };    

  const updateSettings = async (key, value) => {
    try {
      const response = await axios.put('/api/v1/setting', { [key]: value });
      if (response.status === 200) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isDarkMode, toggleGlobalTheme}}>
      {children}
    </SettingsContext.Provider>
  );
}
