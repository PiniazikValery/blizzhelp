import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import webpackDevServer from '../webpack/dev-server';
import indexRouter from './routes';
import wowRouter from './routes/wow';
import authApi from './api/routes/auth_api_route';

const MongoStore = require('connect-mongo')(session);

const app = express();

mongoose.connect('mongodb://localhost:27017/blizzhelpDb', {
  useNewUrlParser: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
});

app.use(session({
  secret: 'Dfkthfgbyzpbr1',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
  }),
}));

// view engine setup
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'pug');
if (process.env.NODE_ENV !== 'production') {
  webpackDevServer(app);
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/public')));

app.use('/', indexRouter);
app.use('/wow', wowRouter);
app.use('/api', authApi);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
