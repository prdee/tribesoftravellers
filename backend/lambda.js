/**
 * AWS Lambda handler using serverless-http
 * This wraps the Express app for Lambda + API Gateway deployment.
 */
const serverless = require('serverless-http');
const app = require('./server');

// serverless-http wraps Express for Lambda
const handler = serverless(app, {
  // Preserve binary content types for images etc.
  binary: ['image/*', 'application/octet-stream'],
});

module.exports = { handler };
