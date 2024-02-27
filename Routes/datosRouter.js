const express = require("express");
const adminController =require('../Controllers/Administrador/AdminController');
//const alumnoController =require('../Controllers/Alumno');
//const docenteController =require('../Controllers/Docente');
const rutaDatos = express.Router();


rutaDatos.get("/ver_docentes",adminController.VerDocente)
rutaDatos.post("/registrar_Docente",adminController.AgregarDocente)

//peticones de Agregar horario
rutaDatos.get("/verHorarios", adminController.mostrarHorario);
rutaDatos.get("/opsionesActividad", adminController.mostrarOpcionesDeActividad);
rutaDatos.get("/filtroHorarios", adminController.filtrarActividadesHorario);
rutaDatos.get("/buscarHorarios/:Lugar/:Dia_semana", adminController.buscarHorariosIguales);
rutaDatos.post("/agregarHorarios", adminController.agregarHorario);
rutaDatos.post("/agregarHorariosActividad", adminController.agregarHorarioActividad);
rutaDatos.put("/actualizarEstado/:id_horario", adminController.actualizarestado);
rutaDatos.put("/actualizarHorario/:id_horario", adminController.actualizarhorario);
rutaDatos.get("/buscarID/:id_horario", adminController.buscarIdHorario);

module.exports=rutaDatos;