import { Avatar } from "radix-ui";
import { FaUser } from "react-icons/fa6";

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
            bg-instabooks-black
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
