module.exports = {
  urlRegExp: /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]{1,}(\.[a-zA-Z]{1,})([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{1,})?/i,
  ruRegExp: /([а-яё])/i,
  enRegExp: /([a-z])/i,
  MONGO_URL: 'mongodb://127.0.0.1:27017/bitfilmsdb',
  WRONG_DATA_ERROR: 'Введены некорректные данные',
  FILM_NOT_FOUND: 'Такой фильм не найден',
  USER_NOT_FOUND: 'Такой пользователь не найден',
  FILM_WRONG_OWNER: 'Нельзя удалить чужой фильм',
  USER_WRONG_DATA: 'Некорректные данные при создании пользователя',
  USER_WRONG_UPDATE: 'Некорректные данные при обновлении пользователя',
  DUBLICATE_EMAIL: 'Такой email уже используется',
  AUTH_REQUIRED: 'Необходима авторизация',
  WRONG_AUTH_DATA: 'Неправильные почта или пароль',
  NOT_FOUND: 'Запрашиваемый ресурс не найден',
  DUBLICATE_ERROR: 11000,
  OK_STATUS: 201,
};
