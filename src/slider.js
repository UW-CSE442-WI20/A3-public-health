module.exports = () => {
    const bar = require("./bar.js");
    const MONTHS = ["January", "February", "March", "April",
                    "May", "June", "July", "August", "September",
                    "October", "November", "December"];
    const YERAS = ["2016", "2017", "2018"]

    // add the label
    label = document.getElementById("time-slider-label");
    labels = ["2016", "2017", "2018", "2018 Dec."];
    for (let i = 0; i < 36; i++) {
        div = document.createElement("div");
        if (i === 0) {
            div.innerText = labels[0]
        } else if (i === 12) {
            div.innerText = labels[1]
        } else if (i === 24) {
            div.innerText = labels[2]
        }
        label.appendChild(div);
    }

    // create the tick mark
    list = document.getElementById("steplist");
    for (let i = 0; i < 36; i++) {
        opt = document.createElement("option");
        opt.innerText = i;
        list.appendChild(opt);
    }

    // behavior when slider changes
    slider = document.getElementById("time-slider");
    function update() {
        let sliderValue = this.value;
        let month = sliderValue % 12;
        let year = Math.floor(sliderValue / 12);
        document.getElementById("month-year").innerText = `${MONTHS[month]} ${YERAS[year]}`;

        // clear the old graph and legend
        svgs = document.querySelectorAll("svg");
        bar(this.value);
        svgs.forEach(element => {element.remove()});
    }
    slider.addEventListener("input", update);
};