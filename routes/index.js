const express = require('express');
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');

const router = express.Router();
router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = router;
