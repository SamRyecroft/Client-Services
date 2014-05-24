var app = require('./app.js').app;
var account_api = require('./routes/account_api.js');
var routes = require('./routes');

app.post('/register', account_api.registerUserAccount);
app.post('/login', account_api.loginUserAccount);
app.post('/logout', account_api.logOutUser);

app.get('/', routes.index);

app.get('*', invalidResource);

function invalidResource(req, res){
	
	res.writeHead(404);
	res.end("invalid resource");
}

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("MONGODBADDRESS", "mongodb://localhost/clientServices");
define("SERVERPORT", 3000);
