var last = 0;

function intro_pressed(which) {
    var new_string = ""
    switch (which) {
        case 1:
            new_string = "Banana";
            // document.getElementById("i1").style.border = "4px solid var(--second)"
            break;
        case 2:
            new_string = "8";
            // document.getElementById("i2").style.border = "4px solid var(--second)"
            break;
        case 3:
            new_string = "Z";
            // document.getElementById("i3").style.border = "4px solid var(--second)"
            break;
        case 4:
            new_string = "Green";
            // document.getElementById("i4").style.border = "4px solid var(--second)"
            break;
    }
    fadeIn();
    document.getElementById("intro-out").innerHTML = new_string;
}

var fade;

function fadeIn() {
    opacity = 0;
    document.getElementById("intro-out").style.opacity = opacity;
    fade = setInterval(show, 10);
}

var opacity = 0;

function show() {
    document.getElementById("intro-out").style.opacity = opacity;
    if (opacity > 1) {
        clearInterval(fade)
        document.getElementById("intro-out").style.opacity = 1;
    }
    opacity += 0.025;
}
