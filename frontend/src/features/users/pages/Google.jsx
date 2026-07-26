import { FaArrowRight, FaGoogle } from "react-icons/fa6";
import Button from "../../../shared/components/Button";
import AltButton from "../../../shared/components/AltButton.jsx";
import Heading from "../../../shared/components/Heading.jsx";
import { Link } from "react-router-dom";

export function Component() {
    let headingStyle = "mt-12 lg:mt-14";

    return (
        <div>
            <Heading variant="route" className={headingStyle}>
                Sign in with your Google account
            </Heading>

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
                <Link to="/auth/google">
                    <FaGoogle />
                    Sign in with google
                </Link>
            </Button>

            <AltButton
                className="
                    items-center
                    mx-auto
                    mt-4
                    gap-2
                    flex!
                    w-fit
                "
                asChild
            >
                <Link to="/auth/google">
                    Go to admin
                    <FaArrowRight />
                </Link>
            </AltButton>
        </div>
    );
}
