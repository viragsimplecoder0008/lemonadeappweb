import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminContextType {
  isAdmin: boolean;
  isEmployee: boolean;
  loading: boolean;
  setAdminMode: (value: boolean) => void;
  setEmployeeMode: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isEmployee: false,
  loading: true,
  setAdminMode: () => {},
  setEmployeeMode: () => {},
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Roles come from the server via user_roles table. localStorage is never trusted.
  const refreshRoles = async (userId: string | null) => {
    if (!userId) {
      setIsAdmin(false);
      setIsEmployee(false);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to load user roles", error);
      setIsAdmin(false);
      setIsEmployee(false);
    } else {
      const roles = (data ?? []).map((r) => r.role);
      setIsAdmin(roles.includes("admin"));
      setIsEmployee(roles.includes("employee"));
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      refreshRoles(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      refreshRoles(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // These setters only affect local UI state. Real authorization is enforced by RLS server-side.
  const setAdminMode = (value: boolean) => setIsAdmin(value);
  const setEmployeeMode = (value: boolean) => setIsEmployee(value);

  return (
    <AdminContext.Provider
      value={{ isAdmin, isEmployee, loading, setAdminMode, setEmployeeMode }}
    >
      {children}
    </AdminContext.Provider>
  );
};
