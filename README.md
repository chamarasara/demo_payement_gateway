# Demo Payment Gateway

This project is a demo payment gateway that integrates with PayPal and Braintree, showcasing how to process payments securely using Node.js and Express.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Tests](#tests)
- [License](#license)
- [Author](#author)

## Features
- Process payments via PayPal and Braintree.
- Environment-based configurations (development, staging, production).
- Validation of payment requests.
- Structured error handling.

## Installation
To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/chamarasara/demo_payment_gateway.git
cd demo_payment_gateway
yarn install
```

Make sure to create a `.env` file in the root directory and add your PayPal and Braintree credentials.

## Usage
To run the application, use the following commands based on the environment:

### Development
```bash
yarn dev
```

### Staging
```bash
yarn stg
```

### Production
```bash
yarn prod
```

## Scripts
- `dev`: Runs the application in development mode using Nodemon.
- `stg`: Runs the application in staging mode using Nodemon.
- `prod`: Runs the application in production mode.
- `test`: Runs the test suite using Jest.

## Dependencies
The project relies on the following packages:

- **@paypal/checkout-server-sdk**: SDK for PayPal Checkout API.
- **body-parser**: Middleware to parse incoming request bodies.
- **braintree**: Braintree SDK for payment processing.
- **dotenv**: Loads environment variables from a `.env` file.
- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **express-validator**: Middleware for validating request bodies.
- **paypal-rest-sdk**: Deprecated SDK for PayPal REST API.
- **pg**: PostgreSQL client for Node.js.
- **pg-hstore**: Library for serializing and deserializing JSON data into hstore format for PostgreSQL.
- **sequelize**: Promise-based Node.js ORM for SQL databases.

## Tests
The project includes a set of unit tests to ensure the functionality of the payment processing feature. To run the tests, use the following command:

```bash
yarn test
```

The tests are written using Jest and include cases for successful payment processing and validation of input data. You can find the test scripts in the `tests` directory.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author
Chamara
