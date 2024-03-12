const bcrypt = require("bcrypt");
const conn =require('../Model/conn').promise()

const PreRegistro = async(req,res)=>{
    const {pkfk_tdoc,numero_id,Nombres,Apellidos,fecha_nacimiento,genero,correo,celular}= req.body

    const consultaExiteUsuario="SELECT * FROM USUARIO WHERE pkfk_tdoc = ? AND numero_id = ? "
    const [existeUsuario]= await conn.query(consultaExiteUsuario,[pkfk_tdoc,numero_id])

    if(existeUsuario.length>0){
        res.json({
            success:false,
            message:"Ya se encuentra registrado un usuario"
        })
        return
    }

    const [consultaCorreo]= await conn.query("SELECT * FROM usuario WHERE correo = ?",[correo])
    if(consultaCorreo.length>0){
        res.json("Ya hay un usuario registrado con ese correo")
        return
    }
    const consultaRegistro="INSERT INTO usuario (pkfk_tdoc,numero_id,id_rol,Nombres,Apellidos,fecha_nacimiento,genero,correo,celular,contrasena,estado) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
    const contraEncriptada = await bcrypt.hash(numero_id,5)
    const PreRegistroDatabase= await conn.query(consultaRegistro,[pkfk_tdoc,numero_id,12,Nombres,Apellidos,fecha_nacimiento,genero,correo,celular,contraEncriptada,2])
    
    res.json({message:"Usuario registrado correctamente"})
    console.log(PreRegistroDatabase)
}

const RecuperarContraseña = async (req,res)=>{
    const {correo,nuevaContra,confirmacionContra}=req.body

    const consultaUsuario ="SELECT * FROM usuario WHERE correo = ?"
    const [UsuarioExistente] = await conn.query(consultaUsuario,[correo])

    if(UsuarioExistente.length<=0){
        res.json({message:"No hay ningun usuario con ese correo"})
        return
    }

    if((nuevaContra.length === confirmacionContra.length) && (nuevaContra===confirmacionContra)){
        const NuevaContraBD= await bcrypt.hash(nuevaContra,5)
        const consultaCambiarContra="UPDATE usuario SET contrasena = ? WHERE correo = ?"

        const ActualizacionContra = await conn.query(consultaCambiarContra,[NuevaContraBD, correo])
        res.json({message:"Contraseña Actualizada correctamente"})
    }else{
        res.json({message:"Las contraseñas deben ser iguales"})
    }  
}

module.exports={
    PreRegistro,
    RecuperarContraseña
}