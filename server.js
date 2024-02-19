require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Main function to choose options, note the commented out options are some of the bonus features
function promptDatabase() {
  inquirer
    .prompt({
        type: 'list',
        message: 'Welcome to the Company Database, select an option!',
        name: 'options',
        choices: [
            'View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            "Update an Employee's Role",
            "Update Employee's Manager",
            // 'View employees by manager',
            // 'View employees by department',
            // 'Delete departments',
            // 'Delete roles',
            // 'Delete Employees',
            // 'View department budgets',
            'Exit'
        ]
    })
    .then((data) => {
      switch (data.options) {
        case 'View all Departments': {
            viewDepartments();
            break;
        }
        case 'View all Roles': {
            viewRoles();
            break;
        }
        case 'View all Employees': {
            viewEmployees();
            break;
        }
        case 'Add a Department': {
            addDepartment();
            break;
        }
        case 'Add a Role': {
            addRole();
            break;
        }
        case 'Add an Employee': {
            addEmployee();
            break;
        }
        case "Update an Employee's Role": {
            updateEmployeeRole();
            break;
        }
        case "Update Employee's Manager": {
            updateEmployeeManager();
            break;
        }
        // case 'View employees by manager': {
        //     viewEmployeeByManager();
        //     break;
        // }
        // case 'View employees by department': {
        //     viewEmployeeByDepartment();
        //     break;
        // }
        // case 'Delete departments': {
        //     deleteDepartments();
        //     break;
        // }
        // case 'Delete roles': {
        //     deleteRoles();
        //     break;
        // }
        // case 'Delete Employees': {
        //     deleteEmployees();
        //     break;
        // }
        // case 'View department budgets': {
        //     viewDepartmentBudgets();
        //     break;
        // }
        case 'Exit': {
            console.log('Exiting!');
            db.end();
        }
      }
    });
}

  function viewDepartments() {
    console.log('Viewing all Departments in database');
    //query to select name and id from department
    db.query('SELECT name AS "Department Name", id AS "Department ID" FROM department', (error, departments) => {
        if (error) {
            console.log('Failed to find departments', error);
            return;
        }
        if (departments.length === 0) {
            console.log('No departments found');
        } else {
            // displays departments
            console.table(departments);
        }
        promptDatabase();
    });
  }

  function viewRoles() {
    console.log('Viewing all Roles in database');
    //selects role title, id, department id and salary from role, and the department name is gathered by using department id
    db.query(`SELECT role.title AS "Job Title", role.id AS "Role ID", department.name AS "Department", CONCAT("$", FORMAT(role.salary, 2)) AS "Salary" FROM role
    JOIN department ON role.department_id = department.id`, (error, roles) => {
        if (error) {
            console.log('Failed to find roles', error);
            return;
        }
        if (roles.length === 0) {
            console.log('No roles found');
        } else {
            console.table(roles);
        }
        promptDatabase();
    });
  }

  function viewEmployees() {
    console.log('Viewing all Employees in database');
    // Selects id, first name and last name, role id, manager id from employee as well as role salary, title and manager name
    db.query(`
    SELECT employee.id AS 'ID', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Name',
    role.title AS 'Job Title', department.name AS 'Department', CONCAT('$', FORMAT(role.salary, 2)) AS 'Salary',
    CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager' FROM employee
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id`, (error, employees) => {
        if (error) {
            console.log('Failed to find employees', error);
            return;
        }
        if (employees.length === 0) {
            console.log('No employees found');
        } else {
            console.table(employees);
        }
        promptDatabase();
    });
  }

// Not sure why but addDepartment function broke so had to look up how to fix, using async function like the rest allows input to be called up
// properly 
  async function addDepartment() {
    console.log('Adding a Department');
    try {
    // inquirer prompts the user to put in input to create a new department
    const departmentInput = await inquirer.prompt([
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
    ]);
    
    //Inserts new department into department table
      await db.promise().query('INSERT INTO department (id, name) VALUES (?, ?)', [departmentInput.departmentId, departmentInput.departmentName]);
      console.log(`${departmentInput.departmentName} department added successfully.`);
      promptDatabase();
   }
    // Catching error
    catch (error) { 
        console.error('There was an error:', error);
        console.log('There was an error adding department, try again');
        promptDatabase();
    }  
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
      console.log(`${roleInput.roleTitle} has been added as a new role.`);
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

    // This is inserting the new employee into the employee table with all the chosen values
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
    console.log('Updating Employee Role');

    // Fetching all employees
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, employees) => {
      if (err) {
        console.log('There was an error: ', err);
        return;
      }

    // This is creating the list of employees
    const employeeChoices = employees.map(employee => ({ name: employee.name, value: employee.id }));

    inquirer.prompt([
      {
        name: 'employeeNames',
        type: 'list',
        message: 'Choose which employee to update:',
        choices: employeeChoices,
      }
    ])
    .then(input => {
      const employeeChoice = input.employeeNames;
      
        // Fetching roles
      db.query('SELECT id, title FROM role', (err, roles) => {
        if (err) {
            console.log('There was an error: ', err);
            return;
        }
        // Creating the list for the employee's new role
        const newRole = roles.map(role => ({ name: role.title, value: role.id }));

        inquirer.prompt([
          {
            name: 'roleNames',
            type: 'list',
            message: "Select the employee's new role:",
            choices: newRole,
          }
        ])
        .then(input => {
            const roleChoice = input.roleNames;
            // This is updating the employee's role from the chosen role where the chosen employee is
            db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleChoice, employeeChoice], (err) => {
              if (err) {
                console.log('Failed to update employee role', err);
                promptDatabase();
              }
              console.log('Employee Role has successfully been updated!');
              promptDatabase();
            });
        });
      });
    });
   });
  }

  function updateEmployeeManager() {
    console.log('Updating Employees Manager');
    // Fetching all employees, essentially the same as updatingEmployeeRole
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, employees) => {
        if (err) {
          console.log('There was an error: ', err);
          return;
        }
      const employeeChoices = employees.map(employee => ({ name: employee.name, value: employee.id }));
  
      inquirer.prompt([
        {
          name: 'employeeNames',
          type: 'list',
          message: 'Choose which employee to update their manager:',
          choices: employeeChoices,
        }
      ])
      .then(input => {
        const employeeChoice = input.employeeNames;
        
          // Fetching managers, essentially it is finding the names of the employee's who's don't have a manager, which
          // Represents the managers.
        db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee WHERE manager_id IS NULL', (err, managers) => {
          if (err) {
              console.log('There was an error: ', err);
              return;
          }
          
          // Basically the same as managerChoice just changed formatting so didn't get it confused with employees
          // This is forming the list for the managers to be selected from
          const newManager = [{ name: 'No Manager', value: null }].concat(managers.map(manager => ({ name: manager.name, value: manager.id })));
  
          inquirer.prompt([
            {
              name: 'managerNames',
              type: 'list',
              message: "Update the employee's new manager:",
              choices: newManager,
            }
          ])
          .then(input => {
              const managerChoice = input.managerNames;
              // This is updating the employee's manager to the new manager, where the selected employee is
              db.query('UPDATE employee SET manager_id = ? WHERE id = ?', [managerChoice, employeeChoice], (err) => {
                if (err) {
                  console.log('Failed to update employee manager', err);
                  promptDatabase();
                }
                console.log('Employee Manager has successfully been updated!');
                promptDatabase();
              });
          });
        });
      });
     });
  }

//   function viewEmployeeByManager() {
//     console.log('viewEmployeeByManager');
//   }

//   function viewEmployeeByDepartment() {
//     console.log('viewEmployeeByDepartment');
//   }

//   function deleteDepartments() {
//     console.log('deleteDepartments');
//   }

//   function deleteRoles() {
//     console.log('deleteRoles');
//   }

//   function deleteEmployees() {
//     console.log('deleteEmployees');
//   }

//   function viewDepartmentBudgets() {
//     console.log('viewDepartmentBudgets');
//   }
// connecting to database, then running the promptDatabase function to bring up options for user to select
  db.connect(err => {
    if (err) {
        console.error('Failed connecting to database:', err);
        return;
    }
    console.log('Successfully connected to Company Database');
    promptDatabase();
});
