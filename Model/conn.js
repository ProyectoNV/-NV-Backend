const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Asegúrate de especificar la ruta correcta al certificado CA
const caCertPath = path.join(__dirname, '../certs/DigiCertGlobalRootCA.crt.pem');

let caCert;
try {
    caCert = fs.readFileSync(caCertPath);
} catch (error) {
    console.error(`Error al leer el certificado: ${error.message}`);
    process.exit(1);
}

const conn = mysql.createConnection({
    host: "admj2024.mysql.database.azure.com",
    user: "Proyecto_Grupal",
    password: "NV2024cordination",
    database: "Db_Cordination",
    port: 3306,
    ssl: {
        ca: caCert // Se especifica el certificado CA para la conexión SSL
    }
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
