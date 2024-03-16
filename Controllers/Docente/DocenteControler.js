const { query } = require("express");
const bcrypt = require('bcrypt');
const conn = require("../../Model/conn").promise();

const RenderInfo = async (req, res) => {

    try {
        const {id_usuario} = req.params;
        const connection = await conn;
        const [[resultado]] = await connection.query(`SELECT * FROM usuario WHERE id_usuario = ? `,[id_usuario])
        res.json(resultado)
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const ActualizarInfoUser = async (req, res) => {
    try {
        const {id_usuario} = req.params;
        const {pkfk_tdoc, numero_id, Nombres, Apellidos, fecha_nacimiento, genero, correo, celular} = req.body;
        const consulta = "UPDATE usuario SET pkfk_tdoc = ?, numero_id = ?, Nombres = ?, Apellidos = ?, fecha_nacimiento = ?, genero = ?, correo = ?, celular = ? WHERE id_usuario = ?";
        await conn.query(consulta, [pkfk_tdoc, numero_id, Nombres, Apellidos, fecha_nacimiento, genero, correo, celular, id_usuario]);
        
        res.json({ message: "Datos del usuario actualizados correctamente" });
        
    } 
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const Listado = async (req, res) => {

    try {
        const{Actividad_id} =req.params;

        const query = `SELECT alu.id_alumno, u.id_usuario, u.Nombres, u.Apellidos
        FROM usuario u
        INNER JOIN actividad_has_alumno aha ON u.id_usuario = aha.id_alumno
        INNER JOIN alumno alu ON u.id_usuario = alu.id_alumno
        WHERE aha.Actividad_id = ? `
        
        const [resultado] = await conn.query(query,Actividad_id)
        res.json(resultado)
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }

}
const Puntos = async (req, res)=>{
    try{
        const connection = await conn;
        const [result] = await connection.query("SELECT * FROM puntos")
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const agregarPuntos = async (req, res)=>{
    try{
        const {id_actividad,id_alumno,puntos_id} = req.body;
        const puntos ={id_actividad, id_alumno, puntos_id}
        console.log(puntos)
        const connection = await conn;
        const result = await connection.query("INSERT INTO  puntos_por_actividad SET ?", puntos)
    
        res.json(result)

    }
    catch(error){
        res.status(500);
        res.send(error.message);
        console.log(error)
    }
};
const agregarObservaciones= async (req, res)=>{
    try{

        const {Actividad_id,id_alumno,descripcion_observacion,fecha_observacion} = req.body;
        const observacion ={Actividad_id, id_alumno,descripcion_observacion,fecha_observacion}
        console.log(observacion)
        const connection = await conn;
        const result = await connection.query("INSERT INTO  observaciones SET ?", observacion)
    
        res.json(result)

    }
    catch(error){
        res.status(500);
        res.send(error.message);
        console.log(error)
    }
};
const DocenteActividad = async (req, res)=>{
    try{
        const{id_docente}=req.params;
        console.log(id_docente)
        const connection = await conn;
        const [result] = await connection.query(`SELECT * FROM docente_has_actividad  
        INNER JOIN actividades acti ON acti.id_actividad = docente_has_actividad.Actividad_id WHERE id_docente = ?`,id_docente)
        console.log(result)
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

/*const llenarAsisten = async (req, res) => {
    try {
        const asisten = `
        SELECT a.id_alumno, u.Nombres, u.Apellidos
        FROM usuario u
        INNER JOIN alumno a ON u.id_usuario = a.id_alumno
        INNER JOIN actividad_has_alumno aha ON aha.id_alumno = a.id_alumno
        WHERE aha.Actividad_id = ?`;

        const [rows] = await conn.query(asisten,[req.params.actividad_id]);

        res.json(rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
 */
const registrarAsistencia = async (req, res) => {
    try {
        const { Actividad_id, id_alumno, fecha_asistencia, Confirmacion } = req.body;
        const asistencia = { Actividad_id, id_alumno, fecha_asistencia, Confirmacion };

        const connection = await conn;
        const result = await connection.query("INSERT INTO asistencia SET ?", asistencia);
    
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
        console.error(error);
    } }

    const verPuntos = async (req, res) => {

        try {
            const { Actividad_id } = req.params;
            console.log(Actividad_id)
            const query = `
            SELECT
        a.id_alumno,
        u.Nombres AS nombre_alumno,
        u.Apellidos AS apellido_alumno,
        COUNT(DISTINCT asis.id_asistencia) AS total_asistencias,
        SUM(puntos.valor_puntos) AS total_puntos,
        COUNT(DISTINCT obs.id_observacion) AS total_observaciones
    FROM
        alumno a
    LEFT JOIN
        usuario u ON a.id_alumno = u.id_usuario
    LEFT JOIN
        actividad_has_alumno AS act_alum ON a.id_alumno = act_alum.id_alumno
    LEFT JOIN
        asistencia AS asis ON act_alum.Actividad_id = asis.Actividad_id AND a.id_alumno = asis.id_alumno
    LEFT JOIN
        puntos_por_actividad AS ppa ON act_alum.Actividad_id = ppa.id_actividad AND a.id_alumno = ppa.id_alumno
    LEFT JOIN
        puntos ON ppa.puntos_id = puntos.id_puntos
    LEFT JOIN
        observaciones AS obs ON act_alum.Actividad_id = obs.Actividad_id AND a.id_alumno = obs.id_alumno
    LEFT JOIN
        actividades AS act ON act_alum.Actividad_id = act.id_actividad
    WHERE
        act_alum.Actividad_id = ?
    GROUP BY
        a.id_alumno, u.Nombres, u.Apellidos;
            `;
            const [resultado] = await conn.query(query, [Actividad_id]);
            res.json(resultado);
        } catch (error) {
            res.status(500);
            res.send(error.message);
        }
    
    }
    

module.exports = {
    agregarPuntos,
    verPuntos,
    DocenteActividad,
    agregarObservaciones,
    Listado,
    RenderInfo,
    Puntos,
    ActualizarInfoUser,
    registrarAsistencia
}