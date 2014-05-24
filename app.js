
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
exports.app = app;


var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoDB = require('mongoose');
var serverConfiguration = require('./config.js');



mongoDB.connect(serverConfiguration.MONGODBADDRESS);

// all environments
app.set('port', serverConfiguration.SERVERPORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

