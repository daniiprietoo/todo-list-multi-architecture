import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./hooks/user-context.tsx";
import { ArchitectureProvider } from "./hooks/architecture-context";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ArchitectureProvider>
        <App />
        <Toaster richColors position="top-center" />
      </ArchitectureProvider>
    </UserProvider>
  </StrictMode>
);
