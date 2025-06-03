"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true); 
  const [actionLoading, setActionLoading] = useState(false); 
  const [error, setError] = useState(null);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const loadUserFromSession = async () => {
      if (!backendUrl) {
        setInitialLoading(false);
        return;
      }
      try {
        console.log("AuthProvider: Checking user session with /api/auth/me");
        const response = await axios.get(`${backendUrl}/auth/me`, {
          withCredentials: true, 
        });
        if (response.data && response.data.user) {
          setUser(response.data.user);
          console.log("AuthProvider: User session loaded", response.data.user);
        } else {
          setUser(null); 
        }
      } catch (err) {
        setUser(null); 
      } finally {
        setInitialLoading(false);
      }
    };
    loadUserFromSession();
  }, [backendUrl]);

  const login = async (email, password) => {
    setActionLoading(true);
    setError(null);
    if (!backendUrl) {
      setError('Backend URL is not configured. Please check .env.local in the frontend folder.');
      setActionLoading(false);
      return false;
    }
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, { 
        email,
        password,
      }, { withCredentials: true }); 
      
      if (response.data && response.data.user) {
        setUser(response.data.user); 
        router.push('/dashboard');
        setActionLoading(false);
        return true;
      } else {
        setError('Login successful, but no user data returned.');
        setUser(null);
        setActionLoading(false);
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setUser(null);
      setActionLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setActionLoading(true);
    setError(null);
    if (!backendUrl) {
      setUser(null);
      router.push('/login');
      setActionLoading(false);
      return;
    }
    try {
      await axios.post(`${backendUrl}/auth/logout`, {}, { 
        withCredentials: true, 
      });
    } catch (err) {
      console.error('Logout API call failed:', err.response?.data?.message || err.message);
    } finally {
      setUser(null);
      router.push('/login'); 
      setActionLoading(false);
    }
  };

  const register = async (email, password) => {
    setActionLoading(true);
    setError(null);
    if (!backendUrl) {
      setError('Backend URL is not configured. Please check .env.local in the frontend folder.');
      setActionLoading(false);
      return false;
    }
    try {
      await axios.post(`${backendUrl}/auth/register`, {
        email,
        password,
      });
      router.push('/login?registered=true');
      setActionLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setActionLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      initialLoading, 
      actionLoading,  
      error, 
      login, 
      logout, 
      register, 
      setError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { 
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
