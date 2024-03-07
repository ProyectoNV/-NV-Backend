const express = require('express')
const AdminController = require('../Controllers/Administrador/AdminController')
const AdminRutas=express.Router()


AdminRutas.get("/ver_docentes",AdminController.VerDocente)
AdminRutas.post("/registrar_Docente",AdminController.AgregarDocente)
AdminRutas.put("/ver_docentes/:id",AdminController.ActualizarDocente)
AdminRutas.delete("/ver_docentes/:id",AdminController.EliminarDocente)



module.exports=AdminRutas;