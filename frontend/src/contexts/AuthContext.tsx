import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, TokenResponse, LoginPayload, RegisterPayload } from "../api/auth";
import { login as apiLogin, register as apiRegister } from "../api/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore from localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("pp_access_token");
    const storedUser = localStorage.getItem("pp_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  const persist = (newToken: string, newUser: User) => {
    localStorage.setItem("pp_access_token", newToken);
    localStorage.setItem("pp_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (payload: LoginPayload) => {
    const res: TokenResponse = await apiLogin(payload);
    persist(res.access_token, res.user);
  };

  const register = async (payload: RegisterPayload) => {
    // create user then log in
    const newUser = await apiRegister(payload);
    const res: TokenResponse = await apiLogin({ email: newUser.email, password: payload.password });
    persist(res.access_token, res.user);
  };

  const logout = () => {
    localStorage.removeItem("pp_access_token");
    localStorage.removeItem("pp_user");
    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}