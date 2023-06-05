const mongoose = require('mongoose');
const Movie = require('../models/movies');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors/index');

const savedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(201).send({ data: movies });
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const movieData = { ...req.body, owner: req.user._id };
  Movie.create(movieData)
    .then((movie) => {
      res.status(201).send({ data: movie });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Такой фильм не найден');
      }
      if (String(movie.owner) !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      }
      return Movie.deleteOne({ _id: String(movie._id) })
        .then((deletedMovie) => {
          res.status(201).send({ data: deletedMovie });
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
