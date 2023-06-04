const express = require('express');
const { celebrate } = require('celebrate');

const userRouter = express.Router();
const { getMe, updateMe } = require('../controllers/users');
const { userUpdateValidationSchema } = require('./shemaValidation');

userRouter.get('/me', getMe);
userRouter.patch('/me', celebrate({ body: userUpdateValidationSchema }), updateMe);

module.exports = {
  userRouter,
};
