const express = require("express");
const DocenteController =require('../Controllers/Docente/DocenteControler');
const loginController =require('../Controllers/Ingreso');
const preRegistroRecuperarContrasena= require('../Controllers/Preregistro_RecuperarContraseña');
//const docenteController =require('../Controllers/Docente');
const rutaDatos = express.Router();

//peticiones de ingreso

/**
 * @swagger
 * components:
 *  schemas:
 *      Login:
 *          type: object
 *          properties:
 *              correo:
 *                  type: string
 *                  description: Correo electronico que identifica el usuario
 *              contrasena:
 *                  type: string
 *                  description: Contraseña que identifica al usuario
 *          required:
 *              - correo
 *              - contrasena
 *          example: 
 *              correo : equipo@gmail.com
 *              contrasena : 8025663
 */

/**
 * @swagger
 * /ingresar:
 *  post:
 *      summary: Valida que el Correo y contraseña pertenescan a un usuario
 *      tags: [Login]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          200: 
 *              description: Autenticacion exitosa
 */
rutaDatos.post("/ingresar", loginController.IniciarSesion);

/**
 * @swagger
 * /Informacion/usuario/{id_usuario}:
 *  get:
 *      summary: mostrar usuario
 *      tags: [Usuario]
 *      parameters:
 *        - in : path
 *          name: id_usuario
 *          description: id de identificacion del usuario a buscar 
 *          schema: 
 *              type: integer
 *          required: true
 *      responses:
 *       '200':
 *         description: infromacion del usuario con ese id
 */
rutaDatos.get("/Informacion/usuario/:id_usuario", DocenteController.RenderInfo);

/**
 * @swagger
 * /actilizar/InfoUser/{id_usuario}:
 *  put:
 *      summary: actualizar estado
 *      tags: [Usuario]
 *      parameters:
 *        - in : path
 *          name: id_usuario
 *          description: numero de identificacion 
 *          schema: 
 *              type: integer
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                          type: array
 *                          properties:
 *                              pkfk_tdoc:
 *                                  type: string
 *                                  description: tipo de documento del usuario que ingreso
 *                              numero_id:
 *                                  type: string
 *                                  description: Numero de documento del usuario que ingreso      
 *                              Nombres:
 *                                  type: string
 *                                  description: Nombres del usuario que ingreso
 *                              Apellidos:
 *                                  type: string
 *                                  description: Apellidos del usuario que ingreso
 *                              fecha_nacimiento:
 *                                  type: date
 *                                  description: Fecha de nacimiento del usuario que ingreso
 *                              genero:
 *                                  type: string
 *                                  description: Genero del usuario que ingreso
 *                              correo:
 *                                  type: string
 *                                  description: Correo del usuario que ingreso
 *                              celular:
 *                                  type: string
 *                                  description: Celular del usuario que ingreso
 *                          required:
 *                              - pkfk_tdoc
 *                              - numero_id
 *                              - Nombres
 *                              - Apellidos
 *                              - fecha_nacimiento
 *                              - genero
 *                              - correo 
 *                              - celular 
 *                          example: 
 *                              pkfk_tdoc: CC, 
 *                              numero_id: 1027283625, 
 *                              Nombres: Daniel Felipe, 
 *                              Apellidos: Reyes Herrera,
 *                              fecha_nacimiento: 1999-08-24,
 *                              genero: masculino,
 *                              correo: proyectnv@gmail.com,
 *                              celular: 3153194766    
 *      responses:
 *         '200':
 *           description: actualizacion de estado 
 */
rutaDatos.put("/actilizar/InfoUser/:id_usuario", DocenteController.ActualizarInfoUser);

rutaDatos.post("/preregistro",preRegistroRecuperarContrasena.PreRegistro)

rutaDatos.put("/recuperarContrasena",preRegistroRecuperarContrasena.RecuperarContrasena)

module.exports=rutaDatos;