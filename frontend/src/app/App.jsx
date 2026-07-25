import { RouterProvider } from "react-router-dom";
import routes from "./routes.jsx";
import DialogProvider from "./providers/DialogProvider.jsx";
import ToastProvider from "./providers/ToastProvider.jsx";

function App() {
    return (
        <div className="
            bg-white
            min-h-screen
            overflow-x-hidden
        ">
            <ToastProvider>
                <DialogProvider>
                    <RouterProvider router={routes} />
                </DialogProvider>
            </ToastProvider>
        </div>
    );
}

export default App;
