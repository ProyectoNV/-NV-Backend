const mysql = require('mysql2')

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"Db_Cordination"
})

conn.connect((error)=>{
    if(error){
        console.error(`Error al conectarse a la base de datos: ${error}`)
        return
    }
    console.log("Conexion exitosa")

})

process.on("SIGINT",()=>{
    conn.end();
    process.exit();
})

module.exports=conn;