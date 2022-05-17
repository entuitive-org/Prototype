function faf1(value) {
    value = parseFloat(value);
    if (value != value) return;

    let html = '';

    html = '\\( 2 \\times ';
    if (value < 0) html += '(';
    html += value;
    if (value < 0) html += ')';
    html += '-1 \\)'

    document.getElementById("faf1-line1").innerHTML = html;

    html = '\\(';
    // if (value < 0) html += '(';
    html += 2 * value;
    // if (value < 0) html += ')';
    html += '-1 \\)';

    document.getElementById("faf1-line2").innerHTML = html;

    html = '\\(';
    html += Graph.round(2 * value - 1, 3);
    html += '\\)';

    document.getElementById("faf1-line3").innerHTML = html;
    MathJax.typeset(document.getElementsByClassName("equation"));
}