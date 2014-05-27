var accounts_api = require('../controller/account_api.js');
var app = require('../app.js').app;

app.post('/register', accounts_api.registerUserAccount);

app.post('/login', accounts_api.logInUserAccount);

app.get('/logout', accounts_api.logOutUser)

app.get('/accountResources/allUsers.json', accounts_api.getAllAccounts);

app.get('/accountResources/isValidUserAccount.json', accounts_api.isValidUserAccount);
