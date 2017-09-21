var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

// Main manager view
function managerView() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'init',
            choices: [
                'View Inventory',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Quit'
            ]
        }
    ]).then(function(answer) {
        // Functions based on prompt answers
        switch (answer.init) {
            // If view inventory, viewInventory()
            case 'View Inventory':
                viewInventory();
                break;
            // If view low inventory, lowInventory()
            case 'View Low Inventory':
                lowInventory();
                break;
            // If add to inventory, addInventory()
            case 'Add to Inventory':
                addInventory();
                break;
            // If add new product, addProduct()
            case 'Add New Product':
                addProduct();
                break;
            // If Quit, end connection
            case 'Quit':
                quit();
                break;
        }
    });
}
// Call managerView on load
managerView();

// View inventory function
function viewInventory() {
    // Inititate connection
    connection.query(
        // Select all from products table
        'SELECT * FROM products', function(err, res) {
            if (err) throw err;
            console.log('\n');
            // Show the entire inventory as a table
            console.table(res);
            console.log('--------------------------------------------')
        }
    );
    // Call manager view to see if user would like to continue using program
    managerView();
};

var lowProduct;
// Function to check for products that have less than 5 items in inventory
function lowInventory() {
    // Initiate connection
    connection.query(
        // Select everything from products table
        'SELECT * FROM products', function(err, res) {
            if (err) throw err;
            // Loop through stock quantity to find products with less than 5 items
            for (i = 0; i < res.length; i++) {
                // If less than 5...
                if (res[i].stock_quantity < 5) {
                    // Log the product that has less than 5 items
                    console.log('\n************* ' + res[i].product_name + ' is low on stock! *************\n');
                    // Wait 2.5 seconds before giving the option to add to inventory
                    setTimeout(addInventory, 2500);
                } else {
                    // If the product has 5 or more items in stock, inform the user that all is well
                    console.log(res[i].product_name + ' is all stocked up! Nothing to worry about.')
                }
            }
        }
    );
};

var stock;
var newStock;
// Function to add to inventory
function addInventory() {
    // Initiate connection
    connection.query(
        // Select everything from products table
        'SELECT * FROM products', function(err, res) {
            console.log('\n');
            // Log entire inventory as a table
            console.table(res);
            console.log('--------------------------------------------');
            // Empty array for choices
            var choiceArr = [];
            // Loop through products and push to choice array
            for (i = 0; i < res.length; i++) {
                choiceArr.push(res[i].product_name);
            }
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Which product would you like to update?',
                    choices: choiceArr,
                    name: 'inventory'
                },
                {
                    type: 'input',
                    message: 'How many items will you add?',
                    name: 'updateProduct'
                }
            ]).then(function(answer) {
                // Find stock quantity of selected product
                stock = res[choiceArr.indexOf(answer.inventory)].stock_quantity;
                // Update stock quantity with input
                newStock = parseInt(answer.updateProduct) + parseInt(stock);
                // Initiate connection
                connection.query(
                    // Update products table at stock_quantity with the input
                    'UPDATE products SET ? WHERE ?',
                    [
                        {
                            stock_quantity: newStock
                        },
                        {
                            product_name: answer.inventory
                        }
                    ],
                    function(err) {
                        if (err) throw err;
                        // Let the user know the inventory has been updated
                        console.log('Inventory updated');
                    }
                );
                // Find out if the user would like to continue using program, or quit
                managerView();
            });
        }
    );
};

// Function to add a brand new product to the database
function addProduct() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Item Name: ',
            name: 'product_name'
        },
        {
            type: 'input',
            message: 'Department Name: ',
            name: 'dept_name'
        },
        {
            type: 'input',
            message: 'Price',
            name: 'price'
        },
        {
            type: 'input',
            message: 'Stock Quantity: ',
            name: 'stock_quantity'
        }
    ]).then(function(answer) {
        // Initiate connection
        connection.query(
            // Insert into products table with the object based on answers from inquirer prompt
            'INSERT INTO products SET ?',
            {
                product_name: answer.product_name,
                dept_name: answer.dept_name,
                price: answer.price,
                stock_quantity: answer.stock_quantity
            }, 
            function(err, res) {
                if (err) throw err;
                // Let the user know product has been added
                console.log(res.affectedRows + ' New product added\n');
            }
        );
        // Go back to manager view
        managerView();
    });
};

// Quit function
function quit() {
    // End the connection
    connection.end();
}