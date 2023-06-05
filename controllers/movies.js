const mongoose = require('mongoose');
const Movie = require('../models/movies');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors/index');
const {
  WRONG_DATA_ERROR,
  FILM_NOT_FOUND,
  FILM_WRONG_OWNER,
  OK_STATUS,
} = require('../constants');

const savedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(OK_STATUS).send({ data: movies });
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const movieData = { ...req.body, owner: req.user._id };
  Movie.create(movieData)
    .then((movie) => {
      res.status(OK_STATUS).send({ data: movie });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(WRONG_DATA_ERROR));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(FILM_NOT_FOUND);
      }
      if (String(movie.owner) !== req.user._id) {
        throw new ForbiddenError(FILM_WRONG_OWNER);
      }
      return Movie.deleteOne({ _id: String(movie._id) })
        .then((deletedMovie) => {
          res.status(OK_STATUS).send({ data: deletedMovie });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  savedMovies,
  createMovie,
  deleteMovie,
};
