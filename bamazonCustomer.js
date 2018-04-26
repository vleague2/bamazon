const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
})

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected as " + connection.threadId);
    readDB();
})


function readDB() {
    connection.query(
        "SELECT * FROM products", (err, res) => {
            if (err) throw err;
            console.log(res);
        }
    )
}