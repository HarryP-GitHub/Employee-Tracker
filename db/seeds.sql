USE employee_tracker_db;

INSERT INTO department (id, name)
VALUES
    (0001, 'Marketing'),
    (0002, 'Finance'),
    (0003, 'Operations'),
    (0004, 'Engineering'),
    (0005, 'Security');

INSERT INTO role (id, title, salary, department_id)
VALUES
    (1001, 'Marketing Manager', 90000, 0001),
    (1002, 'Finance Manager', 90000, 0002),
    (1003, 'Operations Manager', 90000, 0003),
    (1004, 'Engineering Manager', 90000, 0004),
    (1005, 'Security Manager', 90000, 0005),
    (2001, 'Digital Marketer', 80000, 0001),
    (2002, 'Accountant', 80000, 0002),
    (2003, 'Operation Assistant', 80000, 0003),
    (2004, 'Software Engineer', 80000, 0004),
    (2005, 'Cyber Analyst', 80000, 0005);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1011, 'Bob', 'Big', 1001, NULL),
    (1012, 'Bill', 'Bo', 1002, NULL),
    (1013, 'Dave', 'Do', 1003, NULL),
    (1014, 'Mana', 'Ger', 1004, NULL),
    (1015, 'Phil', 'Lihp', 1005, NULL),
    (2011, 'Susan', 'Na', 2001, 1011),
    (2012, 'Soosan', 'Nah', 2002, 1012),
    (2013, 'De', 'Anne', 2003, 1013),
    (2014, 'Di', 'Nuh', 2004, 1014),
    (2015, 'Hi', 'Hello', 2005, 1015),
    (2021, 'Sunny', 'Day', 2001, 1011),
    (2031, 'Eh', 'He', 2001, 1011),
    (2022, 'Oh', 'No', 2002, 1012),
    (2023, 'Yes', 'Maybe', 2003, 1013),
    (2024, 'Test', 'Yest', 2004, 1014),
    (2034, 'Did', 'This', 2004, 1014),
    (2025, 'Work', 'I', 2005, 1015),
    (2035, 'Hope', 'Wooo', 2005, 1015);