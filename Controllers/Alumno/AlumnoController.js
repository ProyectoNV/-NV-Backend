const { query } = require("express");
const bcrypt = require('bcrypt');
const conn = require("../../Model/conn").promise();

const Datos = async (req, res) => {

    try {
        const query = `SELECT  u.id_usuario, u.Nombres, u.Apellidos, u.fecha_nacimiento, u.correo, u.celular FROM usuario u WHERE id_rol="12" AND estado="1" `
        
        const [resultado] = await conn.query(query)
        res.json(resultado)
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }

}
const Datosa = async (req, res) => {

    try {
        const query = `SELECT * FROM alumno`
        const [resultado] = await conn.query(query)
        res.json(resultado)
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }


}

const regisAlumno = async (req, res) => {

    const { pkfk_tdoc, numero_id, Nombres, Apellidos, fecha_nacimiento, genero, correo, celular, contrasena, nombre_acudiente, correo_acudiente, celular_acudiente } = req.body;

    const consulta = "SELECT * FROM usuario WHERE pkfk_tdoc = ? AND numero_id = ?";
    
    try {
        const [resultado] = await conn.query(consulta, [pkfk_tdoc, numero_id]);

        if (resultado.length == 0) {
            
            const Password = await bcrypt.hash(contrasena, 10);

            const consul = await conn.query("INSERT INTO usuario (pkfk_tdoc, numero_id, id_rol, Nombres, Apellidos,fecha_nacimiento,genero,correo,celular,contrasena,estado) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [pkfk_tdoc, numero_id, 12, Nombres, Apellidos, fecha_nacimiento, genero, correo, celular, Password, 1]);

            const [usuario] = await conn.query ("SELECT id_usuario FROM usuario WHERE numero_id=?", [numero_id]);
            const id_usuario = usuario[0].id_usuario;
            //console.log(usuario)
            //console.log(usuario[0].id_usuario)

            const alumno = await conn.query("INSERT INTO alumno (id_alumno,nombre_acudiente,correo_acudiente,celular_acudiente) VALUES (?,?,?,?)", [ id_usuario, nombre_acudiente, correo_acudiente, celular_acudiente]);

            res.status(200).json({ message:"Usuario creado" });
        } else {
            // No se puede crear el alumno porque ya existe un alumno con el mismo ID
            
            res.status(500).json({ message: "Alumno Existente" });
            
        }
        
        
    }
    catch (error) {
        console.log(error.message)
        res.status(500);
        res.json(error.message);
    }
}

const actualizarAlumno = async (req, res) => {
    const { pkfk_tdoc, numero_id, Nombres, Apellidos, fecha_nacimiento, genero, correo, celular, contrasena, nombre_acudiente, correo_acudiente, celular_acudiente } = req.body;
    const {identificacion}=req.params

    const consulta = "SELECT * FROM usuario WHERE pkfk_tdoc = ? AND numero_id = ?";


    try {
        const [resultado] = await conn.query(consulta, [pkfk_tdoc, numero_id]);

        if (resultado.length > 0) {
            const id_usuario = resultado[0].id_usuario;

            // Actualizar datos del usuario
            const actualizarUsuario = await conn.query("UPDATE usuario SET Nombres = ?, Apellidos = ?, fecha_nacimiento = ?, genero = ?, correo = ?, celular = ?, contrasena = ? WHERE numero_id = ?", [Nombres, Apellidos, fecha_nacimiento, genero, correo, celular, contrasena, identificacion]);

            // Actualizar datos del alumno
            const actualizarAlumno = await conn.query("UPDATE alumno SET nombre_acudiente = ?, correo_acudiente = ?, celular_acudiente = ? WHERE id_alumno = ?", [nombre_acudiente, correo_acudiente, celular_acudiente, id_usuario]);

            res.status(200).json({ message: "Usuario actualizado" });
        } else {
            // No se puede actualizar el alumno porque no existe un alumno con el mismo ID
            res.status(404).json({ message: "Alumno no encontrado" });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

const actualizarEstado = async (req, res) => {
    try {
        const {id_usuario} = req.params;
        const connection = await conn;
        const result = await connection.query("UPDATE usuario SET estado = 0 WHERE id_usuario = ?", [id_usuario]);
        res.json(result)
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


module.exports = {
    Datos,
    regisAlumno,
    Datosa,
    actualizarEstado,
    actualizarAlumno,

};