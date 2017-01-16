function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                parseString();
                displayContents(allText);
            }
        }
    }
    rawFile.send(null);
}


function parseString() {
    var trimmedText = allText.trim();
    console.log(trimmedText);
}

/**
 * display content using a basic HTML replacement
 */
function displayContents(txt) {
    var el = document.getElementById('main');
    el.innerHTML = txt; //display output in DOM
}

$(document).ready(function () {
    readTextFile('http://jeff-eu.github.io/tableplanner/table_seat.txt');
});