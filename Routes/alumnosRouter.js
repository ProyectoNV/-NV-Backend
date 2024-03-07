const express = require("express");
const AlumnoController = require('../Controllers/Alumno/AlumnoController');
const rutaAlumno = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Usuario:
 *          type: object
 *          properties:
 *              id_usuario:
 *                  type: integer
 *                  description: Id de cada usuario del sistema
 *              pkfc_tdoc:
 *                  type: string
 *                  description: Tipo de documento del usuario
 *              numero_id:
 *                  type: string
 *                  description: Numero de documento del usuario
 *              id_rol:
 *                  type: integer
 *                  description: numero de rol que cumple cada usuarion en el sistema
 *              Nombres:
 *                  type: string
 *                  description: Nombres de cada usuario que desea registrarse en el sistema 
 *              Apellidos:
 *                  type: string
 *                  description: Apellidos de cada usuario que desea registrarse en el sistema 
 *              fecha_nacimiento:
 *                  type: date
 *                  description: Fecha de nacimietno de cada usuaio que desea registrarse en el sistema 
 *              Genero:
 *                  type: string
 *                  description: Genero de cada usuario
 *              correo:
 *                  type: string
 *                  description: correo de cada usuario que desea registrarse en el sistema 
 *              celular:
 *                  type: string
 *                  description: Numero de celular de cada usuaio que desea registrarse en el sistema 
 *              contrasena:
 *                  type: string
 *                  description: contrasenia con la que el usuario ingresara al sistema
 *              estado:
 *                  type: string
 *                  description: el estado del usuario si es activo o inactivo 
 *              nombre_acudiente:
 *                  type: string
 *                  description: Nombre del acudiente del alumno
 *              correo_acudiente:
 *                  type: string
 *                  description: correo del acudiente del alumno
 *              celular_acudiente:
 *                  type: string
 *                  description: Celurlar del acudiente del alumno
 *          required:
 *              - id_usuario
 *              - pkfk_tdoc
 *              - numero_id
 *              - id_rol
 *              - Nombres
 *              - Apellidos
 *              - fecha_nacimiento
 *              - genero
 *              - correo
 *              - celular
 *              - contrasena
 *              - estado
 *              - nombre_acudiente
 *              - correo_acudiente
 *              - celular_acudiente
 *          example: 
 *              pkfk_tdoc: TI
 *              numero_id : 1021665637
 *              id_rol : 12
 *              Nombres: Angel   
 *              Apellidos : Gonzalez
 *              fecha_nacimiento : 2008-02-21
 *              genero : masculino
 *              correo: angel@gmail.com 
 *              celular : 3124560780
 *              contrasena : angel1234
 *              estado : 1   
 *              nombre_acudiente : sofia piedrahita
 *              correo_acudiente : sofi@gmail.com
 *              celular_acudiente : 3145670912       
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      alumno:
 *          type: object
 *          properties:
 *              id_alumno:
 *                  type: integer
 *                  description: Id autogenerado en la BDD
 *              nombre_acudiente:
 *                  type: string
 *                  description: Nombre del acudiente del alumno
 *              correo_acudiente:
 *                  type: string
 *                  description: correo del acudiente del alumno
 *              celular:
 *                  type: string
 *                  description: Celurlar del acudiente del alumno
 *          required:
 *              - nombre_acudiente
 *              - correo_acudiente
 *              - celular_acudiente
 *          example: 
 *              nombre_acudiente : sofia piedrahita
 *              correo_acudiente : sofi@gmail.com
 *              celular_acudiente : 3145670912
 *                      
 */

/**
 * @swagger
 * /alumno/datosa:
 *  get:
 *      summary: mostrar alumno
 *      tags: [alumno]
 *      responses:
 *       '200':
 *         description: informacion de los alumnos
 */
rutaAlumno.get("/datosa", AlumnoController.Datosa);


/**
 * @swagger
 * /alumno/datos:
 *  get:
 *      summary: mostrar usuario
 *      tags: [Usuario]
 *      responses:
 *       '200':
 *         description: informacion de los usuarios
 */
rutaAlumno.get("/datos", AlumnoController.Datos);

/**
 * @swagger
 * /alumno/registraralumno:
 *  post:
 *      summary: registrar alumno
 *      tags: [Usuario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Usuario'
 *      responses:
 *         '200':
 *           description: resgistro de los alumnos
 */
rutaAlumno.post("/registraralumno", AlumnoController.regisAlumno);

/**
 * @swagger
 * /alumno/actualizaralumno/{id_alumno}:
 *  put:
 *      summary: actualizar alumno
 *      tags: [Usuario]
 *      parameters:
 *        - in : path
 *          name: id_alumno
 *          description: id del horario a alumno al a actualizar
 *          schema: 
 *              type: integer
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Usuario'
 *      responses:
 *         '200':
 *           description: resgistro de los alumnos
 */
rutaAlumno.put("/actualizaralumno/:identificacion", AlumnoController.actualizarAlumno);


/**
 * @swagger
 * /alumno/actualizarestado/{id_usuario}:
 *  put:
 *      summary: actualizar estado
 *      tags: [Usuario]
 *      parameters:
 *        - in : path
 *          name: id_usuario
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
 *                      $ref: '#/components/schemas/Usuario'
 *      responses:
 *         '200':
 *           description: actualizacion de estado 
 */

rutaAlumno.put("/actualizarestado/:id_usuario", AlumnoController.actualizarEstado);


module.exports = rutaAlumno;