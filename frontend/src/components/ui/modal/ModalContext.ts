import { createContext, useContext } from "react";

interface ModalContextValue {
  onClose: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal compound components must be used inside Modal.");
  }

  return context;
}
