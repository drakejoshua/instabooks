import { createBrowserRouter } from "react-router-dom";
import Home from "../features/home/Home";
import Search from "../features/books/pages/Search";
import Checkout from "../features/orders/pages/Checkout";
import BookDetails from "../features/books/pages/BookDetails.";
import OrderDetails from "../features/orders/pages/OrderDetails";
import Google from "../features/users/pages/Google";
import GoogleVerify from "../features/users/pages/GoogleVerify";
import Cart from "../features/orders/pages/Cart";
import Profile from "../features/users/pages/Profile";
import AuthLayout from "../features/users/Layout/AuthLayout";
import AppLayout from "../shared/AppLayout";

let routes = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                path: "",
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: "books/search",
                        element: <Search />,
                    },
                    {
                        path: "books/details/:id",
                        element: <BookDetails />,
                    },
                    {
                        path: "order/checkout",
                        element: <Checkout />,
                    },
                    {
                        path: "order/details/:id",
                        element: <OrderDetails />,
                    },
                    {
                        path: "cart",
                        element: <Cart />,
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                    },
                ],
            },
            {
                path: "auth",
                element: <AuthLayout />,
                children: [
                    {
                        path: "google",
                        element: <Google />,
                    },
                    {
                        path: "verify/:id",
                        element: <GoogleVerify />,
                    },
                ],
            },
        ],
    },
]);

export default routes;
