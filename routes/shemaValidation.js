const { Joi } = require('celebrate');
const { urlRegExp } = require('../constants');

// USER VALIDATION
const createUserValidationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required().min(2).max(30),
});

const loginValidationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userUpdateValidationSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string().required().email(),
});

// MOVIE VALIDATION
const movieCreateValidationSchema = Joi.object().keys({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required().pattern(urlRegExp),
  trailerLink: Joi.string().required().pattern(urlRegExp),
  thumbnail: Joi.string().required().pattern(urlRegExp),
  movieId: Joi.number().required(),
  nameRU: Joi.string().required(),
  nameEN: Joi.string().required(),
});

const idValidationSchema = Joi.object({
  _id: Joi.string().hex().length(24).required(),
});

module.exports = {
  createUserValidationSchema,
  loginValidationSchema,
  userUpdateValidationSchema,
  movieCreateValidationSchema,
  idValidationSchema,
};
