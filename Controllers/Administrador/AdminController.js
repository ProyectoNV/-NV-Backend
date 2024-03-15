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

// ednpoints peticiones actividad 

const registrarActividad = async (req, res) => {
    console.log('endpoint')
    try {
        const { Nombre_actividad, anho_inicio, descripcion , foto} = req.body;

        const resultado = await conn.query("INSERT INTO actividades (Nombre_actividad , anho_inicio , descripcion , foto ,Estado_actividad  ) values (?,?,?,?,?)", [Nombre_actividad, anho_inicio, descripcion, foto,1]);
        res.json(resultado);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const actualizarActividad = async (req, res) => {
    const { id_actividad } = req.params;
    const { Nombre_actividad, anho_inicio, descripcion, foto, Estado_actividad} = req.body;
    const newData = { Nombre_actividad, anho_inicio, descripcion, foto, Estado_actividad};
    try {
    
        const resultado = await conn.query("UPDATE actividades SET ? WHERE id_actividad = ?", [newData, id_actividad]);
        res.json(resultado);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const mostrarDatosActividad = async (req, res) => {
    try{
        let fechaactua = new Date();
        let parame = fechaactua.getFullYear();
        const basedata = await conn;
        const [datosbase] = await basedata.query("SELECT * from actividades WHERE (Estado_actividad = 1) AND (anho_inicio = ?)", parame);
        res.json(datosbase)

    }catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const mostrarActividadInactiva = async (req, res) => {
    try{
        let fechaactua = new Date();
        let parame = fechaactua.getFullYear();
        const basedata = await conn;
        const [inacacti] = await basedata.query("SELECT * from actividades WHERE (Estado_actividad = 0) AND (anho_inicio = ?)", parame);
        res.json(inacacti)

    }catch(error){
        res.status(500);
        res.send(error.message);
    }
}

// Eliminar Actividad

const actuaActivi = async (req, res) => {
    const { id_actividad } = req.params;
    const consulta="SELECT Estado_actividad FROM actividades WHERE id_actividad = ?";
    const [verificarEstado] = await conn.query(consulta, id_actividad);
    let cambio = 1;
    if(verificarEstado[0].Estado_actividad === 1){
        cambio = 0;
    }
    else if(verificarEstado[0].Estado_actividad === 0){
        cambio = 1;
    }
    try {
        const resultado = await conn.query("UPDATE actividades SET Estado_actividad = ? WHERE id_actividad = ?", [cambio, id_actividad]);
        res.json(resultado);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const agregarDocenteActividad = async (req, res)=>{
    try{
        const { id_docente, Actividad_id} = req.body;
        const valores ={id_docente, Actividad_id}
        const connection = await conn;
        const result = await connection.query("INSERT INTO docente_has_actividad SET ?", valores)
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};


// ver listas 
const verLista = async (req, res) => {  
    try {
        const id_actividad = req.params.id_actividad;
        const verListact = `
            SELECT
                actividades.id_actividad,
                actividades.Nombre_actividad,
                actividades.anho_inicio,
                actividades.descripcion,
                usuario.id_usuario,
                usuario.Nombres,
                usuario.Apellidos,
                asistencia.fecha_asistencia,
                asistencia.Confirmacion
            FROM
                actividades
            INNER JOIN
                actividad_has_alumno ON actividades.id_actividad = actividad_has_alumno.Actividad_id
            INNER JOIN
                usuario ON actividad_has_alumno.id_alumno = usuario.id_usuario
            INNER JOIN
                asistencia ON actividades.id_actividad = asistencia.Actividad_id
            WHERE
                actividades.id_actividad = ?`;   
                
    const [resultado] = await conn.query(verListact,id_actividad)
    res.json(resultado);
} catch (error) {
    res.status(500).send(error.message);
}}


//Inscripción 
const InscribirActividad = async (req, res)=>{
    try{
        const {Actividad_id, id_alumno} = req.body;
        const valores ={ Actividad_id, id_alumno}
        const connection = await conn;
        const result = await connection.query("INSERT INTO actividad_has_alumno SET ?", valores)
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const BuscarActividadesAlum = async (req, res)=>{
    try{
        const {id_alumno, anho_inicio} = req.params;
        const connection = await conn;
        const [result] = await connection.query("SELECT COUNT(*) AS cantidad_actividades FROM alumno L INNER JOIN actividad_has_alumno H ON L.id_alumno = H.id_alumno INNER JOIN actividades A  ON H.Actividad_id = A.id_actividad WHERE (H.id_alumno = ?) AND (A.anho_inicio = ?)", [id_alumno, anho_inicio])
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const BuscarNumAlum = async (req, res)=>{
    try{
        const {Actividad_id} = req.params;
        const connection = await conn;
        const [result] = await connection.query("SELECT COUNT(*) AS cantidad_alumnos FROM actividades A INNER JOIN actividad_has_alumno H ON A.id_actividad = H.Actividad_id INNER JOIN alumno L ON L.id_alumno = H.id_alumno WHERE H.Actividad_id = ?", Actividad_id)
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
    mostrarActividadInactiva,
    agregarHorarioActividad,
    filtrarActividadesHorario,
    buscarHorariosIguales,
    eliminarHorario,
    eliminarHorarioActividad, 
    actualizarhorario,
    TraerCronograma,
    registrarActividad,
    actualizarActividad,
    mostrarDatosActividad,
    actuaActivi,
    verLista,
    agregarDocenteActividad, 
    InscribirActividad,
    BuscarActividadesAlum, 
    BuscarNumAlum
}
