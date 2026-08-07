import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.css";
import App from "./app/App.jsx";
import ErrorBoundary from "./app/ErrorBoundary.jsx";
import ErrorComponent from "./shared/ui/ErrorComponent.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store/store.js";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ErrorBoundary fallback={ErrorComponent}>
            <Provider store={ store }>
                <App />
            </Provider>
        </ErrorBoundary>
    </StrictMode>,
);
