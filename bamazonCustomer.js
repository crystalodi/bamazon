var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "bamazon",
  password: ""
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
      validate: function(input) {
        if(isNaN(input) || input <=0) {
          return false;
        }
        return true;
      }
    },
    {
      type: "input",
      message: "How many units do you want to buy?",
      name: "quantityToBuy",
      validate: function(input) {
        if(isNaN(input) || input <=0 ) {
          return false;
        }
        return true;
      }
    }
  ]).then(function(answers){
    fufillOrder(parseInt(answers.item_id), parseInt(answers.quantityToBuy));
  })
}

function fufillOrder(item_id, quantityToBuy) {
  var whereObj = {item_id: item_id};
  var query = connection.query("select stock_quantity, price from products where ?", {
    item_id: item_id
  }, function(err, res){
    if (err) throw err;
    if(res.length === 0) {
      console.log("No product with that id was found. Please try again");
      shopPrompt();
    }
    else {
      var currentStockQuantity = res[0].stock_quantity;
      var newStockQuantity =  currentStockQuantity - quantityToBuy;
      var totalPrice = res[0].price * quantityToBuy;
      if(quantityToBuy > res[0].stock_quantity) {
        console.log("Insufficient stock quantity.")
        connection.end();
      } else {
        var fieldsObj = {stock_quantity: newStockQuantity};
        var arrUpdate = [];
        arrUpdate.push(fieldsObj);
        arrUpdate.push(whereObj);
        var updateQuery = connection.query("update products set ? where ?", arrUpdate, function(err, res){
          if(err) throw err;
          console.log("Purchase successful. Your total bill is " + totalPrice);
          connection.end();
        });
      }
    }
  });
}
