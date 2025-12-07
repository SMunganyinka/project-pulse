import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, TokenResponse, LoginPayload, RegisterPayload } from "../api/auth";
import { login as apiLogin, register as apiRegister } from "../api/auth";

// Define shape of value provided by context
interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Added a loading state for initial auth check
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

// Create context with a default undefined value
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Define props for AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start in a loading state

  // --- AUTHENTICATION HELPERS ---

  // Function to save token and user to state and localStorage
  const persistAuth = (newToken: string, newUser: User) => {
    localStorage.setItem("pp_access_token", newToken);
    localStorage.setItem("pp_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Function to clear token and user from state and localStorage
  const clearAuth = () => {
    localStorage.removeItem("pp_access_token");
    localStorage.removeItem("pp_user");
    setToken(null);
    setUser(null);
  };

  // --- AUTHENTICATION ACTIONS ---

  const login = async (payload: LoginPayload) => {
    try {
      const res: TokenResponse = await apiLogin(payload);
      persistAuth(res.access_token, res.user);
    } catch (error) {
      // On login failure, ensure we are logged out.
      clearAuth();
      // Re-throw error so the calling component (e.g., LoginPage) can handle it
      // (e.g., to show an "Invalid credentials" message).
      throw error;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      // Create a new user account
      const newUser = await apiRegister(payload);
      // Immediately log in with the new user's credentials
      const res: TokenResponse = await apiLogin({ email: newUser.email, password: payload.password });
      persistAuth(res.access_token, res.user);
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    // Use window.location for redirect instead of useNavigate
    window.location.replace('/');
  };

  // --- EFFECTS ---

  // On initial component mount, check for a stored token and user
  useEffect(() => {
    const storedToken = localStorage.getItem("pp_access_token");
    const storedUser = localStorage.getItem("pp_user");

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setToken(storedToken);
        setUser(user);
      } catch (e) {
        // If storedUser is corrupted, clear it
        console.error("Failed to parse stored user data.", e);
        clearAuth();
      }
    }
    
    // Finished initial auth check
    setIsLoading(false);
  }, []); // This effect runs only once on mount

  // --- CONTEXT VALUE ---

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading, // Provide loading state to the app
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily access the auth context
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}