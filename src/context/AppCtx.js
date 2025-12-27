import { createContext, useContext } from "react";

export const AppCtx = createContext(null);
export const useAppCtx = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useAppCtx must be used inside <AppCtx.Provider>");
  return ctx;
};