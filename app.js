const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const limiter = require('./limiter');

const app = express();
const config = require('./config');
const auth = require('./middlewares/auth');
const { NOT_FOUND } = require('./constants');
const { NotFoundError } = require('./errors');
const { handleCors } = require('./middlewares/cors');
const errorsHandler = require('./middlewares/errorsHandler');
const routes = require('./routes/index');
const { createUser, login, logOut } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUserValidationSchema, loginValidationSchema } = require('./routes/shemaValidation');

// mongoose.connect(config.env === 'production' ? config.mongoDbUrl : process.env.MONGO_URL);
mongoose.connect('mongodb://localhost:27017/mestodb');
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
app.use(routes);
app.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND));
});
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(config.port, () => {
  console.log(`Сервер запущен на порту ${config.port}`);
});
