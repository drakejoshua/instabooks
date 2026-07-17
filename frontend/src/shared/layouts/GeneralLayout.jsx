import { Link, Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";

export default function GeneralLayout() {
    return (
        <div>
            This is the general layout

            {/* general layout header */}
            <nav>
                <Logo />

                <div>
                    <Link>
                        <span>
                            cart icon
                        </span>
                    </Link>

                    <Link>
                        <span>
                            profile icon
                        </span>
                    </Link>

                    <Button>
                        Go To Admin
                    </Button>

                    <Button>
                        Sign in
                    </Button>
                </div>
            </nav>

            <Outlet />
        </div>
    );
}
