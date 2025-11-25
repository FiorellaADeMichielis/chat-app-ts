import { createContext, useState, useCallback, type ReactNode } from 'react';
import type { AppView, NavigationState } from '../types/navigation';

interface NavigationContextType extends NavigationState {
  navigateTo: (view: AppView) => void;
  goBack: () => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [state, setState] = useState<NavigationState>({
    currentView: 'chat',
    previousView: null,
  });

  // useCallback to avoid unnecesary re-renders 
  const navigateTo = useCallback((view: AppView) => {
    setState(prev => ({
      currentView: view,
      previousView: prev.currentView,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => ({
      currentView: prev.previousView || 'chat',
      previousView: null,
    }));
  }, []);

  const value: NavigationContextType = {
    currentView: state.currentView,
    previousView: state.previousView,
    navigateTo,
    goBack,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}