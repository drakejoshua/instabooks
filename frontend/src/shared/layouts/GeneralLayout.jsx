import { Link, Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import { FaBars, FaCartShopping, FaUser } from "react-icons/fa6"
import AltButton from "../components/AltButton.jsx";
import { useState } from "react";

export default function GeneralLayout() {
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
                        <FaCartShopping className="text-xl inline-block" />
                    </Link>

                    <Link to="/profile">
                        <FaUser className="text-xl inline-block" />
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
                    <Button>
                        <Link to="/auth/google">
                            Sign in
                        </Link>
                    </Button>

                    <AltButton>
                        <Link to="/auth/google">
                            Go to admin
                        </Link>
                    </AltButton>
                </div>}
            </nav>
            <Outlet />
        </div>
    );
}
