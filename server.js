const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('./db/db');

const userController = require('./controllers/userController');

const photoController = require('./controllers/photoController');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(methodOverride('_method'));
app.use('/users', userController);
app.use('/photos', photoController);



app.get('/', (req,res)=>{
    res.render('index.ejs');
})









app.listen(3000, ()=>{
    console.log('Server running...');
});