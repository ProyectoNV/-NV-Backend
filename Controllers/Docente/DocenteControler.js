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

module.exports = {
    RenderInfo,
    ActualizarInfoUser
}