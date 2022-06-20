let inputs = [];
let outputs = [];

let domain = null;
let range = null;
let func = null;

window.addEventListener("load", dt_setup, true);

// Initial setup
function dt_setup() {
    inputs = document.getElementsByClassName('in');
    outputs = document.getElementsByClassName('out');
    
    domain = document.getElementById('domain');
    range = document.getElementById('range');
    func = document.getElementById('function');

    func.style.visibility = "hidden";
}

function table_update() {
    update_function();
    update_domain_range();
}

function update_domain_range() {
    // Get domain/range from table
    let dom = [];
    let ran = [];
    for (i = 0; i < inputs.length; i++) {
        dom[i] = inputs[i].value;
        ran[i] = outputs[i].value;
    }
    dom = new Set(dom);
    ran = new Set(ran);

    // Update the paragraphs
    let text = 'The domain of this function is \\( \\lbrace';
    for (element of dom) {
        text += element;
        text += ', ';
    }
    text = text.slice(0, -2);
    text += '\\rbrace \\)'

    domain.innerHTML = text;

    text = 'The range of this function is \\( \\lbrace';
    for (element of ran) {
        text += element;
        text += ', ';
    }
    text = text.slice(0, -2);
    text += '\\rbrace \\)'

    range.innerHTML = text;
}

function update_function() {
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
    // Update the messages accordingly
    xs = new Set(xs);
    if (xs.size > 0) {
        func.style.visibility = "visible";
        domain.style.visibility = "hidden";
        range.style.visibility = "hidden";
    } else {
        func.style.visibility = "hidden";
        domain.style.visibility = "visible";
        range.style.visibility = "visible";
    }   
}