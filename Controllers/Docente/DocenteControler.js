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

module.exports = {
    agregarPuntos,
    DocenteActividad,
    agregarObservaciones,
    Listado,
    RenderInfo,
    Puntos,
    ActualizarInfoUser
}