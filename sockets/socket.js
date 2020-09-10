const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('Queen'))
bands.addBand(new Band('Metalica'))
bands.addBand(new Band('Rammstein'))


//MENSAJES DE SOCKETS
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
     });

     
     client.on('message', (payload) => {
        console.log('Mensaje', payload);
        io.emit('message', {admin: 'Nuevo mensaje'});
     })

     client.on('flutter-event', function(payload){
         console.log('Flutter Event: ', payload);
         io.emit('flutter-event-html', payload);
     })

      client.on('vote-band', (payload) => {
         console.log(payload.id);
         bands.voteBand(payload.id);
         io.emit('active-bands', bands.getBands());
      })

      client.on('add-band', (payload) => {
         bands.addBand(new Band(payload.name));
         io.emit('active-bands', bands.getBands());
      })

      client.on('delete-band', (payload) =>{
         bands.deleteBands(payload.id);
         io.emit('active-bands', bands.getBands());
      })

});