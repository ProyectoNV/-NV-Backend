const bcrypt = require("bcrypt");
const conn =require('../Model/conn').promise()

function IniciarSesion(req,res){
    //recuperar datos
    const{correo ,contrasena}=req.body;

    
    //validar usuario
    conn.query('SELECT * FROM usuario WHERE correo= ? ',[correo],
    async(error,results)=>{
        console.log(results)

        if(results.length>0){
            console.log('Usuario en DB');
            // validar contraseña
            const contraseña_DB =results[0].contrasena;
            console.log(contraseña_DB);
            const validacion_contraseñas = await bcrypt.compare(contrasena, contraseña_DB) 
            if (validacion_contraseñas){
                    
                req.session.usuario = {
                    id: results[0].id_usuario,
                    rol: results[0].id_rol,
                    nombre: results[0].Nombres,
                    apellido: results[0].Apellidos   
                }
                const usuario = req.session.usuario;
                res.json({
                    success: true,
                    message:'Autenticacion exitosa',
                    usuario: usuario
                })
            }else{
                res.json({
                    success: false,
                    message:'Autenticacion errada'
                })
            }

        }
        else{
            res.json({
                success: false,
                message: "No se encontro el usuario"
            })
        }
    })

}

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
    IniciarSesion,
    PreRegistro,
    RecuperarContraseña
}