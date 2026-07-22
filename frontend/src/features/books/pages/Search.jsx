import Heading from "../../../shared/components/Heading";
import SearchBar from "../../../shared/components/SearchBar";
import BookList from "../../../shared/components/BookList";

export function Component() {
    return <div
        className="pb-8 lg:pb-12"
    >
        <Heading variant="route">
            Showing search results for: "the great gatsby"
        </Heading>

        <SearchBar
            className="
                mt-8
                w-full lg:w-3/4
                mx-auto
            "
        />

        <BookList
            className="
                mt-16
            "
            books={[
                {
                    title: "How to Win Friends and Influence People",
                    description: `This timeless classic by Dale 
                    Carnegie offers practical advice on how to 
                    improve your social skills, build meaningful 
                    relationships, and become a more influential 
                    person in both your personal and professional life.`,
                    author: "Dale Carnegie",
                    pages: 302,
                    price: 10.00,
                    genre: "Finance",
                    photoUrl: "https://picsum.photos/id/24/400"
                },
                {
                    title: "How to Win Friends and Influence People",
                    description: `This timeless classic by Dale 
                    Carnegie offers practical advice on how to 
                    improve your social skills, build meaningful 
                    relationships, and become a more influential 
                    person in both your personal and professional life.`,
                    author: "Dale Carnegie",
                    pages: 302,
                    price: 10.00,
                    genre: "Finance",
                    photoUrl: "https://picsum.photos/id/24/400"
                },
                {
                    title: "How to Win Friends and Influence People",
                    description: `This timeless classic by Dale 
                    Carnegie offers practical advice on how to 
                    improve your social skills, build meaningful 
                    relationships, and become a more influential 
                    person in both your personal and professional life.`,
                    author: "Dale Carnegie",
                    pages: 302,
                    price: 10.00,
                    genre: "Finance",
                    photoUrl: "https://picsum.photos/id/24/400"
                },
                {
                    title: "How to Win Friends and Influence People",
                    description: `This timeless classic by Dale 
                    Carnegie offers practical advice on how to 
                    improve your social skills, build meaningful 
                    relationships, and become a more influential 
                    person in both your personal and professional life.`,
                    author: "Dale Carnegie",
                    pages: 302,
                    price: 10.00,
                    genre: "Finance",
                    photoUrl: "https://picsum.photos/id/24/400"
                },
            ]}
        />
    </div>;
}
