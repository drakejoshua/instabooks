import SampleBookImage from "../../../assets/sample-book.jpg";
import BookActions from "../../../shared/components/BookActions";
import BookDetailsLayout from "../../../shared/ui/BookDetailsLayout";

export function Component() {
    return (
        <BookDetailsLayout
            src={SampleBookImage}
            genre="Finance"
            title="How to win friends and influence people"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
            price={10.00}
            quantity={123}
            author="Dale Carnegie"
            pages={320}
        >
            <BookActions />
        </BookDetailsLayout>
    );
}
