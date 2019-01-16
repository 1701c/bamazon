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
  connection.query("SELECT * FROM products", function(error,result){
  console.table(result);
  promptCustomer(result);
  })
}

var promptCustomer = function(result){
  inquirer.prompt([{
    type:"input",
    name:"choice",
    message:"Enter item name or QUIT to exit",
    validate: function(value){
      for(i=0;i<result.length;i++){
        if(result[i].product.toLowerCase()==value.toLowerCase() || (value == 'QUIT')){
          return true;
        } 
      }        
    }
  }]).then(function(result2){
    if(result2.choice == 'QUIT') {
      console.log(' > QUITTER');
      process.exit();
    }
    var id = '';
    for(i=0;i<result.length;i++){
      if(result[i].product.toLowerCase()==result2.choice.toLowerCase()){
        id = i;
      }
    }   
    inquirer.prompt([{
      type:"input",
      name:"quantity",
      message:"How many do you wish to purchase?",
      validate: function(value){
        if(isNaN(value) == false && (result[id].stock - value) >= 0) {
          return true;
        } else {
          if(isNaN(value)){
            console.log('\n > Not a valid number');
          } else {
            console.log('\n > Insufficient stock remaining, quantity cannot be great than ' + result[id].stock);
          }
          return false;
        }
      }
    }]).then(function(answer){
      connection.query("UPDATE products SET stock='" + (result[id].stock - answer.quantity) +"' WHERE product='" + result[id].product + "'", function(error,response) {
        console.log("\n You have purchased " + answer.quantity + " " + result[id].product + " for a total of $" + (answer.quantity * result[id].price).toFixed(2));
        drawTable();
      })
    })    
  })
}