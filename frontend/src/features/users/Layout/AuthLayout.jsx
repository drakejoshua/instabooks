import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div>
            This is the auth layout
            <Outlet />
        </div>
    );
}

export default AuthLayout;
