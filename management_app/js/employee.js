function doStartupConfig() {
    checkUser();
    getEmpData();
    createTable();
}

function checkUser() {
    const userLoggedIn = sessionStorage.getItem('userLogged');

    if (userLoggedIn !== 'logged') {
        window.location.replace('index.html');
    }
}

const empFromLocalStorage = localStorage.getItem('employeesArr');
let employeesArr = JSON.parse(empFromLocalStorage);

const prjFromLocalStorage = localStorage.getItem('projectsArr');
let projectsArr = prjFromLocalStorage ? JSON.parse(prjFromLocalStorage) : [];

let empIndex;

function getEmpData() {
    const searchArr = window.location.search.split('=');
    empIndex = searchArr[1];
    document.getElementById('avatar').innerHTML = '<i class="fa-solid fa-user-tie"></i>';
    document.getElementById('emp_name').innerHTML = employeesArr[empIndex].name;

    createSelect();
}

function createSelect() {
    let selectStr = '<option value="0">No project</option>';
    
    projectsArr.forEach(project => {
        const selectedPrj = (employeesArr[empIndex].project === project.name) ? 'selected' : '';
        selectStr += '<option value="' + project.name + '" ' + selectedPrj + '>' + project.name + '</option>';
    });
    
    document.getElementById('projects').innerHTML = selectStr;
}

function saveEmpPrj() {
    const prjSelected = document.getElementById('projects').value;

    

    projectsArr.forEach((project, i) => {
        if (employeesArr[empIndex].project !== null && employeesArr[empIndex].project === project.name) {
            if (projectsArr[i].employees > 0) {
                projectsArr[i].employees--;
            }
        }
        
        if (prjSelected === project.name) {
            projectsArr[i].employees++;   
        }
    })

    localStorage.setItem('projectsArr', JSON.stringify(projectsArr));

    employeesArr[empIndex].project = (prjSelected === '0') ? null : prjSelected;
    localStorage.setItem('employeesArr', JSON.stringify(employeesArr));
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

function resetForm() {
    document.getElementById('container_table').style.display = 'block';
    document.getElementById('add_form').reset();
    document.getElementById('add_form').style.display = 'none';
    document.getElementById('add_emp').style.display = 'block';

    let btnAdd = document.getElementById('btn_add');
    btnAdd.disabled = true;

    let btnSave = document.getElementById('btn_save');
    btnSave.disabled = true;

    let holidayErr = document.getElementById('holiday-error');
    holidayErr.innerHTML = '';

    let startDateErr = document.getElementById('start_date-error'); 
    startDateErr.innerHTML = '';

    let endDateErr = document.getElementById('end_date-error'); 
    endDateErr.innerHTML = ''; 
}

function checkHoliday() {
    const holiday = document.getElementById('holiday').value;
    let holidayErr = document.getElementById('holiday-error');

    if (holiday === '' || holiday === null) {
        holidayErr.innerHTML = 'Name is required!';
        return false;
    } else if (!holiday.match(/[A-Za-z]+$/)) {
        holidayErr.innerHTML = 'Write full name!';
        return false;
    } else {
        holidayErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function checkStartDate() {
    const startDate = document.getElementById('start_date').value;
    let startDateErr = document.getElementById('start_date-error');

    if (startDate === '' || startDate === null) {
        startDateErr.innerHTML = 'Satrt date is required!';
        return false;
    } else if (!startDate.match(/^(\d{4})-(\d{2,2})-(\d{2,2})$/)) {
        startDateErr.innerHTML = 'Start date format must be YYYY-MM-DD!';
        return false;
    } else {
        startDateErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function checkEndDate() {
    const endDate = document.getElementById('end_date').value;
    let endDateErr = document.getElementById('end_date-error');

    let startDateEntered = document.getElementById('start_date').value;
    let startDateHoliday = new Date(startDateEntered);

    let endDateEntered = document.getElementById('end_date').value;
    let endDateHoliday = new Date(endDateEntered);

    if (endDate === '' || endDate === null) {
        endDateErr.innerHTML = 'End date is required!';
        return false;
    } else if (!endDate.match(/^(\d{4})-(\d{2,2})-(\d{2,2})$/)) {
        endDateErr.innerHTML = 'End date format must be YYYY-MM-DD!';
        return false;
    } else if (endDateHoliday <= startDateHoliday) {
        endDateErr.innerHTML = 'Invalid end date!';
        return false;
    } else {
        endDateErr.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        return true;
    }
}

function validateForm() {
    let btnAdd = document.getElementById('btn_add');
    let btnSave = document.getElementById('btn_save');

    if (!checkHoliday() || !checkStartDate() || !checkEndDate()) {   
        btnAdd.disabled = true;
        btnSave.disabled = true;
        return false;
    } else { 
        btnAdd.disabled = false;
        btnSave.disabled = false;
    };
}

function createTable() {
    if (employeesArr[empIndex].holidaysArr && employeesArr[empIndex].holidaysArr.length === 0) {
        document.getElementById('no-emp_container').style.display = 'block';
        document.getElementById('container_table').style.display = 'none';
    } 
    else {
        document.getElementById('no-emp_container').style.display = 'none';
        document.getElementById('container_table').style.display = 'block';

        const table = document.getElementById('table');

        let tableStr = '<tr><th>No.</th><th>Holiday</th><th>Start date</th><th>End date</th><th>Days off</th><th>Action</th></tr>';
    
        employeesArr[empIndex].holidaysArr.forEach((data, i) => {
            tableStr += createRow(data, i);
        });
    
        table.innerHTML = tableStr;
    }    
}

function createRow(data, i) {
    const rowIndex = i + 1;

    let rowStr = '<tr>';
    rowStr += '<td>' + rowIndex + '</td>';
    rowStr += '<td>' + data.name + '</td>';
    rowStr += '<td>' + data.start_date + '</td>';
    rowStr += '<td>' + data.end_date + '</td>';
    rowStr += '<td>' + data.days_off + '</td>';
    rowStr += '<td>' + '<button class="btn_edit" onclick="editData(' + i + ')">Edit</button>' + '<button class="btn_delete" onclick="deleteData(' + i + ')">Delete</button>' + '</td>';
    rowStr += '</tr>';
    return rowStr;
}

function calculateDaysOff() {
    let startDateEntered = document.getElementById('start_date').value;
    let startDate = new Date(startDateEntered);

    let endDateEntered = document.getElementById('end_date').value;
    let endDate = new Date(endDateEntered);

    let differenceDates = endDate.getTime() - startDate.getTime();
    let totalDaysOff = Math.ceil(differenceDates / (1000 * 3600 * 24));
    return totalDaysOff;
}

function addData() {
    const addNewData = {
        name: document.getElementById('holiday').value,
        start_date: document.getElementById('start_date').value,
        end_date: document.getElementById('end_date').value,
        days_off: calculateDaysOff(),
    }

    employeesArr[empIndex].holidaysArr.push(addNewData);
    localStorage.setItem('employeesArr', JSON.stringify(employeesArr));

    createTable();

    resetForm(); 
}

function deleteData(i) {
    const answer = confirm('Are you sure you want to delete ' + employeesArr[empIndex].holidaysArr[i].name + ' holiday ?');
    
    if (answer) {
        employeesArr[empIndex].holidaysArr.splice(i, 1);
        localStorage.setItem('employeesArr', JSON.stringify(employeesArr));
        createTable();
    }
}

let saveDataIndex = 0;

function editData(i) {
    saveDataIndex = i;

    document.getElementById('add_form').style.display = 'block';
    document.getElementById('add_emp').style.display = 'none';
    document.getElementById('btn_add').style.display = 'none';
    document.getElementById('btn_save').style.display = 'inline-block';

    document.getElementById('holiday').value = employeesArr[empIndex].holidaysArr[i].name;
    document.getElementById('start_date').value = employeesArr[empIndex].holidaysArr[i].start_date;
    document.getElementById('end_date').value = employeesArr[empIndex].holidaysArr[i].end_date;

    validateForm();
}

function saveEditData() {
    employeesArr[empIndex].holidaysArr[saveDataIndex].name = document.getElementById('holiday').value;
    employeesArr[empIndex].holidaysArr[saveDataIndex].start_date = document.getElementById('start_date').value;
    employeesArr[empIndex].holidaysArr[saveDataIndex].end_date = document.getElementById('end_date').value;
    employeesArr[empIndex].holidaysArr[saveDataIndex].days_off = calculateDaysOff();

    localStorage.setItem('employeesArr', JSON.stringify(employeesArr));

    createTable();
    resetForm();
}