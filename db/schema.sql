DROP DATABASE IF EXISTS company_db;
-- Drops the database
CREATE DATABASE company_db;
-- creates the database
USE company_db;
create table department(
    id integer not null auto_increment,
    name varchar(30),
    primary key(id)
);
create unique index department_name_idx on department(name);
create table role (
    id integer not null auto_increment,
    title varchar(30),
    salary decimal(10, 2),
    isManager bool default false,
    department_id integer not null,
    primary key(id),
    index (department_id),
    foreign key(department_id) references department(id)
);

create unique index role_title_idx on role(title);
create table employee(
    id integer not null auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id integer not null,
    manager_id integer null,
    primary key(id),
    index (role_id),
    index (manager_id),
    foreign key (role_id) references role(id),
    foreign key (manager_id) references employee(id)
);

use company_db;
