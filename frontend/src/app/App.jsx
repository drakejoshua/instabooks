import { RouterProvider } from "react-router-dom";
import routes from "./routes.jsx";
import DialogProvider from "./providers/DialogProvider.jsx";

function App() {
    return (
        <>
            <DialogProvider>
                <RouterProvider router={routes} />
            </DialogProvider>
        </>
    );
}

export default App;
