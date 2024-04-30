const express = require("express");
const adminController =require('../Controllers/Administrador/AdminController');
const rutaActivi = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     actividad:
 *       type: object
 *       properties:
 *         id_actividad:
 *           type: integer
 *           description: Id autogenerado en la base de datos
 *         Nombre_actividad:
 *           type: string
 *           description: Nombre de la actividad correspondiente
 *         anho_inicio:
 *           type: integer
 *           description: Año de inicio de la actividad
 *         descripcion:
 *           type: string
 *           description: Descripción que deseen colocar respecto a la actividad. 
 *         foto:
 *           type: string
 *           description: Una foto alusiva o correspondiente de actividad
 *         Estado_actividad:
 *           type: integer
 *           description: Estado de la actividad 0 para activo, 1 para inactivo
 *       required:
 *         - Nombre_actividad
 *         - anho_inicio
 *         - descripcion
 *         - foto
 *         - Estado_actividad
 *       example: 
 *         - Nombre_actividad: Fotografía
 *           anho_inicio: 2024
 *           descripcion: Unas fotos bellas
 *           foto: ''
 *           Estado_actividad: 1
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      actividad_Docente:
 *          type: object
 *          properties:
 *              id_docente:
 *                  type: integer
 *                  description: Id del docente a la que se le asignara una actividad
 *              Actividad_id:
 *                  type: integer
 *                  description: Id de la actividad que se le asignara a un docente
 *          required:
 *              - id_docente
 *              - Actividad_id
 *          example: 
 *              id_docente : 16
 *              Actividad_id : 4
 */

/**
 * @swagger
 * /actividades/mostrar:
 *  get:
 *      summary: mostrar actividades activas
 *      tags: [actividad]
 *      responses:
 *       '200':
 *         description: informacion de los alumnos
 */
rutaActivi.get('/mostrar', adminController.mostrarDatosActividad);

/**
 * @swagger
 * /actividades/mostrarInactivas:
 *  get:
 *      summary: mostrar actividades inactivas
 *      tags: [actividad]
 *      responses:
 *       '200':
 *         description: informacion de los alumnos
 */
rutaActivi.get('/mostrarInactivas', adminController.mostrarActividadInactiva);



/**
 * @swagger
 * /actividades/registrar:
 *   post:
 *     summary: Registra una nueva actividad
 *     tags: [actividad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/actividad'
 *     responses:
 *       200:
 *         description: Nuevo horario fue creado
 *       500:
 *         description: Error al agregar horario
 */

rutaActivi.post('/registrar', adminController.registrarActividad);


/**
 * @swagger
 * /actividades/actualizar/{id_actividad}:
 *   put:
 *     summary: Actualizar actividad
 *     tags: [actividad]
 *     parameters:
 *       - in: path
 *         name: id_actividad
 *         required: true
 *         description: ID de la actividad que se va a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/actividad'
 *     responses:
 *       '200':
 *         description: se actualizo la actividad
 *       '500':
 *         description: Error interno del servidor
 */
rutaActivi.put('/actualizar/:id_actividad', adminController.actualizarActividad );

/**
 * @swagger
 * /actividades/actualizar/{id_actividad}:
 *   put:
 *     summary: Actualizar estado actividad
 *     tags: [actividad]
 *     parameters:
 *       - name: id_actividad
 *         in: path
 *         description: el id de la actividad que se va actualizar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Ok
 *       '500':
 *         description: Error interno del servidor
 */
rutaActivi.put('/actualizaract/:id_actividad', adminController.actuaActivi);
/**
 * @swagger
 * /actividades/actualizaract/{id_actividad}:
 *   put:
 *     summary: Actualizar estado de una actividad (1 para activo, 0 para inactivo)
 *     tags: [actividad]
 *     parameters:
 *       - name: id_actividad
 *         in: path
 *         description: El ID de la actividad que se va a actualizar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Operación exitosa. Devuelve el resultado de la actualización.
 *       '500':
 *         description: Error interno del servidor. Devuelve un mensaje de error.
 */





rutaActivi.get('/verlistas/:id_actividad', adminController.verLista);

/**
 * @swagger
 * /actividades/verlistas/{id_actividad}:
 *   get:
 *     summary: Ver lista de asistencia de una actividad
 *     tags: [actividad]
 *     parameters:
 *       - name: id_actividad
 *         in: path
 *         description: El ID de la actividad para la cual se desea ver la lista de asistencia
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Operación exitosa. Devuelve la lista de asistencia de la actividad especificada.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_actividad:
 *                     type: integer
 *                     description: ID de la actividad.
 *                   Nombre_actividad:
 *                     type: string
 *                     description: Nombre de la actividad.
 *                   anho_inicio:
 *                     type: integer
 *                     description: Año de inicio de la actividad.
 *                   descripcion:
 *                     type: string
 *                     description: Descripción de la actividad.
 *                   id_usuario:
 *                     type: integer
 *                     description: ID del usuario.
 *                   Nombres:
 *                     type: string
 *                     description: Nombres del usuario.
 *                   Apellidos:
 *                     type: string
 *                     description: Apellidos del usuario.
 *                   asistencias:
 *                     type: integer
 *                     description: Cantidad de asistencias.
 *                   clases:
 *                     type: integer
 *                     description: Cantidad de clases.
 *       '500':
 *         description: Error 
 */




/**
 * @swagger
 * /actividades/insertarDocente:
 *  post:
 *      summary: Asignar una actividad a un docente existente
 *      tags: [actividad_Docente]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/actividad_Docente'
 *      responses:
 *          200:
 *              description: actividad asignada
 *          500:
 *              description: error al asignar actividad
 */
rutaActivi.post('/insertarDocente', adminController.agregarDocenteActividad);


rutaActivi.post('/Inscribirse', adminController.InscribirActividad);
rutaActivi.get('/BuscarActividadesAlumno/:id_alumno/:anho_inicio', adminController.BuscarActividadesAlum);
rutaActivi.get('/BuscarAlumnosActi/:Actividad_id', adminController.BuscarNumAlum);

module.exports = rutaActivi;


