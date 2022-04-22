const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const config = require('../config/authConfig');
const User = require('../models/user');

//sign in
function authenticate(req, res, next) {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user && user.comparePassword(req.body.password)) {
      req.dbUser = user;
      next();
    } else {
      res.status(401).json({ error: 'Wrong username or password' });
    }
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

//Generate JWT
async function generateJWT(req, res, next) {
  if (req.dbUser) {
    const jwtPayload = { id: req.dbUser.id };
    
    req.token = jwt.sign(jwtPayload, config.secret, { expiresIn: 43200 });
    // Sets a new refresh_token every time the jwt is generated
    await req.dbUser.update({ refresh_token: uuidv4() }).catch((e) => {
      res.status(500).json({ error: e.message });
    });
  }
  next();
}

//Refresh JWT
function refreshJWT(req, res, next) {
  User.findOne({
    where: {
      username: req.body.username,
      refresh_token: req.body.refresh_token,
    },
  }).then((user) => {
    req.dbUser = user;
    next();
  }).catch(() => {
    res.status(401).json({ error: 'Invalid username or refresh_token' });
  });
}

function returnJWT(req, res) {
  if (req.dbUser && req.token) {
   return res.status(201).json({ userId:req.dbUser.id,access_token: req.token, refresh_token: req.dbUser.refresh_token });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

//Verify Token
function verifyToken(req, res, next){
  let token = req.headers["x-access-token"];
 
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};


module.exports = {
  authenticate, generateJWT, refreshJWT, returnJWT,verifyToken
};