
var express = require('express');
var app = express();
exports.app = app;

require('./routes/accountService.js');
require('./routes/index.js');

var https = require('https');
var path = require('path');
var mongoDB = require('mongoose');
var serverConfiguration = require('./config.js');
var compress = require('compression');
var fs = require('fs');

var routes = require ('./routes');

var privateKey = fs.readFileSync('./certificates/privkey.pem').toString(); 
var certificate = fs.readFileSync('./certificates/newcert.pem').toString();

var options = {
		key: privateKey,
		cert : certificate
}



mongoDB.connect(serverConfiguration.MONGODB_ADDRESS);

// all environments
app.set('port', serverConfiguration.SERVER_PORT);
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(compress());  
 
app.get('*', invalidResource);



function invalidResource(req, res){
	
	res.writeHead(404);
	res.end("invalid resource");
}

https.createServer(options, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

