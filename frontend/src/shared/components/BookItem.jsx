import { FaCircleUser, FaFileLines } from "react-icons/fa6";
import Badge from "./Badge";
import BookActions from "./BookActions";
import Heading from "./Heading";

function BookItem({
    title,
    author,
    price,
    photoUrl,
    genre,
    description,
    pages,
    className = ""
}) {
    return <div
        className={`
            rounded-xl
            overflow-hidden
            outline-2
            outline-gray-200
            ${ className }
        `}
    >
        {/* book image */}
        <div
            className="
                relative
            "
        >
            <img 
                src={ photoUrl }
                alt="Book cover"
                className="
                    w-full
                    max-h-70
                "
            />
        
            {/* genre */}
            <Badge
                className="
                    absolute
                    top-3
                    right-3
                "
            >
                { genre }
            </Badge>
        </div>

        {/* book details */}
        <div
            className="
                p-6
            "
        >
            {/* title */}
            <Heading>
                { title }
            </Heading>

            {/* description */}
            <p
                className="
                    mt-3
                    line-clamp-4
                "
            >
                { description }
            </p>

            {/* metadata */}
            <div 
                className="
                    mt-6
                    flex
                    gap-4
                    flex-wrap

                    *:flex
                    *:items-center
                    *:gap-2
                    [&_.metadata-icon]:text-instabooks-blue
                    [&_.metadata-icon]:text-xl
                "
            >
                <span>
                    <FaCircleUser className="metadata-icon"/>
                    { author }
                </span>
                
                <span>
                    <FaFileLines className="metadata-icon"/>
                    { pages } pages
                </span>
            </div>

            {/* price */}
            <span 
                className="
                    mt-4
                    ml-auto
                    inline-block
                    text-4xl 
                    font-medium 
                    text-instabooks-blue
                "
            >
                ${ price.toFixed(2) }
            </span>

            {/* book actions */}
            <BookActions 
                className="
                    mt-8
                "
            />
        </div>
    </div>;
}

export default BookItem;
