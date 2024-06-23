const bcrypt = require("bcrypt");
const conn =require('../Model/conn').promise()

const PreRegistro = async(req, res) => {
    const {
        tipoId,
        numeroId,
        nombres,
        apellidos,
        fecha,
        genero,
        correo,
        telefono,
        nombreAcudiente,
        celularAcudiente,
        correoAcudiente
    } = req.body;

    try {
        const consultaExiteUsuario = "SELECT * FROM usuario WHERE pkfk_tdoc = ? AND numero_id = ?";
        const [existeUsuario] = await conn.query(consultaExiteUsuario, [tipoId, numeroId]);

        if (existeUsuario.length > 0) {
            res.json({
                success: false,
                message: "Ya se encuentra registrado un usuario"
            });
            return;
        }

        const [consultaCorreo] = await conn.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
        if (consultaCorreo.length > 0) {
            res.json({ success: false, message: "Ya hay un usuario registrado con ese correo" });
            return;
        }

        const contraEncriptada = await bcrypt.hash(numeroId, 5);
        const consultaRegistroUsuario = "INSERT INTO usuario (pkfk_tdoc, numero_id, id_rol, Nombres, Apellidos, fecha_nacimiento, genero, correo, celular, contrasena, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const result = await conn.query(consultaRegistroUsuario, [tipoId, numeroId, 12, nombres, apellidos, fecha, genero, correo, telefono, contraEncriptada, 2]);

        const usuarioId = result[0].insertId;
        const consultaRegistroAlumno = "INSERT INTO alumno (id_alumno, nombre_acudiente, correo_acudiente, celular_acudiente) VALUES (?, ?, ?, ?)";
        await conn.query(consultaRegistroAlumno, [usuarioId, nombreAcudiente, correoAcudiente, celularAcudiente]);

        res.json({ success: true, message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.json({ success: false, message: "Ocurrió un error al registrar el usuario" });
    }
};


const RecuperarContrasena = async (req,res)=>{
    const {correo,nuevaContra,confirmacionContra}=req.body

    const consultaUsuario ="SELECT * FROM usuario WHERE correo = ?"
    const [UsuarioExistente] = await conn.query(consultaUsuario,[correo])

    if(UsuarioExistente.length>0){
        if(nuevaContra===confirmacionContra){
            const NuevaContraBD= await bcrypt.hash(nuevaContra,5)
            const consultaCambiarContra="UPDATE usuario SET contrasena = ? WHERE correo = ?"
    
            await conn.query(consultaCambiarContra,[NuevaContraBD, correo])
            res.json({success:true,message:"Contraseña Actualizada correctamente"})
        }else{
            res.json({success:false, message:"Las contraseñas deben ser iguales"})
        }  
    }else{
         res.json({
            sucess:false,
            message:"No hay ningun usuario con ese correo"})
    }
}

module.exports={
    PreRegistro,
    RecuperarContrasena
}