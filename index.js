const express = require('express')
const bodyparser = require('body-parser')
const datosRouter = require('./Routes/datosRouter')
const rutaHorarios = require('./Routes/horariosRouter')
const AdminRoutes = require('./Routes/AdminRoutes')
const cors = require('cors')
const {conn} = require('./Model/conn')
const {swaggerJSDOCs} = require('./swagger') 


const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST','PUT','DELETE'],
};
app.use(cors(corsOptions));

app.use("/",datosRouter);
app.use("/horario", rutaHorarios);
app.use("/admin", AdminRoutes);

app.get("/", (req, res)=>{
    res.send("Bienvenido a mi API conectandome a MYSQL...");
});

const puerto =process.env.port || 4000;

app.listen(puerto,()=>{
    console.log(`Escuchando en el puerto ${puerto}`);
    swaggerJSDOCs(app, 4000);
})