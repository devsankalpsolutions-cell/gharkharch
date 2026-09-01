'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { getStoredUser, setStoredUser } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserPreferences: (prefs: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const loaded = getStoredUser();
    setUser(loaded);
    setIsAuthenticated(true);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    const updated: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0] || 'User',
      email,
      currency: 'INR',
      numberFormat: 'indian',
      defaultMonth: '2026-03',
      theme: 'system',
    };
    setUser(updated);
    setStoredUser(updated);
    setIsAuthenticated(true);
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      currency: 'INR',
      numberFormat: 'indian',
      defaultMonth: '2026-03',
      theme: 'system',
    };
    setUser(newUser);
    setStoredUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
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
        login,
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
