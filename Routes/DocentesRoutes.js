const express = require('express')
const DocenteControler = require('../Controllers/Docente/DocenteControler')
const rutaDocentes=express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *      puntos:
 *          type: object
 *          properties:
 *              valor_puntos:
 *                  type: integer
 *                  description: El valor de los puntos que se genera
 *              descripcion_puntos:
 *                  type: string
 *                  description: La descripcion de los puntos asignados
 *          required:
 *              - valor_puntos
 *              - descripcion_puntos
 *          example: 
 *              valor_puntos : 8
 *              descripcion_puntos : Buen trabajo en clase
 *                      
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Observaciones:
 *          type: object
 *          properties:
 *              Actividad_id:
 *                  type: integer
 *                  description: El id de cada actividad
 *              id_alumno:
 *                  type: intger
 *                  description: La descripcion de los puntos asignados
 *              fecha_observacion:
 *                  type: date
 *                  description: La fecha en la que se genera las observaciones
 *              descripcion_observacion:
 *                  type: string
 *                  description: La descripcion de las observaciones
 *          required:
 *              - Actividad_id
 *              - id_alumno
 *              - fecha_observacion
 *              - descripcion_observacion
 * 
 *          example: 
 *              Actividad_id : 1
 *              id_alumno : 7
 *              fecha_observacion : 2024-08-12
 *              descripcion_observacion : Buen trabajo en clase
 *                      
 */

/**
 * @swagger
 * /docente/listado:
 *  get:
 *      summary: Mostrar los alumnos de esa actividad
 *      tags: [Puntos]
 *      responses:
 *       '200':
 *         description: Informacion de los ualumnos en cada actividad
 */
rutaDocentes.get("/listado/:Actividad_id", DocenteControler.Listado);

/**
 * @swagger
 * /docente/puntosactividad:
 *  get:
 *      summary: Mostrar los alumnos de esa actividad
 *      tags: [Puntos]
 *      responses:
 *       '200':
 *         description: Informacion de los puntos de alumno
 */
rutaDocentes.get("/puntosactividad", DocenteControler.Puntos);

/**
 * @swagger
 * /docente/puntos:
 *  post:
 *      summary: agregar puntos a cada alumno
 *      tags: [Puntos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/puntos'
 *      responses:
 *         '200':
 *           description: puntos para cada alumno
 */
rutaDocentes.post("/puntos", DocenteControler.agregarPuntos);

/**
 * @swagger
 * /docente/observaciones:
 *  post:
 *      summary: registrar observaciones
 *      tags: [Observaciones]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Observaciones'
 *      responses:
 *         '200':
 *           description: resgistro de las observaciones del alumno
 */
rutaDocentes.post("/observaciones", DocenteControler.agregarObservaciones);

rutaDocentes.get("/docenteactividad/:id_docente", DocenteControler.DocenteActividad);


module.exports=rutaDocentes;