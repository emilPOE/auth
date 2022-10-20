
require('dotenv').config();
import mysql from "mysql2";

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    timezone: "+00:00" 
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("DB connected...");
});

module.exports = connection;
