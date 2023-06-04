require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  port: process.env.PORT || 3000,
  mongoDbUrl: process.env.MONGODB_URL || 'mongodb://158.160.51.43:27017/bitfilmsdb',
};

module.exports = config;
