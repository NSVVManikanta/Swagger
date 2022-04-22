const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//get user
function get(req, res) {
  const id=req.userId
  User.findByPk(id,
    { attributes: { exclude: ['password', 'refresh_token','createdAt','updatedAt'] } }).then((user) => {
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      return res.status(201).send(user);
    }
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}


//signup
function create(req, res) {
  User.create({
    username: req.body.username,
    password: req.body.password,
  }).then(() => {
    return res.status(201).send('User created successfully');
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

//signout
 function signout(req, res) {
  User.update({ refresh_token: "" },{where:{username:req.body.username}}).then(() => {
    return res.sendStatus(201);
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}
  


//update user
function update(req, res) {
  User.update({
    username:req.body.username,
    password:bcrypt.hashSync(req.body.password, 10),
    },{where:{id:req.userId}}).then((user) => {
      return res.status(200).send({
        username:req.body.username,
        password:req.body.password
      });
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

//users list
function list(req, res) {
  const { offset = 0, limit = 50 } = req.query;
  User.findAll({
    offset,
    limit,
    attributes: { exclude: ['password', 'refresh_token','createdAt','updatedAt'] },
  }).then((users) => {
    return res.status(200).json(users);
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}


//delete user
function remove(req, res) {
  User.destroy({where : {id:req.userId}}).then(() => {
   return res.status(200).send("Deleted Succcessfully!");
    }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}


module.exports = {
   get, create, update, list, remove,signout
};
