var express = require('express');
var logger = require('morgan');
var path = require('path');
var router = express.Router();
var RSVP = require("rsvp")
var Promise = RSVP.Promise
var fs = require("fs")
var path = require("path")
var marked = require("marked")

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'))

// Routes
////////////////////////////////////////////////////////////////////////////////

router.get("/", function(req, res, next){
  // Render the README file.
  var p = new Promise(function(res, rej){
    fs.readFile("README.md", "utf8", function(err, data) {
      if (err) throw err
      res(data)
    })
  }).then(function(val){
    res.status(200).send(marked(val.toString()))
  })
})

// {"ipaddress":"76.14.162.131","language":"en-US","software":"Windows NT 6.3; WOW64"}
router.get("/api/whoami", function(req, res, next){
  var userAgent = req.get("User-Agent")
  var software = userAgent.substring(userAgent.indexOf("(") + 1, userAgent.indexOf(")"))
  var whoami = {
    ipaddress: req.ip,
    language: req.get("Accept-Language").split(",")[0],
    software: software
  }
  res.status(200).json(whoami)
})

app.use(router)

// Error Handlers
////////////////////////////////////////////////////////////////////////////////

// Development Error Handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production Error Handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
