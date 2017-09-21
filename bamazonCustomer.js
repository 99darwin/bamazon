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

var stock;
var newStock;
// Customer shopping function
function shop() {
    // Connect to database
    connection.query(
        // Select all from products table
        'SELECT * FROM products', function(err, res) {
            if (err) throw err;
            console.log('\n');
            // Console log table of product choices, prices, etc
            console.table(res);
            console.log('----------------------------------------------------------------');
            // Define choice array
            var choiceArr = [];
            // Loop thru products and add to array
            for (var j = 0; j < res.length; j++) {
                // Push products to choice array
                choiceArr.push(res[j].product_name);
            }
            // Begin user prompt
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Which item ID would you like to purchase?',
                    name: 'itemPrompt',
                    choices: choiceArr
                },
                {
                    type: 'input',
                    message: 'How many of these items would you like to purchase?',
                    name: 'numItems'
                }
            ])
            .then(function(answer) {
                // Find stock quantity based on user choice
                stock = res[choiceArr.indexOf(answer.itemPrompt)].stock_quantity;
                // New stock equals stock quantity of chosen item minus number of items desired
                newStock = stock - answer.numItems;
                // If number of items desired is less than or equal to amount in stock...
                if (answer.numItems <= stock) {
                    connection.query(
                        // Update database with new stock quantity
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                product_name: answer.itemPrompt
                            }
                        ],
                        function(err) {
                            if (err) throw err;
                            console.log('Thank you for your purchase!');
                            // Prompt user to decide whether or not they would like to keep shopping
                            keepShopping();
                        }
                    );
                    // If number of items desired exceeds stock quantity...
                } else if (answer.numItems > stock) {
                    // Inform the user
                    console.log('Insufficient stock!');
                    // Prompt user to decide whether or not they would like to keep shopping
                    keepShopping();
                }
            });
        }
    );
};
// Call shopping function
shop();

// Function to prompt user on whether or not they would like to keep shopping
function keepShopping() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Keep shopping?',
            name: 'keepShopping',
            choices: ['yes', 'no']
        }
    ]).then(function(answer) {
        // If user decides to keep shopping...
        if (answer.keepShopping === 'yes') {
            // Run shopping function
            shop();
        // Otherwise...
        } else {
            console.log('Thank you, come again!');
            // End the connection
            connection.end();
        }
    });
};
