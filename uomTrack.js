// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(function (error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}
let table = document.querySelector('.uomTrack');
let tableData = table.querySelectorAll('td');
let tableRows = table.querySelectorAll('tr');

let css = `
/* Table Style */
table {
    width: 100%;
    height: 100%;
    font-size: 1.2rem;
    text-align: center;
    border-collapse: collapse;
}

table th {
    border-bottom: dashed #000000 1px;
    padding-bottom: 10px;
}

table tfoot {
    border-top: dashed #000000 1px;
}

table td img {
    height: 25px;
}

table input {
    text-align: center;
}

table tbody tr:hover {
    background-color: #cecece;
}

/* 800px Breakpoint */
@media all and (max-width: 800px) {
    table {
        font-size: 1rem;
    }
}

/* 400px Breakpoint */
@media all and (max-width: 400px) {

    /* Force table to not be like tables anymore */
    table, thead, tbody, th, td, tr {
        display: block;
    }

    /* Hide table headers (but not display: none;, for accessibility) */
    thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }

    tr {
        border: 1px solid #ccc;
    }

    td {
        /* Behave  like a "row" */
        border: none;
        border-bottom: 1px solid #eee;
        position: relative;
        padding-left: 50%;
    }

    td:before {
        /* Now like a table header */
        position: absolute;
        /* Top/left values mimic padding */
        top: 6px;
        left: 6px;
        width: 45%;
        padding-right: 10px;
        white-space: nowrap;
    }

    /*
	Label the data
	*/
    td:nth-of-type(1):before {
        content: "Country";
    }

    td:nth-of-type(2):before {
        content: "Name";
    }

    td:nth-of-type(3):before {
        content: "Per. Best";
    }

    td:nth-of-type(4):before {
        content: "Time";
    }
}
`;
let styleSheet = document.createElement('style');
styleSheet.innerText = css;
document.head.appendChild(styleSheet);

// change cells to inputs
for(let i=0; i<tableData.length; i++){
    let data = tableData[i].innerText;
    tableData[i].innerHTML = '<input type="text" value=' + data + '>';
}

// add event listener to the table
table.addEventListener('click', function (evt) {
    if(evt.target.tagName.toLowerCase() === 'th'){
        sortTable(evt.target.cellIndex);
    }
    if(evt.target.matches('.copy')) {
        let cpy = evt.target.parentNode.parentNode.cloneNode(true);
        table.querySelector('tbody').appendChild(cpy);
        statistics();
    }
    if(evt.target.matches('.delete')) {
        let del = evt.target.parentNode.parentNode;
        del.remove();
        statistics();
    }
}, false);

// add event listener to the table
table.addEventListener('change', function (evt) {
    if(evt.target.tagName.toLowerCase() === 'input'){
        statistics();
    }
}, false);


/* Insert copy and delete buttons.
Loop through all table rows (except the
first, which contains table headers):*/
for(let i=1; i<tableRows.length; i++){
    tableRows[i].querySelector('td:last-child').insertAdjacentHTML('afterend', '<td><img src="assets/copy-icon.png" class="copy"><img src="assets/delete-icon.png" class="delete"></td>');
}


function sortTable(col) {
    let rows, switching, i, x, y, shouldSwitch;
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.querySelector('tbody').rows;

      for (i = 0; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName('input')[col];
        y = rows[i + 1].getElementsByTagName('input')[col];
        //check if the two rows should switch place:
        if( !isNaN( parseFloat(x.value) ) ){
                if (parseFloat(x.value) > parseFloat(y.value)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        else if(x.value.toLowerCase() > y.value.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }

	// make all the table headings black
    let headings = table.querySelectorAll('th');
    for(let i=0; i<headings.length; i++){
        headings[i].style.color = '#000000';
    }
	// change only the sorted column heading
    headings[col].style.color = '#a72419';
}

function statistics(){
    let rows, switching, i, x, y, shouldSwitch, totalTime = 0, max = 0, min = Infinity, average;

    rows = table.querySelector('tbody').rows;
    totalTime = parseFloat(rows[0].getElementsByTagName('input')[3].value);
    for (i = 0; i < (rows.length - 1); i++) {
        totalTime = totalTime + parseFloat(rows[i+1].getElementsByTagName('input')[3].value);
    }
    
    // remove table footer (previous data)
    if(table.querySelector('tfoot') !== null) {
        table.querySelector('tfoot').remove();
    }

	// find max and min
    for (i = 0; i < (rows.length); i++) {
        if(max < parseFloat(rows[i].getElementsByTagName('input')[3].value)) {
            max = parseFloat(rows[i].getElementsByTagName('input')[3].value);
        }
        if(min > parseFloat(rows[i].getElementsByTagName('input')[3].value)){
            min = parseFloat(rows[i].getElementsByTagName('input')[3].value);
        }
    }
    average = totalTime/(rows.length-1);

     // Create an empty <tfoot> element and add it to the table:
    let footer = table.createTFoot();

    // Create an empty <tr> element and add it to the first position of <tfoot>:
    let row = footer.insertRow(0);     

    // Insert a new cell (<td>) at the first position of the "new" <tr> element:
    let cellMin = row.insertCell(0);
    let cellMax = row.insertCell(1);
    let cellAverage = row.insertCell(2);

    // Add text in the new cells:
    cellMin.innerHTML = 'Best: ' + min.toFixed(2);
    cellMax.innerHTML = 'Worst: ' + max.toFixed(2);
    cellAverage.innerHTML = 'Average: ' + average.toFixed(2);
}

statistics();