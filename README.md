# Bamazon

Bamazon is a database of products that customers can purchase. This app contains three different levels of functionality. 

## How to Use
* You must have NodeJS installed.
* Clone down the repo.
* Use the "node" command to run the file of your choice. The gifs below demonstrate how to run the command line.

## Customer View
As a customer, the user will see a table of the items available.
* The app will prompt them to enter the product number of the item they want to purchase.
* The app will validate that the number they enter is one of the options in the database, and that they enter a number.
* The app will prompt the user to specify how much of the item they want to purchase.
* The app will validate that they enter a number, and that there is enough of the item available. 
* If the transaction is successful, the app will update the quantity in the database and display to the user what they have purchased, and its total cost.
* After each transaction, the program restarts.

See gif below for functionality.

![CustomerView](/images/customerview.gif)

## Manager View
As a manager, the user will be able to select one of four commands:

Command | Result
------------ | -------------
View Products for Sale | The app will display a table of the items in the database. The program then restarts.
View Low Inventory | The app will display items from the database with a quantity of 5 or less. The program then restarts.
Add to Inventory | The app will display the items in the database and prompt the user to identify which item they'd like to restock, and by how much. The app validates the user's input. The app will update the database, display to the user what they have updated, and then restart the program.
Add New Product | The app will prompt the user to enter the information needed to add an item to the database. It will then insert the new item into the database, display to the user that the item has been added, and then restart the program.

See gifs below for functionality.

![Manager View](/images/managerview1.gif)

![Manager View](/images/managerview2.gif)

![Manager View](/images/managerview3.gif)

![Manager View](/images/managerview4.gif)

## Supervisor View
As a supervisor, the user will be able to select one of two commands:

Command | Result
------------ | -------------
View product sales by department | The app will perform a join on two tables in the Bamazon database to display department information combined with product sale information. The program then restarts.
Add a new department | The app will prompt the user to enter the information needed to create a new department. It will add the new department to the database, but please note that the new department will not have any product sales yet, and thus no profit. The program then restarts.

See gifs below for functionality.

![Supervisor View](/images/supervisorview1.gif)

![Supervisor View](/images/supervisorview2.gif)

## Technologies used:
* Node.js
* Vanilla Javascript
* MySQL with Workbench
* Node packages: Chalk, Inquirer, Console.table, MySQL