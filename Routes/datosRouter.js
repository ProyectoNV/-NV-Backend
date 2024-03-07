const express = require("express");
const adminController =require('../Controllers/Administrador/AdminController');
const loginController =require('../Controllers/Ingreso');
//const docenteController =require('../Controllers/Docente');
const rutaDatos = express.Router();

//peticiones de ingreso
rutaDatos.post("/ingresar", loginController.IniciarSesion);






module.exports=rutaDatos;