/*
function showPieChart(){
    console.log("loading chart");
    
    // some fake numbers to create a chart --> real values need to be requested from the server
    let sliceA = {size: 250, color: "blue"};
    let sliceB = {size: 650, color: "blue"};

}
*/

let allData;

document.addEventListener('DOMContentLoaded', function() {
    allTimePie(); //allTimePie
});


async function fetchAllExpenses() {

    const serverUrl = 'http://localhost:8080/api/expenses';
    console.log('Fetching expense data...');

    try {
        const response = await fetch(serverUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch expense data: ${response.status} ${response.statusText}`);
        }
        const bookedSeats = await response.json();
        // You can return the array of booked seats here
        return bookedSeats || [];
    } catch (error) {
        console.error('Error fetching booked seats:', error);
        console.error('Error details:', error.message); // Log the error details

        // Return an empty array or handle the error according to your needs
        return [];
    }
}


async function ensureStylesLoaded() {
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });
}



let currentPieChart;

async function allTimePie() {
    //await ensureStylesLoaded(); // Wait for styles to load
    allData = await fetchAllExpenses();
    console.log(allData);
    let chartData = createPieData(allData);
    currentPieChart = createPie(chartData[0], chartData[1]);
}


async function weekPie() {
    //await ensureStylesLoaded(); // Wait for styles to load
    allData = await fetchAllExpenses();

    // filter out entries that are older than a week

    let validData = [];
    let length = 0;
    while(allData[length] != undefined){
        var expenseDate = allData[length].date;

        // check if date is in the current week --> week starting monday

        let dateSplit = expenseDate.split("/");
        var expenseDateAsJsDate = new Date(dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0]);
        //console.log(expenseDateAsJsDate);

        let currentDate = Date.now(); // time in milliseconds since January 1, 1970

        const minute = 1000 * 60; // 1000 milliseconds
        const hour = minute * 60;
        const day = hour * 24;

        var timeDif = (currentDate - expenseDateAsJsDate.getTime()) / day; // days that have passed
        var timeDifRounded = timeDif.toLocaleString().split(".")[0];
        console.log(timeDifRounded);

        // determine current day of the week --> needed to determine is timeDif is part of the week
        let today = new Date();
        var currentDay = today.getDay(); // 0-6 || 0:Sunday || Saturday:6
        
        if(currentDay == 0) {
            // Sunday regarded as start
            if(7 - timeDif > 0){
                validData.push(allData[length]);
            }
        } else {
            if(currentDay - timeDifRounded >= 0){
                validData.push(allData[length]); 
            }
        }

        //validdates.push(expenseDateDesrlsd); 
        length++;
    }
    console.log(validData);
    let chartData = createPieData(validData);
    currentPieChart = createPie(chartData[0], chartData[1]);
    //currentPieChart = createPie(amountsInCategories, categoriesonce);
}

async function monthPie() {
    //await ensureStylesLoaded();
    allData = await fetchAllExpenses();

    // filter out entries that are older than a week

    let validData = [];
    let length = 0;
    while(allData[length] != undefined){
        var expenseDate = allData[length].date;

        // check if date is in the current week --> week starting monday

        let dateSplit = expenseDate.split("/");
        var expenseDateAsJsDate = new Date(dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0]);
        //console.log(expenseDateAsJsDate);

        // checking month
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1; // January is 0

        if(dateSplit[1] == currentMonth) {
            validData.push(allData[length]);
        }

        length++;
    }
    console.log(validData);
    let chartData = createPieData(validData);
    currentPieChart = createPie(chartData[0], chartData[1]);

}

async function yearPie() {
    //await ensureStylesLoaded();
    allData = await fetchAllExpenses();

    //console.log("All Data: " + allData);

    // filter out entries that are older than a week

    let validData = [];
    let length = 0;
    while(allData[length] != undefined){
        var expenseDate = allData[length].date;
        let dateSplit = expenseDate.split("/");

        // checking month
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();

        if(dateSplit[2] == currentYear) {
            validData.push(allData[length]);
        }

        length++;
    }
    console.log(validData);
    let chartData = createPieData(validData);
    currentPieChart = createPie(chartData[0], chartData[1]);
}

// not yet integrated --> Graphical elements enabling choice of date needed
async function costomPie(targetDate) {
    //await ensureStylesLoaded(); // Wait for styles to load
    allData = await fetchAllExpenses();

    // filter out entries that are older than a week

    let validData = [];
    let length = 0;
    while(allData[length] != undefined){
        var expenseDate = allData[length].dateString;

        // check if date is in the current week --> week starting monday
        
        // deserialising date
        let expenseDateDesrlsd = expenseDate.slice(1, expenseDate.length-1);
        //console.log(expenseDateDesrlsd);

        let dateSplit = expenseDateDesrlsd.split("/");
        var expenseDateAsJsDate = new Date(dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0]);
        //console.log(expenseDateAsJsDate);

        let currentDate = Date.now(); // time in milliseconds since January 1, 1970

        const minute = 1000 * 60; // 1000 milliseconds
        const hour = minute * 60;
        const day = hour * 24;

        let targetDateJS = new Date(targetDate);

        var timeDifTarget = (currentDate - targetDateJS.getTime()) / day;
        var timeDifTargetRounded = timeDifTarget.toLocaleString().split(".")[0];

        var timeDif = (currentDate - expenseDateAsJsDate.getTime()) / day; // days that have passed
        var timeDifRounded = timeDif.toLocaleString().split(".");
        console.log(timeDifRounded);

        // compare the differences of the two times

        if(timeDifTargetRounded >= timeDifRounded) {
            validData.push(allData[length]);
        }

        //validdates.push(expenseDateDesrlsd); 
        length++;
    }
    console.log(validData);
    let chartData = createPieData(validData);
    currentPieChart = createPie(chartData[0], chartData[1]);
}


function createPieData(allData) {    
    // determine length of allData
    let lengthAllData = 0;
    while(allData[lengthAllData] != undefined) {
        //console.log(lengthAllData);
        lengthAllData++;
    }

    // create arrays of amounts and categories
    let amounts = [];
    for(var i = 0; i < lengthAllData; i++) {
        amounts.push(allData[i].price);
        //console.log(allData[i]);
    }

    let categories = [];
    
    for(var j = 0; j < lengthAllData; j++) {
        categories.push(allData[j].category);
        //console.log(allData[j].categories);
    }

    let categoriesonce = [];
    let amountsInCategories = [];

    for(var i = 0; i < lengthAllData; i++) {
        // search if new category is already in the list
        if(categoriesonce.includes(categories[i]) == false){
            categoriesonce.push(categories[i]);
            amountsInCategories.push(amounts[i]);
        } else {
            let currentCategory = categories[i];
            var catIndex = categoriesonce.indexOf(categories[i]);
            amountsInCategories[catIndex] += amounts[i];
        }
    }

    // show expenditures
    var totalMoneySpend = 0;
    for(var i = 0; i < lengthAllData; i++) {
        totalMoneySpend += amounts[i];
    }

    var paragraph = document.getElementById("moneyspend");
    //var amountdisplayed = document.createTextNode(totalMoneySpend + "€");
    paragraph.innerHTML = totalMoneySpend.toString().slice(0, 5) + " €";

    return [amountsInCategories, categoriesonce];
}

function createPie(amounts, categories) {

    console.log("Abstact function");
    console.log(amounts);
    console.log(categories);

    console.log("my function");
    const ctx = document.getElementById('pie-chart').getContext('2d');
    const pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses',
                data: amounts,
                backgroundColor: [
                    '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    return pieChart;
}

// buttons activation

// Add active class to the current button (highlight it)
// checking if button is pressed
var header = document.getElementById("optionsdisplay");
var btns = header.getElementsByClassName("pieoptions");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// checking the buttons
// is working
var btnWeek = document.getElementById("week");
btnWeek.addEventListener("click", function() {
    currentPieChart.destroy();
    weekPie();
}); 

var btnMonth = document.getElementById("month");
btnMonth.addEventListener("click", function() {
    currentPieChart.destroy();
    monthPie();
}); 

var btnYear = document.getElementById("year");
btnYear.addEventListener("click", function() {
    currentPieChart.destroy();
    yearPie();
}); 

var btnAllTime = document.getElementById("all");
btnAllTime.addEventListener("click", function() {
    currentPieChart.destroy();
    allTimePie();
}); 

var btnCustom = document.getElementById("custom");
btnCustom.addEventListener("click", function() {

}); 



// add expenses

var btnCategory = document.getElementById("category");
btnCategory.addEventListener("click", function() {

   
    const menudrop = document.querySelector('.dropdown-menu-category');
    menudrop.style.display = menudrop.style.display === 'block' ? 'none' : 'block';

    /*
    const btnCategory = document.querySelector('#category');
    btnCategory.style.backgroundColor = '#9a7942';
    btnCategory.style.color = '#ffffff';
    */

    var buttonClasses = document.getElementsByClassName("expenseDetails");
    buttonClasses[0].className += " active";
    console.log(buttonClasses[0].className);
    
});



var btnPrice = document.getElementById("price");
btnPrice.addEventListener("click", function() {

    const menudrop = document.querySelector('.dropdown-menu-price');
    menudrop.style.display = menudrop.style.display === 'block' ? 'none' : 'block';

    /*
    const btnCategory = document.querySelector('#category');
    btnCategory.style.backgroundColor = '#9a7942';
    btnCategory.style.color = '#ffffff';
    */

    var buttonClasses = document.getElementsByClassName("expenseDetails");
    buttonClasses[1].className += " active";
    console.log(buttonClasses[1].className);
});

var btnDate = document.getElementById("date");
btnDate.addEventListener("click", function() {

    const menudrop = document.querySelector('.dropdown-menu-date');
    menudrop.style.display = menudrop.style.display === 'block' ? 'none' : 'block';

    /*
    const btnCategory = document.querySelector('#category');
    btnCategory.style.backgroundColor = '#9a7942';
    btnCategory.style.color = '#ffffff';
    */

    var buttonClasses = document.getElementsByClassName("expenseDetails");
    buttonClasses[1].className += " active";
    console.log(buttonClasses[1].className);
});

var btnDescription = document.getElementById("description");
btnDescription.addEventListener("click", function() {
    //const menu = document.querySelector('.dropdown-menu-description');
    //menu.style.display = 'none';
    //console.log(menu.style.display);
    // check if dropdown is already opened 
    
    //console.log("getting here");
    const menudrop = document.querySelector('.dropdown-menu-description');
    menudrop.style.display = menudrop.style.display === 'block' ? 'none' : 'block';

    /*
    const btnCategory = document.querySelector('#category');
    btnCategory.style.backgroundColor = '#9a7942';
    btnCategory.style.color = '#ffffff';
    */

    var buttonClasses = document.getElementsByClassName("expenseDetails");
    buttonClasses[1].className += " active";
    //console.log(buttonClasses[1].className);
});

// Optional: Close dropdown if clicked outside
document.addEventListener('click', (event) => {
    checkClosing('.category-div', '.dropdown-menu-category');
    checkClosing('.price-div', '.dropdown-menu-price');
    checkClosing('.date-div', '.dropdown-menu-date');
    checkClosing('.description-div', '.dropdown-menu-description');
});

function checkSendingStatus() {
    const expenseBtns = document.getElementsByClassName("expenseDetails");
    var counter = 0;
    for(var i = 0; i < (expenseBtns.length - 1); i++) {
        if(expenseBtns[i].innerHTML != "Category" && expenseBtns[i].innerHTML != "Price" && expenseBtns[i].innerHTML != "Date" && expenseBtns[i].innerHTML != "Description") {
            counter += 1;
        }
    }
    //console.log("counter: " + counter);
    return counter;
}

function checkClosing(btnDiv, dropdownMenu) {
    document.addEventListener('click', (event) => {
        const dropdown = document.querySelector(btnDiv);
        //console.log(dropdown.style.display);
        if (!dropdown.contains(event.target)) {
            //console.log("in here");
            const menu = document.querySelector(dropdownMenu);
            menu.style.display = 'none';
    
            // replace active
            var current = document.getElementsByClassName(" active");
            //console.log(current);
            while(current.length == 2) {
                //console.log(current[1].className);
                current[1].className = current[1].className.replace(" active", "");
            }
        }
    });
}

function handleItemClick(id, option) {
    //alert(`You selected: ${option}`);
    //console.log(`Action triggered for: ${option}`);
    const menu = document.querySelector('.dropdown-menu-category');
    menu.style.display = 'none';
    const btnCategory = document.getElementById(id);
    btnCategory.innerHTML = option;
    btnCategory.style.backgroundColor = '#9a7942';
    btnCategory.style.color = '#ffffff';
    if(checkSendingStatus() == 4) {
        displaySaveField();
    }
}

function handlePriceInput() {
    var input = document.getElementById('priceInput').value;
    const menu = document.querySelector('.dropdown-menu-price');
    menu.style.display = 'none';
    //console.log(input);
    if(input == '') {
        alert("Please add an amount");
    } else {
        const btnPrice = document.getElementById('price');
        btnPrice.innerHTML = input + " €";
        btnPrice.style.backgroundColor = '#9a7942';
        btnPrice.style.color = '#ffffff';
    }
    if(checkSendingStatus() == 4) {
        displaySaveField();
    }
}

function handleDateInput() {
    var input = document.getElementById('dateInput').value;
    const menu = document.querySelector('.dropdown-menu-date');
    menu.style.display = 'none';
    //console.log(input);

    inputAsDate = new Date(input);
    //console.log(inputAsDate.getTime());

    if(input == '') {
        alert("Please add a date");
    } else if(inputAsDate.getTime() > Date.now()) {
        alert("Please choose a date from the past or today's date");
    } else {
        const btnDate = document.getElementById('date');
        btnDate.innerHTML = input;
        btnDate.style.backgroundColor = '#9a7942';
        btnDate.style.color = '#ffffff';
    }
    if(checkSendingStatus() == 4) {
        displaySaveField();
    }
}

function handleDescriptionInput() {
    var input = document.getElementById('descriptionInput').value;
    const menu = document.querySelector('.dropdown-menu-description');
    menu.style.display = 'none';
    //console.log(input);

    const btnDate = document.getElementById('description');
    btnDate.innerHTML = input;
    btnDate.style.backgroundColor = '#9a7942';
    btnDate.style.color = '#ffffff';
    if(checkSendingStatus() == 4) {
        displaySaveField();
    }
}


function displaySaveField() {
    const btn = document.getElementById("submitExpenseBtn");
    btn.style.display = "block";
}



function postData() {
    var category = document.getElementById("category").innerHTML;
    var price = document.getElementById("price").innerHTML;
    var date = document.getElementById("date").innerHTML;
    var description = document.getElementById("description").innerHTML;

    let data = {category, price, date, description};

    fetch('http://localhost:8080/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
        // Handle the response
        console.log('Response Json:', data);
        if(data.errors == undefined) {
            console.log("Data has been succesfully posted to server");
            location.reload(); 
        } else {
            alert("Error: Invalid Input");
        }
    })
        .catch(error => {
        // Handle the error
        console.error('Error posting data:', error);
    });
}

/* AI request */


document.getElementById('sendImage').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from reloading the page

    const imageInput = document.getElementById('imageUpload');
    const file = imageInput.files[0]; // Get the selected file

    if (!file) {
        alert('Please select a file!');
        return;
    }

    const formData = new FormData();
    formData.append('image', file); // Append the file to the form data

    fetch('http://localhost:8080/upload', { // Adjust URL to your server endpoint
        method: 'POST',
        body: formData, // Send the FormData object
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then(async result => {
        console.log('Server response:', result);
        alert('Image uploaded successfully!');
        let response = await fetchAiResponse();
        console.log(response);
        if(response.success == false) {
            alert("Uploaded image contains no purchases. Please try again or enter expenses manually.");
        } else {
            displayResponse(response.data);
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
    });
});

async function fetchAiResponse() {

    const serverUrl = 'http://localhost:8080/api/data';
    console.log('Fetching Ai response');

    try {
        const response = await fetch(serverUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch Ai response: ${response.status} ${response.statusText}`);
        }
        const bookedSeats = await response.json();
        // You can return the array of booked seats here
        return bookedSeats || [];
    } catch (error) {
        console.error('Error fetching booked seats:', error);
        console.error('Error details:', error.message); // Log the error details

        // Return an empty array or handle the error according to your needs
        return [];
    }
}

function displayResponse(response) {
    var key, count = 0;
    for(key in response.purchases) {
        if(response.purchases.hasOwnProperty(key)) {
            count++;
            const list = document.createElement("ul");
            const listText = document.createTextNode(response.purchases[key].quantity + "x " + response.purchases[key].product + ": " + response.purchases[key].price + " € ; category: " + response.purchases[key].category);
            list.appendChild(listText);

            const element = document.getElementById("aiResponse");
            element.appendChild(list);
        }
    }
    document.getElementById("addAiResponseToExpenses").style.display = "block";
}

document.getElementById('imageUpload').addEventListener('change', async function(e) {
    console.log("in here");
    const fileName = e.target.files[0]?.name || 'No file chosen';
    document.querySelector('.selected-file').textContent = fileName;
    document.querySelector('.sendBtnDiv').style.display = "block";
});

document.getElementById('addExpenseBtn').addEventListener('click', function() {
    let listData = document.querySelectorAll('ul');
    console.log(listData);
    console.log(listData.length);
    
    for(var i = 0; i < listData.length; i++) {
        let splitText = listData[i].innerHTML.split(" ; ");
        var price = splitText[0].split(": ")[1];
        var category = splitText[1].split(": ")[1];
        const currentDate = new Date();
        var date = currentDate.getFullYear() + "-" + currentDate.getMonth() + "-" + currentDate.getDate();
        var description = "Adding expenses generated through AI";
        var data = {category, price, date, description};

        fetch('http://localhost:8080/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
            // Handle the response
            console.log('Response Json:', data);
            if(data.errors == undefined) {
                console.log("Data has been succesfully posted to server");
                location.reload(); 
            } else {
                alert("Error: Invalid Input");
            }
        })
            .catch(error => {
            // Handle the error
            console.error('Error posting data:', error);
        });        
    }
    //location.reload();
});


