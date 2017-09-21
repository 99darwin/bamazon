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
                var stock;
                for (var i = 0; i < res.length; i++) {
                    stock = res[i].stock_quantity;
                }
                if (answer.numItems <= stock) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: stock -= answer.numItems
                            },
                            {
                                product_name: answer.itemPrompt
                            }
                        ],
                        function(err) {
                            if (err) throw err;
                            console.log('Thank you for your purchase!');
                            setTimeout(shop, 3000);
                        }
                    );
                } else {
                    console.log('Sorry this item is out of stock! Keep shopping?');
                }
            });
        }
    );
};
shop();
