window.addEventListener("load", widget_setup, true);

let graph = null;
let canvas = null;

let widgets = 3;
let hours = 2;
let elapsed = 5;

let inputs = null;
let outputs = null;

function widget_setup() {
    table_update();

    canvas = document.getElementById("widgets-graph");
    //graph = new Graph(canvas, [-1, 7.5], [-1, 7.5], 't', 'w');

    reset_graph();
}

function reset_graph() {
    let right = Math.ceil(elapsed) + 1;
    let upper = Math.ceil(right * widgets / hours) + 1;

    graph = new Graph(canvas, [-1, right], [-1, upper], 't', 'w');
    
    function call(xs, ys) {
        if (xs.length == 1) {
            elapsed = xs[0];
            update_outputs();
        }
    }

    graph.addStaircase(hours, widgets, 0, 0, right-0.5);
    graph.addInteractiveFunctionHeight(call);

    update_outputs();
}

function table_update() {
    inputs = document.getElementsByClassName("table_in");
    outputs = document.getElementsByClassName("table_out");

    for (let i = 0; i < inputs.length; i++) {
        if (parseFloat(inputs[i].value) != parseFloat(inputs[i].value)) continue;
        outputs[i].innerHTML = Math.max(Math.floor(widgets / hours * parseFloat(inputs[i].value)), 0);
    }
}

function update_outputs() {
    let html = '\\(';
    html += elapsed;
    html += '\\)';
    let aft = document.getElementById('widget_after');
    aft.innerHTML = html;
    
    html = '\\(';
    html += Math.max(Math.floor(widgets / hours * elapsed), 0);
    html += '\\)';

    let out = document.getElementById('widget_output');
    out.innerHTML = html;

    MathJax.typeset([aft, out]);
    table_update();
}

function update_widgets(value) {
    value = parseFloat(value);
    if (value != value) return;
    if (value < 1) return;
    widgets = value;
    reset_graph();
    table_update();
}

function update_hours(value) {
    value = parseFloat(value);
    if (value != value) return;
    if (value < 1) return;
    hours = value;
    reset_graph();
    table_update();
}

function update_elapsed(value) {
    value = parseFloat(value);
    if (value != value) return;
    if (value < 1) return;
    elapsed = value;
    reset_graph();
    table_update();
}