import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import publicClient from "../api/publicClient";
import authenticatedClient from "../api/authenticatedClient";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
interface User {
  id: number;
  fullname: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let externalLogout: (() => void) | null = null;

export const setLogoutHandler = (fn: () => void) => {
  externalLogout = fn;
};

export const triggerExternalLogout = () => {
  if (externalLogout) {
    externalLogout();
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await publicClient.post("/auth/login", credentials);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
    } catch (err) {
      toast.error("Los datos ingresados son incorrectos", {
        description: "Intente nuevamente",
      });
      throw err;
    }
  };

  const logout = async () => {
    if (location.pathname === "/") return;
    localStorage.removeItem("token");
    await authenticatedClient.post("/auth/logout").catch(() => {});
    setUser(null);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await authenticatedClient.get("/auth/me");
      const { user } = res.data;
      setUser(user);
    } catch (error) {
      if ((error as any)?.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    fetchUser()
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setInitialLoading(false));

    const interval = setInterval(
      () => {
        fetchUser().catch(() => {
          localStorage.removeItem("token");
        });
      },
      30 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading: initialLoading,
        fetchUser,
      }}
    >
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
