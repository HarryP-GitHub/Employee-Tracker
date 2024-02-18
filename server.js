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
    console.log('Adding a Department');
    // inquirer prompts the user to put in input to create a new department
    inquirer
    .prompt([
    {
      name: 'departmentId',
      type: 'input',
      message: 'Enter valid ID for the new department:',
      // validates the department id if it is already in use
      validate: async (input) => {
        const query = 'SELECT * FROM department WHERE id = ?';
        const [departments] = await db.promise().query(query, [input]);
          if (departments.length) {
            return 'This ID is invalid. Please use a different ID';
          }
          return true;
      }
    },
    {
      name: 'departmentName',
      type: 'input',
      message: 'What is the name of the new department?'
    }
    ])
    .then(result => {
    //Had to use db.promise() because it wasn't catching error
      return db.promise().query('INSERT INTO department (id, name) VALUES (?, ?)', [result.departmentId, result.departmentName]);
    })
    .then(() => {
      console.log(`${result.departmentName} department added successfully.`)
      promptDatabase();
    })
    // Add to add catch because it wasn't catching error properly
    .catch(error => { 
        console.error('There was an error:', error);
        console.log('There was an error adding department, try again');
        promptDatabase();
    });  
  }

//   id, title, salary, department_id
  async function addRole() { 
    console.log('Adding a Role');
// Using try catch to get id's from department, so that it can be added to the list so department id can be selected by name
    try {
      const [departments] = await db.promise().query('SELECT id, name FROM department');
      if (departments.length === 0) {
        console.log('Error finding departments');
        return;
      }
    // Using .map to gather department name and id to be used
      const departmentChoice = departments.map(department => ({
        name: department.name,
        value: department.id,
      }));
    // inquirer to use input to create new role and using different validating to ensure ID isn't already used
    const roleInput = await inquirer.prompt([
    {
      name: 'roleId',
      type: 'input',
      message: 'Enter the ID for this role:',
      // Validates the role id if it is already in use
      validate: async (input) => {
        const query = 'SELECT * FROM role WHERE id = ?';
        const [roles] = await db.promise().query(query, [input]);
          if (roles.length) {
            return 'This ID is invalid. Please use a different ID';
          }
          return true;
      }
    },
    {
      name: 'roleTitle',
      type: 'input',
      message: 'Enter the title of this role:'
    },
    {
      name: 'roleSalary',
      type: 'input',
      message: 'What is the salary for this role:',
      //Not necessary to validate, however it feels nicer, it would be good to do this with every input, however it is so time consuming
      validate: function(input) {
        const validSalary = parseFloat(input);
        if (isNaN(validSalary)) {
            return 'Please enter salary as a number';
        }
        return true;
      }
    },
    {
      name: 'departmentId',
      type: 'list',
      message: 'Which department is this role in?',
      choices: departmentChoice,
    }
    ]);
      
      await db.promise().query('INSERT INTO role (id, title, salary, department_id) VALUES (?, ?, ?, ?)', [roleInput.roleId, roleInput.roleTitle, roleInput.roleSalary, roleInput.departmentId]);
      console.log(`${roleInput.roleTitle} has been added as a new role`);
      promptDatabase();
    } catch (error) {
      console.error('There was an error:', error);
      console.log('Failed to add new role, try again');
      promptDatabase();
    }
  }

  // employee (id, first_name, last_name, role_id, manager_id)
  async function addEmployee() {
    console.log('Adding an Employee');

    //Using same try catch to get the role title and id to allow employee to select id by role title and manager by name and give manager id
    try {
    // fetching the roles so that user can select from list of roles
      const [roles] = await db.promise().query('SELECT id, title FROM role');
      if (roles.length === 0) {
        console.log('Error finding roles');
        return;
      }
      const roleChoice = roles.map(role => ({ 
        name: role.title,
        value: role.id, 
    }));

    // fetching managers so that user can use a list of managers to select from
    //Searching to combine firstname and lastname, using CONCAT function and WHERE manager_id is null because managers wouldn't have manager id
    const [managers] = await db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name from employee WHERE manager_id IS NULL');

    // including no manager choice incase the new employee is a manager
    // Using concat so it includes No Manager as a choice with the other managers
    const managerChoice = [{ name: 'No Manager', value: null }].concat(managers.map(employee => ({ 
      name: employee.name,
      value: employee.id,
    })));

    // Inquirer to get intput to create new employee in database
    const employeeInput = await inquirer.prompt([
      {
        name: 'employeeId',
        type: 'input',
        message: 'Enter the ID for the employee:',
        // Validates the same if the employee id is already in use
        validate: async (input) => {
          const query = 'SELECT * FROM employee WHERE id = ?';
          const [employees] = await db.promise().query(query, [input]);
            if (employees.length) {
              return 'This ID is invalid. Please use a different ID';
            }
            return true;
        }
      },
      {
        name: 'employeeFirstName',
        type: 'input',
        message: 'Please enter first name of the employee:'
      },
      {
        name: 'employeeLastName',
        type: 'input',
        message: 'Please enter the last name of the employee:'
      },
      {
        name: 'roleId',
        type: 'list',
        message: 'Please select the role of this employee:',
        choices: roleChoice
      },
      {
        name: 'managerId',
        type: 'list',
        message: "Please select the name of this employee's manager:",
        choices: managerChoice
      }
    ]);

    await db.promise().query('INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?)', [employeeInput.employeeId, employeeInput.employeeFirstName, employeeInput.employeeLastName, employeeInput.roleId, employeeInput.managerId]);
    
    console.log(`${employeeInput.employeeFirstName} ${employeeInput.employeeLastName} has been added as an employee.`);
    promptDatabase();
    } catch (error) {
      console.error('There was an error:', error);
      console.log('Failed to add new employee, try again');
    promptDatabase();
    }
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
