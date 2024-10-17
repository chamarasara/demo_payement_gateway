const request = require('supertest');
const app = require('../index.js'); 

describe('Payment API Tests', () => {
  describe('POST /api/pay', () => {
    it('should process a payment successfully with valid PayPal credentials', async () => {
      const response = await request(app)
        .post('/api/pay')
        .send({
          method: 'paypal', 
          amount: "100",
          currency: "USD",
          customerName: "John Doe",
          description: "Payment for services",
         
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.approvalUrl).toBeDefined(); 
    });

    it('should process a payment successfully with valid Braintree credentials', async () => {
      const response = await request(app)
        .post('/api/pay')
        .send({
          method: 'braintree',
          amount: "100",
          currency: "USD",
          customerName: "John Doe",
          paymentMethodNonce: "fake-valid-nonce", 
          expirationDate: "12/25",
          csv: "123",
          description: "Payment for services",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.order).toBeDefined(); 
    });

    it('should return an error for invalid currency', async () => {
      const response = await request(app)
        .post('/api/pay')
        .send({
          method: 'braintree',
          amount: "100",
          currency: "INR",
          customerName: "John Doe",
          paymentMethodNonce: "fake-valid-nonce",
          expirationDate: "12/25",
          csv: "123",
          description: "Payment for services",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toBe('Invalid currency'); 
    });

    it('should return an error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/pay')
        .send({
          amount: "100",
          currency: "USD",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1); 
    });

    it('should return an error for invalid payment method', async () => {
      const response = await request(app)
        .post('/api/pay')
        .send({
          method: 'unknown_method', 
          amount: "100",
          currency: "USD",
          customerName: "John Doe",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid payment method'); 
    });
  });
});
