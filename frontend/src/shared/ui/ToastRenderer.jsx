import { Toast } from "radix-ui";
import {
    FaCircleCheck,
    FaCircleExclamation,
    FaTriangleExclamation,
    FaXmark,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToast, removeToast } from "../uiSlice";

export const ToastTypes = {
    info: "info",
    error: "error",
    success: "success",
};

let ToastIcons = {
    [ToastTypes.info]: <FaCircleExclamation />,
    [ToastTypes.success]: <FaCircleCheck />,
    [ToastTypes.error]: <FaTriangleExclamation />,
};

export function useToastActions() {
    const dispatch = useDispatch();

    return {
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
        closeToast(toastId) {
            dispatch(removeToast(toastId));
        },
    };
}

function ToastRenderer({ children }) {
    const toasts = useSelector(function (state) {
        return state.ui.toasts;
    });

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
                {ToastIcons[type]}
            </Toast.Title>

            <Toast.Description
                className="
                    text-instabooks-black
                    wrap-break-word
                "
            >
                {message}
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
    );
}
