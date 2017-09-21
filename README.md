# bamazon
A console-based e-commerce shop using MySQL and Node.js that takes orders and tracks inventory and can report on top items / departments.  
## Getting Started
These instructions will assist you in installing and using bamazon.

First things first:
```
git clone https://github.com/99darwin/bamazon.git
cd bamazon
```

### Dependencies
```
npm install inquirer
npm install mysql
npm install console.table
```

## Running bamazon
To shop on bamazon, simply run the following code while in your local bamazon directory:
```
node bamazon.js
```

## How it works
- The program will display a table of available items available for purchase and then prompt you for your choice.
- Once you choose an item, the program will ask you how many items you'd like to purchase.
- Assuming you have requested an amount that does not exceed the overall stock, you will have successfully purchased the item, and the store's stock will reflect your purchase.
