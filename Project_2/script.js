var dates = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

var init = false;

var daily     = null;
var hourly    = null;
var currently = null;

var data_maxlow    = 9999;
var data_maxhigh   = -9999;
var data_maxspread = data_maxlow - data_maxhigh;

var date    = new Date();
var hour    = date.getHours()%12;
var minute  = date.getMinutes();

// Simulate time at 5x
setInterval(function () {
    hour   = minute === 60 ? hour + 1 : hour;

    if (hour === 24){
        hour = 1;
    }

    if (minute === 60){
        minute = 1;
    }

    minute = minute === 60 ? 1 : minute + 1;

    $(".time-indicator").text(hour + ":" + ((minute +"").length === 1? "0"+minute: minute));

    var height = (((hour - 1) * 60) + minute)/1440 * 100;
    $(".time-block").css("height", 100- height + "%");

}, 1000/40);

function populate_random() {

    var maxlow    = 70;
    var maxhigh   = 90;
    var maxspread = maxhigh - maxlow;

    for (var i = 1; i < 8; i++) {
        $("#date-" + i + " p").text(dates[i-1]);

        var low = Math.round(maxlow + Math.random()*20);
        var high = Math.round(Math.min(maxhigh, low + Math.random()*10));

        low = low === high? low - 1: low;

        var lowoffset = low  - maxlow;
        var width     = high - low;

        if (i === 1) {
            var t = Math.round(high - Math.random() * width);
            $(".current-temp").fadeOut(300, function () {
                $(".current-temp .first").text(Math.floor(t/10));
                $(".current-temp .second").text(Math.round(t%10));
                $(".current-temp").fadeIn(500);
            });
        }

        $("#bar-" + i + " .bar")
            .css("width", (width/maxspread)*260);
        $("#bar-" + i + " .left")
            .css("margin-left", lowoffset/maxspread*250)
            .text(low);
        $("#bar-" + i + " .right")
            .text(high);
    }
}

function populate_actual() {

    for (var i = 1; i < 8; i++) {
        var now  = daily.data[i];
        var day  = new Date(now.time*1000).getDay();
        var high = Math.round(now.temperatureHigh);
        var low  = Math.round(now.temperatureLow);

        $("#date-" + i + " p").text(dates[day]);

        var lowoffset = low  - data_maxlow;
        var width     = high - low;

        if (i === 1) {
            var t = Math.round(currently.temperature);
            $(".current-temp").fadeOut(300, function () {
                $(".current-temp .first").text(Math.floor(t/10));
                $(".current-temp .second").text(Math.round(t%10));
                $(".current-temp").fadeIn(500);
            });
        }

        $("#bar-" + i + " .bar")
            .css("width", (width/data_maxspread)*260);
        $("#bar-" + i + " .left")
            .css("margin-left", lowoffset/data_maxspread*250)
            .text(low);
        $("#bar-" + i + " .right")
            .text(high);
    }

}


$.getJSON( "data.json", function( data ) {
    init = true;

    daily     = data.daily;
    hourly    = data.hourly;
    currently = data.currently;

    for (var i = 0; i < daily.data.length; i++) {
        var now  = daily.data[i];
        data_maxlow  = Math.min(Math.round(now.temperatureLow), data_maxlow);
        data_maxhigh = Math.max(Math.round(now.temperatureHigh), data_maxhigh);
    }

    data_maxspread = data_maxhigh - data_maxlow;

    populate_actual();

    $(".temp-indicator").text(Math.round(currently.temperature));

    var next = 7;
    for(var i = 0; i < hourly.data.length; i++) {
        var hour = new Date(hourly.data[i].time*1000).getHours();

        if(hour !== next)
            continue;

        var temperature =  Math.round(hourly.data[i].temperature);

        $("#mor-" + hour + " .temp").text(temperature);

        next += 5;
    }

});
