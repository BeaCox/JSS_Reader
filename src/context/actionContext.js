import { createContext, useContext, useState, } from 'react';


export const ActionContext = createContext();

export const useAction = () => useContext(ActionContext);


export function ActionProvider({ children }) {
  const [action, setAction] = useState('');
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
