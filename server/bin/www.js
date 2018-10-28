import Server from '../server';

const server = new Server();

server.setUpMongo();

server.setUpSocketIO();

server.setUpViewEngine();

server.setUpWebpackDevServer();

server.setUpLogger();

server.setUpJson();

server.setUpEncodedUrl();

server.setUpCookeParser();

server.setUpRouters();

server.setUpErrorHandler();

server.setUpPort();

server.startListen();
