
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { setAdminMode, setEmployeeMode, isAdmin, isEmployee } = useAdmin();

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
      if (event.altKey && !event.ctrlKey) {
        switch (event.key) {
          case 'v': // Alt+V for VIP
            event.preventDefault();
            navigate('/vip');
            toast.success('Shortcut: VIP page');
            break;
        }
      }
      
      // Compound shortcuts
      if (event.ctrlKey && event.shiftKey && !event.altKey) {
        switch (event.key) {
          case 'c': // Ctrl+Shift+C for Community
            event.preventDefault();
            navigate('/community');
            toast.success('Shortcut: Community page');
            break;
        }
      }
      
      // Track order - Ctrl+T then O
      if (event.ctrlKey && event.key === 't') {
        const trackOrderListener = (e: KeyboardEvent) => {
          if (e.key === 'o') {
            e.preventDefault();
            navigate('/orders');
            toast.success('Shortcut: Track orders');
            window.removeEventListener('keydown', trackOrderListener);
          } else {
            window.removeEventListener('keydown', trackOrderListener);
          }
        };
        window.addEventListener('keydown', trackOrderListener, { once: true });
      }
      
      // Admin/Employee mode toggles
      if (event.altKey && event.shiftKey) {
        switch (event.key) {
          case 'A': // Alt+Shift+A for Admin mode
          case 'a':
            event.preventDefault();
            if (!isAdmin) {
              setAdminMode(true);
              toast.success('Admin mode activated');
            } else {
              setAdminMode(false);
              toast.info('Admin mode deactivated');
            }
            break;
          case 'E': // Alt+Shift+E for Employee mode
          case 'e':
            event.preventDefault();
            if (!isEmployee) {
              setEmployeeMode(true);
              toast.success('Employee mode activated');
            } else {
              setEmployeeMode(false);
              toast.info('Employee mode deactivated');
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, setAdminMode, setEmployeeMode, isAdmin, isEmployee]);
};
