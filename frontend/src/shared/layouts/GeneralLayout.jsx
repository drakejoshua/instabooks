import { Link, Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import { FaBars, FaCartShopping } from "react-icons/fa6";
import AltButton from "../components/AltButton.jsx";
import { useState } from "react";
import UserAvatar from "../components/UserAvatar.jsx";
import { useProtectedRoute } from "../hooks/useProtectedRoute.jsx";
import { useLogoutMutation } from "../../features/users/services/authApi.js";
import { useToastActions, ToastTypes } from "../ui/ToastRenderer.jsx";
import { useDialogActions } from "../ui/DialogRenderer.jsx";
import { useDispatch } from "react-redux";
import { logOut } from "../../features/users/authSlice.js"


export function Component() {
    const isMobile = window.innerWidth < 768;
    let [isMobileMenuOpen, setIsMobileMenuOpen] = useState(
        isMobile ? false : true,
    );

    const { data, isLoading, error } = useProtectedRoute();
    const dispatch = useDispatch();

    // toast utility functions via the useToastActions to
    // help with toast notifications
    const { openToast } = useToastActions()

    // dialog utility functions via useDialogActions to 
    // help with dialog alerts
    const { openDialog, closeDialog } = useDialogActions()


    // lazy logout query to logout users when
    // they click the logout button in the mobile menu
    const [ triggerLogout, { isLoading: logoutIsLoading } ] = useLogoutMutation()

    // handleLogout() 
    // This function triggers the lazy logout request logging the 
    // current user out of the application. It also closes any open 
    // dialog if a dialogId is provided.
    async function handleLogout( dialogId = "" ) {
        if ( dialogId ) {
            closeDialog( dialogId )
        }

        try {
            await triggerLogout().unwrap()

            openToast({
                message: "You have been logged out of your account",
                type: ToastTypes.success
            })

            dispatch(logOut());
        } catch {
            let dialogId = openDialog({
                title: "Account Logout Error",
                description: "There was an error logging out of your account. " +
                "Please check your internet connection and try again",
                render: function() {
                    return (
                        <Button 
                            onClick={ () => handleLogout( dialogId ) }
                            className="
                                mt-4
                                w-full
                            "
                        >
                            Retry Logout
                        </Button>
                    )
                }
            })
        }
    }


    if (isLoading) {
        return <div> loading authenticated user information </div>;
    }

    if ( error ) {
        return <></>
    }

    const user = data?.data;

    return (
        <div>
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

                <div
                    className="
                        flex
                        items-center
                        gap-4
                        flex-wrap
                        ml-auto lg:mr-4 
                    "
                >
                    <Link to="/cart" className="relative top-0">
                        <FaCartShopping
                            className="
                                text-2xl 
                                inline-block
                                text-instabooks-blue
                            "
                        />

                        {user?.cart?.length > 0 && (
                            <span
                                className="
                                inline-block
                                p-1
                                rounded-full
                                bg-instabooks-blue
                                absolute
                                -top-1
                                -right-2.5
                            "
                            ></span>
                        )}
                    </Link>

                    <Link to="/profile">
                        <UserAvatar
                            src={user?.photo_url}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full"
                        />
                    </Link>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="
                            lg:hidden
                        "
                    >
                        <FaBars className="text-xl inline-block" />
                    </button>
                </div>

                {/* mobile buttons */}
                {isMobileMenuOpen && (
                    <div
                        className="
                    w-full lg:w-auto
                    flex
                    gap-2 lg:gap-4
                    mt-6 lg:m-0
                    *:grow
                "
                    >
                        <Button 
                            className="capitalize cursor-pointer"
                            onClick={ () => handleLogout() }
                            disabled={ logoutIsLoading }
                        >
                            { !logoutIsLoading && <> log out </> }
                            { logoutIsLoading && <> loading.. </> }
                        </Button>

                        <AltButton asChild>
                            <Link to="/admin/books">Go to admin</Link>
                        </AltButton>
                    </div>
                )}
            </nav>

            <div
                className="
                    px-5
                    pt-3
                    pb-12 lg:pb-5
                "
            >
                <Outlet />
            </div>
        </div>
    );
}
