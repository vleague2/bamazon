// set up required modules
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');
const chalk = require('chalk');

// Constructor to allow us to make product objects quickly
let Product = function(id, name, dept, price, quant) {
    this.Item = id;
    this.Product = name;
    this.Department = dept;
    this.Price = price;
    this.Quantity = quant;
}

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
    readDB();

})

// read the database's current entries
function readDB() {
    connection.query(
        "SELECT * FROM products", (err, res) => {
            if (err) throw err;
    
            // display a table containing the array items
            console.log("\n")
            console.table(res);

            // call the next function to ask the user what they want to purchase, and pass in productsArray so we can use it there
            userAction(res);
        }
    )
}

// function to ask the user what action they'd like to take
function userAction(res) {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID # of the item you would like to purchase?",
            name: "item",

            // make sure the item ID is one of the available options
            validate: function(input) {
                if (input > res.length) {
                    return false;
                }

                else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "How many would you like to purchase?",
            name: "quantity"
        }
    ])
    .then(answers => {

        let itemIndex = parseInt(answers.item) - 1;

        // set up a variable that we will adjust to contain the item the user has chosen
        let userItem = res[itemIndex];

        // if the quantity the user has specified is more than the quantity available
        if (answers.quantity > userItem.stock_quantity) {

            // log that the quantity is insufficient, and re-call the function to restart the questions
            console.log(chalk.red("\nInsufficient quantity!\n"));
            userAction(res);
        }

        else {
            console.log(chalk.bgGreen("\n\n   You have purchased " + answers.quantity + " " + userItem.product_name + "s!   \n   The total cost was: $" + answers.quantity * userItem.price + "   "));
            updateDB(answers.quantity, userItem);
        }
    })
}

// function to update the database
function updateDB(quantity, userItem) {

    // calculate the new quantity for the item
    let newQuant = userItem.stock_quantity - quantity;

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

        // call the read DB function to restart the whole program
        function(err, res) {
            if (err) throw err;
            readDB();
        }
    )
}