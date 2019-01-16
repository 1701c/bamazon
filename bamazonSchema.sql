DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products(product,department,price,stock)
VALUES ("Shampoo","Hair Care",10,10),
  ("Conditioner","Hair Care",12,5),
  ("Dirt","Garden",8,12),
  ("Shovel","Garden",25,3),
  ("Post-it Notes","Office",5,5),
  ("Paper Clips","Office",1,100),
  ("Twizlers","Grocery",1,50),
  ("Coke","Grocery",2,200),
  ("Hammer","Hardware",15,15),
  ("Screwdriver","Hardware",8,10);

