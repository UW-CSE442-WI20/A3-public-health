(() => {
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
        } else if (i === 35) {
            div.innerText = labels[3]
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
    slider.addEventListener("change", function() {
        console.log(this.value)
    });
})()