window.addEventListener("load", fg_intro_setup, true);

function fg_intro_setup() {
    canvas = document.getElementById("fg_intro");
    
    let graph = new Graph(canvas);
    graph.addLine({m: 0.5, b: 1}, {on: true, text: 'y=f(x)', x: 5});
}