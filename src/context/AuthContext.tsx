import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (fullName: string, email: string, pass: string, role: UserRole, grade?: string) => Promise<boolean>;
  logout: () => void;
  switchUserRole: (role: UserRole, specificUserId?: string) => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    id: 'user-student-1',
    email: 'budi@mathpath.id',
    fullName: 'Budi Pratama',
    role: 'student',
    classGrade: 'Kelas 10 SMA'
  });

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (user) {
      headers.set('x-user-id', user.id);
    }
    return fetch(url, { ...options, headers });
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (
    fullName: string,
    email: string,
    pass: string,
    role: UserRole,
    grade?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password: pass, role, classGrade: grade })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchUserRole = (targetRole: UserRole, specificUserId?: string) => {
    if (targetRole === 'teacher') {
      setUser({
        id: 'user-teacher-1',
        email: 'ibu.dewi@mathpath.id',
        fullName: 'Ibu Dewi Safitri, S.Pd.',
        role: 'teacher',
        classGrade: 'Guru Matematika'
      });
    } else if (targetRole === 'admin') {
      setUser({
        id: 'user-admin-1',
        email: 'admin@mathpath.id',
        fullName: 'Admin Kurikulum MathPath',
        role: 'admin'
      });
    } else {
      if (specificUserId === 'user-student-2') {
        setUser({
          id: 'user-student-2',
          email: 'siti@mathpath.id',
          fullName: 'Siti Rahmawati',
          role: 'student',
          classGrade: 'Kelas 9 SMP',
          hasCompletedDiagnostic: false
        });
      } else {
        setUser({
          id: 'user-student-1',
          email: 'budi@mathpath.id',
          fullName: 'Budi Pratama',
          role: 'student',
          classGrade: 'Kelas 10 SMA',
          hasCompletedDiagnostic: true
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchUserRole,
        authFetch
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
