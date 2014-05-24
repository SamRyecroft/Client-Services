
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var account_api = require('./routes/account_api.js');
var mongoDB = require('mongoose');
var serverConfiguration = require('./config.js');
var app = express();

mongoDB.connect(serverConfiguration.MONGODBADDRESS);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', routes.index);

app.post('/register', account_api.registerUserAccount);
app.post('/login', account_api.loginUserAccount);
app.post('/logout', account_api.logOutUser);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
