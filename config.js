var app = require('./app.js').app;




function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("MONGODBADDRESS", "mongodb://localhost/clientServices");
define("SERVERPORT", 3000);
 