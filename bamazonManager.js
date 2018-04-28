// Setting up required modules
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');
const chalk = require('chalk');

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
    console.log("\nWelcome to Bamazon!\n");
    
    connection.query(
        "SELECT * FROM products", (err, res) => {
            if (err) throw err;
            // call the function to start the program
            start(res);
        }
    )
})

function start(res) {

    
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "action"
        }
    ])
    .then(answers => {
        let action = answers.action;
        switch (action) {
            case "View Products for Sale": 
                viewProducts(res);
                break;
            case "View Low Inventory":
                lowInventory(res);
                break;
            case "Add to Inventory":
                addInventory(res);
                break;
            case "Add New Product":
                newProduct();
                break;
        }    
    })
}

function viewProducts(res) {
    console.table(res);
    start(res);
}


function lowInventory(res) {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity < 5", (err, res2) => {
            if (err) throw err;
            console.table(res2);
            start(res);
        }
    )
}

function addInventory(res) {
    console.table(res);
    inquirer.prompt([
        {
            type: "input",
            message: "Which item would you like to replenish?",
            name: "item",

            // make sure the item ID is one of the available options
            validate: function(input) {
                if (input > res.length || isNaN(input) === true) {
                    return false;
                }

                else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "How much inventory would you like to add?",
            name: "amount",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        }
    ])
    .then(answers => {

        let itemIndex = answers.item - 1;

        // set up a variable that we will adjust to contain the item the user has chosen
        let userItem = res[itemIndex];

        let amount = parseInt(answers.amount);

        let newQuant = userItem.stock_quantity + amount;

        console.log(newQuant);

        // query the database to update
        connection.query(
            "UPDATE products SET ? WHERE ?",

            // use the item's ID as the identifier, and plug in the new quantity
            [
                {
                    stock_quantity: newQuant
                },
                {
                    id: userItem.id
                }
            ],

            function(err, res3) {
                if (err) throw err;
                console.log(chalk.bgGreen("\n\n   You have added " + amount + " to " + userItem.product_name + "     \n"));

                // send another query to database to get updated response and pass into start function
                connection.query(
                    "SELECT * FROM products", (err, res) => {
                        if (err) throw err;
                        // call the function to start the program
                        start(res);
                    }
                )
                
            }
        )
    })
}

function newProduct() {

}