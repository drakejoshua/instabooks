import { Avatar } from "radix-ui";
import { FaUser } from "react-icons/fa6";

// UserAvatar component
// This component is responsible for rendering a user's avatar. 
// It accepts props such as "src" for the image source, "alt" for
// alternative text, "iconClassName" for styling the fallback icon,
// and "className" for custom styling. The component uses the Radix UI 
// Avatar component to handle image loading and fallback behavior, 
// displaying a default user icon if the image fails to load or is not provided.

function UserAvatar({ 
    src, 
    alt, 
    iconClassName, 
    className, 
    ...props 
}) {
    return <Avatar.Root 
        className={`
            flex
            items-center
            justify-center
            overflow-hidden
            select-none
            rounded-full
            bg-instabooks-blue
            ${ className || "" }
        `}
    >
        <Avatar.Image
            className="
                w-full
                h-full
                rounded-[inherit]
                object-cover
            "
            src={ src }
            alt={ alt || "User avatar" }
            { ...props }
        />

        <Avatar.Fallback 
            className={`
                text-white
                ${ iconClassName || "w-1/2 h-1/2" }
            `} 
            delayMs={600}
        >
            <FaUser />
        </Avatar.Fallback>
    </Avatar.Root>
}

export default UserAvatar;
