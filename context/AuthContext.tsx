'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { getStoredUser, setStoredUser } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (payload: { credential?: string; email?: string; name?: string }) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUserPreferences: (prefs: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authenticated session on mount
  useEffect(() => {
    async function checkAuthSession() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          setStoredUser(data.user);
        } else {
          // Check fallback stored user
          const stored = getStoredUser();
          if (stored && stored.id && stored.id !== 'guest') {
            setUser(stored);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthSession();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        setStoredUser(data.user);
        return { success: true };
      }

      return { success: false, message: data.message || 'Login failed.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error during login.' };
    }
  };

  const loginWithGoogle = async (payload: { credential?: string; email?: string; name?: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        setStoredUser(data.user);
        return { success: true };
      }

      return { success: false, message: data.message || 'Google authentication failed.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error during Google login.' };
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        setStoredUser(data.user);
        return { success: true };
      }

      return { success: false, message: data.message || 'Registration failed.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error during registration.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      window.location.href = '/login';
    }
  };

  const updateUserPreferences = (prefs: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...prefs };
    setUser(updated);
    setStoredUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
