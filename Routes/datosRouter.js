const express = require("express");
const DocenteController =require('../Controllers/Docente/DocenteControler');
const loginController =require('../Controllers/Ingreso');
//const docenteController =require('../Controllers/Docente');
const rutaDatos = express.Router();

//peticiones de ingreso
rutaDatos.post("/ingresar", loginController.IniciarSesion);

rutaDatos.get("/Informacion/usuario/:id_usuario", DocenteController.RenderInfo);

rutaDatos.put("/actilizar/InfoUser/:id_usuario", DocenteController.ActualizarInfoUser);



module.exports=rutaDatos;