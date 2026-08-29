import { FaCircleUser, FaFileLines } from "react-icons/fa6";
import Badge from "./Badge";
import BookActions from "./BookActions";
import Heading from "./Heading";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useAuthUserData } from "../hooks/useAuthUserData";

// BookItem component 
// This component displays a book item with its details, 
// including title, author, price, genre, description, and 
// pages. It also provides options to view book details or 
// add the book to the cart based on the user's authentication 
// status and the specified type (default or admin).

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
    // generate the link to the book details page 
    // based on the type of the component
    let bookDetailsLink = type === "default" ? `/books/details/${id}` : `/admin/books/details/${id}`;

    // get the authenticated user data using the useAuthUserData hook
    // in order to determine whether to show the book actions or a login prompt
    const { data } = useAuthUserData();

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
        <Link 
            to={ bookDetailsLink }
            className="block"
        >
            <div
                className="
                    relative
                "
            >
                {/* cover image */}
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
        </Link>

        {/* book details */}
        <div
            className="
                p-6
            "
        >
            {/* title */}
            <Link 
                to={ bookDetailsLink }
                className="block hover:text-instabooks-blue"
            >
                <Heading
                    className="line-clamp-1"
                >
                    { title }
                </Heading>
            </Link>

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
                {/* author */}
                <span>
                    <FaCircleUser className="metadata-icon"/>
                    { author }
                </span>
                
                {/* pages */}
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

            {
                // if the user is authenticated, show the book actions 
                // for users or a view book link for admins based on 
                // the type of the component
                data && <>
                    {/* book actions for users */}
                    { type === "default" && <BookActions 
                        id={ id }
                        className="
                            mt-8
                        "
                    />}

                    {/* view book link for admins */}
                    { type === "admin" && <Button
                        className="
                            mt-8
                            w-full
                        "
                        asChild
                    >
                        <Link to={ bookDetailsLink }>
                            View book details
                        </Link>
                    </Button>}
                </>
            }

            {
                // if the user is not authenticated, show a login link
                // to redirect the user to the login page before they 
                // can add the book to their cart
                !data &&
                <Button
                    className="
                        mt-8
                        w-full
                    "
                    asChild
                >
                    <Link to="/auth/google">
                        Add to cart
                    </Link>
                </Button>
            }
        </div>
    </div>;
}

export default BookItem;
