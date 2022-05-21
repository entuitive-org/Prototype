window.addEventListener("load", faf_draw_setup, true);

let graph = null;

function faf_draw_setup() {
    let canvas = document.getElementById("faf_draw");

    graph = new Graph(canvas, [-5, 5], [-5,5]);
    
    g = function(x) {return (Math.pow(x,3) - 9*x)/3;}
    
    // graph.addFunction(g, null, {on: true, text:'y=g(x)', x:3.25});
    
    graph.addPoint(1, -8/3, -1, 0);

    graph.addInteractiveDrawing(g, call, 2);

    function call(x) {
        document.getElementById("fafd-input").value = x;
        faf_calc(x);
    }
}

function faf_draw_point(x,y) {
    graph.addPoint(x, y, -1);
}

function faf_calc(value) {
    // Format input, make sure it's a number and not NaN
    value = parseFloat(value);
    if (value != value) return;

    let html = '';

    html = '\\( \\frac{';
    if (value < 0) html += '(';
    html += Graph.round(value,3);
    if (value < 0) html += ')';
    html += '^3}{3} - 3 \\times ';
    if (value < 0) html += '(';
    html += Graph.round(value,3);
    if (value < 0) html += ')';
    html += '\\)';

    document.getElementById("fafd-line1").innerHTML = html;

    html = '\\( \\frac{';
    html += Graph.round(Math.pow(value, 3),3);
    html += '}{3} - ';
    html += Graph.round(3 * value, 3);
    html += '\\)';

    document.getElementById("fafd-line2").innerHTML = html;

    let y = Math.pow(value,3) / 3 - 3 * value;
    let f = Graph.round(y, 3);
    
    html = '\\(';
    html += f;
    html += '\\)';

    let eq = document.getElementById("fafd-lasteq")
    if (f == y) {
        eq.innerHTML = '\\(=\\)';
    } else {
        eq.innerHTML = '\\( \\approx \\)';
    }

    document.getElementById("fafd-line3").innerHTML = html;

    value = Graph.round(value, 3);
    faf_draw_point(value, y);
    
    html = '\\( (';
    html += value;
    html += ', ';
    html += f;
    html += ') \\)';

    let pt =document.getElementById("faf-point");
    pt.innerHTML = html;

    MathJax.typeset([document.getElementById("fafd-eq"), eq, pt]);

}
