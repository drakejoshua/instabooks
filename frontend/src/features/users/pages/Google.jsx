import { FaGoogle } from "react-icons/fa6";
import Button from "../../../shared/components/Button";
import RouteHeading from "../components/RouteHeading";

export function Component() {
    return <div>
        <RouteHeading>
            Sign in with your Google account
        </RouteHeading>

        <p
            className="
                text-center
                mt-4
            "
        >
            Welcome back! Please continue with your Google 
            account to access your Instabooks account. You
            will be redirected to the Google sign-in page.
        </p>

        <Button
            className="
                mt-12
                flex
                items-center
                gap-2
                mx-auto
            "
        >
            <FaGoogle />
            Sign in with google
        </Button>
    </div>;
}
