const express = require('express');
const { celebrate } = require('celebrate');

const movieRouter = express.Router();
const { savedMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { movieCreateValidationSchema, idValidationSchema } = require('./shemaValidation');

movieRouter.get('/', savedMovies);
movieRouter.post('/', celebrate({ body: movieCreateValidationSchema }), createMovie);
movieRouter.delete('/:_id', celebrate({ params: idValidationSchema }), deleteMovie);

module.exports = {
  movieRouter,
};
