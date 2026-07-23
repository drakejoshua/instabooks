import { RouterProvider } from "react-router-dom";
import routes from "./routes.jsx";
import DialogProvider from "./providers/DialogProvider.jsx";
import ToastProvider from "./providers/ToastProvider.jsx";

function App() {
    return (
        <>
            <ToastProvider>
                <DialogProvider>
                    <RouterProvider router={routes} />
                </DialogProvider>
            </ToastProvider>
        </>
    );
}

export default App;
