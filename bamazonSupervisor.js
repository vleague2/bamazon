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
    console.log("\nWelcome to Bamazon! You are entering as a supervisor.");

    // call the function to start the program
    prompt();
})

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
        let action = answers.action;

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
        let name = answers.name;
        let cost = answers.cost;

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