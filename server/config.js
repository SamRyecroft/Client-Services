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
define("OUTGOING_EMAIL_ADDRESS", "testemailnodejs@gmail.com");
define("EMAIL_ACCOUNT_PASSWORD", "totalySecurePassword123");
define("SERVICE", "Gmail");
define("PASSWORD_RECOVERY_KEY_LIFE_SPAN", 24);
define('FACEBOOK_APP_ID', '563369227113484');
define('FACEBOOK_APP_SECRET', '4a6c58a748973605599ace09ff810e21');

 