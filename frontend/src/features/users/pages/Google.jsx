import { FaGoogle } from "react-icons/fa6";
import Button from "../../../shared/components/Button";
import Heading from "../../../shared/components/Heading.jsx";
import { Link } from "react-router-dom";

export function Component() {
    let headingStyle = "mt-12 lg:mt-14";

    // get the backend URL from the environment variables. 
    let backendURL = import.meta.env.VITE_BACKEND_URL

    return (
        <div>
            {/* page heading */}
            <Heading variant="route" className={headingStyle}>
                Sign in with your Google account
            </Heading>

            {/* page description */}
            <p
                className="
                text-center
                mt-4
            "
            >
                Welcome back! Please continue with your Google account to access
                your Instabooks account. You will be redirected to the Google
                sign-in page.
            </p>

            {/* sign in with google button */}
            <Button
                className="
                    mt-12
                    flex!
                    items-center
                    gap-2
                    mx-auto
                    w-fit
                "
                asChild
            >
                <Link to={`${backendURL}/auth/google`}>
                    <FaGoogle />
                    Sign in with google
                </Link>
            </Button>
        </div>
    );
}
