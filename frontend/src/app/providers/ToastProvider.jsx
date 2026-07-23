import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Toast } from "radix-ui";
import { FaCircleCheck, FaCircleExclamation, FaTriangleExclamation, FaXmark } from "react-icons/fa6";

const ToastContext = createContext();

export const ToastTypes = {
    info: "info",
    error: "error",
    success: "success",
}

let ToastIcons = {
        [ ToastTypes.info ]: <FaCircleExclamation />,
        [ ToastTypes.success ]: <FaCircleCheck />,
        [ ToastTypes.error ]: <FaTriangleExclamation />
    }

export function useToastProvider() {
    let context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToastProvider must be used within a ToastProvider");
    }

    return context;
}

function ToastProvider({ children }) {
    const [ toasts, setToasts ] = useState([
        {
            id: "default",
            type: ToastTypes.info,
            message: "sample toast"
        }
    ]);

    const addToast = useCallback( function(toast) {
        let toastId = crypto.randomUUID();

        setToasts(prevToasts => [
            ...prevToasts,
            {
                id: toastId,
                message: toast.message || "",
                type: toast.type || ToastTypes.info
            }
        ]);
    }, []);

    const removeToast = useCallback( function(toastId) {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== toastId));
    }, []);

    return (
        <ToastContext.Provider value={ useMemo( () => ({ addToast, removeToast }), [ addToast, removeToast ] ) }>
            <Toast.Provider>
                <Toast.Viewport 
                    className="
                        fixed
                        top-3
                        right-3
                        flex
                        flex-col
                        gap-3
                        w-full
                        max-w-80
                        z-50
                        [--viewport-padding:24px]
                    "
                />

                {children}

                {
                    toasts.map( function( toast ) {
                        return (
                            <ToastComponent
                                key={ toast.id }
                                type={ toast.type }
                                message={ toast.message }
                                onOpenChange={ ( isOpen ) => {
                                    if ( !isOpen ) {
                                        removeToast(toast.id);
                                    }
                                } } 
                            />
                        );
                    } )
                }
            </Toast.Provider>
        </ToastContext.Provider>
    );
}

export default ToastProvider;


export function ToastComponent({ type, message, ...props }) {
    return (
        <Toast.Root
            className="
                bg-white
                rounded-lg
                p-4
                flex
                items-center
                gap-2
                w-full
                border-2
                border-instabooks-blue
                transition-transform
                data-[state=open]:animate-[slide-in_500ms_ease-in-out]
                data-[swipe=end]:animate-[slide-out_1500ms_ease-in-out]
                data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)
                data-[swipe=cancel]:translate-x-0
                data-[swipe=cancel]:transition-transform
                data-[swipe=cancel]:duration-200
                data-[swipe=cancel]:ease-out
                data-[state=closed]:animate-[fade-out_2000ms_ease-out]
            "
            {...props}
        >
            <Toast.Title 
                asChild
                className="
                    text-2xl
                    text-instabooks-blue
                    shrink-0
                "
            >
                { 
                    ToastIcons[type] 
                }
            </Toast.Title>

            <Toast.Description
                className="
                    text-instabooks-black
                    wrap-break-word
                "
            >
                { message }
            </Toast.Description>

            <Toast.Close 
                asChild
                className="
                    ml-auto
                    text-2xl
                    text-gray-500
                    hover:text-gray-700
                    shrink-0
                "
            >
                <button>
                    <FaXmark />
                </button>
            </Toast.Close>
        </Toast.Root>
    )
}