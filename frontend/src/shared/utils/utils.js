export function getErrorMessage(error) {
    return (
        error?.data?.error?.message ||
        error?.message ||
        "Something went wrong. Please try again."
    );
}