var nodemailer = require('nodemailer');
var serverConfiguration = require('../config.js');
var smtpTransport = nodemailer.createTransport("SMTP", {
	service: serverConfiguration.SERVICE,
	auth:{
		user: serverConfiguration.OUTGOING_EMAIL_ADDRESS,
		pass: serverConfiguration.EMAIL_ACCOUNT_PASSWORD
	}
})


var logingUtilities = require('./logger.js');
var databaseLogger = logingUtilities.logger.loggers.get('Database error');
var serverLogger = logingUtilities.logger.loggers.get('Server error');

function sendEmail (recipient, subject, plainTextBody, htmlBody){
	
	var mailOptions = {
			from: serverConfiguration.OUTGOING_EMAIL_ADDRESS,
			to: recipient,
			subject: subject,
			text: plainTextBody,
			html: htmlBody
	}

	smtpTransport.sendMail(mailOptions, function(err, response){

		if (err){

			serverLogger.warn(err.message + " could not send email to account " + recipient);
			callback (err);

		}
	});
}

exports.sendEmail = sendEmail;

