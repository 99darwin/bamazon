var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'N0dogsallowed!23',
    database: 'bamazon_db'
});

var stock;
var newStock;
function shop() {
    connection.query(
        'SELECT * FROM products', function(err, res) {
            if (err) throw err;
            console.log('\n');
            console.table(res);
            console.log('----------------------------------------------------------------');
            var choiceArr = [];
            for (var j = 0; j < res.length; j++) {
                choiceArr.push(res[j].product_name);
            }
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
                stock = res[choiceArr.indexOf(answer.itemPrompt)].stock_quantity;
                newStock = stock - answer.numItems;
                if (answer.numItems <= stock) {
                    connection.query(
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
                            keepShopping();
                        }
                    );
                } else if (answer.numItems > stock) {
                    console.log('Insufficient stock!');
                    keepShopping();
                }
            });
        }
    );
};
shop();

function keepShopping() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Keep shopping?',
            name: 'keepShopping',
            choices: ['yes', 'no']
        }
    ]).then(function(answer) {
        if (answer.keepShopping === 'yes') {
            shop();
        } else {
            console.log('Thank you, come again!');
            connection.end();
        }
    });
}
