var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "bamazon",
  password: "WowNoU89!"
});

connection.connect(function(err){
  if(err) throw err;
  retrieveAllProducts()
});

function retrieveAllProducts() {
  var query = connection.query("select item_id, product_name, department_name, price, stock_quantity from products", function(err, res){
    if(err) throw err;
    console.log("Products for sale\n")
    for(var i = 0; i < res.length; i++) {
      console.log("Product ID: " + res[i].item_id);
      console.log("Product Name: " + res[i].product_name);
      console.log("Department Name: " + res[i].department_name);
      console.log("Price (in USD): " + res[i].price);
      console.log("Number in Stock: " + res[i].stock_quantity);
      console.log("-------------------------------");
    }
    shopPrompt();
  });
}

function shopPrompt() {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter an id for a product you want to buy",
      name: "item_id",
      filter: function(input) {
        return parseInt(input);
      },
      validate: function(input) {
        console.log(input);
        if(isNaN(input)) {
          return false;
        }
        return true;
      }
    },
    {
      type: "input",
      message: "How many units do you want to buy?",
      name: "quantityToBuy",
      filter: function(input) {
        return parseInt(input);
      },
      validate: function(input) {
        console.log(input)
        if(isNaN(input)) {
          return false;
        }
        return true;
      }
    }
  ]).then(function(answers){
    fufillOrder(answers.item_id, answers.quantityToBuy);
  })
}

function fufillOrder(item_id, quantityToBuy) {
  console.log(arguments);
  connection.end();
}