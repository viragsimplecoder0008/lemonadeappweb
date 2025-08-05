
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { AdminVerification } from '@/components/admin/AdminVerification';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { setAdminMode, setEmployeeMode, isAdmin, isEmployee } = useAdmin();
  const [showAdminVerification, setShowAdminVerification] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle navigation shortcuts
      if (event.ctrlKey && !event.shiftKey && !event.altKey) {
        switch (event.key) {
          case 'h': // Ctrl+H for Home
            event.preventDefault();
            navigate('/');
            toast.success('Shortcut: Home page');
            break;
          case 'p': // Ctrl+P for Products
            event.preventDefault();
            navigate('/products');
            toast.success('Shortcut: Products page');
            break;
          case 'd': // Ctrl+D for Docs
            event.preventDefault();
            navigate('/docs');
            toast.success('Shortcut: Docs page');
            break;
        }
      }
      
      // Alt based shortcuts
      if (event.altKey && !event.ctrlKey && !event.shiftKey) {
        switch (event.key) {
          case 'v': // Alt+V for VIP
            event.preventDefault();
            navigate('/vip');
            toast.success('Shortcut: VIP page');
            break;
          case 't': // Alt+T for Track Orders
            event.preventDefault();
            navigate('/orders');
            toast.success('Shortcut: Track orders');
            break;
        }
      }
      
      // Alt + Shift shortcuts
      if (event.altKey && event.shiftKey && !event.ctrlKey) {
        switch (event.key) {
          case 'C': // Alt+Shift+C for Community
          case 'c':
            event.preventDefault();
            navigate('/community');
            toast.success('Shortcut: Community page');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, setAdminMode, setEmployeeMode, isAdmin, isEmployee]);

  return {
    showAdminVerification,
    setShowAdminVerification
  };
};
