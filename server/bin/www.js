import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import http from 'http';
import config from '../config';
import webpackDevServer from '../../webpack/dev-server';
import indexRouter from '../routes';
import wowRouter from '../routes/wow';
import authRouter from '../routes/auth';
import authApi from '../api/routes/auth_api_route';
import User from '../models/account/user';

const MongoStore = require('connect-mongo')(session);
const debug = require('debug')('test-site:server');
const winston = require('../logger');

const user = new User();

const app = express();

mongoose.connect(config.get('connectionString'), {
  useNewUrlParser: true,
});
const db = mongoose.connection;

db.on('error', () => {
  winston.error('db connection error');
});
db.once('open', () => {
  user.getCountOfSuperAdmins((err, count) => {
    if (count === 0) {
      user.createSuperAdmin(config.get('superAdminEmail'), config.get('superAdminUserName'), config.get('superAdminPassword'), (creationErr) => {
        winston.error(creationErr);
      });
    }
  });
});

app.use(cookieParser());

app.use(session({
  secret: 'Dfkthfgbyzpbr1',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
    ttl: config.get('ttl_days') * 24 * 60 * 60,
  }),
  cookie: { secure: false },
}));

app.set('views', path.join(__dirname, '../../client/views'));
app.set('view engine', 'pug');
if (process.env.NODE_ENV !== 'production') {
  webpackDevServer(app);
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));
app.use(express.static(path.join(__dirname, '../../client/public')));

app.use('/', indexRouter);
app.use('/wow', wowRouter);
app.use('/api', authApi);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

function normalizePort(val) {
  const _port = parseInt(val, 10);

  if (isNaN(_port)) {
    return val;
  }

  if (_port >= 0) {
    return _port;
  }

  return false;
}

const port = normalizePort(process.env.PORT || config.get('port'));
app.set('port', port);

const server = http.createServer(app);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      winston.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      winston.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
