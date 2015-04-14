﻿/*
 * Justin Robb
 * 4/10/15
 * Best Clip of the Week Application
 * Term configuration page
 */

// Constants
const GOOD = 0;
const BAD = 1;
const OKAY = 2
const USER_NAME = "Admin";

window.onerror = function (msg, url, line, col, error) {
    // Note that col & error are new to the HTML 5 spec and may not be 
    // supported in every browser.  It worked for me in Chrome.
    var extra = !col ? '' : '\ncolumn: ' + col;
    extra += !error ? '' : '\nerror: ' + error;

    // You can view the information in an alert to see things working like this:
    console.log("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
    displayMessage("An error occured on the page. Please try releoading the page. If you experience any further issues you can contact me for support.", BAD);

    // TODO: Report this error via ajax so you can keep track
    //       of what pages have JS issues

    var suppressErrorAlert = true;
    // If you return true, then error alerts (like in older versions of 
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
};

$(document).ready(function () {
    $("#table_config").fadeOut(500);
    $("#table_config tbody").empty();
    $(".loading").fadeIn(500);
    executeAsync(function () { handleEvent('GET', null) });
});


// Helper method to display a message on the page.
function displayMessage(message, good) {
    $('#message').text(message);

    if (good == GOOD) {
        $('#message').attr("class", "good");
        $('#message').fadeOut(500);
    } else if (good == BAD) {
        $('#message').attr("class", "bad");
        $('#message').fadeIn(500);
    } else {
        $('#message').attr("class", "okay");
        $('#message').fadeIn(500);
    }
}

function handleEvent(method, options) {
    if (method == 'GET') {
        return getData(USER_NAME);
    } 

    if (method == 'POST') {
        if (options.length != 3)
            return false;
        return postData(USER_NAME, options[0], options[1], options[2]);
    }

    if (method == 'DELETE') {
        if (options.length != 1)
            return false;

        return deleteData(USER_NAME, options[0]);
    }

    return false;
}

function getData(user) {
    // show loading
    $(".loading").fadeIn(500);

    $.ajax({
        url: 'https://bestclipoftheweek-1xxoi1ew.rhcloud.com/',
        type: "GET",
        timeout: 5000,
        data: {
            username: user
        },
        success: displayData,
        error: showResultStatus
    });

    return true;
}


function postData(user, term, color, enabled) {

    $.ajax({
        url: 'https://bestclipoftheweek-1xxoi1ew.rhcloud.com/',
        type: "POST",
        timeout: 5000,
        data: {
            method: 'POST',
            username: user,
            term: term,
            color: color,
            enabled: enabled
        },
        success: showResultStatus,
        error: showResultStatus
    });

    return true;
}


function deleteData(user, term) {
    $.ajax({
        url: 'https://bestclipoftheweek-1xxoi1ew.rhcloud.com/',
        type: "POST",
        timeout: 5000,
        data: {
            method: 'DELETE',
            username: user,
            term: term
        },
        success: showResultStatus,
        error: showResultStatus
    });

    return true;
}

function showResultStatus(msg) {
    $(".loading").fadeOut(500);
    if (!msg) {
        displayMessage("No message to display", GOOD)
    }
    // msg.status
    // msg.responseText
    // msg. statusText
    if (msg.hasOwnProperty("status")) {
        if (msg.status != 200)
            displayMessage("Error: " + msg.status + " - " + msg.statusText + ". " + msg.responseText, BAD);
        else
            displayMessage("Success: " + msg.status + " - " + msg.statusText + ". " + msg.responseText, GOOD);
    } else
        displayMessage("Success", GOOD);
}

function displayData(msg) {
    if (!msg)
        return false;

    showResultStatus(msg);
    $("#table_config").fadeIn(500);

    if (!msg.hasOwnProperty("status")) {
        var rows = msg.split("<br/>");
        createTableRow("   ", 'add');
        for (i = 0; i < rows.length; i++) {
            createTableRow(rows[i], 'delete');
        }
        jscolor.init();
    }
}


function createTableRow(row, buttonType, before) {
    var row_dom = $("<tr></tr>");
    var case_delete = false;
    
    if (buttonType.toUpperCase() == 'DELETE')
        case_delete = true;


    if (case_delete) {
        cols = row.split(" ");
    } else {
        cols = ["", getRandomColor(), "1"];
        row_dom.addClass("tr_add");
    }
    if (cols.length == 3) {

        if (case_delete) {
            // delete button (last column)
            var button = $("<button class='button_delete'>Delete</button>");
            button.click(function () {
                $(this).prop('disabled', true);
                var parent = $(this).closest("tr");
                var vterm = parent.find(".input_term").val();
                handleEvent('DELETE', [vterm]);
                $(this).closest('tr').find("td").fadeOut(1000, function () { $(this).parent().remove(); }); // There is a problem in jQuery when hiding trs. This is the current workaround
            });
        } else {
            // add button (last column)
            var button = $("<button class='button_delete'>Add</button>");
            button.click(function () {
                $(this).prop('disabled', true);
                var parent = $(this).closest("tr");
                var vterm = parent.find(".input_term").val();
                var vcolor = parent.find(".color").val();
                var venabled = 'no';
                if (parent.find(".checkpox_enabled").prop('checked'))
                    venabled = 'yes';

                if (vterm.length == 0) {
                    // handle invalid cases
                    parent.find(".input_term").css("border", "1px solid red");
                    parent.find(".input_term").focus();
                    return;
                }

                // library ensures us the color is always valid
                parent.find(".input_term").css("border", "none");
                handleEvent('POST', [vterm, vcolor, venabled]);

                // clear all inputs
                parent.find(".input_term").val("");
                parent.find(".color").val(getRandomColor());
                parent.find(".checkpox_enabled").prop('checked', true);
                $(this).prop('disabled', false).addClass('disabled');
                $(this).removeClass('disabled');

                // add row to table (in sorted order)
                if (venabled == 'yes')
                    venabled = 1;
                else
                    venabled = 0;

                var toinsert = true;
                $("#table_config > tbody > tr").each(function () {
                    var item = $(this).find(".input_term").val();
                    if (item && vterm.toUpperCase() < item.toUpperCase()) {
                        if (toinsert) {
                            createTableRow(vterm + " " + vcolor + " " + venabled, 'delete', this);
                            toinsert = false;
                        }
                    }
                });
                if (toinsert) {
                    createTableRow(vterm + " " + vcolor + " " + venabled, 'delete');
                }
                jscolor.init();
            });
        }
        button = $("<td class='center'></td>").append(button);

        // enabled checkbox
        enabled = $("<input type='checkbox' class='checkpox_enabled'></input>");
        if (cols[2] == true)
            $(enabled).prop('checked', true); // Unchecks it
        else
            $(enabled).prop('checked', false); // Unchecks it

        if (case_delete)
            enabled.click(function () {
                var parent = $(this).closest("tr");
                var vterm = parent.find(".input_term").val();
                var vcolor = "#" + parent.find(".color").val();
                var venabled = 'no';
                if ($(this).prop('checked'))
                    venabled = 'yes';
                handleEvent('POST', [vterm, vcolor, venabled]);
            });
        enabled = $("<td class='center'></td>").append(enabled);

        // term input
        term = $("<input placeholder='Add a term' class='input_term' type='text' maxlength='50'></input>");
        if (case_delete)
            term.prop("disabled", "disabled");
            term.change(function () {
                var parent = $(this).closest("tr");
                var vterm = $(this).val().trim();
                var vcolor = "#" + parent.find(".color").val();
                var venabled = 'no';
                if (parent.find(".checkpox_enabled").prop('checked'))
                    venabled = 'yes';
                    
                if (vterm.length == 0) {
                    // handle invalid cases
                    $(this).css("border", "1px solid red");
                    $(this).focus();
                } else {
                    $(this).css("border", "none");
                    handleEvent('POST', [vterm, vcolor, venabled]);
                }
            });

        $(term).val(cols[0]);
        term = $("<td></td>").append(term);

        //color
        // handled by external lib JSColor
        color = $("<input class='color' value='" + cols[1] + "' />");
        if (case_delete)
            color.change(function () {
                var parent = $(this).closest("tr");
                var vterm = parent.find(".input_term").val();
                var vcolor = "#" + $(this).val();
                var venabled = 'no';
                if (parent.find(".checkpox_enabled").prop('checked'))
                    venabled = 'yes';

                // library ensures us the color is always valid
                $(this).css("border", "none");
                handleEvent('POST', [vterm, vcolor, venabled]);
            });
        color = $("<td></td>").append(color);

        row_dom.append(term);
        row_dom.append(color);
        row_dom.append(enabled);
        row_dom.append(button);
        row_dom.find("td").fadeIn(1000);
    }

    if (before) {
        $(before).before(row_dom);
    } else {
        $("#table_config tbody").append(row_dom);
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function executeAsync(func) {
    setTimeout(func, 0);
}