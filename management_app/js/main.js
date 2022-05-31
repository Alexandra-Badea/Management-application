function doStartupConfig() {
    checkUser();
    createTable();
}

function checkUser() {
    const userLoggedIn = sessionStorage.getItem('userLogged');

    if (userLoggedIn !== 'logged') {
        window.location.replace('login.html');
    }
}

function resetForm() {
    document.getElementById('container_table').style.display = 'block';
    document.getElementById('add_form').reset();
    document.getElementById('add_form').style.display = 'none';
    document.getElementById('add_emp').style.display = 'block';

    let btnAdd = document.getElementById('btn_add');
    btnAdd.disabled = true;

    let btnSave = document.getElementById('btn_save');
    btnSave.disabled = true;

    let nameErr = document.getElementById('name-error');
    nameErr.innerHTML = '';

    let ageErr = document.getElementById('age-error'); 
    ageErr.innerHTML = '';

    let birthdateErr = document.getElementById('birthdate-error'); 
    birthdateErr.innerHTML = '';

    let phoneErr = document.getElementById('phone-error');    
    phoneErr.innerHTML = '';

    let emailErr = document.getElementById('email-error'); 
    emailErr.innerHTML = '';   
}

function addNewEmp() {
    document.getElementById('add_emp').style.display = 'none';
    document.getElementById('add_form').style.display = 'block';
    document.getElementById('btn_add').style.display = 'inline-block';
    document.getElementById('btn_save').style.display = 'none';
}

function cancelAddForm() {
    const answer = confirm('Are you sure you want to cancel the form ?');

    if (answer) {
        resetForm();
    }
}

function checkName() {
    const name = document.getElementById('name').value;
    let nameErr = document.getElementById('name-error');

    if (name === '' || name === null) {
        nameErr.innerHTML = 'Name is required!';
        return false;
    } else if (!name.match(/[A-Za-z]+$/)) {
        nameErr.innerHTML = 'Write full name!';
        return false;
    } else {
        nameErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function checkAge() {
    const age = document.getElementById('age').value;
    let ageErr = document.getElementById('age-error');

    if (age === '' || age === null) {
        ageErr.innerHTML = 'Age is required!';
        return false;
    } else if (age < 18) {
        ageErr.innerHTML = 'Age must be at least 18 years!';
        return false;
    } else if (age > 65) {
        ageErr.innerHTML = 'Age must be less then 65 years!';
        return false;
    } else if (!age.match(/^\d+$/)) {
        ageErr.innerHTML = 'Only digits!';
        return false;
    } else {
        ageErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function checkBirthdate() {
    const birthdate = document.getElementById('birthdate').value;
    let birthdateErr = document.getElementById('birthdate-error');

    if (birthdate === '' || birthdate === null) {
        birthdateErr.innerHTML = 'Birthdate is required!';
        return false;
    } else if (!birthdate.match(/^(\d{4})-(\d{2,2})-(\d{2,2})$/)) {
        birthdateErr.innerHTML = 'Birthdate format must be YYYY-MM-DD!';
        return false;
    } else {
        birthdateErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function checkPhone() {
    const phone = document.getElementById('phone').value;
    let phoneErr = document.getElementById('phone-error');

    if (phone === '' || phone === null) {
        phoneErr.innerHTML = 'Phone number is required!';
        return false;
    } else if (phone.length !== 10) {
        phoneErr.innerHTML = 'Phone number must be 10 digits long!';
        return false;
    } else if (!phone.match(/^07\d{8,8}$/g)) {
        phoneErr.innerHTML = 'Phone format must be only digits and start with 07..!';
        return false;
    } else {
        phoneErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function checkEmail() {
    let email = document.getElementById('email').value;
    let emailErr = document.getElementById('email-error');

    if (email === '' || email === null) {
        emailErr.innerHTML = 'Email is required!';
        return false;
    } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        emailErr.innerHTML = 'Email format must be example@example.com!';
        return false;
    } else {
        emailErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function validateForm() {
    let btnAdd = document.getElementById('btn_add');
    let btnSave = document.getElementById('btn_save');

    if (!checkName() || !checkAge() || !checkBirthdate() || !checkPhone() || !checkEmail()) {   
        btnAdd.disabled = true;
        btnSave.disabled = true;
        return false;
    } else { 
        btnAdd.disabled = false;
        btnSave.disabled = false;
    };
}

const empFromLocalStorage = localStorage.getItem('employeesArr');
let employeesArr = empFromLocalStorage ? JSON.parse(empFromLocalStorage) : [];

function createTable() {
    if (employeesArr && employeesArr.length === 0) {
        document.getElementById('no-emp_container').style.display = 'block';
        document.getElementById('container_table').style.display = 'none';
    } else {
        document.getElementById('no-emp_container').style.display = 'none';
        document.getElementById('container_table').style.display = 'block';

        const table = document.getElementById('table');

        let tableStr = '<tr><th>No.</th><th>Name</th><th>Age</th><th>Project</th><th>Birthdate</th><th>Hired</th><th>Phone</th><th>Email</th><th>Action</th></tr>';
        
        employeesArr.forEach((person, i) => {
            tableStr += createRow(person, i);
        });
    
        table.innerHTML = tableStr;
    }    
}

const prjFromLocalStorage = localStorage.getItem('projectsArr');
let projectsArr = prjFromLocalStorage ? JSON.parse(prjFromLocalStorage) : [];

function deleteEmp(i) {
    const answer = confirm('Are you sure you want to delete ' + employeesArr[i].name + '?');
    
    if (answer) {
        let delEmp = employeesArr.splice(i, 1);

        projectsArr.forEach(prj => {
            if (prj.name === delEmp[0].project) {
                prj.employees--;
            }
        })
        localStorage.setItem('employeesArr', JSON.stringify(employeesArr));
        localStorage.setItem('projectsArr', JSON.stringify(projectsArr));

        createTable();
    }
}

let saveEmpIndex = 0;

function editEmp(i) {
    saveEmpIndex = i;

    document.getElementById('add_form').style.display = 'block';
    document.getElementById('add_emp').style.display = 'none';
    document.getElementById('btn_add').style.display = 'none';
    document.getElementById('btn_save').style.display = 'inline-block';

    document.getElementById('name').value = employeesArr[i].name;
    document.getElementById('age').value = employeesArr[i].age;
    document.getElementById('birthdate').value = employeesArr[i].birthdate;
    document.getElementById('phone').value = employeesArr[i].phone;
    document.getElementById('email').value = employeesArr[i].email;

    validateForm();
}

function saveEditEmp() {
    employeesArr[saveEmpIndex].name = document.getElementById('name').value;
    employeesArr[saveEmpIndex].age = document.getElementById('age').value;
    employeesArr[saveEmpIndex].birthdate = document.getElementById('birthdate').value;
    employeesArr[saveEmpIndex].phone = document.getElementById('phone').value;
    employeesArr[saveEmpIndex].email = document.getElementById('email').value;

    localStorage.setItem('employeesArr', JSON.stringify(employeesArr));
    createTable();
    resetForm();
}

function createRow(person, i) {
    const rowIndex = i + 1;
    const projectName = person.project ? person.project : '-';

    let rowStr = '<tr>';
    rowStr += '<td>' + rowIndex + '</td>';
    rowStr += '<td><a href="employee.html?index=' + i + '" class="emp_link">' + person.name + '</a></td>';
    rowStr += '<td>' + person.age + '</td>';
    rowStr += '<td>' + projectName + '</td>';
    rowStr += '<td>' + person.birthdate + '</td>';
    rowStr += '<td>' + person.hired + '</td>';
    rowStr += '<td><a href="tel:"' + person.phone + '">' + person.phone + '</a></td>';
    rowStr += '<td><a href="mailto:' + person.mail + '">' + person.email + '</a></td>';
    rowStr += '<td>' + '<button class="btn_edit" onclick="editEmp(' + i + ')">Edit</button>' + '<button class="btn_delete" onclick="deleteEmp(' + i + ')">Delete</button>' + '</td>';
    rowStr += '</tr>';
    return rowStr;
}

function addEmp() {
    let hired = new Date();
    let date = hired.getFullYear() + '-' + ('0' + (hired.getMonth() + 1)).slice(-2) + '-' + ('0' + (hired.getDate())).slice(-2);

    const addNewEmp = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        birthdate: document.getElementById('birthdate').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        hired: date,
        project: null,
        holidaysArr: [],
    }
     
    employeesArr.push(addNewEmp);
    localStorage.setItem('employeesArr', JSON.stringify(employeesArr));
    createTable();

    resetForm();    
}