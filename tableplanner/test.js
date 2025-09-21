let gTables = [];
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                gTables = parseTxtToTables(allText);
            //    displayContents(allText);
            }
        }
    }
    rawFile.send(null);
}


function parseTxtToTables(txt) {

    var tables = [];
    var lines = txt.split('\n');
    
    //code here using lines[i] which will give you each line
    for(var i = 0; i < lines.length; i++) {
        
        // remove all white characters
        let lineCleaned = lines[i].replace('/ /g','');
        var firstChar = lineCleaned[0];
        if(firstChar === '$') {

            var array = lineCleaned.substring(1).split(',');

            let newTable = {
                id: array[0],
                name: array[1],
                blessNote: array[2],
                members: []
            };

            tables.push(newTable);
        }else {

            if(lines[i].replace('/ /g','') === '')
                continue;
            else
                tables[tables.length - 1].members.push(lines[i]);
        }
    }

    console.log(tables);
    return tables;
}

/**
 * display content using a basic HTML replacement
 */
function displayContents(txt) {
    var el = document.getElementById('main');
    // el.innerHTML = txt; //display output in DOM
}

$(document).ready(function () {
    readTextFile('http://jeff-eu.github.io/tableplanner/table_seat.txt');
});

function onTableBtnClick() {
    var name = document.getElementById("nameInput").value;

    for(let i=0; i<gTables.length; i++){
        for(let j=0; j<gTables[i].members.length; j++){
            if(name === gTables[i].members[j]){
                alert(gTables[i].name);
                return;
            }
        } 
    }

    alert('查無此人');
}