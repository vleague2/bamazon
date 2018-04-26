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
        "SELECT * FROM products", (err, res) => {
            if (err) throw err;
    
            // set up empty array that will hold each value from the database response
            let tableVal = [];

            // loop through database response and push each value to the array
            for (i=0; i < res.length; i++) {
                let array = {
                    item: res[i].id,
                    product: res[i].product_name,
                    department: res[i].department_name,
                    price: res[i].price,
                    quantity: res[i].stock_quantity
                };
                
                tableVal.push(array);
            }

            // display a table containing the array items
            console.log("\n")
            console.table(tableVal);

            // call the next function to ask the user what they want to purchase, and pass in tableVal so we can use it there
            userAction(tableVal);
        }
    )
}

// function to ask the user what action they'd like to take
function userAction(tableVal) {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID # of the item you would like to purchase?",
            name: "item",

            // make sure the item ID is one of the available options
            validate: function(input) {
                if (input > tableVal.length) {
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
        let item = "";

        // loop through tableVal array and check if the user's choice matches that item's ID. if so, reassign the variable above
        tableVal.forEach(val => {
            if (answers.item == val.item) {
                item = val;
            }
        });

        // if the quantity the user has specified is more than the quantity available
        if (answers.quantity > item.quantity) {

            // log that the quantity is insufficient, and re-call the function to restart the questions
            console.log(chalk.red("\nInsufficient quantity!\n"));
            userAction(tableVal);
        }

        else {
            console.log(chalk.bgGreen("\n\nYou have purchased " + answers.quantity + " " + item.product + "s!\nThe total cost was: $" + answers.quantity * item.price));
            updateDB(answers.quantity, item);
        }
    })
}


function updateDB(quantity, item) {

    let newQuant = item.quantity - quantity;

    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newQuant
            },
            {
                id: item.item
            }
        ],
        function(err, res) {
            if (err) throw err;
            readDB();
        }
    )
}