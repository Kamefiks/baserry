"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { AppState, User } from "@/types";

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  toggleTheme: () => void;
  setSelected: (selected: null | string) => void;
  setInputPrompt: (prompt: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "TOGGLE_THEME" }
  | { type: "SET_SELECTED"; payload: null | string }
  | { type: "SET_INPUT"; payload: string };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case "SET_SELECTED":
      return { ...state, selected: action.payload };
    case "SET_INPUT":
      return { ...state, inputPrompt: action.payload };
    default:
      return state;
  }
};

const initialState: AppState = {
  user: null,
  isLoading: true,
  theme: "light",
  selected: null,
  inputPrompt: "",
  tablesCount: 0, // // / / / /
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setUser = (user: User | null) => {
    dispatch({ type: "SET_USER", payload: user });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };
  const setSelected = (selected: null | string) => {
    dispatch({ type: "SET_SELECTED", payload: selected });
  };
  const setInputPrompt = (prompt: string) => {
    dispatch({ type: "SET_INPUT", payload: prompt });
  };

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  useEffect(() => {
    //AKTUALNIE WYLACZONE SUPABASE AUTH
    setLoading(false);
  }, []);

  const value: AppContextType = {
    ...state,
    setUser,
    setLoading,
    toggleTheme,
    setSelected,
    setInputPrompt,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
