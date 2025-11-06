// context/LoadingContext.tsx
import { createContext, useState, useContext, useEffect } from "react";

const LoadingContext = createContext<{
  loading: boolean;
  setLoading: (value: boolean) => void;
}>({ loading: false, setLoading: () => {} });

// Guardamos la función global
let externalSetLoading: ((value: boolean) => void) | null = null;

// Permite registrar un "setter" global
export const setLoadingHandler = (fn: (value: boolean) => void) => {
  externalSetLoading = fn;
};

// Función global que puedes llamar desde donde sea
export const setGlobalLoading = (value: boolean) => {
  if (externalSetLoading) {
    externalSetLoading(value);
  }
};

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Registrar setLoading cuando el componente se monte
    setLoadingHandler(setLoading);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
