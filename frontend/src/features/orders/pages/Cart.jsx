import Heading from "../../../shared/components/Heading";
import CartBookItem from "../components/CartBookItem";

export function Component() {
    return <div>
        <Heading>
            Your cart
        </Heading>

        {/* cart list */}
        <div
            className="
                mt-6
                flex
                flex-col
                gap-4
                md:gap-6
            "
        >
            {/* book item */}
            <CartBookItem
                id={1}
                title="The Great Gatsby"
                price={10}
                photoUrl="https://picsum.photos/id/24/400"
            />
            
            <CartBookItem
                id={2}
                title="Rich Dad Poor Dad"
                price={19}
                photoUrl="https://picsum.photos/id/30/400"
            />
        </div>
    </div>;
}
