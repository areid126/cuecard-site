const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require("./utils/config");
require('express-async-errors');
const cors = require('cors');
const userRouter = require('./routes/user');
const setRouter = require('./routes/set');
const imageRouter = require('./routes/image');
const folderRouter = require('./routes/folder');
const authRouter = require('./routes/auth');
const cardRouter = require('./routes/card');
const { setToken } = require('./utils/setToken');
const { handleError } = require('./utils/handleError');

const app = express();

app.use(cors(config.CORS_ACCESS));
if (config.MODE === "dev") app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setToken);

app.use('/api/user', userRouter);
app.use('/api/set', setRouter);
app.use('/api/image', imageRouter);
app.use('/api/folder', folderRouter);
app.use('/api/auth', authRouter);
app.use('/api/card', cardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) { next(createError(404)); });

// error handler
app.use(handleError);

module.exports = app;