function faf1(value) {
    value = parseInt(value);
    if (value != value) return;

    let html = '';

    html = '\\( 2 \\times ';
    html += value;
    html += '-1 \\)'

    document.getElementById("faf1-line1").innerHTML = html;

    html = '\\(';
    html += 2 * value;
    html += '-1 \\)';

    document.getElementById("faf1-line2").innerHTML = html;

    html = '\\(';
    html += 2 * value - 1;
    html += '\\)';

    document.getElementById("faf1-line3").innerHTML = html;
}