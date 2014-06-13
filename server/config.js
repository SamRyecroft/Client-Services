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
define("OUTGOING_EMAIL_ADDRESS", "justsam33@gmail.com");
define("EMAIL_ACCOUNT_PASSWORD", "macB00kAir");
define("SERVICE", "Gmail");
define("PASSWORD_RECOVERY_KEY_LIFE_SPAN", 24);

 