const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const limiter = require('./limiter');

const app = express();
const config = require('./config');
const auth = require('./middlewares/auth');
const { NotFoundError } = require('./errors');
const { handleCors } = require('./middlewares/cors');
const errorsHandler = require('./middlewares/errorsHandler');
const { userRouter, movieRouter } = require('./routes/index');
const { createUser, login, logOut } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUserValidationSchema, loginValidationSchema } = require('./routes/shemaValidation');

mongoose.connect(config.env === 'production' ? config.mongoDbUrl : 'mongodb://127.0.0.1:27017/bitfilmsdb');
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(handleCors);
app.use(requestLogger);
app.post('/signup', celebrate({ body: createUserValidationSchema }), createUser);
app.post('/signin', celebrate({ body: loginValidationSchema }), login);
app.use('/signout', logOut);
app.use(auth);
app.use('/users', userRouter);
app.use('/movies', movieRouter);
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(config.port);
