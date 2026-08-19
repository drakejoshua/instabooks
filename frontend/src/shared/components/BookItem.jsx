import { FaCircleUser, FaFileLines } from "react-icons/fa6";
import Badge from "./Badge";
import BookActions from "./BookActions";
import Heading from "./Heading";
import Button from "./Button";
import { Link } from "react-router-dom";

function BookItem({
    id,
    title,
    author,
    price,
    photoUrl,
    genre,
    description,
    pages,
    className = "",
    type = "default"
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
                    h-70
                    object-cover
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
            <Heading
                className="line-clamp-1"
            >
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
                    *:capitalize
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
            { type === "default" && <BookActions 
                id={ id }
                className="
                    mt-8
                "
            />}
            
            { type === "admin" && <Button
                className="
                    mt-8
                    w-full
                "
                asChild
            >
                <Link to={`/admin/books/details/${id}`}>
                    View book details
                </Link>
            </Button>}
        </div>
    </div>;
}

export default BookItem;
