//left join employee -> role --> department
//const cTable = require('console.table');
//run search with inquirer prompts
//add dept,roles, employees
//view dept,roles,employees
//update employee roles

const mysql = require("mysql");
const inquirer = require("inquirer")

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "company_db"
});

cconnection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

const runSearch = () =>{
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Add Role",
        "Update Employee's Role",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View All Employees":
        employeeSearch();
        break;

      case "View All Roles":
        roleSearch();
        break;

      case "View All Departments":
        deptSearch();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Add Role":
        addRole();
        break;
     
      case "Update Employee's Role":
        updateEmployeeRole();
        break;
        case "Exit":
          connection.end()
          break;
      }
    });
}

const EmplopyeeSearch = () => {
  const query = `SELECT e.emp_id, e.first_name, e.last_name, e.manager_id,
    r.title, r.salary, d.department_name
    FROM ((employee e
    INNER JOIN roles r ON e.role_id = r.role_id)
    INNER JOIN department d ON d.department_id = r.department_id)`;
  const dbquery = connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    runSearch();
  });
};

const roleSearch = () => {
  const query = `SELECT * FROM roles`;
  const dbquery = connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    runSearch();
  });
};

const deptSearch = () => {
  const query = `SELECT * FROM department`;
  const dbquery = connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  })}

  const addEmployee = () => {
 
    connection.query("SELECT * FROM roles", function (err, roles) {
        if (err) throw err;
       connection.query("SELECT * FROM employee", function (err, employees) {
        inquirer.prompt([

            {
                type: "input",
                name: "firstname",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the employee's last name?"
            },
            {
                name: "role",
                type: "rawlist",
                choices: function () {
                    let choicesArr = [];
                    for (var i = 0; i < roles.length; i++) {
                        choicesArr.push(roles[i].title);
                    }
                    return choicesArr;
                },
                message: "What is the employee's role?"
            },

            {
                type: "rawlist",
                name: "manager",
                message: "What is the employee's manager?",
                choices: function () {
                    let choicesArr = [];
                    for (var i = 0; i < employees.length; i++) {
                        choicesArr.push(employees[i].first_name + " " + employees[i].last_name);
                    }
                    return choicesArr;
                }
            }

        ]).then(function (res) {
          console.log(res);
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].title == res.role) {
                    res.role_id = roles[i].id;
                }
            }
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].first_name + " " + employees[i].last_name == res.manager) {
                    res.manager_id = employees[i].id;
                }
            }
            let query = "INSERT INTO employee SET ?"
            const VALUES = {
                first_name: res.firstname,
                last_name: res.lastname,
                role_id: res.role_id,
                manager_id: res.manager_id
            }
            connection.query(query, VALUES, function (err) {
                if (err) throw err;
                console.log("New employee was added!");
                runSearch()
            }

            )
        });
    });
    });

};

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "role",
        message: "Enter the new role.",
      },
      {
        name: "salary",
        message: "Enter annual salary for this role.",
      },
      {
        type: "list",
        name: "department",
        message: "What department is this roel for?",
        choices: ["Sales", "Engineering", "Finance", "Legal"],
      },
    ])
    .then(function (response) {
      const query = `SELECT department_id FROM department WHERE department_name = '${response.department}'`;
      const dbquery = connection.query(query, (err, res) => {
        if (err) throw err;

        console.log(response[0].department_id);

        const query2 = `INSERT INTO roles (title, salary, department_id) VALUES ("${response.role}", ${response.salary}, ${response[0].department_id})`;
        const dbquery2 = connection.query(query2, (err, res) => {
          if (err) throw err;

          runSearch();
        });
      });
    });
};

const updateEmployeeRole = () => {

  let rQuery = "SELECT * FROM role;";
  let eQuery = "SELECT * FROM employee;";


  connection.query(rQuery, function (err, roles) {
      connection.query(eQuery, function (err, employees) {

          if (err) throw err;
          inquirer.prompt([{
                  name: "employee",
                  type: "rawlist",
                  choices: function () {
                      let array = [];
                      for (var i = 0; i < roles.length; i++) {
                          array.push(employees[i].first_name);
                      }

                      return array;
                  },
                  message: "Select the employee to update their role."
              },{
                  name: "role",
                  type: "rawlist",
                  choices: function () {
                      var array = [];
                      for (var i = 0; i < roles.length; i++) {
                          array.push(roles[i].title);
                      }
                      return array;
                  },
                  message: "What is this employee's new role?"
              }
          ]).then(function (result) {

              for (var i = 0; i < employees.length; i++) {
                  if (employees[i].first_name === result.employee) {
                      result.employee_id = employees[i].id;
                  }
              }
              for (var i = 0; i < roles.length; i++) {
                  if (roles[i].title === result.role) {
                      result.role_id = roles[i].id;
                  }
              }
              var query = "UPDATE employee SET role_id=? WHERE employee_id= ?"
              const VALUES = [

                  { role_id: result.result.role_id },
                  { employee_id: result.employee_id }
              ]
              let query1 = connection.query(query, VALUES, function (err) {
                  if (err) throw err;
                  console.table("Role updated");
                  runSearch()
              });

          })
      })
  })
};