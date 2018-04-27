// Setting up required modules
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

// set up items connection to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
})

// connect to database and start the program
connection.connect((err) => {
    if (err) throw err;
    console.log("\nWelcome to Bamazon!");

    // call the function to start the program
    start();

})

function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "action"
        }
    ])
    .then(answers => {
        let action = answers.action;
        switch (action) {
            case "View Products for Sale": 
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
        }    
    })
}

function viewProducts() {

}

function lowInventory() {

}

function addInventory() {

}

function newProduct() {
    
}