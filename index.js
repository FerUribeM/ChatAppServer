const express = require('express');
const path = require('path');
require('dotenv').config();

require('./database/config').dbConnection();

//APP de Express
const app = express();

//Lectura y parseo del Body
app.use( express.json() );

//NODE SERVER
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);

require('./sockets/socket');

const port = process.env.PORT || 3003;

const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath))

//MIS RUTAS
app.use('/api/login', require('./routes/auth'))

server.listen(port, () =>{
     console.log('Escuchando en el puerto: ', port);
})

 app.get('/', (req, res) => {
    res.status(200).send('Servidor respondiendo correctamente en puesto 3003');
 })

 module.exports = app;