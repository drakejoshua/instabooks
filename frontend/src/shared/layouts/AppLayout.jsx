import { useEffect } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { useSelector } from "react-redux"

function AppLayout() {
    let { state } = useNavigation();
    let token = useSelector( function( state ) {
        return state.auth.token
    })
    
    useEffect( function() {
        if ( token ) {
            localStorage.setItem("instabooks-auth-token", token )
        }
    }, [ token ])

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
