const bcrypt = require("bcrypt");
const conn = require('../Model/conn');

function IniciarSesion(req, res) {
    // Recuperar datos
    const { correo, contrasena } = req.body;

    // Validar usuario
    conn.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (error, results) => {
        console.log(results);

        if (results.length > 0) {
            const usuario = results[0];
            console.log('Usuario en DB');

            // Verificar estado del usuario
            if (usuario.estado !== 1) {
                return res.json({
                    success: false,
                    message: 'Usuario no está activo'
                });
            }

            // Validar contraseña
            const contraseña_DB = usuario.contrasena;
            console.log(contraseña_DB);
            const validacion_contraseñas = await bcrypt.compare(contrasena, contraseña_DB);
            
            if (validacion_contraseñas) {
                req.session.usuario = {
                    id: usuario.id_usuario,
                    rol: usuario.id_rol,
                    nombre: usuario.Nombres,
                    apellido: usuario.Apellidos
                };
                const usuarioSesion = req.session.usuario;
                res.json({
                    success: true,
                    message: 'Autenticación exitosa',
                    usuario: usuarioSesion
                });
            } else {
                res.json({
                    success: false,
                    message: 'Contraseña incorrecta'
                });
            }
        } else {
            res.json({
                success: false,
                message: 'No se encontró el usuario'
            });
        }
    });
}

function ObtenerUsuariosPendientes(req, res) {
    const estadoPendiente = 2;
    
    const query = `
        SELECT 
            u.id_usuario, u.pkfk_tdoc, u.numero_id, u.id_rol, u.Nombres, u.Apellidos,
            u.fecha_nacimiento, u.genero, u.correo, u.celular, u.estado,
            a.nombre_acudiente, a.correo_acudiente, a.celular_acudiente
        FROM 
            usuario u
        LEFT JOIN 
            alumno a ON u.id_usuario = a.id_alumno
        WHERE 
            u.estado = ?
    `;

    conn.query(query, [estadoPendiente], (error, results) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al recuperar los usuarios pendientes',
                error: error
            });
        }
        
        res.json({
            success: true,
            message: 'Usuarios pendientes recuperados con éxito',
            usuarios: results
        });
    });
}


module.exports = {
    IniciarSesion,
    ObtenerUsuariosPendientes
};
