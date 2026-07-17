import { Outlet } from "react-router-dom";

function AppLayout() {
    return (
        <div>
            This is the app layout
            <Outlet />
        </div>
    );
}

export default AppLayout;
