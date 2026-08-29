import Logo from "../../../shared/components/Logo";
import Button from "../../../shared/components/Button";
import { Link, Outlet } from "react-router-dom";
import { useProtectedRoute } from "../../../shared/hooks/useProtectedRoute";


// AdminLayout component - This component is used to display the 
// layout for the admin dashboard. It includes a navigation bar 
// with a logo and a button to go to the shop, as well as a content 
// area where the child components will be rendered. The component 
// uses the useProtectedRoute hook to ensure that only authenticated 
// users can access the admin dashboard. If the user is not authenticated, 
// they will be redirected to the login page. While the authenticated user 
// information is being fetched, a loading message is displayed.


export function Component() {
    // get the loading state from the useProtectedRoute hook 
    // to determine if the authenticated user information is 
    // still being fetched. This hook also redirects the user 
    // to the login page if they are not authenticated.
    const { isLoading } = useProtectedRoute()

    // display a loading message while the authenticated 
    // user information is being fetched
    if ( isLoading ) {
        return (
            <div>
                loading authenticated user information
            </div>
        )
    }

    // render the admin layout with navigation and content area once the
    // authenticated user information has been fetched
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
            {/* logo */}
            <Logo 
                className="
                    lg:h-8 h-6
                "
            />

            {/* go to shop button */}
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
