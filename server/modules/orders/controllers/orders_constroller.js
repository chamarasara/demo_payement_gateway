import { Order } from '../../../../models/index.js';
import { paypal, gateway } from '../../../../config/payment.js';
import { body, validationResult } from 'express-validator';

export const validatePayment = [
    body('method')
        .isIn(['paypal', 'braintree']).withMessage('Invalid payment method'),
    body('amount')
        .isNumeric().withMessage('Amount must be a number'),
    body('currency')
        .isIn(['USD', 'EUR', 'THB', 'HKD', 'SGD', 'AUD']).withMessage('Invalid currency'),
    body('description')
        .optional().isString().withMessage('Description must be a string'),
    body('paymentMethodNonce')
        .optional().isString().withMessage('Payment method nonce must be a string'),
    body('customerName')
        .isString().notEmpty().withMessage('Customer name is required'),
    body('expirationDate')
        .optional().matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/).withMessage('Invalid expiration date format (MM/YY)'),
    body('csv')
        .optional().isLength({ min: 3, max: 4 }).withMessage('CSV must be 3 or 4 digits'),
];


export const processPayment = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { method, amount, currency, description, paymentMethodNonce, customerName, expirationDate, csv } = req.body;

    try {
        if (method === 'paypal') {
            // PayPal Payment Processing
            const createPaymentJson = {
                intent: 'sale',
                payer: {
                    payment_method: 'paypal',
                },
                transactions: [{
                    amount: {
                        currency: currency,
                        total: amount,
                    },
                    description: description,
                }],
                redirect_urls: {
                    return_url: 'http://localhost:3000/api/orders/success', // Success route
                    cancel_url: 'http://localhost:3000/api/orders/failure', // Failure route
                },
            };

            paypal.payment.create(createPaymentJson, async (error, payment) => {
                if (error) {
                    return res.status(400).json({ success: false, message: error.message });
                } else {
                    const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;

                    const newOrder = await Order.create({
                        customerName,
                        amount,
                        currency,
                        paymentMethod: 'PayPal',
                        paymentStatus: 'Pending', // Since user needs to approve the payment
                        response: payment,
                    });

                    return res.json({ success: true, approvalUrl, order: newOrder });
                }
            });
        } else if (method === 'braintree') {
            // Braintree Payment Processing
            const result = await gateway.transaction.sale({
                amount: amount,
                paymentMethodNonce: paymentMethodNonce,
                creditCard: {
                    expirationDate: expirationDate,
                    cvv: csv
                },
                options: {
                    submitForSettlement: true,
                },
            });

            if (result.success) {
                // Save the order to the database
                const newOrder = await Order.create({
                    customerName,
                    amount,
                    currency,
                    paymentMethod: 'Braintree',
                    paymentStatus: result.transaction.status,
                    response: result.transaction,
                });

                return res.json({ success: true, message: 'Payment processed successfully', order: newOrder });
            } else {
                return res.status(400).json({ success: false, message: result.message });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid payment method' });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


export const getWelcomeMessage = (req, res) => {
    res.send('Welcome to the Payment Gateway API');
};

export const getPaymentForm = (req, res) => {
    const htmlForm = `
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <div class="container mt-5">
            <form action="/api/orders/pay" method="POST" class="p-4 border rounded">
                <h3 class="mb-4">Payment Information</h3>
                <div class="form-group">
                    <label for="method">Payment Method</label>
                    <select name="method" class="form-control" required>
                        <option value="paypal">PayPal</option>
                        <option value="braintree">Braintree</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="amount">Amount</label>
                    <input type="text" name="amount" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="currency">Currency</label>
                    <select name="currency" class="form-control" required>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="THB">THB</option>
                        <option value="HKD">HKD</option>
                        <option value="SGD">SGD</option>
                        <option value="AUD">AUD</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="text" name="description" class="form-control" />
                </div>
                <div class="form-group">
                    <label for="customerName">Customer Name</label>
                    <input type="text" name="customerName" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="paymentMethodNonce">Credit Card Number (for Braintree)</label>
                    <input type="text" name="paymentMethodNonce" class="form-control" placeholder="Card number" required />
                </div>
                <div class="form-group">
                    <label for="expirationDate">Expiration Date (MM/YY)</label>
                    <input type="text" name="expirationDate" class="form-control" placeholder="MM/YY" required />
                </div>
                <div class="form-group">
                    <label for="csv">CSV (Card Security Code)</label>
                    <input type="text" name="csv" class="form-control" placeholder="CSV" required />
                </div>
                <button type="submit" class="btn btn-primary btn-block">Submit Payment</button>
            </form>
        </div>
    `;
    res.send(htmlForm);
};


export const paymentSuccess = (req, res) => {
    res.send(`
        <h1>Payment Successful</h1>
        <p>Thank you for your payment. Your transaction was successful.</p>
        <a href="/">Go back to homepage</a>
    `);
};

export const paymentFailure = (req, res) => {
    res.send(`
        <h1>Payment Failed</h1>
        <p>Sorry, your payment could not be processed at this time. Please try again later.</p>
        <a href="/">Go back to homepage</a>
    `);
};


