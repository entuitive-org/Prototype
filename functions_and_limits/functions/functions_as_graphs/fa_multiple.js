window.addEventListener("load", fa_multiple_setup, true);

function fa_multiple_setup() {
    let canvas = document.getElementById("fa_multiple");

    let graph = new Graph(canvas, [-3,3], [-3,3]);

    // f = function(x) {return 1};
    // finv = function(x,y) {return y==1? x : null};
    f = function(x) {return (1/6) * Math.pow(x,3)};
    finv = function(x,y) {return Math.cbrt(6*y)};
    h = function(x) {return x};
    hinv = function(x,y) {return y;}
    g = function(x) {return 0.5 * Math.pow(x,2)};
    ginv = function(x,y) {return x > 0?  Math.sqrt(2*y) : -1 * Math.sqrt(2*y)};

    graph.addFunction(f, finv, {on: true, text:'y=f(x)', x:-1.5});
    graph.addFunction(g, null, {on: true, text:'y=g(x)', x:-1.5});
    graph.addFunction(h, hinv, {on: true, text:'y=h(x)', x:-1.5});

    graph.addInteractiveFunctionHeight(updateF);

    function updateF(a, fa) {
        let captions = ['fa_multiple_f', 'fa_multiple_g', 'fa_multiple_h'];
        let names = ['f', 'g', 'h'];
        let caption = null, html = null, x = null, y = null;
        for (let i = 0; i < captions.length; i++) {
            caption = document.getElementById(captions[i]);
            html = '\\( ' + names[i] + '(';
            x = Graph.round(a[i],1);
            y = fa[i];
            html += x;
            html += ') = ';
            if (y.length == 1) {
                y = Graph.round(y[0], 1);
            } else {
                y = 'undefined';
            }
            html += y;
            html += '\\)';
            caption.innerHTML = html;
            MathJax.typeset([caption]);
        }
    }

}