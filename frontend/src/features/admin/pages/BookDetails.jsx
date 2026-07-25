import SampleBookImage from "../../../assets/sample-book.jpg";
import BookDetailsLayout from "../../../shared/ui/BookDetailsLayout";
import AdminBookActions from "../components/AdminBookActions";

export function Component() {
    return (
        <BookDetailsLayout
            src={SampleBookImage}
            genre="Finance"
            title="How to win friends and influence people"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
            price={10.0}
            quantity={123}
            author="Dale Carnegie"
            pages={320}
        >
            <AdminBookActions />
        </BookDetailsLayout>
    );
}
