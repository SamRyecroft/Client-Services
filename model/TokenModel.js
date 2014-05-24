var mongoDB = require('mongoose');
var userId = mongoDB.Schema.ObjectId;
var Schema = mongoDB.Schema;
var serverConfiguration = require('../config');
var crypto = require('crypto');

var tokenSchema = mongoDB.Schema({

	emailAddress : String,
	series : String,
	issueTime : Date

});

var tokenModel = mongoDB.model('token', tokenSchema);

function createToken(emailAddress, callback) {

	crypto.randomBytes(48, function(ex, buf) {

		var token = new tokenModel({
			emailAddress : emailAddress,
			series : buf.toString('hex'),
			issueTime : new Date()
		});

		token.save(function(err, token) {

			if (err) {
				console.error(err);
				callback(new Error("Token genration error"), null);

			} else {
				callback(null, token);
			}

		});
	});
}

function verifyToken(token) {
	tokenModel.find({
		emailAddress : token.emailAddress,
		series : token.series,
		issueTime : token.issueTime
	}, null, function(err, results) {
		
		console.log(results);
		
		if (results.length === 1){
			
			console.log(true);
		}else {
			
			console.log(false);
		}
	});
}

function invalidateToken(token) {
	tokenModel.remove({
		emailAddress : token.emailAddress,
		series : token.series,
		issueTime : token.issueTime
	}, function(err, removed) {

		console.log('removed');
	});

}

exports.tokenModel = tokenModel;

exports.verifyToken = verifyToken;
exports.invalidateToken = invalidateToken;
exports.createToken = createToken;
exports.verifyToken = verifyToken;
exports.invalidateToken = invalidateToken;