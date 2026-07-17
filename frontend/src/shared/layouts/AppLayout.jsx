import { Outlet, useNavigation } from "react-router-dom";

function AppLayout() {
    let { state } = useNavigation()

    return (
        <div>
            This is the app layout

            <br /> { state === "loading" && <p>Loading...</p> }
            <br />

            <Outlet />
        </div>
    );
}

export default AppLayout;
