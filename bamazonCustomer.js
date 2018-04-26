const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

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
            console.log(res[0].id + res[0].product_name + res[0].department_name + res[0].price + res[0].stock_quantity);
 
            const tableHead = [
                'Item #',
                'Product',
                'Department',
                'Price',
                'Quantity'
            ]

            let tableVal = [];

            for (i=0; i < res.length; i++) {
                let array = [
                    res[i].id,
                    res[i].product_name,
                    res[i].department_name,
                    res[i].price,
                    res[i].stock_quantity
                ];
                
                tableVal.push(array);
            }

            console.table(tableHead, tableVal);
        }
    )
}