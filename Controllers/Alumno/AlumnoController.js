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

const Consultaid = async (req, res) => {

    try {
        const {numero_id} = req.params;
        const connection = await conn;
        const [[resultado]] = await connection.query(`SELECT * FROM usuario INNER JOIN alumno ON id_usuario = id_alumno WHERE numero_id = ? `,[numero_id])
        if(resultado ){
            res.json(resultado)
        }else{
            res.status(404).json({ message: "Alumno no encontrado" });
        }
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
    console.log(req.body.id_usuario)

    const consulta = "SELECT * FROM usuario WHERE  id_usuario = ? ";
    
    try {
        // Consulta a la base de datos para obtener el usuario por su numero de usuario
        const [resultado] = await conn.query(consulta, [req.body.id_usuario]);

        console.log(resultado)

        if (resultado.length > 0) {

            const id_usuario = resultado[0].id_usuario;
    
            // Actualizar datos del usuario en la tabla usuario
            const actualizarUsuario = await conn.query("UPDATE usuario SET Nombres = ?, Apellidos = ?, fecha_nacimiento = ?, pkfk_tdoc=?, numero_id= ?, genero = ?, correo = ?, celular = ?, contrasena = ? WHERE id_usuario = ?", [Nombres, Apellidos, fecha_nacimiento, pkfk_tdoc,numero_id, genero, correo, celular, contrasena, id_usuario]);
    
            // Actualizar datos del alumno en la tabla alumno
            const actualizarAlumno = await conn.query("UPDATE alumno SET nombre_acudiente = ?, correo_acudiente = ?, celular_acudiente = ? WHERE id_alumno = ?", [nombre_acudiente, correo_acudiente, celular_acudiente, id_usuario]);
    
            // Envía una respuesta JSON con un mensaje de éxito
            res.status(200).json({ message: "Usuario actualizado" });
        } else {
            // Si no se encuentra ningún usuario con el tipo de documento y número de identificación especificados, envía una respuesta con un mensaje de error
            res.status(404).json({ message: "Alumno no encontrado" });
        }
    
    } catch (error) {
        // Si ocurre algún error durante el proceso, se captura y se envía una respuesta con un mensaje de error
        console.log(error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

const actualizarEstado = async (req, res) => {
    try {
        const {numero_id} = req.params;
        const {estado}= req.body
        console.log(estado)
        console.log(numero_id)
        const connection = await conn;
        const result = await connection.query("UPDATE usuario SET estado = ? WHERE numero_id = ?", [estado, numero_id]);
        res.json(result)
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const RenderAlumUser = async (req, res) => {

    try {
        const {id_usuario} = req.params;
        const connection = await conn;
        const [[resultado]] = await connection.query(`SELECT * FROM usuario INNER JOIN alumno ON id_usuario = id_alumno WHERE id_usuario = ? `,[id_usuario])
        if(resultado ){
            res.json(resultado)
        }else{
            res.status(404).json({ message: "usuario no encontrado" });
        }
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const verActividadesAlum = async (req, res) => {  
    try {
        const id_alumno = req.params.id_alumno;
        const verListact = `
        SELECT 
    actividades.id_actividad,
    actividades.Nombre_actividad,
    actividades.anho_inicio,
    actividades.descripcion,
    usuario.id_usuario AS id_alumno,
    usuario.Nombres AS nombres_alumno,
    usuario.Apellidos AS apellidos_alumno,
    usuario_docente.id_usuario AS id_docente,
    usuario_docente.Nombres AS nombres_docente,
    usuario_docente.Apellidos AS apellidos_docente,
    SUM(asistencia.Confirmacion) AS asistencias,
    COUNT(asistencia.Confirmacion) AS clases
FROM 
    asistencia
LEFT JOIN 
    actividad_has_alumno ON asistencia.Actividad_id = actividad_has_alumno.Actividad_id AND asistencia.id_alumno = actividad_has_alumno.id_alumno
INNER JOIN 
    actividades ON actividad_has_alumno.Actividad_id = actividades.id_actividad
INNER JOIN 
    alumno ON actividad_has_alumno.id_alumno = alumno.id_alumno
LEFT JOIN 
    usuario ON usuario.id_usuario = alumno.id_alumno
LEFT JOIN 
    docente_has_actividad ON actividades.id_actividad = docente_has_actividad.Actividad_id
LEFT JOIN 
    usuario AS usuario_docente ON usuario_docente.id_usuario = docente_has_actividad.id_docente
WHERE 
    actividad_has_alumno.id_alumno = ?
GROUP BY 
    actividades.id_actividad,
    actividades.Nombre_actividad,
    actividades.anho_inicio,
    actividades.descripcion,
    usuario.id_usuario,
    usuario.Nombres,
    usuario.Apellidos,
    usuario_docente.id_usuario,
    usuario_docente.Nombres,
    usuario_docente.Apellidos;
        `; 
                
    const [resultado] = await conn.query(verListact,id_alumno)
    res.json(resultado);
} catch (error) {
    res.status(500).send(error.message);
}}

module.exports = {
    Datos,
    regisAlumno,
    Datosa,
    actualizarEstado,
    actualizarAlumno,
    Consultaid,
    RenderAlumUser,
    verActividadesAlum
};