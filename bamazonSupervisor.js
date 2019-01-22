var inquirer = require("inquirer");
var connection = require("./config/connection.js");

var drawTable = function(){
  connection.query("SELECT product, department, price, stock FROM products", function(error,productTable){
    console.table(productTable);
    supervisorPrompt();
  })
}

var supervisorPrompt = function(){
  inquirer.prompt([{
    type:"input",
    name:"choice",
    message:"(S)ales by Department\n  (A)dd new Department\n  QUIT to exit",
    validate: function(value){
    if(value.toLowerCase()=='s'||value.toLowerCase()=='a'||value=='QUIT'){
        return true;
      }
    }
  }]).then(function(menuSelection){
    switch(menuSelection.choice){
      case 's': 
        salesByDept();
        break;
      case 'a':
        addNewDepartment();
        break;
      case 'QUIT':
        console.log(' > QUITTER');
        process.exit();
    }
  })
}

var salesByDept = function(){
  connection.query("SELECT *, sales - overhead_costs AS profit FROM (SELECT departments.department_id, products.department, SUM(products.sales) as sales, departments.overhead_costs FROM products inner join departments on products.department = departments.department_name GROUP BY department_id) AS T", function(error,productTable){
    console.table(productTable);
    supervisorPrompt();
  })
}

var addNewDepartment = function(){
  connection.query("SELECT * FROM departments", function(error,departmentTable){
    console.table(departmentTable);

    inquirer.prompt([
      {
      type:"input",
      name:"name",
      message:"Enter new department name",
      validate: function(value){
        for(i=0;i<departmentTable.length;i++){
          console.log(departmentTable[i].department_name.toLowerCase());
          if(departmentTable[i].department_name.toLowerCase()==value.toLowerCase()){
            console.log('\n > Department already exists');
            return false;
          }
        }
        return true;
      }
    }]).then(newDepartment => {
      console.table(newDepartment);
      inquirer.prompt([{
        type:"input",
        name:"confirm",
        message:"Ready to Add.  Press Y to confirm, any other key to cancel",
      }]).then(function(updatePrompt){
        if (updatePrompt.confirm.toLowerCase() == 'y') {
          connection.query("INSERT INTO departments(department_name, overhead_costs) VALUES ('" + newDepartment.name + "', 0)", function(error,response) {
            console.log(" > New Deparment added successfully");
            supervisorPrompt();
          })
        } else {
          console.log(' > Nothing added to database');
        }
      })    
    })
  })    
}

drawTable();