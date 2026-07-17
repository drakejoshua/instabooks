import Button from "../../../shared/components/Button";
import { Link } from "react-router-dom";

export function Component() {
    let state = "loading";   // placeholder state for the mean time
    return <>
        {/* loading state */}
        { state === "loading" && <div>
            {/* TODO: to be replaced with animated loading icon */}
            <span> loading... </span>

            <h1>
                Hold on, we're verifying your google
                sign-in credentials. This may take a few seconds.
            </h1>

            <p>
                If your confirmation isn't completed within a few 
                seconds, please check your internet connection and 
                try again.
            </p>
        </div>}
        
        {/* error state */}
        { state === "error" && <div>
            {/* TODO: to be replaced with animated error icon */}
            <span> error... </span>

            <h1>
                There was an error verifying your google 
                sign-in credentials.
            </h1>

            <p>
                Please check your internet connection and try again.
                You can try signing in with your google account again 
                by clicking the button below.
            </p>

            <Button>
                <Link to="/auth/google">
                    Try signing in with google again
                </Link>
            </Button>
        </div>}

        {/* loaded state */}
        { state === "loaded" && <div>
            {/* TODO: to be replaced with animated confirmation icon */}
            <span> confirmed... </span>

            <h1>
                Your google sign-in credentials have been verified.
            </h1>

            <p>
                You can now proceed to access your Instabooks account.
                You will be redirected to your Instabooks account shortly.
            </p>

            <Button>
                <Link to="/">
                    Proceed to your Instabooks account
                </Link>
            </Button>
        </div>}
    </>;
}
