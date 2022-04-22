const express = require('express');

const validation = require('../validations/validation')
const authCtrl = require('../controllers/Auth');

const app = express();

app.post('/',validation.authenticate,authCtrl.authenticate, authCtrl.generateJWT, authCtrl.returnJWT);

app.post('/refresh',validation.refresh_token,authCtrl.refreshJWT, authCtrl.generateJWT, authCtrl.returnJWT);

module.exports =app ;