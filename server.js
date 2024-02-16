require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function promptDatabase() {
  inquirer
    .prompt({
        type: 'list',
        message: 'Welcome to the Company Database, select an option!',
        name: 'options',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Update employee managers',
            'View employees by manager',
            'View employees by department',
            'Delete departments',
            'Delete roles',
            'Delete Employees',
            'View department budgets',
            'Exit'
        ]
    })
    .then((data) => {
      switch (data.options) {
        case 'View all departments': {
            viewDepartments();
            break;
        }
        case 'View all roles': {
            viewRoles();
            break;
        }
        case 'View all employees': {
            viewEmployees();
            break;
        }
        case 'Add a department': {
            addDepartment();
            break;
        }
        case 'Add a role': {
            addRole();
            break;
        }
        case 'Add an employee': {
            addEmployee();
            break;
        }
        case 'Update an employee role': {
            updateEmployeeRole();
            break;
        }
        case 'Update employee managers': {
            updateEmployeeManager();
            break;
        }
        case 'View employees by manager': {
            viewEmployeeByManager();
            break;
        }
        case 'View employees by department': {
            viewEmployeeByDepartment();
            break;
        }
        case 'Delete departments': {
            deleteDepartments();
            break;
        }
        case 'Delete roles': {
            deleteRoles();
            break;
        }
        case 'Delete Employees': {
            deleteEmployees();
            break;
        }
        case 'View department budgets': {
            viewDepartmentBudgets();
            break;
        }
        case 'Exit': {
            console.log('Exiting!');
            db.end();
        }
      }
    });
}

  function viewDepartments() {
    console.log('viewDepartments');
  }

  function viewRoles() {
    console.log('ViewRoles');
  }

  function viewEmployees() {
    console.log('viewEmployees');
  }

  function addDepartment() {
    console.log('addDepartment');
  }
    
  function addRole() {
    console.log('addRole');
  }

  function addEmployee() {
    console.log('addEmployee');
  }

  function updateEmployeeRole() {
    console.log('updateEmployeeRole');
  }

  function updateEmployeeManager() {
    console.log('updateEmployeeManager');
  }

  function viewEmployeeByManager() {
    console.log('viewEmployeeByManager');
  }

  function viewEmployeeByDepartment() {
    console.log('viewEmployeeByDepartment');
  }

  function deleteDepartments() {
    console.log('deleteDepartments');
  }

  function deleteRoles() {
    console.log('deleteRoles');
  }

  function deleteEmployees() {
    console.log('deleteEmployees');
  }

  function viewDepartmentBudgets() {
    console.log('viewDepartmentBudgets');
  }

  db.connect(err => {
    if (err) {
        console.error('Failed connecting to database:', err);
        return;
    }
    console.log('Successfully connected to Company Database');
    promptDatabase();
});
