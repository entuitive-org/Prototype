window.addEventListener("load", interactive_setup, true);

function interactive_setup() {
    canvas = document.getElementById("intervals_interactive");

    let numberline = new Numberline(canvas, [0, 5]);
    numberline.addInteractive([2, [2,4]]);
}