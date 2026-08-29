import { Link, Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import { FaBars, FaCartShopping } from "react-icons/fa6";
import AltButton from "../components/AltButton.jsx";
import { useState } from "react";
import UserAvatar from "../components/UserAvatar.jsx";
import { useGetMeQuery, useLogoutMutation } from "../../features/users/services/authApi.js";
import { useToastActions, ToastTypes } from "../ui/ToastRenderer.jsx";
import { useDialogActions } from "../ui/DialogRenderer.jsx";
import { useDispatch } from "react-redux";
import { logOut } from "../../features/users/authSlice.js"
import { logger } from "../../infra/logging/logger.js";
import { useAuthUserData } from "../hooks/useAuthUserData.jsx";

// GeneralLayout component
// This component serves as the main layout for the application. 
// It includes a navigation bar with links to different sections
// of the application, such as the cart and user profile. It also
// handles user authentication state, displaying login or logout
// options based on whether the user is authenticated. The layout
// is responsive, with a mobile menu that can be toggled on smaller
// screens.

export function Component() {
    // get the local storage key for authentication from 
    // environment variables
    const LocalStorageAuthKey = import.meta.env.VITE_LOCALSTORAGE_AUTH_KEY

    // check if the current window width is less than 
    // 768 pixels to determine if the device is mobile
    const isMobile = window.innerWidth < 768;

    // useState hook to manage the state of the mobile menu.
    // If the device is mobile, the menu is initially closed (false).
    // If the device is not mobile, the menu is initially open (true).
    let [isMobileMenuOpen, setIsMobileMenuOpen] = useState(
        isMobile ? false : true,
    );

    // fetch the authenticated user's data using the useGetMeQuery hook.
    // The query is skipped if there is no authentication token
    // in local storage, preventing unnecessary API calls.
    useGetMeQuery(undefined, {
        skip: !localStorage.getItem( LocalStorageAuthKey )
    });

    // get the authenticated user's data using the useAuthUserData hook.
    const { data } = useAuthUserData();

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
        // close any open dialog if a dialogId is provided
        if ( dialogId ) {
            closeDialog( dialogId )
        }

        try {
            // trigger the lazy logout request and unwrap the 
            // result to handle any errors
            await triggerLogout().unwrap()

            // show a success toast notification to inform the user 
            // that they have been logged out
            openToast({
                message: "You have been logged out of your account",
                type: ToastTypes.success
            })

            // dispatch the logOut action to update the Redux store
            dispatch(logOut());
        } catch (error) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error logging out user",
                error,
                {
                    requestId: error?.requestId,
                    userId: data?.data?.id
                }
            )

            // show an error dialog to inform the user that there was
            // an error logging out of their account and provide an option
            // to retry the logout process
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

    // get the authenticated user's data from the query result
    const user = data?.data;

    return (
        <div>
            {/* Navigation */}
            <nav
                className="
                    flex 
                    justify-between 
                    items-center
                    p-5
                    flex-wrap
                "
            >
                {/* Logo */}
                <Logo
                    className="
                        lg:h-8 h-6
                    "
                />

                {/* navigation links if user is authenticated */}
                {
                    user && <>
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
        
                                {/* 
                                    show a small indicator if any items are present in
                                    the user's cart
                                */}
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
        
                            {/* user profile link */}
                            <Link to="/profile">
                                {/* user profile photo/avatar */}
                                <UserAvatar
                                    src={user?.photo_url}
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            </Link>
        
                            {/* mobile menu button */}
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
                    </>
                }

                {/* login link if no user is authenticated */}
                {
                    !user && 
                    <Button 
                        asChild
                        className="capitalize"
                    >
                        <Link to="/auth/google">Login</Link>
                    </Button>
                }
            </nav>

            <div
                className="
                    px-5
                    pt-3
                    pb-12 lg:pb-5
                "
            >
                {/* Main Content */}
                <Outlet />
            </div>
        </div>
    );
}
