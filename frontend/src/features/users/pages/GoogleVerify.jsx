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

export function Component() {
    let { id } = useParams()
    const dispatch = useDispatch()

    const { data, isLoading, error } = useGoogleVerifyQuery( 
        id || ""
    )

    const navigateTo = useNavigate()

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

    useEffect( function() {
        if ( !isLoading && data ) {
            // dispatch the access token to the redux store
            dispatch( setToken( data.data.access_token ) )

            // redirect to the shop after 1 second
            let timeout = setTimeout( function() {
                navigateTo("/")
            }, 2500 )

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
