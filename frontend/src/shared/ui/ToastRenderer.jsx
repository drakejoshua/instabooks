import { Toast } from "radix-ui";
import {
    FaCircleCheck,
    FaCircleExclamation,
    FaTriangleExclamation,
    FaXmark,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToast, removeToast } from "../uiSlice";


// ToastTypes object
// This object defines the different types of toasts that can be displayed.
// Each type corresponds to a specific icon and styling for the toast message.
export const ToastTypes = {
    info: "info",
    error: "error",
    success: "success",
};

// ToastIcons object
// This object maps each toast type to its 
// corresponding icon component.
// It is used to render the appropriate icon based on the 
// type of toast being displayed.
let ToastIcons = {
    [ToastTypes.info]: <FaCircleExclamation />,
    [ToastTypes.success]: <FaCircleCheck />,
    [ToastTypes.error]: <FaTriangleExclamation />,
};

// useToastActions() hook
// This is a custom hook that provides functions for 
// opening and closing toasts.
// It uses the Redux dispatch function to manage the state 
// of toasts in the application.
export function useToastActions() {
    const dispatch = useDispatch();

    return {
        // openToast function - opens a new toast with the specified message and type
        openToast(toast) {
            let toastId = crypto.randomUUID();

            dispatch(
                addToast({
                    id: toastId,
                    message: toast.message || "",
                    type: Object.values(ToastTypes).includes(toast.type)
                        ? toast.type
                        : ToastTypes.info,
                }),
            );

            return toastId;
        },
        // closeToast function - closes an existing toast by its ID
        closeToast(toastId) {
            dispatch(removeToast(toastId));
        },
    };
}

// ToastRenderer component
// This component is responsible for rendering toasts 
// based on the state of the application.
// It listens to the Redux store for any toasts that need 
// to be displayed and renders them accordingly.
function ToastRenderer({ children }) {
    // get the list of toasts from the Redux store
    const toasts = useSelector(function (state) {
        return state.ui.toasts;
    });

    // get the closeToast function from the useToastActions hook
    const { closeToast } = useToastActions();

    return (
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

            {/* 
                map over the list of toasts and render a 
                ToastComponent for each one. The onOpenChange 
                prop is used to handle the closing of the toast 
                when the user dismisses it. It calls the closeToast 
                function with the toast's ID to remove it from the 
                Redux store.
            */}
            {toasts.map(function (toast) {
                return (
                    <ToastComponent
                        key={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) {
                                closeToast(toast.id);
                            }
                        }}
                    />
                );
            })}
        </Toast.Provider>
    );
}

export default ToastRenderer;

// ToastComponent component
// This component is responsible for rendering an individual toast message.
// It takes in the type and message of the toast as props, and uses the 
// appropriate icon and styling based on the type of toast.
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
            {/* toast icon */}
            <Toast.Title
                asChild
                className="
                    text-2xl
                    text-instabooks-blue
                    shrink-0
                "
            >
                {ToastIcons[type]}
            </Toast.Title>

            {/* toast message */}
            <Toast.Description
                className="
                    text-instabooks-black
                    wrap-break-word
                "
            >
                {message}
            </Toast.Description>

            {/* close button */}
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
    );
}
