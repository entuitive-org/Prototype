function faf2(value) {
    value = parseInt(value);
    if (value != value) return;

    let html = '';

    html = '\\( \\frac{ ';
    html += value;
    html += '^3 - 4 \\times';
    html += value;
    html += '^2 + 7 } {';
    
    html += value;
    html += '^2 + 1}';
    html += '\\)';

    document.getElementById("faf2-line1").innerHTML = html;

    html = '\\( \\frac{ ';
    html += Math.pow(value, 3);
    html += '-4 \\times';
    html += Math.pow(value, 2);
    html += '+7 }{ ';

    html += Math.pow(value, 2);
    html += '+1}';
    html += '\\)';

    document.getElementById("faf2-line2").innerHTML = html;

    html = '\\( \\frac{ ';
    let num = Math.pow(value, 3) - 4*Math.pow(value, 2) + 7;
    html += num;
    html += '} {';
    let den = Math.pow(value, 2) + 1;
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
}