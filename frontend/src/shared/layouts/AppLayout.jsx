import { Outlet, useNavigation } from "react-router-dom";

function AppLayout() {
    let { state } = useNavigation()

    return (
        <div>
            <h1 className="text-instabooks-blue text-3xl font-bold">This is the app layout</h1>

            <br /> { state === "loading" && <p>Loading...</p> }
            <br />

            <Outlet />
        </div>
    );
}

export default AppLayout;
