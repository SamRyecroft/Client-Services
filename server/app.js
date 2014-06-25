 var express = require('express');
var app = express();

var logingUtilities = require('./utilities/logger.js');
var databaseLogger = logingUtilities.logger.loggers.get('Database error');
var serverLogger = logingUtilities.logger.loggers.get('Server error');
exports.app = app;



var https = require('https');
var path = require('path');
var mongoDB = require('mongoose');
var serverConfiguration = require('./config.js');
var compress = require('compression');
var fs = require('fs');
var util = require('util')
var BasicStrategy = require('passport-http').BasicStrategy;

var passport = require('passport');


// Connects the database to the server useing the value stored within the server configuration folder, 
mongoDB.connect(serverConfiguration.MONGODB_ADDRESS, function (err){

	if (err){
		console.log('There was an error connecting to the database, please check the logs');
		databaseLogger.error(err.message);
		process.exit(1);
		
	}else {
		console.log ('sucsessful connection to the database');
		databaseLogger.info('Connected to database');
	}
});

// Sets the on error method for the database connection
mongoDB.connection.on("error", function (err){

	if (err){
		console.log('Connection to the database has been lost attmpting to reconnect...');
		databaseLogger.warn(err.message);
	}

});

// Sets the port that the application will use, this is loaded from the configuration file
app.set('port', serverConfiguration.SERVER_PORT);

// Sets the view engin of the application to jade
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));


// Sets the application to use Compress which enables Gzip compression to responses from the server
app.use(compress());  
app.use(passport.initialize());

 // If the server dose not have a method mapped to the requested url the server will return a 404 error


// Loading private key for server
var privateKey = fs.readFileSync('./certificates/privkey.pem').toString(); 

// Loading certificate for server
var certificate = fs.readFileSync('./certificates/newcert.pem').toString();

// Createing the options file for the server 
var options = {
		key: privateKey, 
		cert : certificate
}
require('./routes/AccountService.js');
// Creates a https server useing the loaded private key and certificate and deploys the app on it
https.createServer(options, app).listen(app.get('port'), function(){

	// Outputs that the sever is running and listing on the appopriate port
	console.log('Express server listening on port ' + app.get('port'));
});

