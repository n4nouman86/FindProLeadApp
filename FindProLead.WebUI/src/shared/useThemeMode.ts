import { useContext } from "react";
import { ThemeModeContext } from "./themeModeContextDefinition";

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
}
