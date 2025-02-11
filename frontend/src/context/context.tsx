"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";
import { Token } from "../types/token";
import { getTokenCookie } from "../utils/cookieUtils";
import { jwtDecode } from "jwt-decode";

interface ContextProps {
  decoded: Token | null;
  setDecoded: Dispatch<SetStateAction<Token | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<ContextProps>({
  decoded: null,
  setDecoded: () => null,
  loading: false,
  setLoading: () => false,
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const initialToken = getTokenCookie();
  const decodedToken = initialToken ? (jwtDecode(initialToken) as Token) : null;

  let [decoded, setDecoded] = useState<Token | null>(decodedToken);
  let [loading, setLoading] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ decoded, setDecoded, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
