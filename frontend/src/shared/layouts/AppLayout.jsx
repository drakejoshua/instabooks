import { Outlet, useNavigation } from "react-router-dom";

function AppLayout() {
    let { state } = useNavigation();

    return (
        <div>
            {/* loading indicator */}
            { state === "loading" && (
                <div 
                    className="
                        fixed
                        top-0
                        left-0
                        w-full
                        h-1
                        bg-instabooks-blue/20
                    "
                >
                    {/* alternating loading bar */}
                    <div 
                        className="
                            h-full
                            w-40
                            bg-instabooks-blue
                            motion-safe:animate-[loading_2s_ease-in-out_infinite_alternate]
                        "
                    ></div>
                </div>
            )}

            <Outlet />
        </div>
    );
}

export default AppLayout;
