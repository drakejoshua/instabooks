import { createBrowserRouter } from "react-router-dom";
import Home from "../features/home/Home";
import AppLayout from "../shared/layouts/AppLayout.jsx";
import AppLayoutError from "../shared/components/AppLayoutError.jsx";

let routes = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "",
                lazy: () => import("../shared/layouts/GeneralLayout.jsx"),
                children: [
                    {
                        index: true, // protected
                        element: <Home />,
                    },
                    {
                        path: "books/search", // protected
                        lazy: () => import("../features/books/pages/Search.jsx")
                    },
                    {
                        path: "books/details/:id", // protected
                        lazy: () => import("../features/books/pages/BookDetails.jsx"),
                    },
                    {
                        path: "orders/checkout", // protected
                        lazy: () => import("../features/orders/pages/Checkout.jsx")
                    },
                    {
                        path: "orders/details/:id", // protected
                        lazy: () => import("../features/orders/pages/OrderDetails.jsx"),
                    },
                    {
                        path: "cart", // protected
                        lazy: () => import("../features/orders/pages/Cart.jsx"),
                    },
                    {
                        path: "profile", // protected
                        lazy: () => import("../features/users/pages/Profile.jsx"),
                    }
                ],
            },
            {
                path: "admin", // protected
                lazy: () => import("../features/admin/Layout/AdminLayout.jsx"),
                children: [
                    {
                        path: "books",
                        lazy: () => import("../features/admin/pages/Home.jsx"),
                    },
                    {
                        path: "books/details/:id",
                        lazy: () => import("../features/admin/pages/BookDetails.jsx"),
                    },
                    {
                        path: "books/search",
                        lazy: () => import("../features/admin/pages/BookSearch.jsx"),
                    },
                    {
                        path: "orders",
                        lazy: () => import("../features/admin/pages/Orders.jsx"),
                    },
                ]
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
                        path: "google/verify/:id",
                        lazy: () => import("../features/users/pages/GoogleVerify.jsx"),
                    },
                ],
            },
        ],
        errorElement: <AppLayoutError />
    },
]);

export default routes;
