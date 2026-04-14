import { loadStripe } from "@stripe/stripe-js";

// 🔥 Replace with your Stripe publishable key
export const stripePromise = loadStripe("pk_test_XXXXXXXXXXXX");