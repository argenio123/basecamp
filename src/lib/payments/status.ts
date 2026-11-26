// Whether real customers can pay online right now (server-only: reads the payment keys from the environment).
// Test / sandbox keys don't count, so public copy never promises online payment that only works in testing.
import { paymongoConfigured, paymongoTestMode } from "./paymongo";
import { paypalConfigured, paypalTestMode } from "./paypal";

export const paymentsLive = () => (paymongoConfigured() && !paymongoTestMode()) || (paypalConfigured() && !paypalTestMode());
