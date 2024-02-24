const express = require('express')
const bodyparser = require('body-parser')
const datosRouter = require('./Routes/datosRouter')
const cors = require('cors')
const {conn} = require('./Model/conn')



const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST','PUT','DELETE'],
};
app.use(cors(corsOptions));

app.use("/",datosRouter);


const puerto =process.env.port || 4000;

app.listen(puerto,()=>{
    console.log(`Escuchando en el puerto ${puerto}`)
})