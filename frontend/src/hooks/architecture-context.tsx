import { createContext, useContext, useState, type ReactNode } from "react";
import type { Architecture } from "@/components/architecture-selector";

interface ArchitectureContextType {
  architecture: Architecture;
  setArchitecture: (arch: Architecture) => void;
}

const ArchitectureContext = createContext<ArchitectureContextType | undefined>(
  undefined
);

export const ArchitectureProvider = ({ children }: { children: ReactNode }) => {
  const [architecture, setArchitecture] =
    useState<Architecture>("microservices");

  return (
    <ArchitectureContext.Provider value={{ architecture, setArchitecture }}>
      {children}
    </ArchitectureContext.Provider>
  );
};

export const useArchitectureContext = () => {
  const context = useContext(ArchitectureContext);
  if (!context) {
    throw new Error(
      "useArchitectureContext must be used within an ArchitectureProvider"
    );
  }
  return context;
};
