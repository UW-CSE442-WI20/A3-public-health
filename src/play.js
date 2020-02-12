// accepts the interval between each chart month
// the unit is in ms (1s = 1000ms).
module.exports = (interval = 1000) => {
    var playBtn = document.getElementById("play-btn");
    var slider = document.getElementById("time-slider");
    var timer;
    playBtn.addEventListener("click", function() {
        if (timer) { // if playing
            pause();
        } else { // if not playing
            play();
        }
    });

    function play() {
        playBtn.classList.add("pause");
        timer = setInterval(function() {
            if (slider.value == slider.max) {
                slider.value = 0;
                pause();
            } else {
                slider.value = parseInt(slider.value) + 1;
                slider.click();
            }
        }, interval);
    }

    function pause() {
        playBtn.classList.remove("pause");
        clearInterval(timer);
        timer = null;
    }
}