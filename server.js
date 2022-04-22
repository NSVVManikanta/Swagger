const express = require('express'); 
const sequelize =require('./util/database');
const albums = require('./models/albums');
const songs = require('./models/songs');
const route = require('./routes/route');
const users = require('./routes/user');
const auth = require('./routes/auth');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocs = yaml.load('./swagger.yaml');
const app = express();

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));



app.use(express.json());

albums.hasMany(songs,{ foreignKey: 'albumId' });
songs.belongsTo(albums);

sequelize
.sync({force:false})
.then((result)=>{
    console.log(result);
}).catch(err=>console.log(err));

app.use('/',route);
app.use('/auth',auth);
app.use('/users',users);



app.listen(8080,()=>{
    console.log('Sever running on 8080!');
});