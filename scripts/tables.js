/*
Script to generate tables rapidly
Enclose parameters with <div class="table"></div>
First line should be either "vertical" or "horizontal"
Each line (including first) should end in "//"
Elements should be separated by a "/"
No limit to number of rows/columns
e.g. a vertically-oriented table:

<div class="table">
    vertical//
    x/ y//
    1/ 1//
    2/ 4//
    3/ 9//
    4/ 16//
</div>

e.g. a horizontally-oriented table:

<div class="table">
    horizontal//
    t/ 0/ 1/ 2/ 3/ 4//
    d(t)/ 0/ 5/ 20/ 45/ 80//
    v(t)/ 0/ 10/ 20/ 30/ 40//
</div>

The headers here are t, d(t), and v(t) in the first column.

To use html for any entry, use [] in place of <>, and | in place of /

e.g. [span] text [|span]

*/

window.addEventListener("load", tables, true);

function tables() {
    var tables = document.getElementsByClassName("table");

    for (var table of tables){
        set_table(table);
    }

    function set_table(table) {
        var inputs = table.innerText;
        inputs = inputs.split('//');
        switch (inputs[0]){
            case "vertical":
                vertical_table(table, inputs);
                break;
            case "horizontal":
                horizontal_table(table, inputs);
                break;
        }
    }

    function vertical_table(table, inputs) {
        var headers = inputs[1].trim().split('/');
        var data = inputs.slice(2, -1);
        
        // Create the table
        var html = '<table class="vertical">\n';
        html += '<tr>'
        for (var header of headers) {
            html += '<th>';
            html += check_entry(header);
            html += '</th>';
        }
        html += '</tr>\n'
        for (let line of data) {
            html += '<tr>';
            let entries = line.trim().split('/');
            for (var entry of entries) {
                html += '<td>';
                html += check_entry(entry);
                html += '</td>';
            }
            html += '</tr>\n';
        }
        html += '</table>';
        table.innerHTML = html;
    }

    function horizontal_table(table, inputs) {
        var data = inputs.slice(1, -1);
        
        // Create the table
        var html = '<table class="horizontal">\n';
        for (var line of data) {
            html += '<tr>';
            line = line.trim().split('/');
            for (j = 0; j < line.length; j++) {
                html += (j==0)? '<th>' : '<td>';
                html += check_entry(line[j]);
                html += (j==0)? '</th>' : '</td>';
            }
            html += '</tr>\n';
        }
        html += '</table>';
        table.innerHTML = html;
    }

    function check_entry(text) {
        text = text.replace(/\[/g, '<');
        text = text.replace(/\]/g, '>');
        text = text.replace(/\|/g, '\/');
        return text;
    }
}