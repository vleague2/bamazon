// Set up required modules
const mysql = require('mysql');
const table = require('console.table');
const inquirer = require('inquirer');
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

    // welcome the user to bamazon
    console.log("\nWelcome to Bamazon! You are entering as a supervisor.\n");

    // call the function to start the program
    prompt();
})

// function to ask the user what they would like to do
function prompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View product sales by department", "Add a new department"]
        }
    ])
    .then(answers=> {

        // assign user answer to a variable so it's cleaner
        let action = answers.action;

        // decide what to do based on user answer
        switch (action) {
            case "View product sales by department":
                viewSales();
                break;
            case "Add a new department":
                addDept();
                break;
        }
    })
}

// function to view sales by department
function viewSales(){
    // give the console some space
    console.log("\n");

    // query the database to display two different tables combined. we are selecting the three columns in the departments table, and selecting the SUM of the product_sales in the products table (which we then rename so it looks nicer on the table), and selecting the difference between the SUM of the product_sales and the overhead costs (which we name total_profit for this table). we identify departments as the main (left) table, and join it to the products table so that all departments will display and products that match those departments will join. we identify the department_name as the joined parameter for both tables, and then group the new display table by the department_id and the department_name so everything joins together.
    connection.query(
        "SELECT departments.department_id, departments.department_name, departments.overhead_costs, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.overhead_costs) AS total_profit"
        + " FROM departments"
        + " LEFT JOIN products ON departments.department_name = products.department_name"
        + " GROUP BY departments.department_id, departments.department_name"
        ,function(err, res) {
            if (err) throw err;

            // display the result for the user
            console.table(res);

            // recall the prompt function
            prompt();
        }
    )
}

// function to add a new department
function addDept() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the department called?"
        },
        {
            type: "input",
            name: "cost",
            message: "What is the overhead cost to run this department?"
        }
    ])
    .then(answers=> {

        // assign both answers to variables to make it cleaner...
        let name = answers.name;
        let cost = answers.cost;

        // query the database to insert a new row containing the user's answers
        connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: name,
                overhead_costs: cost
            },
            function (err) {
                if (err) throw err;

                // log that the department was added
                console.log(chalk.bgGreen("\n\n   The department has been added successfully!     \n"));

                // rerun prompt
                prompt();
            }
        )
    })
}