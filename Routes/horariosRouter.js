const express = require("express");
const adminController =require('../Controllers/Administrador/AdminController');
const rutaHorarios = express.Router();

//Rutas de Horario

/**
 * @swagger
 * components:
 *  schemas:
 *      horario:
 *          type: object
 *          properties:
 *              id_horario:
 *                  type: integer
 *                  description: Id autogenerado en la BDD
 *              Dia_semana:
 *                  type: string
 *                  description: Nombre del dia de la semana que ocurre
 *              Hora_inicio:
 *                  type: time
 *                  description: Hora en la que inicia, formato 24 horas
 *              Hora_fin:
 *                  type: time
 *                  description: Hora en la que finaliza, formato 24 horas 
 *              Lugar:
 *                  type: string
 *                  description: Nombre del lugar asignado
 *          required:
 *              - Dia_semana
 *              - Hora_inicio
 *              - Hora_fin
 *              - Lugar
 *          example: 
 *              Dia_semana : lunes
 *              Hora_inicio : 15:00
 *              Hora_fin : 16:59
 *              Lugar: salon 3        
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      actividad_horario:
 *          type: object
 *          properties:
 *              id_actividad:
 *                  type: integer
 *                  description: Id de la actividad a la que se le asignara un horario
 *              horario_id:
 *                  type: integer
 *                  description: Id del horario al que se le asignara una actividad
 *          required:
 *              - id_actividad
 *              - horario_id
 *          example: 
 *              id_actividad : 1
 *              horario_id : 12     
 */

/**
 * @swagger
 * /horario/filtroHorarios:
 *  get:
 *      summary: Mostrar todos los horarios que no tengan asignado una actividad
 *      tags: [horario]
 *      responses:
 *          200:
 *              description: Lista de horarios que cumplen la condición
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/horario'
 */
rutaHorarios.get("/filtroHorarios", adminController.filtrarActividadesHorario);

/**
 * @swagger
 * /horario/agregarHorarios:
 *  post:
 *      summary: Crea nuevo horario
 *      tags: [horario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/horario'
 *      responses:
 *          200:
 *              description: nuevo horario fue creado
 *          500:
 *              description: error al agregar horario
 */
rutaHorarios.post("/agregarHorarios", adminController.agregarHorario);


/**
 * @swagger
 * /horario/buscarHorarios/{Lugar}/{Dia_semana}:
 *  get:
 *      summary: Mostrar la hora de inicio y fin de los horarios que coincidan con el lugar y dia que se busca
 *      tags: [horario]
 *      parameters:
 *        - in : path
 *          name: Lugar
 *          description: nombre del lugar que se quiere buscar 
 *          schema: 
 *              type: string
 *          required: true
 *        - in : path
 *          name: Dia_semana
 *          description: nombre del dia de la semana que se quiere buscar 
 *          schema: 
 *              type: string
 *          required: true
 *      responses:
 *          200:
 *              description: Lista de horarios que cumplen la condición
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                              Hora_inicio:
 *                                  type: string
 *                                  description: Hora en la que inicia el horario
 *                              Hora_fin:
 *                                  type: string
 *                                  description: Hora en la que finaliza el horario
 *                          required:
 *                              - Hora_inicio
 *                              - Hora_fin
 *                          example: 
 *                              Hora_inicio : 15:15:00
 *                              Hora_fin : 16:30:00
 *             
 */
rutaHorarios.get("/buscarHorarios/:Lugar/:Dia_semana", adminController.buscarHorariosIguales);


/**
 * @swagger
 * /horario/eliminarHorario/{id_horario}:
 *  delete:
 *      summary: Se elimina un horario
 *      tags: [horario]
 *      parameters:
 *        - in : path
 *          name: id_horario
 *          description: id del horario a eliminar
 *          schema: 
 *              type: integer
 *          required: true
 *      responses:
 *          200:
 *              description: horario eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/horario'          
 */
rutaHorarios.delete("/eliminarHorario/:id_horario", adminController.eliminarHorario);

/**
 * @swagger
 * /horario/actualizarHorario/{id_horario}:
 *  put:
 *      summary: Actualizar la informacion de un horario
 *      tags: [horario]
 *      parameters:
 *        - in : path
 *          name: id_horario
 *          description: id del horario a actualizar
 *          schema: 
 *              type: integer
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/horario'
 *      responses:
 *          200:
 *              description: nuevo horario fue creado
 *          500:
 *              description: error al agregar horario
 */
rutaHorarios.put("/actualizarHorario/:id_horario", adminController.actualizarhorario);

/**
 * @swagger
 * /horario/agregarHorariosActividad:
 *  post:
 *      summary: Asignar a una actividad un horario
 *      tags: [actividad_horario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/actividad_horario'
 *      responses:
 *          200:
 *              description: nuevo horario fue creado
 *          500:
 *              description: error al agregar horario
 */
rutaHorarios.post("/agregarHorariosActividad", adminController.agregarHorarioActividad);

rutaHorarios.get("/opsionesActividad", adminController.mostrarOpcionesDeActividad);


rutaHorarios.get("/VerCronograma/:Dia_semana", adminController.TraerCronograma);

rutaHorarios.delete("/EliminarActividadHorario/:id_actividad/:horario_id", adminController.eliminarHorarioActividad);



module.exports=rutaHorarios;