require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  port: process.env.PORT || 3003,
  mongoDbUrl: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/bitfilmsdb',
};

module.exports = config;
