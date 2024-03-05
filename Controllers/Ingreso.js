const bcrypt = require("bcrypt");
const conn =require('../Model/conn')

function IniciarSesion(req,res){
    //recuperar datos
    const{correo ,contrasena}=req.body;

    
    //validar usuario
    conn.query('SELECT contrasena FROM usuario WHERE correo= ? ',[correo],
    async(error,results)=>{
        console.log(results)

        if(results.length>0){
            console.log('Usuario en DB');
            // validar contraseña
            const contraseña_DB =results[0].contrasena;
            console.log(contraseña_DB);
            const validacion_contraseñas = await bcrypt.compare(contrasena, contraseña_DB) 
            if (validacion_contraseñas){
                res.json({
                    mensaje:'Autenticacion exitosa'
            })
            }else{
                res.json({
                    mensaje:'Autenticacion errada'
                })
            }

        }
        else{
            res.json("No se encontro el usuario")
        }
    })

}

module.exports={
    IniciarSesion
}