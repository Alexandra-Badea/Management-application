function doStartupConfig() {
    checkUser();
    createTable();
}

function checkUser() {
    const userLoggedIn = sessionStorage.getItem('userLogged');

    if (userLoggedIn !== 'logged') {
        window.location.replace('index.html');
    }
}

function addNewEmp() {
    document.getElementById('add_emp').style.display = 'none';
    document.getElementById('add_form').style.display = 'block';
    document.getElementById('btn_add').style.display = 'inline-block';
    document.getElementById('btn_save').style.display = 'none';
}

function cancelPrjForm() {
    const answer = confirm('Are you sure you want to cancel the form ?');

    if (answer) {
        resetForm();
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

    let startDateErr = document.getElementById('start_date-error'); 
    startDateErr.innerHTML = '';

    let durationErr = document.getElementById('duration-error'); 
    durationErr.innerHTML = '';

    let personelErr = document.getElementById('no_pers-error');    
    personelErr.innerHTML = '';  
}

function checkName() {
    const name = document.getElementById('name').value;
    let nameErr = document.getElementById('name-error');

    if (name === '' || name === null) {
        nameErr.innerHTML = 'Name of the project is required!';
        return false;
    } else {
        nameErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function checkStartDate() {
    const startDate = document.getElementById('start_date').value;
    let startDateErr = document.getElementById('start_date-error');

    if (startDate === '' || startDate === null) {
        startDateErr.innerHTML = 'Start date is required!';
        return false;
    } else if (!startDate.match(/^(\d{4})-(\d{2,2})-(\d{2,2})$/)) {
        startDateErr.innerHTML = 'Start date format must be YYYY-MM-DD!';
        return false;
    } else {
        startDateErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function checkDuration() {
    const duration = document.getElementById('duration').value;
    let durationErr = document.getElementById('duration-error');

    if (duration === '' || duration === null) {
        durationErr.innerHTML = 'Duration is required!';
        return false;
    } else if (duration < 1) {
        durationErr.innerHTML = 'Minimum duration is 1 month!';
        return false;
    } else if (duration > 36) {
        durationErr.innerHTML = 'Duration must be less then 36 months!';
        return false;
    } else if (!duration.match(/^\d+$/)) {
        durationErr.innerHTML = 'Only digits!';
        return false;
    } else {
        durationErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function checkPersonel() {
    const personel = document.getElementById('no_pers').value;
    let personelErr = document.getElementById('no_pers-error');

    if (personel === '' || personel === null) {
        personelErr.innerHTML = 'No of people is required!';
        return false;
    } else if (personel < 1) {
        personelErr.innerHTML = 'Minimum no of people is 1!';
        return false;
    } else if (personel > 10) {
        personelErr.innerHTML = 'Maximum no of people is 10!';
        return false;
    } else if (!personel.match(/^\d+$/)) {
        personelErr.innerHTML = 'Only digits!';
        return false;
    } else {
        personelErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function validateForm() {
    let btnAdd = document.getElementById('btn_add');
    let btnSave = document.getElementById('btn_save');

    if (!checkName() || !checkStartDate() || !checkDuration() || !checkPersonel()) {   
        btnAdd.disabled = true;
        btnSave.disabled = true;
        return false;
    } else { 
        btnAdd.disabled = false;
        btnSave.disabled = false;
    };
}

const prjFromLocalStorage = localStorage.getItem('projectsArr');
let projectsArr = prjFromLocalStorage ? JSON.parse(prjFromLocalStorage) : [];

function createTable() {
    if (projectsArr && projectsArr.length === 0) {
        document.getElementById('no-emp_container').style.display = 'block';
        document.getElementById('container_table').style.display = 'none';
    } else {
        document.getElementById('no-emp_container').style.display = 'none';
        document.getElementById('container_table').style.display = 'block';

        const table = document.getElementById('table');

        let tableStr = '<tr><th>No.</th><th>Project name</th><th>Start date</th><th>Duration (months)</th><th>Emp needed</th><th>Emp working</th><th>Action</th></tr>';       
    
        projectsArr.forEach((project, i) => {
            tableStr += createRow(project, i);
        });
    
        table.innerHTML = tableStr;

        let rows = document.querySelectorAll('tr');
        rows.forEach( row => {
            let fourthCell = row.cells[4].innerHTML;
            let cellFive = row.cells[5];
            let fifthCell = row.cells[5].innerHTML;

            let cell_4 = parseInt(fourthCell);
            let cell_5 = parseInt(fifthCell);

            if (cell_5 > cell_4) {
                cellFive.classList.add('over_worker');
            };
        });
    }    
}

function createRow(project, i) {
    const rowIndex = i + 1;

    let rowStr = '<tr>';
    rowStr += '<td>' + rowIndex + '</td>';
    rowStr += '<td>' + project.name + '</td>';
    rowStr += '<td>' + project.start_date + '</td>';
    rowStr += '<td>' + project.duration + '</td>';
    rowStr += '<td>' + project.personel + '</td>';
    rowStr += '<td>' + project.employees + '</td>';
    rowStr += '<td>' + '<button class="btn_edit" onclick="editPrj(' + i + ')">Edit</button>' + '<button class="btn_delete" onclick="deletePrj(' + i + ')">Delete</button>' + '</td>';
    rowStr += '</tr>';
    return rowStr;
}


function addProject() {
    const addNewPrj = {
        name: document.getElementById('name').value,
        start_date: document.getElementById('start_date').value,
        duration: document.getElementById('duration').value,
        personel: document.getElementById('no_pers').value,
        employees: 0,
    }
     
    projectsArr.push(addNewPrj);
    localStorage.setItem('projectsArr', JSON.stringify(projectsArr));
    createTable();

    resetForm(); 
}

const empFromLocalStorage = localStorage.getItem('employeesArr');
let employeesArr = JSON.parse(empFromLocalStorage);

function deletePrj(i) {
    const answer = confirm('Are you sure you want to delete ' + projectsArr[i].name + '?');
    
    if (answer) {
        let delPrj = projectsArr.splice(i, 1);
        
        employeesArr.forEach(emp => {
            if (emp.project === delPrj[0].name) {
                emp.project = null;
            }
        })

        localStorage.setItem('projectsArr', JSON.stringify(projectsArr));
        localStorage.setItem('employeesArr', JSON.stringify(employeesArr));

        createTable();
    }
}

let savePrjIndex = 0;

function editPrj(i) {
    savePrjIndex = i;

    document.getElementById('add_form').style.display = 'block';
    document.getElementById('add_emp').style.display = 'none';
    document.getElementById('btn_add').style.display = 'none';
    document.getElementById('btn_save').style.display = 'inline-block';

    document.getElementById('name').value = projectsArr[i].name;
    document.getElementById('start_date').value = projectsArr[i].start_date;
    document.getElementById('duration').value = projectsArr[i].duration;
    document.getElementById('no_pers').value = projectsArr[i].personel;

    validateForm();
}

function saveEditPrj() {
    projectsArr[savePrjIndex].name = document.getElementById('name').value;
    projectsArr[savePrjIndex].start_date = document.getElementById('start_date').value;
    projectsArr[savePrjIndex].duration = document.getElementById('duration').value;
    projectsArr[savePrjIndex].personel = document.getElementById('no_pers').value;

    localStorage.setItem('projectsArr', JSON.stringify(projectsArr));
    createTable();
    resetForm();
}
