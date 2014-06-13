var logger = require('winston');

// Creates a new type of logger called 'Database error'
logger.loggers.add('Database error', {

	console:{
		level : 'important',
		colorize : 'true',
		lable : 'database error'
	},

	file:{
		
		// Sets the file path for the logger
		filename: './logs/databaselog.txt'
	}
});


// Creates a new type of logger called 'Server error'
logger.loggers.add('Server error', {

	console:{
		level : 'important',
		colorize : 'true',
		lable : 'server error'
	},

	file: {
		
		// Sets the file path for the logger
		filename: './logs/serverlog.txt'
	}
});

exports.logger = logger;