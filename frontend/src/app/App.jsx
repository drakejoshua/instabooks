import { RouterProvider } from "react-router-dom";
import routes from "./routes.jsx";
import DialogRenderer from "../shared/ui/DialogRenderer.jsx";
import ToastRenderer from "../shared/ui/ToastRenderer.jsx";

function App() {
    return (
        <div
            className="
            bg-white
            min-h-screen
            overflow-x-hidden
        "
        >
            <ToastRenderer>
                <DialogRenderer>
                    <RouterProvider router={routes} />
                </DialogRenderer>
            </ToastRenderer>
        </div>
    );
}

export default App;
