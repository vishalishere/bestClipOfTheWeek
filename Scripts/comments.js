﻿/*
 * Justin Robb
 * 4/10/15
 * Best Clip of the Week Application
 * Index (home) page
 */

// Variables
var startTime, endTime;
var overallCount = 0;
var fetchID = 0;
var voters = new Array();


window.onerror = function (msg, url, line, col, error) {
    var extra = !col ? '' : '\ncolumn: ' + col;
    extra += !error ? '' : '\nerror: ' + error;
    console.log("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
    displayMessage("An error occured on the page. Please try releoading the page. If you experience any further issues you can contact me for support.", BAD);
    fetchID++;
    var suppressErrorAlert = true;
    return suppressErrorAlert;
};

$(document).ready(function () {
    // tool-tips
    Utility.configureTooltipForPage('comments');


    // executes when HTML-Document is loaded and DOM is ready
    $("#fetch").click(fetchResults);
    $("#collapse").click(function () {
        if ($(this).hasClass("expanded")) {
            $("#userSpace").slideUp("slow", function () {
                $("#userSpace").fadeOut(500);
                $("#collapse").removeClass("expanded");
                $("#collapse").addClass("collapsed");
            });
        } else {
            $("#userSpace").slideDown("slow", function () {
                $("#userSpace").fadeIn(500);
                $("#userSpace .loading").fadeOut(500);
                $("#collapse").removeClass("collapsed");
                $("#collapse").addClass("expanded");
            });
        }
    });

    $("#a_index").prop("href", "index.html?username=" + urlParams['username'] + "&token=" + urlParams['token'] + "&version=" + VERSION);
    $("#a_config").prop("href", "config.html?username=" + urlParams['username'] + "&token=" + urlParams['token'] + "&version=" + VERSION);
    $("#a_about").prop("href", "about.html?username=" + urlParams['username'] + "&token=" + urlParams['token'] + "&version=" + VERSION);
    $("#a_quick").prop("href", "quick.html?username=" + urlParams['username'] + "&token=" + urlParams['token'] + "&version=" + VERSION);

    // clean up
    $("input[type='checkbox']").prop('disabled', false);
    $("#h2_comments").html('0');
    $("#voters").children().filter(":not(.error)").remove();
    $("#stats_group").children().filter(":not(.error, .loading)").remove();

    // start off hiding errors, will be shown as they crop up
    $(".error").fadeOut(500);
    $(".loading").fadeIn(500);
    $("#voters .error").fadeIn(500);
    
    // hide all sections (will show one at a time as it completes
    $("#results").fadeOut(500);

    //reset
    overallCount = 0;
    voters = new Array();
    toggleVoters($("#checkbox_voters"), false);
    
    //  populate list
    Utility.populateBestOfTheWeek($("#select_bestOfTheWeek"),
    function success(videoHistoryStats) {
        $("#select_bestOfTheWeek .loading").fadeOut(500);
    },
    function error(x, t, m) {
        $("#select_bestOfTheWeek").children().filter(":not(.error, .loading)").remove();
        $("#select_bestOfTheWeek .loading").fadeOut(500);
        $("#select_bestOfTheWeek .error").fadeIn(500);
    });
});

////////////////////////////////// FUNCTIONS ////////////////////////////////

function addUrlToInput(url, elt) {
    if ($(elt).hasClass("selected")) {
        $(elt).removeClass("selected");
        $("#input_video").val("");
        return true;
    }

    $("#select_bestOfTheWeek .selected").removeClass("selected");
    $(elt).addClass("selected");

    $("#input_video").val(url);
}

function toggleVoters(cb, manual) {

    if (manual) {
        //$("#checkbox_comments").prop('checked', false);
        //toggleComments($("#checkbox_comments"), false);
    }

    if (cb.prop('checked')) {
        $("#voters").fadeIn(500);
    } else {
        $("#voters").fadeOut(500);
    }
}

function fetchResults() {
    // clean up
    $("input[type='checkbox']").prop('disabled', false);
    $("#h2_comments").html('0');
    $("#voters").children().filter(":not(.error)").remove();
    $("#stats_group").children().filter(":not(.error, .loading)").remove();

    // start off hiding errors, will be shown as they crop up
    $(".error :not(#userSpace .error)").fadeOut(500);
    $("#voters .error").fadeIn(500);

    // starting off showing all loading images, will hide as they load
    $(".loading :not(#userSpace .loading)").fadeIn(500);
    
    // hide all sections (will show one at a time as it completes
    $("#results").fadeOut(500);

    //reset
    overallCount = 0;
    voters = new Array();
    toggleVoters($("#checkbox_voters"), false);

    // Start
    $("#collapse").click();
    $("#results").slideDown("slow");

    fetchID++;
    startTime = new Date().getTime();

    Utility.displayMessage('Processing query...please wait', OKAY);
    var id = Utility.grabVideoId();
    Utility.delayAfter(function () { getVideoStats(id, fetchID); }, 500);
}

function getVideoStats(id, currFetchID) {
    if (currFetchID != fetchID)
        return;

    if (!id) {
        // no results
        $("#stats .loading").fadeOut(500);
        $("#stats .error").fadeIn(500);
        Utility.displayMessage("No results found for video with ID='" + id + "'.", OKAY);
        return;
    }


    var title, description, thumbUrl, thumbW, thumbH, viewCount, likeCount, dislikeCount, favoriteCount, commentCount;

    var url = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=" + id + "&maxResults=1"

    Utility.makeAsyncYouTubeAjaxRequest(url, null,
       function success(response) {
        if (response.pageInfo.totalResults > 0) {
            // snippet
            title = response.items[0].snippet.title;
            description = response.items[0].snippet.description;
            thumbUrl = response.items[0].snippet.thumbnails.high.url;
            thumbW = response.items[0].snippet.thumbnails.high.width;
            thumbH = response.items[0].snippet.thumbnails.high.height;


            // stats
            viewCount = response.items[0].statistics.viewCount;
            likeCount = response.items[0].statistics.likeCount;
            dislikeCount = response.items[0].statistics.dislikeCount;
            favoriteCount = response.items[0].statistics.favoriteCount;
            commentCount = response.items[0].statistics.commentCount;

            // construct html
            var image = $("<img id='img_thumb' src='" + thumbUrl + "' alt='" + title + "'>");

            title = $("<h3><a href='https://www.youtube.com/watch?v=" + id + "'>" + title + "</a></h3>");
            description = $("<h3 class='hidden'>" + description + "</h3>");

            viewCount = $("<p>Views: " + viewCount + "</p>");
            likeCount = $("<p>Likes: " + likeCount + "</p>");
            dislikeCount = $("<p>Dislikes: " + dislikeCount + "</p>");
            favoriteCount = $("<p>Favorites: " + favoriteCount + "</p>");
            commentCount = $("<p>Comments: " + commentCount + "</p>");
            var videoStats = $("<div id='div_video_stats'></div>");
            videoStats.append(viewCount).append(likeCount).append(dislikeCount).append(favoriteCount).append(commentCount);

            // add to DOM
            $("#stats > .error").fadeOut(500);
            $("#stats_group").append(title).append(description).append(image)
            $("#stats_group").append(videoStats);
            $("#stats_group .loading").fadeOut(500);
            Utility.delayAfter(function () { loadComments(1, "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=" + id + "&maxResults=" + 20, currFetchID) });

        } else {
            // no results
            $("#stats .loading").fadeOut(500);
            $("#stats .error").fadeIn(500);
            Utility.displayMessage("No results found for video with ID='" + id + "'.", OKAY);
            return;
        }
    }, function (x,t,m) {
        $("#stats .loading").fadeOut(500);
        $("#stats .error").fadeIn(500);
        Utility.displayMessage('Error loading stats', BAD);
    });
}

function loadComments(count, url, currFetchID) {
    if (currFetchID != fetchID)
        return;

    Utility.makeAsyncYouTubeAjaxRequest(url, null, 
           function success(data) {
            if (currFetchID != fetchID)
                return;
  
            nextUrl = "";
            if (data["nextPageToken"] && data["nextPageToken"].length > 0) {
                nextUrl = url;
                if (nextUrl.indexOf("pageToken") > 0) {
                    nextUrl = nextUrl.replace(/pageToken=.*$/, "pageToken=" + data["nextPageToken"]);
                } else {
                    nextUrl += "&pageToken=" + data["nextPageToken"];
                }
            }

            if (nextUrl != "")
                Utility.delayAfter(function () { loadComments(count + data.pageInfo.resultsPerPage, nextUrl, currFetchID) });

            $.each(data["items"], function (key, val) {
                var googleID = val.snippet.topLevelComment.snippet.authorGoogleplusProfileUrl;
                var replyCt = val.snippet.totalReplyCount;
                var commentID = val.id;

                parseComment(val.snippet.topLevelComment.snippet.textDisplay, currFetchID, val.snippet.topLevelComment.snippet.authorDisplayName);

                // find replies
                if (replyCt > 0) {
                    loadCommentReplies(val.snippet.topLevelComment.snippet.textDisplay, commentID, 1, "", currFetchID);
                }

                $("#h2_comments").html(count);
                count++;
            });

            if (!nextUrl) {
                Utility.displayMessage('Completed query.', GOOD);
                endTime = new Date().getTime();
                var time = (endTime - startTime) / 1000.00;
                console.log('Execution time: ' + time + " seconds");
            }
           }, function error(x, t, m) {
               if (currFetchID != fetchID)
                   return;

               Utility.displayMessage('Issue retrieving comments.', BAD);

               // try again
               loadComments(count, url, currFetchID);
        });
}

function loadCommentReplies(id, count, pageToken, currFetchID) {
    if (currFetchID != fetchID)
        return;

    if (pageToken == "")
        url = "https://www.googleapis.com/youtube/v3/comments?part=snippet&id=" + id;
    else
        url = "https://www.googleapis.com/youtube/v3/comments?part=snippet&id=" + id + "&pageToken=" + pageToken;

    Utility.makeAsyncYouTubeAjaxRequest(url, null, 
        function success(data) {
            if (currFetchID != fetchID)
                return;

            var nextPageToken = "";

            if (data["nextPageToken"]) {
                nextPageToken = data["nextPageToken"];
                Utility.delayAfter(function () { loadCommentReplies(commentParent, id, count + data.pageInfo.resultsPerPage, nextPageToken, currFetchID) });
            }

            $.each(data["items"], function (key, val) {
                parseComment(val.snippet.textDisplay, currFetchID, val.snippet.authorDisplayName);
                count++;
            });
        }, function error(x, t, m) {
            if (currFetchID != fetchID)
                return;

            Utility.displayMessage('Issue retrieving replies.', BAD);
    });
}

function parseComment(comment, currFetchID, author) {
    if (currFetchID != fetchID)
        return;

    if (voters.indexOf(author) < 0) {
        voters.push(author);
        $("#voters .error").fadeOut(500);
        Utility.addToSortedList("voters", author);
    }

    overallCount++;
}