import { createContext, useState, useEffect } from 'react';
import { login, register } from '../lib/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get user data (simplified, use jwt-decode in production)
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.data.token);
      setUser({ token: response.data.token });
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const response = await register({ name, email, password });
      localStorage.setItem('token', response.data.token);
      setUser({ token: response.data.token });
      toast.success('Registered successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};