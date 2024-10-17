import { Router } from 'express';

const OrderRoutes = new Router();

import { processPayment, getWelcomeMessage, getPaymentForm, paymentSuccess, paymentFailure } from '../controllers/orders_constroller.js';

OrderRoutes.post('/pay', processPayment);
OrderRoutes.get('/', getWelcomeMessage);
OrderRoutes.get('/form', getPaymentForm);
OrderRoutes.get('/success', paymentSuccess);
OrderRoutes.get('/failure', paymentFailure);

export default OrderRoutes;