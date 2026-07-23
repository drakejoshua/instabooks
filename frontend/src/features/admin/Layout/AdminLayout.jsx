import Logo from "../../../shared/components/Logo";
import Button from "../../../shared/components/Button";
import { Outlet } from "react-router-dom";

export function Component() {
    return <div>
        {/* admin navigation */}
        <nav 
            className="
                flex 
                justify-between 
                items-center
                p-5
                flex-wrap
            "
        >
            <Logo 
                className="
                    lg:h-8 h-6
                "
            />

            <Button className="capitalize">
                go to shop
            </Button>
        </nav>

        {/* admin content */}
        <div
            className="
                px-5
            "
        >
            <Outlet />
        </div>
    </div>;
}
