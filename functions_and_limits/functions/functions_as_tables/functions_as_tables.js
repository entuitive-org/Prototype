let inputs = [];
let outputs = [];
let g1 = null;
let g2 = null;
let g3 = null;
let g1out = null;
let g2out = null;
let g3out = null;

window.addEventListener("load", fat_setup, true);

function fat_setup() {
    inputs = document.getElementsByClassName('in');
    outputs = document.getElementsByClassName('out');
    g1 = document.getElementById('g1');
    g2 = document.getElementById('g2');
    g3 = document.getElementById('g3');
    g1out = document.getElementById('g1out');
    g2out = document.getElementById('g2out');
    g3out = document.getElementById('g3out');
}

function fat_update() {
    update_phrase();
    update_outputs();
}

function update_phrase() {
    // Update the "this function g..." paragraph
    //This function \(g\) of the variable \(x\) has a domain of \(\{1, 2, 3, 4, 5, 6, 7\}\) and a range of \(\{1, 2, 4, 8, 16, 32, 64\}\).
    
    // Get the domain and range
    let domain = [];
    let range = [];
    for (i = 0; i < inputs.length; i++) {
        domain[i] = inputs[i].value;
        range[i] = outputs[i].value;
    }
    domain = new Set(domain);
    range = new Set(range);
    
    // Set the domain/range phrase
    let text = 'This function \\(g\\) of the variable \\(x\\) has a domain of \\( \\{';
    for (element of domain) {
        text += element;
        text += ', ';
    }
    text = text.slice(0, -2);
    
    text += '\\} \\) and a range of \\( \\{';
    for (element of range) {
        text += element;
        text += ', ';
    }
    text = text.slice(0, -2);
    text += '\\} \\).';

    document.getElementById('g0').innerText = text;

    // Check for multiple outputs for any single input
    let x = null;
    let y = null;
    let xs = [];
    for (i = 0; i < inputs.length; i++) {
        x = inputs[i].value;
        y = outputs[i].value;
        for (j = i; j < inputs.length; j++) {
            if (inputs[j].value == x) {
                if (outputs[j].value != y) {
                    xs.push(x);
                }
            }
        }
    }

    xs = new Set(xs);
    if (xs.size > 0) {
        let text = 'This table does NOT represent a function. It has multiple outputs for \\(';
        for (x of xs) {
            text += x;
            text += ', ';
        }
        text = text.slice(0, -2);
        text += '\\).';
        
        document.getElementById('g0').innerText = text;
        document.getElementById('gf').innerHTML = '<br><br><br>';
    }
    

}

function update_outputs() {
    // Update the g(a)=... pieces
    let g = [g1, g2, g3];
    let gout = [g1out, g2out, g3out];
    let x = 0;
    let y = null;
    for (i = 0; i < 3; i++) {
        x = g[i].value;
        y = null;
        for (j = 0; j < inputs.length; j++) {
            if (inputs[j].value == x) {
                if (y == null) {
                    y = outputs[j].value;
                } else if (y != outputs[j].value) {
                    y = "undefined";
                }
            }
        }
        if (y == null) {y = "undefined";}
        gout[i].innerText = '\\(' + y + '\\)';
    }
}