/*

This code generates the left and right side navigation on pages from section.map and chapter.map,
as well as the "Next: ..." link at the bottom of the page.

The page just needs the following code:

<div id="left-nav">
</div>

<div id="right-nav">
</div>

<div id="next">
</div>

and this script will populate them automatically

*/

window.addEventListener("load", maps, true);

// Clean strings, things like whitespace and & symbols cause errors
function clean(string) {
    string = string.trim();
    string = string.replace('&amp;', '&');
    return string
}

function maps() {

    var current = document.getElementById("title").innerHTML;
    current = clean(current);
    
    var chapter = '';
    var section = '';
    
    // Get the section map
    fetch('../../section.map')
        .then(response => response.text())
        .then((data) => {
            right_map(data)
        })
    
    // Get the chapter map
    fetch('../../../chapter.map')
        .then(response => response.text())
        .then((data) => {
            left_map(data);
        })
    
    function right_map (text) {
        // Fill out the right-side navigation HTML
        var section_map = parse_map(text);
        var html = map_to_html_right(section_map);
        document.getElementById("right-nav").innerHTML = html;
    }

    function left_map (text) {
        // Fill out the left-side navigation HTML
        var section_map = parse_map(text);
        var html = map_to_html_left(section_map, false);
        document.getElementById("left-nav").innerHTML = html;
    }
    
    function map_to_html_left(map) {
        // For the left side, dealing with chapters instead of sections
        var html = '<ul class="nav">';
        var url = '';
        var course = '';

        for (line in map) {
            html += '<li>';
            switch (typeof(map[line])) {
                case 'string':
                    course = map[line];
                    url = chapter_to_url(map[line]);
                    html += '<a href="../' + url + '" title="' + map[line] + '">'
                    html += map[line];
                    html += '</a> </li>';
                    break;
                case 'object':
                    html += '<ul class="nav">';
                    for (sub in map[line]) {
                        if (map[line][sub] == chapter) {
                            html += '<li>';
                            html += map[line][sub];
                            html += '</li>';
                        } else {
                            url = title_to_url(map[line][sub], course);
                            html += '<a href="../' + url + '" title="' + map[line][sub] + '"><li>'
                            html += map[line][sub];
                            html += '</li> </a>';
                        }
                    }
                    html += '</ul>';
                    break;
                }
                html += '</li>';
            }
        html += '</ul>';
        return html;
    }

    function map_to_html_right (map) {
        // Receive an array, turn it into an html list nest
        var html = '<ul class="nav">';
        var url = '';
        var next = '';

        for (line in map) {
            html += '<li>';
            switch (typeof(map[line])) {
                case 'string':
                    section = map[line].trim();
                    if (map[line].trim() == current) {
                        chapter = section;
                        next = '#'; // Trigger for setting actual next
                        html += map[line];
                        html += '</li>';
                    } else {
                        url = title_to_url(map[line], section);
                        if (next == '#') {
                            set_next(map[line], url);
                            next = '';
                        }
                        html += '<a href="' + url + '" title="' + map[line] + '">'
                        html += map[line];
                        html += '</a> </li>';
                    }
                    break;
                case 'object':
                    html += '<ul class="nav">';
                    for (sub in map[line]) {
                        // html += '<li>';
                        if (map[line][sub].trim() == current) {
                            chapter = section;
                            next = '#' // Trigger etc.
                            html += '<li>';
                            html += map[line][sub];
                            html += '</li>';
                        } else {
                        url = title_to_url(map[line][sub], section);
                        if (next == '#') {
                            set_next(map[line][sub], url);
                            next = '';
                        }
                        html += '<a href="' + url + '" title="' + map[line][sub] + '"><li>'
                        html += map[line][sub];
                        html += '</li></a>';
                        }
                    }
                    html += '</ul>';
                    break;
            }
            html += '</li>';
        }
        html += '</ul>';
        return html;
    }

    function set_next(title, url) {
        // Sets the "Next: ..." link at the bottom of the page
        var html = '<a href="' + url + '" title="' + title + '">';
        html += 'Next: ';
        html += title;
        html += '</a>';
        document.getElementById('next').innerHTML = html;
    }

    function chapter_to_url(text) {
        // Only for the chapter title, e.g. "Functions and Limits"
        text = text.toLowerCase();
        text = text.trim();
        text = text.replace(/\s/g, '_');
        text = text.replace(/,/g, '');
        text = text.replace(/&/g, 'and');

        var url = '../../';
        url += text;
        url += '/index.html';
        return url
    }

    function title_to_url(text, section) {
        // Convert a heading like "Functions as Graphs" to a url e.g. '../functions_as_graphs/index.html'
        text = text.toLowerCase();
        text = text.trim();
        text = text.replace(/\s/g, '_');
        text = text.replace(/,/g, '');
        text = text.replace(/&/g, 'and');

        section = section.toLowerCase();
        section = section.trim();
        section = section.replace(/\s/g, '_');
        section = section.replace(/,/g, '');
        section = section.replace(/&/g, 'and');

        var url = '../../';
        url += section;
        url += '/';
        url += text;
        url += '/index.html';
        return url;
    }

    function parse_map (text) {
        // Chop the text into an array of string arrays
        var lines = text.split('\n');
        var index = -1;
        var outer = 0;
        var inner = 0;
        var map = [];
        for (line in lines) {
            if (lines[outer][0] == "-") {
                if (inner == 0){
                    index += 1;
                    map[index] = [];
                }
                map[index][inner] = lines[outer].slice(1);
                inner += 1;
                outer += 1;
            } else {
                index += 1;
                map[index] = lines[outer];
                inner = 0;
                outer += 1;
            }
        }
        return map;
    }

}