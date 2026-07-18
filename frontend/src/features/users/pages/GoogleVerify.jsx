import {
    FaCircleCheck,
    FaCircleNotch,
    FaTriangleExclamation,
} from "react-icons/fa6";
import Button from "../../../shared/components/Button";
import { Link } from "react-router-dom";
import RouteHeading from "../components/RouteHeading";
import AnimatedWarningIcon from "../../../shared/components/AnimatedWarningIcon";
import AnimatedCheckIcon from "../../../shared/components/AnimatedCheckIcon";

export function Component() {
    let state = "loaded"; // placeholder state for the mean time

    let iconStyle = `
        text-6xl
        block
        mx-auto
        mt-16
        text-instabooks-blue
    `;

    let buttonStyle = `
        mt-10
        block
        mx-auto
    `;

    return (
        <>
            {/* loading state */}
            {state === "loading" && (
                <div>
                    <FaCircleNotch className={iconStyle + "animate-spin"} />

                    <RouteHeading>
                        We're verifying your google sign-in credentials
                    </RouteHeading>

                    <p
                        className="
                            text-center
                            mt-4
                        "
                    >
                        If your confirmation isn't completed within a few
                        seconds, please check your internet connection and try
                        again.
                    </p>
                </div>
            )}

            {/* error state */}
            {state === "error" && (
                <div>
                    <AnimatedWarningIcon />

                    <RouteHeading>
                        Error verifying your google sign-in credentials.
                    </RouteHeading>

                    <p
                        className="
                            text-center
                            mt-4
                        "
                    >
                        Please check your internet connection and try again. You
                        can try signing in with your google account again by
                        clicking the button below.
                    </p>

                    <Button className={buttonStyle}>
                        <Link to="/auth/google">
                            Try signing in with google again
                        </Link>
                    </Button>
                </div>
            )}

            {/* loaded state */}
            {state === "loaded" && (
                <div>
                    <AnimatedCheckIcon />

                    <RouteHeading>
                        Your google sign-in credentials have been verified.
                    </RouteHeading>

                    <p
                        className="
                            text-center
                            mt-4
                        "
                    >
                        You can now proceed to access your Instabooks account.
                        You will be redirected to your Instabooks account
                        shortly.
                    </p>

                    <Button className={buttonStyle}>
                        <Link to="/">Proceed to your Instabooks account</Link>
                    </Button>
                </div>
            )}
        </>
    );
}
