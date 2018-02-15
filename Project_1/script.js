var date    = new Date();
var hour    = date.getHours()%12;
var minute  = date.getMinutes();
var reverse = false;

// Simulate time at 12x
setInterval(function () {
    hour   = minute === 60 ? hour + 1 : hour;

    if (hour === 13){
        $(".time-block").css("width", "0%");
        hour = 1;
    }

    if (minute === 60){
        $(".time-row").css(reverse ? "bottom" : "top", "");

        reverse = !reverse;
        minute = 1;
    }

    minute = minute === 60 ? 1 : minute + 1;

    // Sketch 1
    $("#plot1 h1").text(hour);
    $("#plot1 h3").text(minute);

    // Sketch 2
    $("#time-block-" + hour).css("width", 100*minute/60 + "%");

    // Sketch 3
    $(".time-bar").css("left", 95*hour/12 + "%");
    $(".time-row").css(reverse ? "bottom" : "top", 100*minute/60 + "%");

}, 5*1000/60);

var timeBlocks = "";

for (var i = 0; i < 12; i++) {
    timeBlocks += "<div id='time-block-"+(i+1)+"' class='time-block'></div>";
}

document.getElementById("plot2").innerHTML = timeBlocks;

setHour(hour);

function setHour(hour) {
    for (var i = 1; i < hour; i++) {
        $("#time-block-" + i).css("width", "100%");
    }
}