import { createBrowserRouter } from "react-router-dom";
import Home from "../features/home/Home";
import AppLayout from "../shared/layouts/AppLayout.jsx";
import GeneralLayout from "../shared/layouts/GeneralLayout.jsx";

let routes = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "",
                element: <GeneralLayout />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: "books/search",
                        lazy: () => import("../features/books/pages/Search.jsx")
                    },
                    {
                        path: "books/details/:id",
                        lazy: () => import("../features/books/pages/BookDetails.jsx"),
                    },
                    {
                        path: "orders/checkout",
                        lazy: () => import("../features/orders/pages/Checkout.jsx")
                    },
                    {
                        path: "orders/details/:id",
                        lazy: () => import("../features/orders/pages/OrderDetails.jsx"),
                    },
                    {
                        path: "cart",
                        lazy: () => import("../features/orders/pages/Cart.jsx"),
                    },
                    {
                        path: "profile",
                        lazy: () => import("../features/users/pages/Profile.jsx"),
                    },
                ],
            },
            {
                path: "auth",
                lazy: () => import("../features/users/Layout/AuthLayout.jsx"),
                children: [
                    {
                        path: "google",
                        lazy: () => import("../features/users/pages/Google.jsx"),
                    },
                    {
                        path: "verify/:id",
                        lazy: () => import("../features/users/pages/GoogleVerify.jsx"),
                    },
                ],
            },
        ],
    },
]);

export default routes;
