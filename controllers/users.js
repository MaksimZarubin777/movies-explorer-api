const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const config = require('../config');
const { BadRequestError, ConflictError, NotFoundError } = require('../errors');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой email уже используется '));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id.toString() }, config.env === 'production' ? config.jwtSecret : 'dev-secret', { expiresIn: 3600 });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ data: user });
    })
    .catch(next);
};

const logOut = (req, res, next) => {
  try {
    res.clearCookie('jwt').send({ message: 'Выход' });
  } catch (err) {
    next(err);
  }
};

const getMe = (req, res, next) => {
  const myId = req.user._id;
  User.findOne({ _id: myId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такой пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const updateMe = (req, res, next) => {
  const { name } = req.body;
  const myId = req.user._id;
  User.findByIdAndUpdate(myId, { name }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Такой пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректные данные при обновлении пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMe,
  updateMe,
  createUser,
  login,
  logOut,
};
