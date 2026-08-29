import { Outlet } from "react-router-dom";
import Logo from "../../../shared/components/Logo";


// AuthLayout
// This component serves as a layout for authentication-related 
// pages, such as google login and google confirmation pages. 
// It provides a consistent structure and styling for these pages, 
// including a centered logo at the top. The Outlet component is 
// used to render the specific content of the child routes within 
// this layout.


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
                    mt-12
                "
            />

            {/* auth layout content */}
            <Outlet />
        </div>
    );
}

// export as Component due to react-router-dom
// lazy loading 
export function Component() {
    return <AuthLayout />;
}
