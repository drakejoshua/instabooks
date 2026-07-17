import { Outlet } from "react-router-dom";
import Logo from "../../../shared/components/Logo";

function AuthLayout() {
    return (
        <div>
            This is the auth layout
            {/* auth layout header */}
            <header>
                <Logo />
            </header>

            <Outlet />
        </div>
    );
}

export function Component() {
    return <AuthLayout />;
}
