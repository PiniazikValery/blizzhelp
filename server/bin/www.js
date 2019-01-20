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

const MongoStore = require('connect-mongo')(session);
const debug = require('debug')('test-site:server');

const app = express();

mongoose.connect('mongodb://pinval:Dfkthfgbyzpbr1@cluster0-shard-00-00-j1nom.mongodb.net:27017,cluster0-shard-00-01-j1nom.mongodb.net:27017,cluster0-shard-00-02-j1nom.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', {
  useNewUrlParser: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
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

// view engine setup
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

function normalizePort(val) {
  const _port = parseInt(val, 10);

  if (isNaN(_port)) {
    // named pipe
    return val;
  }

  if (_port >= 0) {
    // port number
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

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
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
