"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type NavbarActionsValue = {
  registerReturnToHero: (fn: (() => void) | null) => void;
  returnToHero: () => boolean;
};

const NavbarActionsContext = createContext<NavbarActionsValue>({
  registerReturnToHero: () => {},
  returnToHero: () => false,
});

export function NavbarActionsProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<(() => void) | null>(null);

  const registerReturnToHero = useCallback((fn: (() => void) | null) => {
    handlerRef.current = fn;
  }, []);

  const returnToHero = useCallback(() => {
    if (!handlerRef.current) return false;
    handlerRef.current();
    return true;
  }, []);

  return (
    <NavbarActionsContext.Provider
      value={{ registerReturnToHero, returnToHero }}
    >
      {children}
    </NavbarActionsContext.Provider>
  );
}

export function useNavbarActions() {
  return useContext(NavbarActionsContext);
}

/** Homepage registers the morph-aware return-to-hero handler. */
export function useRegisterReturnToHero(handler: () => void) {
  const { registerReturnToHero } = useNavbarActions();

  useEffect(() => {
    registerReturnToHero(handler);
    return () => registerReturnToHero(null);
  }, [handler, registerReturnToHero]);
}
