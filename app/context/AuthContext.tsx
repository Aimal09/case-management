'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  canCreateCase?: boolean; // Added property to indicate if user can create cases
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // For mock implementation
          if (token === 'mock-token-for-testing') {
            const mockUser = {
              id: '1',
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin'
            };
            setUser(mockUser);
          } else {
            // Verify token and get user info
            const res = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
            } else {
              // Invalid token
              localStorage.removeItem('authToken');
            }
          }
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Hash the password before sending
      const hashedPassword = CryptoJS.AES.encrypt(password, "pwd").toString();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'  // CSRF protection
        },
        credentials: 'include',  // Important for cookie handling
        body: JSON.stringify({ 
          email, 
          password: hashedPassword 
        })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
};

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login: async (email: string, password: string): Promise<void> => login(email, password).then(() => {}),
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Add a helper method to check if user can create cases
  if (context.user) {
    context.user.canCreateCase = context.user.role === 'admin' || context.user.role === 'DD';
  }
  
  return context;
}