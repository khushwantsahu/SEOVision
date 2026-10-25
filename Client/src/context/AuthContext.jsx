import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('seo_vision_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('seo_vision_token') || null;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('seo_vision_theme') || 'light';
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Sync theme class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('seo_vision_theme', theme);
  }, [theme]);

  // Verify token & fetch user profile on load
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('seo_vision_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session initialization error:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('seo_vision_token', res.token);
        localStorage.setItem('seo_vision_user', JSON.stringify(res.user));
        showToast('Welcome back! Login successful.', 'success');
        return res;
      }
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authService.register({ name, email, password });
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('seo_vision_token', res.token);
        localStorage.setItem('seo_vision_user', JSON.stringify(res.user));
        showToast('Registration successful! Welcome to SEO Vision.', 'success');
        return res;
      }
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('seo_vision_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        theme,
        toggleTheme,
        toast,
        showToast,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
