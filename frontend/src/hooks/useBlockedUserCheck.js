import { useEffect } from 'react';
import api from '../api';

/**
 * Hook to periodically check if user is blocked
 * If user is blocked, automatically logout and show message
 */
export const useBlockedUserCheck = () => {
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    
    // Only run if user is logged in
    if (!authToken) return;

    // Check user status every 30 seconds
    const checkInterval = setInterval(async () => {
      try {
        await api.get('/user');
        // If successful, user is not blocked
      } catch (err) {
        // If error with blocked status, api interceptor will handle logout
        // But we can also handle it here if needed
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, []);
};

export default useBlockedUserCheck;
