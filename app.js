var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const PORT = process.env.PORT || 3001;
const app = express();

if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

}
else{

    // view engine setup
    app.set('views', path.join(__dirname, 'client/build'));
    app.set('view engine', 'jsx');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname+ '/client/build/index.html'));
    });
    require('./routes/filemaker')(app);
    require('./routes/functionality')(app);
    require('./routes/login')(app);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
    app.listen(PORT, function () {
     console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
   });

  }

  module.exports = app;
