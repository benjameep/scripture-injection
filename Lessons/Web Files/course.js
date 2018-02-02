/********************************************************
    The purpose of course.js is to house only the JavaScript
    specific to an individual course. The online.js
    houses all the default JavaScript.
********************************************************/
/* DO NOT DELETE OR MODIFY THIS SECTION */
/* Append Script Tag for Online.js to the Body Tag */
var onlineJs = document.createElement("script");
onlineJs.src = 'https://content.byui.edu/integ/gen/00134d04-34d1-47b8-9242-c29059c522ee/0/online.js';
document.body.appendChild(onlineJs);

/* Add Course Specific JavaScript Below */

var name = "",
    data = {},
    checkboxToFocus;

function initCheckboxes() {
    var dropDowns = document.querySelectorAll('.drop-down'),
        checkboxes = document.querySelectorAll('.check'),
        checkLables = document.querySelectorAll('.check-wrapper label'),
        courseCode,
        file,
        i;
    /* If no checkboxs then return */
    if (checkboxes.length === 0) { return; }
    
    /* Get unique name for page to use in local storage */
    courseCode = window.location.search.split("&");
    for (i = 0; i < courseCode.length; i++) {
        if (courseCode[i].indexOf("ou=") != -1) {
            name = courseCode[i].slice(3);
            break;
        }
    }
    /* Get unique file name to add to unique name for local storage */
    file = window.location.pathname.split("/");
    name += "-" + file.pop();
    
    /* Apply class for checkbox styling and set event trigger on checkboxes */
    for (i = 0; i < checkboxes.length; i++) {
        checkboxes[i].parentElement.style.display = "inline-block"; checkboxes[i].parentElement.previousElementSibling.classList.add('check-item');
        checkboxes[i].onchange = saveCheckbox;
        // Make checkbox accessible with enter key (space already works)
        checkboxes[i].onkeypress = function(e) {
            if (e.type === 'keypress' && e.keyCode === 13) {
                this.click();
            }
        };
    }

    setCheckboxes();
    window.addEventListener("load", sizeCheckWrappers);
    window.addEventListener("resize", sizeCheckWrappers);
}

/* Size checkbox wrappers to the same height as the drop-down */
function sizeCheckWrappers() {
    var wrappers = document.querySelectorAll('.check-wrapper');
    for (i = 0; i < wrappers.length; i++) { wrappers[i].style.height = wrappers[i].previousElementSibling.offsetHeight + 'px';
    } 
}

/* Check for stored data and use it to set checkboxes */
function setCheckboxes() {
    if (typeof localStorage[name] != "undefined") {
        data = JSON.parse(localStorage[name]);
        for (checkbox in data) {
            if (data[checkbox] && checkbox != "shownMsg") {
                document.getElementById(checkbox).checked = true;
            }
        }
    }
}

// Calculate the distance from the top of an element to the top of the document
function calculateTop(element) {
    var top = element.offsetTop,
        parent = element.offsetParent,
        i;
    while (parent.nodeName != "BODY") {
        top += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return top;
}

/* Display a message about the checkbox tool */
function showMsg(el) {
    var overlay = '<div id="alertOverlay"><div id="alertBox"><p><b>Important</b></p><p>Checking items off on this page is for your convience only. It is not required nor does it affect your grade. The data is only stored in the browser and will not update to other browsers or computers.<br><button onclick="closeMsg()">Ok</button></p></div></div>',
        top = calculateTop(el) - 75,
        alertBox;
    // Save checkbox so it can be focused after message is closed
    checkboxToFocus = el;
    document.getElementById("main").insertAdjacentHTML("afterend", overlay);
    /* Hide #main from screen readers until overlay is closed */
    document.getElementById("main").setAttribute('aria-hidden', true);
    // Set alert position
    alertBox = document.querySelector("#alertBox");
    alertBox.style.top = top + "px";
    alertBox.style.left = (window.innerWidth / 2) - (alertBox.offsetWidth / 2) + "px";
    /* Move focus to #alertBox */
    document.querySelector("#alertOverlay button").focus();
    /* Keep keyboard focus on #alertBox button until closed */
    window.onkeydown = function(e) {
        if(e.keyCode === 9) {
            e.preventDefault();
            document.querySelector("#alertBox button").focus();
        }
    };
}

function closeMsg() {
    document.getElementById('alertOverlay').style.display = 'none';
    /* Re-enable main content to screen readers */
    document.getElementById("main").setAttribute('aria-hidden', false);
    /* Release focus */
    window.onkeydown = null;
    /* Return focus to checkbox */
    checkboxToFocus.focus();
}


/* Save checkbox state in localstorage */
function saveCheckbox() {
    if (typeof data["shownMsg"] === "undefined") {
        showMsg(this);
        data["shownMsg"] = true;
    }
    data[this.id] = this.checked;
    localStorage.setItem(name, JSON.stringify(data));
}

initCheckboxes();