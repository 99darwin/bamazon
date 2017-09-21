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
        switch (answer.init) {
            case 'View Inventory':
                viewInventory();
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
            case 'Quit':
                quit();
                break;
        }
    });
}
managerView();

function viewInventory() {
    connection.query(
        'SELECT * FROM products', function(err, res) {
            if (err) throw err;
            console.log('\n');
            console.table(res);
            console.log('--------------------------------------------')
        }
    );
    managerView();
};

var lowProduct;
function lowInventory() {
    connection.query(
        'SELECT * FROM products', function(err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < 5) {
                    console.log('\n************* ' + res[i].product_name + ' is low on stock! *************\n');
                    setTimeout(addInventory, 2500);
                } else {
                    console.log(res[i].product_name + ' is all stocked up! Nothing to worry about.')
                }
            }
        }
    );
};

var stock;
var newStock;
function addInventory() {
    connection.query(
        'SELECT * FROM products', function(err, res) {
            console.log('\n');
            console.table(res);
            console.log('--------------------------------------------')
            var choiceArr = [];
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
                stock = res[choiceArr.indexOf(answer.inventory)].stock_quantity;
                newStock = answer.updateProduct += stock;
                connection.query(
                    'UPDATE products SET ? WHERE ?',
                    [
                        {
                            stock_quantity: parseInt(newStock)
                        },
                        {
                            product_name: answer.inventory
                        }
                    ],
                    function(err) {
                        if (err) throw err;
                        console.log('Inventory updated');
                    }
                );
                managerView();
            });
        }
    );
};

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
        connection.query(
            'INSERT INTO products SET ?',
            {
                product_name: answer.product_name,
                dept_name: answer.dept_name,
                price: answer.price,
                stock_quantity: answer.stock_quantity
            }, 
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' New product added\n');
            }
        );
        managerView();
    });
};

function quit() {
    connection.end();
}