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

    // welcome the user!
    console.log("\nWelcome to Bamazon! You are entering as a manager.\n");
    
    // start the program
    start();
})


// function that starts the program
function start() {

    // query database for an updated list of all products
    connection.query(
        "SELECT * FROM products", (err, res) => {
            if (err) throw err;

            // prompt the user to select what they want to do
            inquirer.prompt([
                {
                    type: "list",
                    message: "What would you like to do?",
                    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                    name: "action"
                }
            ])
            .then(answers => {

                // based on what they choose, select a function and pass in the response from the database if needed
                switch (answers.action) {
                    case "View Products for Sale": 
                        viewProducts(res);
                        break;
                    case "View Low Inventory":
                        lowInventory();
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
    )
}

// function to display all products
function viewProducts(res) {

    // display the results from the database
    console.table(res);

    // recall the start function
    start();
}

// function to display items with low inventory
function lowInventory() {

    // query the database
    connection.query(

        // for items that have less than 5 quantity
        "SELECT * FROM products WHERE stock_quantity < 5", (err, res) => {
            if (err) throw err;

            // display the result in a table
            console.table(res);

            // recall the start function
            start();
        }
    )
}

// function to add to the inventory
function addInventory(res) {

    // display the database in a table so the user can see the items
    console.table(res);

    // prompt them for the item they want to restock and how much
    inquirer.prompt([
        {
            type: "input",
            message: "Which item would you like to replenish?",
            name: "item",

            // make sure the item ID is one of the available options & they enter a number
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

            // make sure they enter a number
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

        // take the amount they entered and parse it to a variable so we can add to it
        let amount = parseInt(answers.amount);

        // calculate the new quantity after the restock 
        let newQuant = userItem.stock_quantity + amount;

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

                // let the user know how much they've restocked
                console.log(chalk.bgGreen("\n\n   You have added " + amount + " to " + userItem.product_name + "     \n"));

                // restart the program
                start();
            }
        )
    })
}

// function to add a new product
function newProduct() {

    // gather the info we need to plug into the database
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product you want to add?",
            name: "name"
        },
        {
           type: "input",
           message: "What department is this item in?",
           name: "dept" 
        },
        {
            type: "input",
            message: "What is the price of the item?",
            name: "price",

            // make sure they enter a number
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        },
        {
            type: "input",
            message: "How many of this item do we have in stock?",
            name: "stock",
            
            // make sure they enter a number
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        }
    ]).then(answers => {

        // query the database to add a new item
        connection.query(
            "INSERT INTO products SET ?",

            // plug in the info we got from the inquirer
            {
                product_name: answers.name,
                department_name: answers.dept,
                price: answers.price,
                stock_quantity: answers.stock
            },
            function(err) {
                if (err) throw err;
                
                // log that the item was added
                console.log(chalk.bgGreen("\n\n   Your item has been added successfully!     \n"));
                
                // restart the program
                start();
            }
        )
    })
}
