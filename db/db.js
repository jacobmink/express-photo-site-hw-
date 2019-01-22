const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost/photo-site';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on('connect', ()=>{
    console.log('MONGOOSE CONNECTED TO ', connectionString);
});

mongoose.connection.on('error', (err)=>{
    console.log('ERROR ', err)
});

mongoose.connection.on('disconnect', ()=>{
    console.log('MONGOOSE DISCONNECTED FROM ', connectionString);
});