import { Link } from "react-router-dom";

export function Home() {
    return <div>
        This is the home page

        <Link to="/books/search">Books search</Link>
        <Link to="/orders/checkout">Orders checkout</Link>
    </div>;
}

export default Home;
