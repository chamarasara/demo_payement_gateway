import request from 'supertest';
import app from '../index.js'; // Import your Express app

describe('POST /api/pay', () => {
  it('should process a payment successfully', async () => {
    const response = await request(app)
      .post('/api/pay')
      .send({
        amount: "100",
        currency: "USD",
        customerName: "John Doe",
        creditCard: {
          number: "4111111111111111",
          expirationMonth: "12",
          expirationYear: "2025",
          cvv: "123"
        }
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return an error for invalid currency', async () => {
    const response = await request(app)
      .post('/api/pay')
      .send({
        amount: "100",
        currency: "INR",
        customerName: "John Doe",
        creditCard: {
          number: "4111111111111111",
          expirationMonth: "12",
          expirationYear: "2025",
          cvv: "123"
        }
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe('Invalid currency');
  });
});
