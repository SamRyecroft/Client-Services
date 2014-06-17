var accounts_api = require('../controller/account_api.js');
var app = require('../app.js').app;

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    next();
});
 
app.get('/accountResources/existingUsername', accounts_api.isUsernameRegistered);

app.get('/accountResources/registeredEmailAddress', accounts_api.isEmailAddressRegistered);

app.get('/userAccount/accountTools/accountRecovery/generateRecoveryKey', accounts_api.createRecoveryKeyForAccount);

app.post('/userAccount/accountTools/accountRecovery/recoverAccountWithKey', accounts_api.recoverAccountWithRecoveryKey);

app.patch('/userAccount/profileUtilities/updateDetails', accounts_api.updateAccountDetails);

app.patch('/userAccount/profileUtilities/changePassword', accounts_api.changePassword); 

app.patch('/userAccounts/profileUtilities/changeEmailAddress', accounts_api.updateEmailAddress);

app.post('/userAccount/accountTools/CreateNewAccount', accounts_api.registerUserAccount);

app.post('/auth/login', accounts_api.logInUserAccount);

app.get('/auth/logout', accounts_api.logOutUser);

app.get('/accountResources/users', accounts_api.getAllAccounts);




