import { FaCircleNotch } from "react-icons/fa6";
import Button from "../../../shared/components/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import AnimatedWarningIcon from "../../../shared/components/AnimatedWarningIcon";
import AnimatedCheckIcon from "../../../shared/components/AnimatedCheckIcon";
import Heading from "../../../shared/components/Heading";
import { useGoogleVerifyQuery } from "../services/authApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../authSlice.js";
import { trackGoogleLoginEvent } from "../../../infra/analytics/auth.js";
import { logger } from "../../../infra/logging/logger.js";


// GoogleVerify page 
// This page handles the verification of Google sign-in 
// credentials. It fetches the verification status from 
// the backend, displays loading, error, or success states, 
// and manages user redirection and token storage upon 
// successful verification.


export function Component() {
    // get the id parameter from the URL using the useParams hook
    let { id } = useParams()

    const dispatch = useDispatch()

    // fetch the google verification status using the 
    // useGoogleVerifyQuery hook,
    // passing the id parameter as a query. The hook returns the
    // verification data, loading state, and error state.
    const { data, isLoading, error } = useGoogleVerifyQuery( 
        id || ""
    )

    // derive the navigate function from the useNavigate hook 
    // for programmatic navigation
    const navigateTo = useNavigate()

    // button and icon styles for consistent styling across 
    // the component
    let iconStyle = `
        text-6xl
        block
        mx-auto
        mt-16
        text-instabooks-blue
    `;

    let buttonStyle = `
        mt-10
        block!
        mx-auto
    `;

    // log any errors that occur during the google verification 
    // process using the app's dedicated logger
    if ( error ) {
        // log the error using the app's dedicated logger
        logger.error(
            "Error verifying google login details",
            error,
            {
                requestId: error?.requestId
            }
        );
    }

    // useEffect to handle login success and redirection 
    // after successful google verification
    useEffect( function() {
        if ( !isLoading && data ) {
            // dispatch the access token to the redux store
            dispatch( setToken( data.data.access_token ) )

            // redirect to the shop after 1 second
            let timeout = setTimeout( function() {
                navigateTo("/")
            }, 2500 )

            // send google login event to google analytics
            trackGoogleLoginEvent()

            return function() {
                clearTimeout( timeout )
            }
        }
    }, [ isLoading ])

    return (
        <>
            {/* loading state */}
            { isLoading && (
                <div>
                    <FaCircleNotch className={iconStyle + "animate-spin"} />

                    <Heading variant="route">
                        We're verifying your google sign-in credentials
                    </Heading>

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
            { ( !isLoading && error ) && (
                <div>
                    <AnimatedWarningIcon />

                    <Heading variant="route">
                        Error verifying your google sign-in credentials.
                    </Heading>

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
            { ( !isLoading && !error ) && (
                <div>
                    <AnimatedCheckIcon />

                    <Heading variant="route">
                        Your google sign-in credentials have been verified.
                    </Heading>

                    <p
                        className="
                            text-center
                            mt-4
                        "
                    >
                        You can now proceed to access your Instabooks account.
                        You will be redirected to the shop shortly.
                    </p>

                    <Button className={buttonStyle}>
                        <Link to="/">Proceed to shop</Link>
                    </Button>
                </div>
            )}
        </>
    );
}
