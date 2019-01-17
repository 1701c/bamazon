var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host:"localhost",
  port:3306,
  user:"root",
  password:"root",
  database:"bamazon_DB"
})

connection.connect(function(error){
  if (error) throw error;
  console.log("Connection Successful");
  drawTable();
})

var drawTable = function(){
  connection.query("SELECT * FROM products", function(error,productTable){
  console.table(productTable);
  promptCustomer(productTable);
  })
}

var promptCustomer = function(productTable){
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
      name:"quantity",
      message:"How many do you wish to purchase?",
      validate: function(value){
        if(isNaN(value) == false && (productTable[id].stock - value) >= 0) {
          return true;
        } else {
          if(isNaN(value)){
            console.log('\n > Not a valid number');
          } else {
            console.log('\n > Insufficient stock remaining, quantity cannot be great than ' + productTable[id].stock);
          }
          return false;
        }
      }
    }]).then(function(answer){
      connection.query("UPDATE products SET stock='" + (productTable[id].stock - answer.quantity) +"' WHERE product='" + productTable[id].product + "'", function(error,response) {
        console.log("\n You have purchased " + answer.quantity + " " + productTable[id].product + " for a total of $" + (answer.quantity * productTable[id].price).toFixed(2));
        drawTable();
      })
    })    
  })
}