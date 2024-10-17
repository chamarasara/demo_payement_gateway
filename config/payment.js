import paypal from 'paypal-rest-sdk';
import braintree from 'braintree';

// PayPal setup
paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// Braintree Gateway setup
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRIANTREE_MERCHANT_ID,
    publicKey: process.env.BRIANTREE_PUBLIC_KEY,
    privateKey: process.env.BRIANTREE_PRIVATE_KEY
});

export { paypal, gateway };
