DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  sales DECIMAL(16,2) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products(product,department,price,stock,sales)
VALUES ("Shampoo","Hair Care",10.49,10,0),
  ("Conditioner","Hair Care",12.95,5,0),
  ("Dirt","Garden",8,12,0),
  ("Shovel","Garden",24.99,3,0),
  ("Post-it Notes","Office",5,5,0),
  ("Paper Clips","Office",1,100,0),
  ("Twizzlers","Grocery",1,50,0),
  ("Coke","Grocery",2,200,0),
  ("Hammer","Hardware",9.99,15,0),
  ("Screwdriver","Hardware",5.99,10,0);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  overhead_costs DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments(department_name,overhead_costs)
VALUES ("Hair Care",10000),
  ("Garden",5000),
  ("Office",1200),
  ("Grocery",900),
  ("Hardware",500);