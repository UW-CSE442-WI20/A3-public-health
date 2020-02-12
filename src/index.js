const d3 = require('d3');
const bar = require("./bar.js");
const slider = require("./slider.js");

const DEBUG_MODE = true;

// turn off console.log when not in debug mode
if (!DEBUG_MODE) {
    var console = {};
    console.log = function(){};
    var alert = function(){};
    window.console = console;
    window.alert = alert;
}

slider();
bar();

