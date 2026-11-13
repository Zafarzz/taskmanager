import WebApp from "@twa-dev/sdk";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AppContext = createContext({});

function AppProvider({ children }: PropsWithChildren<{}>) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const initializeWebApp = async () => {
      WebApp.SettingsButton.show();
      WebApp.SettingsButton.onClick(() => navigate("/settings"));
      WebApp.setBackgroundColor("#f2f2f7");
      WebApp.expand();
      WebApp.MainButton.hide();
      WebApp.disableVerticalSwipes();
      function handleBack() {
        window.history.back();
      }

      const BackButton = WebApp.BackButton;
      BackButton.onClick(handleBack);
    };

    initializeWebApp();
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (location.pathname === "/onboarding") {
      root.style.setProperty(
        "background-image",
        "linear-gradient(to top, #5856D6 0%, #007AFF 100%)",
      );
    } else {
      root.style.setProperty("background-color", "#f2f2f7");
      root.style.setProperty("background-image", "");
    }
  }, [location.pathname]);
  const contextValue = {};
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within a AppContext");
  }

  return context;
};

export { AppProvider, AppContext, useAppContext };
