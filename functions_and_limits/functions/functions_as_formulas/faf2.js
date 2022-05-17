function faf2(value) {
    value = parseFloat(value);
    if (value != value) return;

    let html = '';

    html = '\\( \\frac{ ';
    if (value < 0) html += '(';
    html += value;
    if (value < 0) html += ')';
    html += '^3 - 4 \\times';
    if (value < 0) html += '(';
    html += value;
    if (value < 0) html += ')';
    html += '^2 + 7 } {';
    
    if (value < 0) html += '(';
    html += value;
    if (value < 0) html += ')';
    html += '^2 + 1}';
    html += '\\)';

    document.getElementById("faf2-line1").innerHTML = html;

    html = '\\( \\frac{ ';
    html += Graph.round(Math.pow(value, 3), 3);
    html += '-4 \\times';
    html += Graph.round(Math.pow(value, 2), 3);
    html += '+7 }{ ';

    html += Graph.round(Math.pow(value, 2), 3);
    html += '+1}';
    html += '\\)';

    document.getElementById("faf2-line2").innerHTML = html;

    html = '\\( \\frac{ ';
    let num = Graph.round(Math.pow(value, 3) - 4*Math.pow(value, 2) + 7, 3);
    html += num;
    html += '} {';
    let den = Graph.round(Math.pow(value, 2) + 1, 3);
    html += den;
    html += '} \\)';

    document.getElementById("faf2-line3").innerHTML = html;

    html = '\\(';
    html += Graph.round(num/den, 3);
    html += '\\)';

    if (Graph.round(num/den, 3) == (num/den)) {
        document.getElementById("faf2-lasteq").innerHTML = '\\(=\\)';
    } else {
        document.getElementById("faf2-lasteq").innerHTML = '\\( \\approx \\)';
    }

    document.getElementById("faf2-line4").innerHTML = html;

    MathJax.typeset(document.getElementsByClassName("equation"));
}