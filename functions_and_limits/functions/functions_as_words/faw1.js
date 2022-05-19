function faw1a(value) {
    value = parseFloat(value);
    if (value != value) return;
    
    let html = '';
    if (value == 0) {
        html = 'the instant the ball is thrown,'
    } else {
        html += '\\( ';
        html += Math.abs(value);
        html += ' \\) second';
        html += Math.abs(value) == 1? ' ' : 's ';
        html += value > 0 ? 'after ' : 'before ';
        html += 'the ball is thrown, ';
    }

    let faw = document.getElementById("faw1a");
    faw.innerHTML = html;
    MathJax.typeset([faw]);
}

function faw1b(value) {
    value = parseFloat(value);
    if (value != value) return; // Catch nans
    
    let html = '';
    if (value == 0) {
        html = 'the ball is on the ground.';
    } else {
        html += 'the ball is \\(';
        html += Math.abs(value);
        html += '\\) meters ';
        html += value > 0? 'above ' : 'below ';
        html += 'the ground.';
    }

    let faw = document.getElementById("faw1b");
    faw.innerHTML = html;
    MathJax.typeset([faw]);
}