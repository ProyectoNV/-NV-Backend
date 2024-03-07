const conn = require('../../Model/conn').promise();
const bcryp = require('bcrypt')
const VerDocente = async (req,res)=>{
    try {
        const consulta="select id_usuario, pkfk_tdoc, numero_id, Nombres , Apellidos, celular, correo from usuario where id_rol =11 and estado=1;"
        const [resultado] = await conn.query(consulta)

        res.json(resultado)
        console.log(resultado)
    } catch (error) {
        console.error(`Errro: ${error}`)
    }
}

const AgregarDocente = async(req,res)=>{
    try {
        const {tipoDoc,numeroId,nombres,apellidos,fechaNacimiento,genero,correo,celular}=req.body;
        console.log(req.body)

        if(!tipoDoc || !numeroId || !nombres || !apellidos || !fechaNacimiento || !genero || !correo || !celular){
            res.send("Todos los campos son obligatorios")
            return
        }
        const contraEncriptada = await bcryp.hash(numeroId,3);
        const consulta="SELECT * FROM usuario WHERE pkfk_tdoc = ? AND numero_id = ?";
        const [verificarUsuario] = await conn.query(consulta, [tipoDoc, numeroId]);

        console.log(verificarUsuario.length)
        if (verificarUsuario.length ===0){
            const respuesta = await conn.query('INSERT INTO usuario (pkfk_tdoc,numero_id,id_rol,Nombres,Apellidos,fecha_nacimiento,genero,correo,celular,contrasena,estado) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[tipoDoc,numeroId,11,nombres,apellidos,fechaNacimiento,genero,correo,celular,contraEncriptada,1])
            console.log(respuesta)
            res.json({message:"Usuario y docente creado correctamente"})
        }
    } catch (error) {
        console.error("Error al agregar al profesor :",error)
        res.status(500).json({message:"El profesor no pudo ser registrado "})
    }
};
const ActualizarDocente = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id);
        const {tipoDoc, Nombres, Apellidos, correo, celular } = req.body;
        console.log(id_usuario)
        // Verificar si el docente existe antes de actualizarlo

        const consulta = "UPDATE usuario SET pkfk_tdoc = ?, Nombres = ?,Apellidos = ?, correo = ?, celular = ? WHERE id_usuario = ?";
        await conn.query(consulta, [tipoDoc, Nombres, Apellidos, correo, celular, id_usuario]);
        
        res.json({ message: "Datos del docente actualizados correctamente" });
        
    } catch (error) {
        console.error("Error al actualizar al docente:", error);
        res.status(500).json({ message: "Error al actualizar al docente" });
    }
};

const EliminarDocente = async (req,res)=>{
    try {
        const id = parseInt(req.params.id)
        console.log("**********************",id)

        const consulta = "UPDATE usuario SET estado = ? WHERE id_usuario = ?"

        const [respuesta] =await conn.query(consulta,[0,id])

        console.log(respuesta)
        res.json(respuesta)
    } catch (error) {
        console.log("No se pudo eliminar el docente error: ",error)
    }
};

//Consultas de horario
const mostrarOpcionesDeActividad = async (req, res)=>{
    try{
        const connection = await conn;
        const [resuld] = await connection.query("SELECT id_actividad, Nombre_actividad FROM actividades");
        res.json(resuld)
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
    
}

const filtrarActividadesHorario = async (req, res)=>{
    try{
        const connection = await conn;
        const [resuld] = await connection.query("SELECT horario.id_horario, horario.Dia_semana, horario.Hora_inicio, horario.Hora_fin, horario.Lugar FROM actividad_horario RIGHT JOIN horario ON actividad_horario.horario_id = horario.id_horario WHERE horario_id IS NULL");
        res.json(resuld)
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
    
}

const agregarHorario = async (req, res)=>{
    try{
        const {Dia_semana, Hora_inicio, Hora_fin, Lugar} = req.body;
        const valores ={Dia_semana, Hora_inicio, Hora_fin, Lugar}
        const connection = await conn;
        const result = await connection.query("INSERT INTO  horario SET ?", valores)
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const agregarHorarioActividad = async (req, res)=>{
    try{
        const { id_actividad, horario_id} = req.body;
        const valores ={id_actividad, horario_id}
        const connection = await conn;
        const result = await connection.query("INSERT INTO  actividad_horario SET ?", valores)
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const buscarHorariosIguales = async (req, res)=>{
    try{
        const {Dia_semana, Lugar} = req.params;
        const connection = await conn;
        const [result] = await connection.query("SELECT Hora_inicio, Hora_fin FROM horario WHERE (Dia_semana = ?) AND (Lugar = ?)", [Dia_semana, Lugar])
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

 //
const eliminarHorario = async (req, res)=>{
    try{
        const {id_horario} = req.params;
        const connection = await conn;
        const result = await connection.query("DELETE FROM horario WHERE id_horario = ?", id_horario);
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const actualizarhorario = async (req, res)=>{
    try{
        const {Dia_semana, Hora_inicio, Hora_fin, Lugar} = req.body;
        const {id_horario} = req.params;
        const valores ={Dia_semana, Hora_inicio, Hora_fin, Lugar}
        const connection = await conn;
        const result = await connection.query("UPDATE horario SET ? WHERE id_horario = ?", [valores, id_horario]);
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

//Consultas ver Horario

const TraerCronograma = async (req, res)=>{
    try{
        const {Dia_semana} = req.params;
        const connection = await conn;
        const [resuld] = await connection.query("select H.Dia_semana, H.Hora_inicio, H.Hora_fin, H.Lugar, C.id_actividad, C.horario_id, A.Nombre_actividad, U.Nombres, U.Apellidos from horario H inner join actividad_horario C on H.id_horario = horario_id inner join actividades A on A.id_actividad = C.id_actividad inner join docente_has_actividad S on S.Actividad_id = A.id_actividad inner join usuario U on U.id_usuario = S.id_docente WHERE H.Dia_semana = ?", Dia_semana);
        res.json(resuld)
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
    
}

const eliminarHorarioActividad = async (req, res)=>{
    try{
        const {id_actividad,horario_id } = req.params;
        const connection = await conn;
        const result = await connection.query("DELETE FROM actividad_horario WHERE (id_actividad = ?) AND (horario_id = ?)", [id_actividad, horario_id]);
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

module.exports={
    VerDocente,
    AgregarDocente,
    ActualizarDocente,
    EliminarDocente,
    agregarHorario,
    mostrarOpcionesDeActividad,
    agregarHorarioActividad,
    filtrarActividadesHorario,
    buscarHorariosIguales,
    eliminarHorario,
    eliminarHorarioActividad, 
    actualizarhorario,
    TraerCronograma
}
