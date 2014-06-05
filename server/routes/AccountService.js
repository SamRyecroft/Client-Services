var accounts_api = require('../controller/account_api.js');
var app = require('../app.js').app;

app.patch('/userAccount/profileUtilities/updateDetails', accounts_api.updateAccountDetails);

//app.patch('/userAccount/profileUtilities/changePassword', accounts_api.changePassword); 

app.post('/userAccount/accountTools/CreateNewAccount', accounts_api.registerUserAccount);

app.post('/accountAuthentication/login', accounts_api.logInUserAccount);

app.get('/logout', accounts_api.logOutUser)

app.get('/accountResources/allUsers.json', accounts_api.getAllAccounts);

app.get('/accountResources/isValidUserAccount.json', accounts_api.isValidUserAccount);

app.post('accountActions/newPassword', accounts_api.changePassword);

