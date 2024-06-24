const express = require('express')
const AdminController = require('../Controllers/Administrador/AdminController')
const ingreso=require("../Controllers/Ingreso")
const AdminRutas=express.Router()


/**
 * @swagger
 * components:
 *  schemas:
 *      UsuarioDocente:
 *          type: object 
 *          properties:
 *              id_usuario:
 *                  type: interger
 *                  description : Id del registro de cada usuario
 *              tipoDoc:
 *                  type: string
 *                  description: Tipo de documento de cada persona
 *              numero_id:
 *                  type: string
 *                  description: Numero de documento del usuario
 *              id_rol:
 *                  type: interger
 *                  description: llave foranea para asignar que tipo de rol va a hacer
 *              Nombres:
 *                  type: string
 *                  description: Nombres del usuario que se guardan
 *              Apellidos:
 *                  type: string
 *                  description: Apellidos que se guardan del usuario
 *              fecha_nacimiento:
 *                  type: date
 *                  description: Fecha del dia que nacio el usuario
 *              Genero:
 *                  type: string
 *                  description: Nombres de genero al que pertenece el usuario
 *              correo:
 *                  type: string
 *                  description: correo unico de cada usuario 
 *              celular:
 *                  type: string
 *                  description: Numero de telefono de cada usuario
 *              contrasena:
 *                  type: string
 *                  description: Se guarda de forma encriptada la contraseña
 *              estado:
 *                  type: interger
 *                  description: Hay 3 posibles estados 0 inactivo 1 activo y 2 pendiente
 *          required:
 *              -tipoDoc
 *              -numero_id
 *              -id_rol
 *              -Nombres
 *              -Apellidos
 *              -fecha_nacimiento
 *              -genero
 *              -correo
 *              -celular
 *              -contrasena
 *              -estado
 *          example:
 *              tipoDoc : CC
 *              numero_id : 1034280980
 *              id_rol : 11
 *              Nombres: Juanito
 *              Apellidos: Cortazar
 *              fecha_nacimiento : 1985-11-07
 *              genero : masculino
 *              correo : CortazarJuan@gmail.com
 *              celular : 3158903278
 *              contrasena : CortaJuanito07
 *              estado : 1 
 */


/**
 * @swagger
 * /admin/ver_docentes:
 * get:
 *      summary: mostrar todos los docentes
 *      tags: [UsuarioDocente]
 *      responses:
 *        '200':
 *           description: Informacion de los docentes
 */
AdminRutas.get("/ver_docentes",AdminController.VerDocente)


/**
 * @swagger
 * /admin/ver_docentes:
 * post:
 *      summary : registrar Docente
 *      tags : [UsuarioDocente]
 *      requestBody:
 *          required : true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/UsuarioDocente'  
 *      responses:
 *        '200':
 *           description: registro de los docentes
 */
AdminRutas.post("/registrar_Docente",AdminController.AgregarDocente)


/**
 * @swagger
 * /admin/ver_docentes/{id}:
 *  put:
 *      summary: actualizar docente
 *      tags: [UsuarioDocente]
 *      parameters:
 *        - in : path
 *          name: id
 *          description: Id para actualizar
 *          schema: 
 *              type: integer
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/UsuarioDocente'
 *      responses:
 *         '200':
 *           description: actualizacion docente
 */
AdminRutas.put("/ver_docentes/:id",AdminController.ActualizarDocente)


/**
 * @swagger
 * /admin/ver_docentes/{id_docente}:
 *  put:
 *      summary: actualizar estado
 *      tags: [UsuarioDocente]
 *      parameters:
 *        - in : path
 *          name: id_docente
 *          description: id del estado a actuazlizar
 *          schema: 
 *              type: integer
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/UsuarioDocente'
 *      responses:
 *         '200':
 *           description: actualizacion de estado 
 */

AdminRutas.delete("/ver_docentes/:id",AdminController.EliminarDocente)

AdminRutas.post("/reportes",AdminController.reporteEstudiante)

AdminRutas.get("/verCantidades",AdminController.BuscarCantidad)

module.exports=AdminRutas;