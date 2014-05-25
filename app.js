
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
exports.app = app;

var routes = require('./routes');

var user = require('./routes/user');
var https = require('https');
var path = require('path');
var mongoDB = require('mongoose');
var serverConfiguration = require('./config.js');
var accounts_api = require('./routes/account_api.js')
var compress = require('compression');
var fs = require('fs');

var privateKey = fs.readFileSync('./certificates/privkey.pem').toString();
var certificate = fs.readFileSync('./certificates/newcert.pem').toString();
var options = {
		key: privateKey,
		cert: certificate
}

app.post('/register', accounts_api.registerUserAccount);
app.post('/login', accounts_api.logInUserAccount);
app.get('/logout', accounts_api.logOutUser)
app.get('/accountResources/allUsers.json', accounts_api.getAllAccounts);

mongoDB.connect(serverConfiguration.MONGODBADDRESS);

// all environments
app.set('port', serverConfiguration.SERVERPORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(compress());  
 

app.get('/', routes.index);
app.get('*', invalidResource);



function invalidResource(req, res){
	
	res.writeHead(404);
	res.end("invalid resource");
}

https.createServer(options, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

