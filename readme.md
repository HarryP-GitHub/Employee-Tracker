# SQL Employee Tracker

## Description
This project was to create an SQL Employee Tracker which would allow the business owner to be able to view and manage the departments, roles and employees in their company, ultimately so they can plan and organise their business. The key features on this project are that the user can view departments, roles and employees, add departments, roles and employees and update the employees roles and managers. 

## Installation
To install the dependencies, type in npm install

This project uses mysql2, inquirer, dotenv and console.table.

To install all of these and ensure you have the correct versions, install:

npm install inquirer@8.2.4

npm install mysql2@2.2.5

npm install dotenv@16.4.4

npm install console.table@0.10.0

Also, ensure that you have the sourced the database. This can in the Command Prompt, via signing in through MySQL.

Please note: You need to be in the right location, this can be done by right clicking the db folder, 'Copy Path' and type in cd and paste in the path in the command prompt, then sign in using the following command

mysql -u root -p 

Then enter your password.

Followed by:

source schema.sql;

source seeds.sql;

## Usage
To use this project, simply begin by typing in the intergrated terminal: 

npm start

When the database is connected to, you will be prompted to choose from various options:
View all Departments, View all Roles, View all Employees, Add a Department, Add a Role, Add an Employee, Update an Employee's Role, Update Employee's Manager and Exit.

When an option is selected, follow the steps required to complete the function. The options will then reappear for the user to choose to use another option otherwise you can select exit to exit the employee tracker.

## Credits
- An abundance of Internet Resources 
- Teachers/Class Material + Tom's help with requirements.
- CONCAT in MySQL on Geeksforgeeks by Romy421k...: https://www.geeksforgeeks.org/how-to-concat-two-columns-into-one-with-the-existing-column-name-in-mysql/
- Classmate recommending console.table for console.table formatting: Suyash Maharjan

## License
N/A

## GitHub Repository

[GitHub Repository](https://github.com/HarryP-GitHub/Employee-Tracker)

## Video Demo

[Video Demo](https://drive.google.com/file/d/1pwETSMdQxQaBxtVoQWFk52ZB9u7l9Pl3/view?usp=sharing)
