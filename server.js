require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app)


app.listen(process.env.PORT, ()=>{
     console.log('server is running on port: ' + process.env.PORT);
})