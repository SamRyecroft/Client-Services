var logger = require('winston');

logger.loggers.add('Database error', {

	console:{
		level : 'important',
		colorize : 'true',
		lable : 'database error'
	},

	file:{
		filename: './logs/databaselog.txt'
	}
});

logger.loggers.add('Server error', {

	console:{
		level : 'important',
		colorize : 'true',
		lable : 'server error'
	},

	file: {
		filename: './logs/serverlog.txt'
	}
});

exports.logger = logger;