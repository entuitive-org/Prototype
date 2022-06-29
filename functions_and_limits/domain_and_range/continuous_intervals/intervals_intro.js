window.addEventListener("load", int_intro_closed_setup, true);
window.addEventListener("load", int_intro_open_setup, true);

function int_intro_closed_setup() {
    canvas = document.getElementById("intervals_intro_closed")

    let numberline = new Numberline(canvas, [0, 5]);
    numberline.addSet([1, 3, [1,3]]);
}

function int_intro_open_setup() {
    canvas = document.getElementById("intervals_intro_open")

    let numberline = new Numberline(canvas, [0, 5]);
    numberline.addSet([[1, 3]]);
}