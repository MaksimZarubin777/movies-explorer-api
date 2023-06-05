const token = require('jsonwebtoken');
const config = require('../config');
const { AuthorizeError } = require('../errors/index');
const { AUTH_REQUIRED } = require('../constants');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return next(new AuthorizeError(AUTH_REQUIRED));
  }
  let payload;
  try {
    payload = token.verify(jwt, config.env === 'production' ? config.jwtSecret : 'dev-secret');
  } catch (err) {
    return next(new AuthorizeError(AUTH_REQUIRED));
  }
  req.user = payload;
  return next();
};
