import {
    lemonSqueezySetup,
    createCheckout
} from "@lemonsqueezy/lemonsqueezy.js";
import {CheckoutCustomData} from "@/model/squareData";

const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
const storeId = process.env.LEMON_SQUEEZY_STORE_ID?? "";
const variantId = process.env.LEMON_SQUEEZY_VARIENT_ID?? "";


// Setup Lemon Squeezy with the API key
lemonSqueezySetup({
    apiKey, // working as expected
    onError: (error) => console.error("Error setting up Lemon Squeezy!", error),
});



// Create a payment link for a given product ID
export const makeCheckoutCall = async (checkoutCustomData: CheckoutCustomData) => {
    try {
        const serializedCustomData = JSON.stringify(checkoutCustomData);

        const response = await createCheckout(
            storeId , variantId, {
                checkoutData: {
                    custom: {serializedCustomData}
                },
            });

        // console.log('Payment link created:', JSON.stringify(response, null, 2));
        // console.log(response?.data?.data?.attributes?.url);
        return response; // Return the URL for redirection
    } catch (error) {
        console.error('Error calling checkout API:', error);
        const errorMessage = error instanceof Error? error.message: "Internal failure";
        return new Error("Error calling checkout API: " + errorMessage); // Return null or handle it based on your requirements
    }
};

export const createPaymentLink = async (checkoutCustomData: CheckoutCustomData): Promise<string| undefined> => {
    const response = await makeCheckoutCall(checkoutCustomData);
    if(response instanceof Error) {
        throw new Error("Error creating payment link");
    }
    console.log('Payment Link generated:', response?.data?.data?.attributes?.url);
    return response?.data?.data?.attributes?.url;
};
