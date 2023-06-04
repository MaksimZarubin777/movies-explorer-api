const mongoose = require('mongoose');
const { urlRegExp, ruRegExp, enRegExp } = require('../constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: (props) => `${props.value} is not valid`,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: (props) => `${props.value} is not valid`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: (props) => `${props.value} is not valid`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator: (v) => ruRegExp.test(v),
      message: (props) => `${props.value} - неверный формат записи названия фильма. Название должно быть на русском языке`,
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator: (v) => enRegExp.test(v),
      message: (props) => `${props.value} - неверный формат записи названия фильма. Название должно быть на английском языке`,
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
