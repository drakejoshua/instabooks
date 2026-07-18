import { Outlet, useNavigation } from "react-router-dom";

function AppLayout() {
    let { state } = useNavigation();

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default AppLayout;
