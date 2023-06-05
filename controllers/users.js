const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const config = require('../config');
const { BadRequestError, ConflictError, NotFoundError } = require('../errors');
const {
  OK_STATUS,
  USER_WRONG_DATA,
  DUBLICATE_ERROR,
  DUBLICATE_EMAIL,
  USER_NOT_FOUND,
  USER_WRONG_UPDATE,
} = require('../constants');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(USER_WRONG_DATA));
      } else if (err.code === DUBLICATE_ERROR) {
        next(new ConflictError(DUBLICATE_EMAIL));
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
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.send({ data: user });
    })
    .catch(next);
};

const updateMe = (req, res, next) => {
  const { name, email } = req.body;
  const myId = req.user._id;
  User.findOne({ email })
    .then((existinguser) => {
      if (existinguser && existinguser._id.toString() !== myId) {
        throw new ConflictError(DUBLICATE_EMAIL);
      }
      return User.findByIdAndUpdate(myId, { name, email }, { new: true, runValidators: true })
        .orFail(new NotFoundError(USER_NOT_FOUND))
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            next(new BadRequestError(USER_WRONG_UPDATE));
          } else {
            next(err);
          }
        });
    });
};

module.exports = {
  getMe,
  updateMe,
  createUser,
  login,
  logOut,
};
