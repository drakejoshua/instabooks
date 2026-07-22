import { FaMagnifyingGlass } from "react-icons/fa6";
import Button from "./Button";

function SearchBar({ className = "" }) {
    return <div
        className={`
            flex
            gap-4
            items-center
            bg-gray-200
            p-3 pr-4 pl-5
            rounded-xl
            ${ className }
        `}
    >
        <FaMagnifyingGlass 
            className="
                text-instabooks-black
                text-lg
                shrink-0
            "
        />

        <input
            type="search"
            placeholder="Search for books"
            className="
                self-stretch
                grow
                shrink
                min-w-0
                outline-none
            "
        />

        <Button
            className="
                py-1!
                px-6
                shrink-0
            "
        >
            Search
        </Button>
    </div>;
}

export default SearchBar;
