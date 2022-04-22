const express = require("express");
const app = express();
const authCtrl = require('../controllers/Auth')

const albumControllers = require("../controllers/album");
const songControllers = require("../controllers/song");

app.use(express.json());

app.use(function(req, res, next) {
  req.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// albums
app.get('/',authCtrl.verifyToken,albumControllers.welcome);

app.post("/albums",authCtrl.verifyToken, albumControllers.create);

app.get("/albums", authCtrl.verifyToken,albumControllers.list);

app.put("/albums/:albumId",authCtrl.verifyToken, albumControllers.update);

app.delete("/albums/:albumId",authCtrl.verifyToken, albumControllers.deleteAlbum);

// songs

app.post("/albums/:albumId/songs",authCtrl.verifyToken, songControllers.create);

app.get("/albums/:albumId/songs/:songId",authCtrl.verifyToken,songControllers.getSong);

app.get("/songs",authCtrl.verifyToken, songControllers.list);

app.put("/albums/:albumId/songs/:songId",authCtrl.verifyToken, songControllers.update);

app.delete("/albums/:albumId/songs/:songId",authCtrl.verifyToken,songControllers.deleteSong);

module.exports = app;