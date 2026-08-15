import { FaCircleArrowLeft } from "react-icons/fa6";
import AnimatedWarningIcon from "../components/AnimatedWarningIcon";
import Heading from "../components/Heading";
import Button from "../components/Button";

function RouteError({
    heading = "An error occurred on this page",
    error = null,
    refetch = () => {},
    text = "Please try again later. Error code:",
    buttonLabel = "retry"
}) {
    return <div
        className="
            w-full
            max-w-lg
            mx-auto
            mt-4
            flex
            flex-col
            items-center
        "
    >
        <AnimatedWarningIcon />

        <Heading
            className="
                mt-4
            "
        >
            { heading }
        </Heading>

        <p className="mt-2">
            { text } { error?.status } 
            { error?.data?.message ?? error?.message }
        </p>

        <Button
            onClick={ () => refetch() }
            className="
                mt-2
                flex
                gap-2
                items-center
            "
        >
            {
                <>
                    <FaCircleArrowLeft />

                    <span> 
                        { buttonLabel }
                    </span>
                </>
            }
        </Button>
    </div>;
}

export default RouteError;
