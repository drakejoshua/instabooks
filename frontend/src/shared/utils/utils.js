// getErrorMessage()
// This function takes an error object as input and 
// returns a user-friendly error message. The function checks 
// for the presence of an error message in the error object 
// using the different possible structures and returns the first 
// available message.
export function getErrorMessage(error) {
    return (
        error?.data?.error?.message ||
        error?.message ||
        "Something went wrong. Please try again."
    );
}