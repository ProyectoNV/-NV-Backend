const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "Db_Cordination",
    port: 3306,
});

conn.connect((error) => {
    if (error) {
        console.error(`Error al conectarse a la base de datos: ${error.message}`);
        return;
    }
    console.log("Conexión exitosa a la base de datos MySQL");
});

process.on("SIGINT", () => {
    console.log("Cerrando conexión...");
    conn.end((err) => {
        if (err) {
            console.error(`Error al cerrar la conexión: ${err.message}`);
        } else {
            console.log("Conexión cerrada. Saliendo...");
            process.exit();
        }
    });
});

module.exports = conn;
