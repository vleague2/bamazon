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
    
            // set up empty array that will hold each value from the database response
            let productsArray = [];

            // loop through database response and push each value to the array
            for (i=0; i < res.length; i++) {

                // use the constructor to create an object
                let itemObject = new Product(res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);
                
                productsArray.push(itemObject);
            }

            // display a table containing the array items
            console.log("\n")
            console.table(productsArray);

            // call the next function to ask the user what they want to purchase, and pass in productsArray so we can use it there
            userAction(productsArray);
        }
    )
}

// function to ask the user what action they'd like to take
function userAction(productsArray) {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID # of the item you would like to purchase?",
            name: "item",

            // make sure the item ID is one of the available options
            validate: function(input) {
                if (input > productsArray.length) {
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

        // set up a variable that we will adjust to contain the item the user has chosen
        let userItem = "";

        // loop through productsArray array and check if the user's choice matches that item's ID. if so, reassign the variable above
        productsArray.forEach(product => {
            if (answers.item == product.Item) {
                userItem = product;
            }
        });

        // if the quantity the user has specified is more than the quantity available
        if (answers.quantity > userItem.Quantity) {

            // log that the quantity is insufficient, and re-call the function to restart the questions
            console.log(chalk.red("\nInsufficient quantity!\n"));
            userAction(productsArray);
        }

        else {
            console.log(chalk.bgGreen("\n\n   You have purchased " + answers.quantity + " " + userItem.Product + "s!   \n   The total cost was: $" + answers.quantity * userItem.Price + "   "));
            updateDB(answers.quantity, userItem);
        }
    })
}

// function to update the database
function updateDB(quantity, userItem) {

    // calculate the new quantity for the item
    let newQuant = userItem.Quantity - quantity;

    // query the database to update
    connection.query(
        "UPDATE products SET ? WHERE ?",

        // use the item's ID as the identifier, and plug in the new quantity
        [
            {
                stock_quantity: newQuant
            },
            {
                id: userItem.Item
            }
        ],

        // call the read DB function to restart the whole program
        function(err, res) {
            if (err) throw err;
            readDB();
        }
    )
}