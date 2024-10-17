import paypal from 'paypal-rest-sdk';
import braintree from 'braintree';

// PayPal setup
paypal.configure({
    mode: 'sandbox',
    client_id: 'YOUR_PAYPAL_CLIENT_ID',
    client_secret: 'YOUR_PAYPAL_CLIENT_SECRET'
});

// Braintree Gateway setup
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'YOUR_MERCHANT_ID',
    publicKey: 'YOUR_PUBLIC_KEY',
    privateKey: 'YOUR_PRIVATE_KEY'
});

export { paypal, gateway };
