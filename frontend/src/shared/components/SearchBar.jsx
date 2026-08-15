import { FaMagnifyingGlass } from "react-icons/fa6";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchBar({ className = "" }) {
    const [ searchQuery, setSearchQuery ] = useState( "" )
    const navigateTo = useNavigate()

    function handleSearch() {
        // normalize search query by trimming whitespace
        // with empty check before redirecting to search 
        // results page
        if ( searchQuery.trim() !== "" ) {
            navigateTo( `/books/search?q=${encodeURIComponent(searchQuery)}` )
        }
    }

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
            value={ searchQuery }
            onChange={ ( e ) => setSearchQuery( e.target.value ) }
            onKeyDown={ ( e ) => {
                if ( e.key === "Enter" ) {
                    handleSearch()
                }
            } }
        />

        <Button
            className="
                py-1!
                px-6
                shrink-0
            "
            onClick={ handleSearch }
        >
            Search
        </Button>
    </div>;
}

export default SearchBar;
