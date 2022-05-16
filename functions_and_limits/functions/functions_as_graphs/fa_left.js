window.addEventListener("load", fa_left_setup, true);

function fa_left_setup() {
    let canvas = document.getElementById("fa_left");
    
    let graph = new Graph(canvas, [-6, 6], [-3, 9]);

    x = function(t) {return 5 * Math.cos(t)};
    y = function(t) {return 5 * Math.sin(t)};
    graph.addParametric(x, y, [0, Math.PI]);
    graph.addInteractiveFunctionHeight(updateCaption);

    function updateCaption (a,fa) {
        a = a[0];
        fa = fa[0];
        let caption = document.getElementById('fa_left_caption');
        let html = '\\( f(';
        a = Graph.round(a, 1);
        html += a;
        html += ') = ';
        if (fa.length == 1) {
            fa = Graph.round(fa[0], 1);
        } else {
            fa = 'undefined';
        }
        html += fa;
        html += '\\)';
        caption.innerHTML = html;
        MathJax.typeset([caption]);
    }
}
