drop database if exists bamazon;
create database bamazon;
use bamazon;

CREATE TABLE products (
  item_id int auto_increment not null,
  product_name varchar(100) not null,
  department_name varchar(100) not null,
  price DECIMAL(10, 2) not null, 
  stock_quantity int not null,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Loveseat', 'Home and Kitchen', 562.00, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('15 inch Laptop Sleeve', 'Computers and Accessories', 13.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Gossip Girl: The Complete Series Boxset', 'DVD', 80.99, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Abba Gold: Greatest Hits', 'Music', 12.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Death Note: The Complete Series Boxset', 'Books', 28.00, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Blackout Energy Efficient Curtains', 'Home and Kitchen', 17.34, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('ELLE US Magazine Subscription', 'Books', 120.99, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Vogue US Magazine Subscription', 'Books', 120.99, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Ipad Pro 10.5', 'Computers and Accessories', 600.99, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Harper''s Bazaar US Magazine Subscription', 'Books', 120.99, 1);
