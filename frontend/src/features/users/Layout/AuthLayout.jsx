import { Outlet } from "react-router-dom";
import InstabooksBlackLogo from "../../../assets/instabooks-logo-black.png";

function AuthLayout() {
    return (
        <div>
            This is the auth layout
            {/* auth layout header */}
            <header>
                <img src={InstabooksBlackLogo} alt="Instabooks Logo" />
            </header>

            <Outlet />
        </div>
    );
}

export function Component() {
    return <AuthLayout />;
}
