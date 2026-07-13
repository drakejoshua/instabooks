const backendURL = process.env.BACKEND_URL
const authToken = process.env.PAYSTACK_SECRET_KEY
const paystackCurrency = process.env.PAYSTACK_CURRENCY


export async function paystackInitialize( userData, orderData ) {
    let resp = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            email: userData.email,
            reference: orderData.id,
            currency: paystackCurrency,
            // convert amount to kobo/cents ( paystack expects amount in subcurrency )
            amount: orderData.price_at_purchase * 100,
            callback_url: `${ backendURL }/orders/confirm`
        })
    })

    if ( !resp.ok ) {
        return {
            status: "error",
            error: {
                message: `There was an error initializing the transaction. ${ resp.status } ${resp.statusText}`
            }
        }
    }

    const json = await resp.json()

    return {
        status: "success",
        data: {
            authorization_url: json.data.authorization_url
        }
    }
}

export async function paystackVerify( reference ) {
    let resp = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    })

    if (!resp.ok) {
        return {
            status: "error",
            error: {
                message: `There was an error verifying the transaction. ${resp.status} ${resp.statusText}`
            }
        }
    }

    return {
        status: "success",
        data: await resp.json()
    }
}