import SampleBookImage from "../../../assets/sample-book.jpg";
import BookActions from "../../../shared/components/BookActions";
import Button from "../../../shared/components/Button";
import {
    FaCircleUser,
    FaFileLines,
    FaMinus,
    FaPlus,
} from "react-icons/fa6";

export function Component() {
    return (
        <div
            className="
            grid
            grid-cols-1 lg:grid-cols-[2fr_3fr]
            gap-8 lg:gap-12
        "
        >
            <img
                src={SampleBookImage}
                alt="Book image"
                className="
                w-full
                object-cover
                rounded-md
                max-h-100 lg:max-h-full
            "
            />

            <div>
                {/* book genre */}
                <span
                    className="
                    bg-instabooks-blue
                    text-white
                    px-4
                    py-1
                    rounded-full
                    lg:mt-4
                    inline-block
                "
                >
                    Finance
                </span>

                {/* book title */}
                <h1
                    className="
                    text-4xl
                    font-medium
                    mt-3
                    capitalize
                "
                >
                    How to win friends and influence people
                </h1>

                {/* book description */}
                <p
                    className="
                    mt-4
                    text-instabooks-black
                "
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>

                {/* book price */}
                <p
                    className="
                    mt-4
                    flex
                    items-end
                    gap-2
                "
                >
                    <span
                        className="
                        text-4xl
                        font-medium
                    "
                    >
                        $10.00
                    </span>

                    <span className="text-instabooks-black">123 in stock</span>
                </p>

                {/* book metadata */}
                <div
                    className="
                    mt-10
                    flex
                    items-center
                    gap-6

                    *:flex
                    *:flex-col
                    *:items-start
                    *:gap-1.5
                    [&_.metadata-icon]:ml-0.5
                    [&_.metadata-icon]:text-instabooks-blue
                    [&_.metadata-icon]:text-xl
                    [&_.metadata-text]:capitalize
                    [&_.metadata-text]:font-medium
                "
                >
                    {/* author */}
                    <div className="metadata">
                        <FaCircleUser className="metadata-icon" />

                        <span className="metadata-text">Dale Carnegie</span>
                    </div>

                    {/* pages */}
                    <div className="metadata">
                        <FaFileLines className="metadata-icon" />

                        <span className="metadata-text">320 pages</span>
                    </div>
                </div>

                {/* book actions */}
                <BookActions 
                    className="
                        mt-16
                        max-w-50
                    "
                />
            </div>
        </div>
    );
}
