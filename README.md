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
node bamazonCustomer.js
```

To view the backend (Manager View), run the following code in your local bamazon directory:
```
node bamazonManger.js
```

## How it works

### Customer view
- The program will display a table of available items available for purchase and then prompt you for your choice.
- Once you choose an item, the program will ask you how many items you'd like to purchase.
- Assuming you have requested an amount that does not exceed the overall stock, you will have successfully purchased the item, and the store's stock will reflect your purchase.

### Manager view
- The program will give the user a few managerial options including:
    - **View inventory:** Displays the entire inventory of products
    - **View low inventory:** Displays any products in the inventory that have less than 5 items in stock
    - **Add to inventory:** Allows user to update inventory with more stock
    - **Add new product:** Allows user to add a a new item to the database
    - **Quit:** Ends the connection

