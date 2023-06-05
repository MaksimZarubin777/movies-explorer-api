const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { AuthorizeError } = require('../errors');
const { WRONG_AUTH_DATA } = require('../constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true },
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
}, {
  toJSON: { useProjection: true },
  toObject: { useProjection: true },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizeError(WRONG_AUTH_DATA));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizeError(WRONG_AUTH_DATA));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
