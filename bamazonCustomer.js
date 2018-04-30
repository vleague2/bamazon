// set up required modules
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
    console.log("\nWelcome to Bamazon!");

    // call the function to start the program
    readDB();

})

// read the database's current entries
function readDB() {
    connection.query(
        // in this query, calling only the product fields I want the user to see
        "SELECT id, product_name, department_name, price, stock_quantity FROM products", (err, res) => {
            if (err) throw err;
    
            // display a table containing the array items
            console.log("\n")
            console.table(res);

            // calling another query so that we have all the product fields, which we will need later!
            connection.query(
                "SELECT * FROM products", (err, res2) => {
                    // call the next function to ask the user what they want to purchase, and pass in the database response so we can use it there
                    userAction(res2);
                }
            )    
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
            message: "How many would you like to purchase?",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        }
    ])
    .then(answers => {

        // take the item number they chose and subtract one so that we can use it as an array index number
        let itemIndex = answers.item - 1;

        // assign the array entry to a variable so we can access it
        let userItem = res[itemIndex];

        // if the quantity the user has specified is more than the quantity available
        if (answers.quantity > userItem.stock_quantity) {

            // log that the quantity is insufficient, and re-call the function to restart the questions
            console.log(chalk.red("\nInsufficient quantity!\n"));
            userAction(res);
        }

        else {

            let price = answers.quantity * userItem.price;

            // log what the user purchased and how much it cost
            console.log(chalk.bgGreen("\n\n   You have purchased " + answers.quantity + " " + userItem.product_name + "s!   \n   The total cost was: $" + price + "   "));

            // call the updateDB function and pass in the item and quantity
            updateDB(answers.quantity, userItem, price);
        }
    })
}

// function to update the database
function updateDB(quantity, userItem, price) {

    // calculate the new quantity for the item
    let newQuant = userItem.stock_quantity - quantity;

    // calculate the new total sales for that product
    let newSales = userItem.product_sales + price;

    // query the database to update
    connection.query(
        "UPDATE products SET ? WHERE ?",

        // use the item's ID as the identifier, and plug in the new quantity
        [
            {
                stock_quantity: newQuant,
                product_sales: newSales
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