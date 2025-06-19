import { useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";

const initialState = { isDarkmode: true };
const { useGlobalState } = createGlobalState(initialState);

export const useThemeMode = () => {
  const [isDarkMode, setIsDarkMode] = useGlobalState("isDarkmode");

  useEffect(() => {
    setIsDarkMode(true);
    const root = document.querySelector("html");
    if (root && !root.classList.contains("dark")) {
      root.classList.add("dark");
    }
    localStorage.theme = "dark";
  }, []);

  return {
    isDarkMode: true,
    toDark: () => {},
    toLight: () => {},
    _toogleDarkMode: () => {},
  };
};
