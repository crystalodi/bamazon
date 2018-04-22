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
  showManagerPrompt();
})

function showManagerPrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "What do you want to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
      name: "managerAction"
    }
  ]).then(function(answers){
    switch(answers.managerAction.toLowerCase()) {
      case "view products for sale":
        viewProductsForSale();
      break;
      case "view low inventory":
       viewProductsForSale("low");
      break;
      case "add to inventory":
        addToInventory();
      break;
      case "add new product":
        addNewProduct();
      break;
    }
  })
}

function viewProductsForSale(view) {
  if(view === "low") {
    var queryToRun = "select item_id, product_name, department_name, price, stock_quantity from products where stock_quantity < 5";
    var consoleMessage = "Low inventory\n";
  } else {
    var queryToRun = "select item_id, product_name, department_name, price, stock_quantity from products where stock_quantity";
    var consoleMessage = "Products for Sale\n";
  }
  var query = connection.query(queryToRun, function(err, res){
    if(err) throw err;
    console.log(consoleMessage)
    if(res.length === 0) {
      console.log("No products found.");
    } else {
      for(var i = 0; i < res.length; i++) {
        console.log("Product ID: " + res[i].item_id);
        console.log("Product Name: " + res[i].product_name);
        console.log("Department Name: " + res[i].department_name);
        console.log("Price (in USD): " + res[i].price);
        console.log("Number in Stock: " + res[i].stock_quantity);
        console.log("-------------------------------");
      }
    }
    exitContinuePrompt();
  });
}

function addToInventory() {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter the id of the product you want to add inventory for",
      name: "item_id",
      validate: function(input) {
        if(isNaN(input) ||  parseInt(input) <=0){
          return false;
        }
        return true;
      },
      filter: function(input) {
        return parseInt(input);
      }
    },
    {
      type: "input",
      message: "How much do you want to add to the quantity currently in stock?",
      name: "quantityToAdd",
      validate: function(input) {
        if(isNaN(input) || parseInt(input) <=0){
          return false;
        }
        return true;
      },
      filter: function(input) {
        return parseInt(input);
      }
    }
  ]).then(function(answers){
    var quantityToAdd = answers.quantityToAdd;
    var itemToUpdate = answers.item_id;
    var query = connection.query("select stock_quantity, product_name from products where ?", {
      item_id: itemToUpdate
    }, function(err, res){
      if(err) throw err;
      if(res.length === 0) {
        console.log("No product with that item_id was found. Please Try Again");
        showManagerPrompt();
      } else {
        var newStockQuantity = quantityToAdd + res[0].stock_quantity;
        var arrUpdate = [{stock_quantity: newStockQuantity}, {item_id: itemToUpdate}];
        var productName = res[0].product_name;
        var updateQuery = connection.query("update products set ? where ?", arrUpdate, function(err, res){
          if(err) throw err;
          console.log("You have successfully added inventory for the product " + productName);
          exitContinuePrompt();
        });
      }
    });
  });
}

function addNewProduct() {
  inquirer.prompt([
    {
      type: "input",
      name: "product_name",
      message: "What product do you want to add?",
      validate: function(input) {
        if(input.trim() === "" || input.length > 100) {
          return false;
        }
        return true;
      }
    },
    {
      type: "input",
      name: "department_name",
      message: "What is the product's deparment",
      validate: function(input) {
        if(input.trim() === "" || input.length > 100) {
          return false;
        }
        return true;
      }
    },
    {
      type: "input",
      name: "price",
      message: "Enter a price",
      filter: function(input) {
        var numberInput = parseFloat(input);
        return Math.round(numberInput * 100)/100;
      },
      validate: function(input) {
        if(isNaN(input) || input <=0) {
          return false;
        }
        return true;
      }
    },
    {
      type: "input",
      name: "stock_quantity",
      message: "Enter a stock quantity",
      filter: function(input) {
        return parseInt(input);
      },
      validate: function(input) {
        if(isNaN(input) || input <=0) {
          return false;
        }
        return true;
      }
    }
  ]).then(function(answers){
    var query = connection.query("insert into products set ?", answers, function(err, res){
      if(err) throw err;
      console.log("Product Added");
      exitContinuePrompt();
    });
  });
}

function exitContinuePrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "Do you want to exit or go back to the main menu?",
      choices: ["Exit", "Main Menu"],
      name: "action"
    }
  ]).then(function(answers){
    if(answers.action === "Exit") {
      connection.end();
    } else {
      showManagerPrompt();
    }
  })
}