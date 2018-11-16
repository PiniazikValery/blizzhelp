import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import http from 'http';
import connectMongo from 'connect-mongo';
import socketIO from 'socket.io';
import debug from 'debug';
import webpackDevServer from '../webpack/dev-server';
import indexRouter from './routes';
import wowRouter from './routes/wow';
import authApi from './api/routes/auth_api_route';
import config from './config';

class Server {
  constructor() {
    this.MongoStore = connectMongo(session);
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server);
    this.db = mongoose.connection;
    this.port = Server.normalizePort(process.env.PORT || config.get('port'));
    this.debug = debug('test-site:server');
  }

  static normalizePort(val) {
    const normalizedPort = parseInt(val, 10);

    if (isNaN(normalizedPort)) {
      return val;
    }
    if (normalizedPort >= 0) {
      return normalizedPort;
    }
    return false;
  }

  setUpMongo() {
    mongoose.connect('mongodb://localhost:27017/blizzhelpDb', {
      useNewUrlParser: true,
    });
    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', () => {
      // we're connected!
    });
    this.app.use(session({
      secret: 'Dfkthfgbyzpbr1',
      resave: true,
      saveUninitialized: false,
      store: new this.MongoStore({
        mongooseConnection: this.db,
      }),
      cookie: {
        'maxAge': 60 * 1000000,
        'secure': false,
      },
    }));
  }

  setUpViewEngine() {
    this.app.set('views', path.join(__dirname, '../client/views'));
    this.app.use(express.static(path.join(__dirname, '../client/public')));
    this.app.set('view engine', 'pug');
  }

  setUpWebpackDevServer() {
    if (process.env.NODE_ENV !== 'production') {
      webpackDevServer(this.app);
    }
  }

  setUpLogger() {
    this.app.use(logger('dev'));
  }

  setUpJson() {
    this.app.use(express.json());
  }

  setUpEncodedUrl() {
    this.app.use(express.urlencoded({
      extended: false,
    }));
  }

  setUpCookeParser() {
    this.app.use(cookieParser());
  }

  setUpSocketIO() {
    let currentSocket;
    this.io.on('connect', (socket) => {
      currentSocket = socket;
    });
    this.app.use((req, res, next) => {
      req.socketIo = currentSocket;
      next();
    });
  }

  setUpRouters() {
    this.app.use('/', indexRouter);
    this.app.use('/wow', wowRouter);
    this.app.use('/api', authApi);
  }

  setUpErrorHandler() {
    this.app.use((req, res, next) => {
      next(createError(404));
    });
    this.app.use((err, req, res) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
  }

  setUpPort() {
    this.app.set('port', this.port);
  }

  startListen() {
    this.server.listen(this.port);
  }
}

export default Server;
