var app = require('./app.js').app;

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("MONGODB_ADDRESS", "mongodb://localhost/clientServices");
define("SERVER_PORT", 3000);
define("MAXIMUM_FAILED_LOGIN_ATTEMPTS", 3);
define("LOCKOUT_TIME", (2));
 