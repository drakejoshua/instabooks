import { Link, Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import { FaBars, FaCartShopping } from "react-icons/fa6"
import AltButton from "../components/AltButton.jsx";
import { useState } from "react";
import UserAvatar from "../components/UserAvatar.jsx";

export function Component() {
    const isMobile = window.innerWidth < 768;
    let [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState( isMobile ? false : true );

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
                    <Link to="/cart">
                        <FaCartShopping 
                            className="
                                text-xl 
                                inline-block
                                text-instabooks-blue
                            " 
                        />
                    </Link>

                    <Link to="/profile">
                        <UserAvatar 
                            src="https://images.unsplash.com/photo-1682685794700-1e3f5c7b8d4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
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
                { ( isMobileMenuOpen) && <div className="
                    w-full lg:w-auto
                    flex
                    gap-2 lg:gap-4
                    mt-6 lg:m-0
                    *:grow
                ">
                    <Button asChild>
                        <Link to="/auth/google">
                            Sign in
                        </Link>
                    </Button>

                    <AltButton asChild>
                        <Link to="/auth/google">
                            Go to admin
                        </Link>
                    </AltButton>
                </div>}
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
