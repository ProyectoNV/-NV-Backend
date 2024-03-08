const bcrypt = require("bcrypt");
const conn =require('../Model/conn')

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
                if(results[0].id_rol == '11'){
                    //const activi = conn.query('SELECT A.id_actividad, A.Nombre_actividad FROM usuario U inner join docente_has_actividad H ON U.id_usuario = H.id_docente inner join actividades A ON A.id_actividad = H.Actividad_id WHERE U.id_usuario = ?', results[0].id_usuario);
                    req.session.usuario = {
                        id: results[0].id_usuario,
                        rol: results[0].id_rol,
                        nombre: results[0].Nombres,
                        apellido: results[0].Apellidos
                    };
                }
                else if(results[0].id_rol == '12'){
                    req.session.usuario = {
                        id: results[0].id_usuario,
                        rol: results[0].id_rol,
                        nombre: results[0].Nombres,
                        apellido: results[0].Apellidos
                    };
                }
                else if(results[0].id_rol == '10'){
                    req.session.usuario = {
                        id: results[0].id_usuario,
                        rol: results[0].id_rol,
                        nombre: results[0].Nombres,
                        apellido: results[0].Apellidos
                    };
                }
                else{
                    console.log("error rol");
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

module.exports={
    IniciarSesion
}