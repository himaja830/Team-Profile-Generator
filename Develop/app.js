const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)


    // After the user has input all employees desired, call the `render` function (required
    // above) and pass in an array containing all employee objects; the `render` function will
    // generate and return a block of HTML including templated divs for each employee!

    // After you have your html, you're now ready to create an HTML file using the HTML
    // returned from the `render` function. Now write it to a file named `team.html` in the
    // `output` folder. You can use the variable `outputPath` above target this location.
    // Hint: you may need to check if the `output` folder exists and create it if it
    // does not.

    // HINT: each employee type (manager, engineer, or intern) has slightly different
    // information; write your code to ask different questions via inquirer depending on
    // employee type.

    // HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
    // and Intern classes should all extend from a class named Employee; see the directions
    // for further information. Be sure to test out each class and verify it generates an
    // object with the correct structure and methods. This structure will be crucial in order
    // for the provided `render` function to work! ``


    const questions = {
        employee: [
            {
                type: "input",
                message:  "What is the Employee name?",
                name: "name"
            },
            {
                type: "input",
                message: "What is the Id of Employee?",
                name: "id"
            },
            {
                type: "input",
                message: "Can you enter Email Id?",
                name: "email"
            }
        ],
        manager: [
            {
                type: "input",
                message: "What is your office number?",
                name: "officeNumber"
            }
        ],
        engineer: [
            {
                type: "input",
                message: "What is your github user name?",
                name: "github"
            }
        ],
        intern: [
            {
                type: "input",
                message: "Which school did you attend?",
                name: "school"
            }
        ]
    }

    let employees = [];

    function createEmployees() {
        let emp = {};
        askRole(emp);
    }

    function askRole(emp) {

        inquirer.prompt([{
            type: "input",
            message: "What is your role? Enter one of the following manager, engineer, intern?",
            name: "role",
            choices: ['manager', 'engineer', 'intern'],
        }])
        .then(answer => {
    
            if (!['manager', 'engineer', 'intern'].includes(answer.role)) {
                console.log('You should enter one of the following; manager, engineer or intern');
                createEmployees();
                return;
            }

            emp['role'] = answer.role;
            askCommonQuestions(emp);
    
        }).catch(err => {
            console.log('Error when asking role', err);
        })

    }

    function askCommonQuestions(emp) {
        inquirer.prompt(questions.employee).then(ans => {
            emp = Object.assign(ans, emp);
            askRoleSpecificQuestions(emp);
        }).catch(err => {
            console.log('Error when asking common questions', err);
        });
    }

    function askRoleSpecificQuestions(emp) {
        inquirer.prompt(questions[emp.role]).then(ans => {
            emp = Object.assign(ans, emp);
            constructEmployee(emp);
            askForAdditionOfAnotherEmployee();
        }).catch(err => {
            console.log('Error when asking role specific questions', err);
        });
    }

    function askForAdditionOfAnotherEmployee() {
        inquirer.prompt([ 
            {
                type: 'input',
                message: 'Would you like to add another employee? (yes/no)',
                name: 'value',
                choices: ['yes', 'no']
            }
        ]).then(ans => {
            if (ans.value === 'yes') {
                createEmployees();
            } else {
                console.log('Added all the employees');
                const html = render(employees);
                fs.writeFileSync(outputPath, html, function(err) {
                    console.log('Error when writing html to teams.html', err);
                });
            }
        })
    }

    function constructEmployee(emp) {
        switch (emp.role) {
            case 'manager':
                const manager = new Manager(emp.name, emp.id, emp.email, emp.officeNumber);
                employees.push(manager);
                return;

            case 'engineer':
                const engineer = new Engineer(emp.name, emp.id, emp.email, emp.github);
                employees.push(engineer);
                return;

            case 'intern':
                const intern = new Intern(emp.name, emp.id, emp.email, emp.school);
                employees.push(intern);
                return;
        }
    }

    createEmployees();