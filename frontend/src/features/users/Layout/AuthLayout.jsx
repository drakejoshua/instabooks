import { Outlet } from "react-router-dom";
import Logo from "../../../shared/components/Logo";

function AuthLayout() {
    return (
        <div
            className="
                w-full
                max-w-lg
                mx-auto
                pt-2 px-6 pb-4 lg:px-2
            "
        >
            {/* auth layout header */}
            <Logo 
                className="
                    h-10
                    block
                    mx-auto
                "
            />

            <Outlet />
        </div>
    );
}

export function Component() {
    return <AuthLayout />;
}
