
import React, { createContext, useState, useContext, useEffect } from "react";

interface AdminContextType {
  isAdmin: boolean;
  isEmployee: boolean;
  setAdminMode: (value: boolean) => void;
  setEmployeeMode: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isEmployee: false,
  setAdminMode: () => {},
  setEmployeeMode: () => {},
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);

  // Load state from localStorage on component mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('isAdmin');
    const storedEmployee = localStorage.getItem('isEmployee');
    
    if (storedAdmin === 'true') setIsAdmin(true);
    if (storedEmployee === 'true') setIsEmployee(true);

    // Listen for admin activation events
    const handleActivateAdminMode = () => {
      setIsAdmin(true);
      setIsEmployee(false);
    };

    window.addEventListener('activateAdminMode', handleActivateAdminMode);
    return () => window.removeEventListener('activateAdminMode', handleActivateAdminMode);
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin.toString());
  }, [isAdmin]);
  
  useEffect(() => {
    localStorage.setItem('isEmployee', isEmployee.toString());
  }, [isEmployee]);

  const setAdminMode = (value: boolean) => {
    setIsAdmin(value);
    // If enabling admin mode, disable employee mode
    if (value === true) {
      setIsEmployee(false);
    }
    if (value === false) {
      localStorage.removeItem('isAdmin');
    }
  };

  const setEmployeeMode = (value: boolean) => {
    setIsEmployee(value);
    // If enabling employee mode, disable admin mode
    if (value === true) {
      setIsAdmin(false);
    }
    if (value === false) {
      localStorage.removeItem('isEmployee');
    }
  };

  return (
    <AdminContext.Provider 
      value={{ 
        isAdmin, 
        isEmployee, 
        setAdminMode, 
        setEmployeeMode 
      }}
      data-admin-context
    >
      {children}
    </AdminContext.Provider>
  );
};
