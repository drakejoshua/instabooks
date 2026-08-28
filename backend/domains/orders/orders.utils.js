// import important data for interacting with the
// paystack API
const backendURL = process.env.BACKEND_URL;
const authToken = process.env.PAYSTACK_SECRET_KEY;
const paystackCurrency = process.env.PAYSTACK_CURRENCY;

// paystackInitialize()
// This function initializes a paystack transaction for the user
// and returns the authorization URL for the user to complete the
// payment.
export async function paystackInitialize(userData, orderData) {
    // make a POST request to the paystack initialize endpoint
    let resp = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            email: userData.email,
            reference: orderData.id,
            currency: paystackCurrency,
            // convert amount to kobo/cents ( paystack expects
            // amount in subcurrency )
            amount: orderData.price_at_purchase * 100,
            callback_url: `${backendURL}/orders/confirm`,
        }),
    });

    // check if the response is not ok and return an
    // error object
    if (!resp.ok) {
        return {
            status: "error",
            error: {
                message: `There was an error initializing the transaction. ${resp.status} ${resp.statusText}`
            },
        };
    }

    // parse the response JSON and return the
    // authorization URL
    const json = await resp.json();

    // return the authorization URL to the invoker
    // of the function
    return {
        status: "success",
        data: {
            authorization_url: json.data.authorization_url,
        },
    };
}

// paystackVerify()
// This function verifies a paystack transaction for the user
// and returns the verification data.
export async function paystackVerify(reference) {
    // make a GET request to the paystack verify endpoint
    let resp = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    );

    // check if the response is not ok and return an
    // error object
    if (!resp.ok) {
        let errorData = await resp.json();

        return {
            status: "error",
            error: {
                message: errorData.message ||
                    `There was an error verifying the transaction. ${resp.status} ${resp.statusText}`,
            },
        };
    }

    // parse the response JSON and return the
    // verification data to the invoker of the function
    return {
        status: "success",
        data: await resp.json(),
    };
}
