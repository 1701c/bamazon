var inquirer = require("inquirer");
var connection = require("./config/connection.js");

var drawTable = function(){
  connection.query("SELECT product, department, price, stock FROM products", function(error,productTable){
    console.table(productTable);
    managerPrompt();
  })
}

var managerPrompt = function(){
  inquirer.prompt([{
    type:"input",
    name:"choice",
    message:"(P)roducts\n  (L)ow Inventory\n  (A)dd Inventory\n  (N)ew Product\n  QUIT to exit",
    validate: function(value){
    if(value.toLowerCase()=='p'||value.toLowerCase()=='l'||value.toLowerCase()=='a'||
      value.toLowerCase()=='n'||value=='QUIT'){
        return true;
      }
    }
  }]).then(function(menuSelection){
    switch(menuSelection.choice){
      case 'p': 
        drawTable();
        break;
      case 'l':
        drawLowInventory();
        break;
      case 'a':
        addToInventory();
        break;
      case 'n':
        addNewProduct();
        break;
      case 'QUIT':
        console.log(' > QUITTER');
        process.exit();
    }
  })
}

var drawTable = function(){
  connection.query("SELECT product, department, price, stock FROM products", function(error,productTable){
    console.table(productTable);
    managerPrompt();
  })
}

var drawLowInventory = function(){
  connection.query("SELECT product, department, price, stock FROM products WHERE stock<=10", function(error,productTable){
    console.table(productTable);
    managerPrompt();
  })
}

var addToInventory = function(){
  connection.query("SELECT product, department, price, stock FROM products", function(error,productTable){
    console.table(productTable);
    inquirer.prompt([{
      type:"input",
      name:"choice",
      message:"Enter item name or QUIT to exit",
      validate: function(value){
        for(i=0;i<productTable.length;i++){
          if(productTable[i].product.toLowerCase()==value.toLowerCase() || (value == 'QUIT')){
            return true;
          }
        }
      }
    }]).then(function(searchTerm){
      if(searchTerm.choice == 'QUIT') {
        console.log(' > QUITTER');
        process.exit();
      }
      var id = '';
      for(i=0;i<productTable.length;i++){
        if(productTable[i].product.toLowerCase()==searchTerm.choice.toLowerCase()){
          id = i;
        }
      }   
      inquirer.prompt([{
        type:"input",
        name:"quantityToAdd",
        message:"How many do you wish to add?",
        validate: function(value){
          if( isNaN(value) == false && (value >= 0) ) {
            return true;
          } else {
            if(isNaN(value)){
              console.log('\n > Not a valid number');
            } else {
              console.log('\n > Invalid amount');
            }
            return false;
          }
        }
      }]).then(function(answer){
        connection.query("UPDATE products SET stock='" + (productTable[id].stock + parseInt(answer.quantityToAdd)) +"' WHERE product='" + productTable[id].product + "'", function(error,response) {
          console.log("\n You have added " + answer.quantityToAdd + " " + productTable[id].product + " for a total of " + (answer.quantityToAdd * productTable[id].stock));
          drawTable();
        })
      })    
    })
  })
}

var addNewProduct = function(){
  // var product = '';
  // var department = '';
  // var price;
  connection.query("SELECT * FROM products", function(error,productTable){
    // console.log('POP');

    inquirer.prompt([
      {
        type:"input",
        name:"name",
        message:"Enter new item name",
        validate: function(value){
          for(i=0;i<productTable.length;i++){
            if(productTable[i].product.toLowerCase()==value.toLowerCase()){
              console.log('\n > Product already exists');
              return false;
            }
          }
          return true;
        }
      },
      {
        type:"input",
        name:"department",
        message:"Enter department",
        validate: function(value){
          if (isNaN(value)) return true;
          return false;
        }
      },
      {
        type:"input",
        name:"price",
        message:"Enter price per unit",
        validate: function(value){
          if (isNaN(value)) return false;
          return true;
        }
      },
      {
        type:"input",
        name:"stock",
        message:"Enter quantity",
        validate: function(value){
          if (isNaN(value)) return false;
          return true;
        }
      }
    ])
    .then(newProduct => {
      console.table(newProduct);
      inquirer.prompt([{
        type:"input",
        name:"confirm",
        message:"Ready to Add.  Press Y to confirm, any other key to cancel",
      }]).then(function(updatePrompt){
        if (updatePrompt.confirm.toLowerCase() == 'y') {
          connection.query("INSERT INTO products(product,department,price,stock,sales) VALUES ('" + newProduct.name + "','" + newProduct.department + "'," + newProduct.price + "," + newProduct.stock + "," + 0 + ")", function(error,response) {
            console.log(" > New product added successfully");
            managerPrompt();
          })
        } else {
          console.log(' > Nothing added to database');
        }
      })    
    })
  })    
}

drawTable();