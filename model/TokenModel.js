var mongoDB = require('mongoose');
var userId = mongoDB.Schema.ObjectId;
var Schema = mongoDB.Schema;
var serverConfiguration = require('../config');
var crypto = require('crypto');

var tokenSchema = mongoDB.Schema({
	
	emailAddress:String,
	series:String,
	issueTime:Date
	
});

var tokenModel = mongoDB.model('token', tokenSchema);


function createToken (emailAddress, callback){
	
	crypto.randomBytes(48, function(ex, buf) {
		 var tokenSeries = buf.toString('hex');
		  
		  var token = new tokenModel({
			  emailAddress: emailAddress,
			  series: tokenSeries,
			  issueTime: new Date()
		  });
		  
		  token.save(function(err, token){
				
				if (err){
					console.error(err);
					callback(new Error("Token genration error"), null);
					
				}else {
					callback(null, token);
				}
					
				
			});
		});
}

function verifyToken (username, token) {
	
}

function invalidateToken (username, token ){
	
	
}

exports.tokenModel = tokenModel;

exports.createToken = createToken;
exports.verifyToken = verifyToken;
exports.invalidateToken = invalidateToken;