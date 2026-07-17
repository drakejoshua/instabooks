import { Outlet } from "react-router-dom";


export default function GeneralLayout() {
    return (
        <div>
            This is the general layout

            {/* general layout header */}
            <header>
                
            </header>

            <Outlet />
        </div>
    );
}
