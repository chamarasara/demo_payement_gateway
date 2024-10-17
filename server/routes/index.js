import express from 'express';
import orderRoutes from '../modules/orders/routes/index.js';

const router = express.Router();

router.use('/orders', orderRoutes);

export default router;
