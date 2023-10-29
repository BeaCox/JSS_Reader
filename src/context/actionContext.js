import { createContext, useContext, useState } from 'react';
import { useSettings } from './settingContext';

export const ActionContext = createContext();

export const useAction = () => useContext(ActionContext);
const startPageMappping = {
  '1': 'all',
  '2': 'star',
  '3': 'unread',
  '4': 'explore',
};
export function ActionProvider({ children }) {
  const { settings } = useSettings();
  const [action, setAction] = useState(startPageMappping[settings.start_page]);
  const [headerAction, setHeaderAction] = useState(null);
  
  const updateHeaderAction = (newAction) => {
    setHeaderAction(newAction);
  };
  
  const updateAction = async (newAction) => {
    setAction(newAction);
  };
  
  return (
    <ActionContext.Provider value={{ action, setAction, headerAction, setHeaderAction, updateHeaderAction, updateAction}}>
      {children}
    </ActionContext.Provider>
  );
}
