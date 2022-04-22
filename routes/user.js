const express = require('express');

const userCtrl = require('../controllers/User');
const authCtrl = require('../controllers/Auth');
const validation = require('../validations/validation');
const app = express();

app.get('/list',authCtrl.verifyToken, userCtrl.list);
app.post('/create',validation.authenticate, userCtrl.create);
app.put('/update',authCtrl.verifyToken,validation.authenticate, userCtrl.update);
app.delete('/delete',authCtrl.verifyToken, userCtrl.remove);
app.get('/getuser',authCtrl.verifyToken, userCtrl.get);
app.put('/signout', userCtrl.signout);


module.exports = app;