import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { QueryClient, QueryClientProvider } from "react-query";
import './i18n'; 
import Application from "./Application.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { AppProvider } from "./context/AppContext.tsx";
const queryClient = new QueryClient();
WebApp.ready();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <AppProvider>
          <Application/>
        </AppProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>,
);
