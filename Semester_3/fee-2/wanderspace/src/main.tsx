import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AuthProvider } from "./hooks/useAuth";
import { NotificationProvider } from "./hooks/useNotifications";
import { ThemeProvider } from "./hooks/useTheme";
import { LanguageProvider } from "./hooks/useLanguage";
import { CurrencyProvider } from "./hooks/useCurrency";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ThemeProvider>
                    <LanguageProvider>
                        <CurrencyProvider>
                            <NotificationProvider>
                                <AuthProvider>
                                    <App />
                                </AuthProvider>
                            </NotificationProvider>
                        </CurrencyProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
);
