import Logo from "../../../shared/components/Logo";
import Button from "../../../shared/components/Button";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";


export function Component() {
    const { isLoading } = useAuth()

    if ( isLoading ) {
        return (
            <div>
                loading authenticated user information
            </div>
        )
    }

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

            <Button 
                className="
                    capitalize
                "
                asChild
            >
                <Link to="/">
                    Go to shop
                </Link>
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
