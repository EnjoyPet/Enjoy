// db.js

global.dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

const mysql = require("mysql2");

// Configuración de la conexión a la base de datos
const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// Conectar a la base de datos
conexion.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: " + err.message);
  } else {
    console.log("Conexión a la base de datos establecida");
  }
});

module.exports = conexion;
