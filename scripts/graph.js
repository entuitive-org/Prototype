class Graph {
    static width = 1024;
    static height = 1024;

    static canvasWidth = 256;
    static canvasHeight = 256;

    // Colors
    static colors = {
        base: "#25445b",
        second: "#8d3434",
        third: "#8d7e34",
        complement: "#b58c55",
        black: "#222",
        white: "#eee",
        gray: "#888",
        link: "#66849b",
        interact: "#b58c55",
    }

    // Graph params
    static lineWidth = 12;
    static axisWidth = 8;
    static pointSize = 16;
    static arrowSize = 32;
    static tickLength = 16;
    static font = "64px monospace";
    static textOffset = 64;

    // Calc parameters
    static calc = {
        epsilon: 8*Number.EPSILON,
        segments: 32,
        runs: 1e2,
        h: 1e-3,
    }
    static round(x, digits=0) {
        // Round to 'digits' decimal places
        x *= Math.pow(10, digits);
        x = Math.round(x);
        x /= Math.pow(10, digits);
        return x;
    }

    constructor(canvas, xlim=[-10,10], ylim=[-10,10], independent='x', dependent='y') {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        // Set scaling for graph
        this.xlim = xlim;
        this.ylim = ylim;
        this.xscale = Graph.width / (xlim[1] - xlim[0]);
        this.yscale = -Graph.height / (ylim[1] - ylim[0]);
        this.scale = Math.sqrt(Math.pow(this.xscale,2) + Math.pow(this.yscale,2));

        this.xvar = independent;
        this.yvar = dependent;

        this.canvas.width = Graph.width;
        this.canvas.height = Graph.height;

        this.ctx.translate(-xlim[0] * this.xscale, -ylim[1] * this.yscale);

        this.drawAxes();
        this.labelAxes();

        this.funcs = [];
        this.points = [];
        this.interact = null;
    }

    redraw() {
        // Clear and redraw the graph
        let ctx = this.ctx;
        ctx.clearRect(-this.canvas.width, -this.canvas.height, this.canvas.width*2, this.canvas.height*2);
        if (this.interact) this.interact.draw();
        this.drawAxes();
        this.labelAxes();
        for (let func of this.funcs) {
            func.draw();
        }
        for (let pt of this.points) {
            pt.draw();
        }
    }

    getColor(which=null) {
        // Set color based on order in which the functions are added
        let color = '';
        if (which === null) which = this.funcs.length;
        switch (which) {
            case -1:
                color = Graph.colors.complement;
                break;
            case 0:
                color = Graph.colors.base;
                break;
            case 1:
                color = Graph.colors.second;
                break;
            case 2:
                color = Graph.colors.third;
                break;
            default:
                color = Graph.colors.link;
                break;
        }
        return color;
    }

    translateMousePosition(offsetX, offsetY) {
        // Translate position from 'offset' (canvas position) to graph position
        let x = this.xlim[0] + (offsetX / Graph.canvasWidth) * (this.xlim[1]-this.xlim[0]);
        let y = this.ylim[1] + (offsetY / Graph.canvasHeight) * (this.ylim[0]-this.ylim[1]);
        return {x: x, y: y};
    }

    addInteractiveFunctionHeight(call=null) {
        // Draw a line at the mouse from x-axis to function to y-axis
        // i represents which function to use
        if (call) {
            this.interact = new Interactive(this, 'function height', call);
        } else {
            this.interact = new Interactive(this, 'function height');
        }
        // Assume graph will only have one interactive element at a time
        let graph = this;
        this.canvas.addEventListener("mousemove", function(event) {
            eventHandler(graph, event);
        })
        function eventHandler(graph, event) {
            let pos = graph.translateMousePosition(event.offsetX, event.offsetY);
            graph.interact.updatePosition(pos.x, pos.y);
        }
    }

    addInteractiveDrawing() {
        // Draw the function one point at a time from values sent in by another script
    }
    
    addPoint(x, y, active=0, inactive=0) {
        let pt = new Point(this, x, y, this.getColor(active), this.getColor(inactive));
        if (this.points.length > 0) {
            this.points[this.points.length-1].setInactive();
            this.points[this.points.length-1].draw();
            // this.points = []; // Added to save memory, but maybe it's not necessary
        }
        this.points.push(pt);
        pt.draw();
    }

    addLine(params={m: 0, b: 1}, label=null) {
        // Receives parameters as either {m,b} or {a,b}
        let line = null;
        if (label) {
            line = new Line(this, params, this.getColor(), label);
        } else {
            line = new Line(this, params, this.getColor());
        }
        line.draw();
        this.funcs.push(line);
    }

    addFunction(f, finv=null, label=null) {
        let func = null;
        if (label) {
            func = new Function(this, f, finv, this.getColor(), label);
        } else {
            func = new Function(this, f, finv, this.getColor());
        }
        func.draw();
        this.funcs.push(func);
    }

    addParametric(x, y, t=[0,1], label=null) {
        // Parametric functions x(t), y(t), and the interval t
        let func = new Parametric(this, x, y, t, this.getColor());
        func.draw();

        this.funcs.push(func);
    }

    drawText(text, x, y, xoffset=0, yoffset=0) {
        // Write on the graph at x,y
        let ctx = this.ctx;
        
        x *= this.xscale;
        x += xoffset;

        y *= this.yscale;
        y += yoffset;

        ctx.font = Graph.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        ctx.fillText(text, x, y);
    }

    drawAngledText(text, x, y, theta, offset=0) {
        // Like the name says. Offset is how high above the line, rotated.
        let ctx = this.ctx;
        ctx.rotate(-theta);

        let xr = 0, yr = 0;
        [xr,yr] = this.rotatePoint([x,y], -theta);

        this.drawText(text, xr, yr, 0, offset);
        ctx.rotate(theta);
        ctx.restore();
    }

    labelAxes() {
        // Guess what this does
        let x = this.xlim[1];
        let y = 0;
        this.drawText(this.xvar, x, y, -Graph.textOffset, Graph.textOffset);

        x = 0;
        y = this.ylim[1];
        this.drawText(this.yvar, x, y, -Graph.textOffset, Graph.textOffset);
    }

    drawAxes() {
        let ctx = this.ctx;
        ctx.strokeStyle = Graph.colors.black;
        ctx.fillStyle = Graph.colors.black;
        ctx.lineWidth = Graph.axisWidth;

        // Vertical axis
        this.drawRay(0, this.ylim[0], 0, this.ylim[1]);
        
        // Horizontal axis
        this.drawRay(this.xlim[0], 0, this.xlim[1], 0);

        this.drawTickMarks();
    }

    drawTickMarks() {
        let ctx = this.ctx;
        ctx.strokeStyle = Graph.colors.black;
        ctx.fillStyle = Graph.colors.black;
        ctx.lineWidth = Graph.axisWidth;

        let left = Math.floor(this.xlim[0] + 1);
        let right = Math.ceil(this.xlim[1] - 1);

        let x = 0;
        for (let i = left; i <= right; i++) {
            x = i * this.xscale;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, Graph.tickLength);
            ctx.stroke();
        }
        
        let bottom = Math.floor(this.ylim[0] + 1);
        let top = Math.ceil(this.ylim[1] - 1);

        let y = 0;
        for (let i = bottom; i <= top; i++) {
            y = i * this.yscale;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(-Graph.tickLength, y);
            ctx.stroke();
        }
        
        
    }

    drawRay(x1, y1, x2, y2) {
        // Draw a ray, i.e. line with arrowhead at one end (x2, y2)
        this.drawLinear(x1, y1, x2, y2, ['none', 'arrowhead']);
    }

    drawLine(x1, y1, x2, y2) {
        // Draw a line, i.e. with arrowheads at both ends
        this.drawLinear(x1, y1, x2, y2, ['arrowhead', 'arrowhead']);
    }

    drawLinear (x1, y1, x2, y2, endpoints=['closed', 'closed']) {
    // drawLinear(x1, y1, x2, y2, ray=false, line=false) {
        // Rescale
        x1 *= this.xscale;
        x2 *= this.xscale;
        y1 *= this.yscale;
        y2 *= this.yscale;
        
        // Get ctx for graphing
        let ctx = this.ctx;
        
        // Get the orientation of the line
        let dx = x2 - x1;
        let dy = y2 - y1;

        // Adjust the endpoints
        let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (endpoints[1] != 'none') {
            x2 -= dx / d * (Graph.arrowSize / 2);
            y2 -= dy / d * (Graph.arrowSize / 2);
        }
        if (endpoints[0] != 'none') {
            x1 += dx / d * (Graph.arrowSize / 2);
            y1 += dy / d * (Graph.arrowSize / 2);
        }

        // Draw the line segment
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        switch (endpoints[1]) {
            case 'arrowhead':
                this.drawEnd(x2, y2, 'arrowhead', dx, dy);
                break;
            default:
                this.drawEnd(x2, y2, endpoints[1]);
                break;
        }

        switch (endpoints[0]) {
            case 'arrowhead':
                this.drawEnd(x1, y1, 'arrowhead', -dx, -dy);
                break;
            default:
                this.drawEnd(x1, y1, endpoints[0]);
        }
    }

    drawFunction(f, x1, x2, steps=256, endpoints=['arrowhead', 'arrowhead']) {
        // Draw a continuous function f(x) from x1 to x2
        let ctx = this.ctx;
        ctx.lineWidth = Graph.lineWidth;

        let y1 = f(x1);
        let y2 = f(x2);
        // Get slopes at endpoints
        let dx = (x2 - x1) / steps;
        let dy1 = y1 - f(x1 + dx);
        let dy2 = y2 - f(x2 - dx);

        // Adjust the endpoints
        let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy2, 2));
        if (endpoints[1] != 'none') {
            x2 -= dx / d * (Graph.arrowSize / this.scale);
            y2 -= dy2 / d * (Graph.arrowSize / this.scale);
        }
        d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy1, 2));
        if (endpoints[0] != 'none') {
            x1 += dx / d * (Graph.arrowSize / this.scale);
            y1 -= dy1 / d * (Graph.arrowSize / this.scale);
        }

        let x = x1;
        ctx.beginPath();
        ctx.moveTo(this.xscale*x, this.yscale*f(x));
        for (let i = 0; i <= steps; i++) {
            x = x1 + (i/steps) * (x2-x1);
            ctx.lineTo(this.xscale * x, this.yscale * f(x));
        }
        ctx.stroke();

        // Draw the endpoints
        let dy = [dy1, dy2];
        dx = [-dx, dx];
        x = [this.xscale*x1, this.xscale*x2];
        let y = [this.yscale*y1, this.yscale*y2];
        for (let k of [0,1]) {
            switch (endpoints[k]) {
                case 'closed':
                    this.drawEnd(x[k], y[k], endpoints[k]);
                    break;
                case 'open':
                    this.drawEnd(x[k], y[k], endpoints[k]);
                    break;
                case 'arrowhead':
                    this.drawEnd(x[k], y[k], endpoints[k], this.xscale*dx[k], this.yscale*dy[k]);
                    break;
            }
        }


        //
    }

    drawParametric (x, y, t=[0,1], endpoints=['closed', 'closed'], steps=256) {
        // Functions x(t), y(t), endpoints can be 'closed', 'open', or 'arrowhead'
        let ctx = this.ctx;
        ctx.lineWidth = Graph.lineWidth;

        // Draw the shape in 1024 steps
        let tn = t[0];
        ctx.beginPath();
        ctx.moveTo(this.xscale*x(tn), this.yscale*y(tn));
        for (let i = 0; i <= steps; i++) {
            tn = t[0] + i*((t[1]-t[0])/steps);
            ctx.lineTo(this.xscale*x(tn), this.yscale*y(tn));
        }
        ctx.stroke();

        // Draw the endpoints
        let dx = 0, dy = 0;
        for (let k of [0,1]) {
            switch (endpoints[k]) {
                case 'closed':
                    this.drawEnd(x(t[k]), y(t[k]), endpoints[k]);
                    break;
                case 'open':
                    this.drawEnd(x(t[k]), y(t[k]), endpoints[k]);
                    break;
                case 'arrowhead':
                    dx = x(t[k]) - x(t[k] + t[1-k]/steps);
                    dy = y(t[k]) - y(t[k] + t[1-k]/steps);
                    this.drawEnd(x(t[k]), y(t[k]), endpoints[k], dx, dy);
                    break;
            }
        }
        
    }

    drawEnd (x, y, type='closed', dx=null, dy=null) {
        // If type 'arrowhead', need to provide dx and dy, i.e. orientation at endpoint
        switch (type) {
            case 'closed':
                this.drawPoint(x, y);
                break;
            case 'open':
                this.drawPoint(x, y, true);
                break;
            case 'arrowhead':
                this.drawArrowhead(x, y, dx, dy);
                break;
        }
    }

    drawPoint(x, y, open=false) {
        // Draw point on the graph, i.e. discrete functions or endpoints
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(this.xscale*x, this.yscale*y, Graph.pointSize, 0, 2*Math.PI);
        if (open) {
            ctx.stroke();
        } else {
            ctx.fill();
        }
    }

    drawArrowhead(x, y, dx, dy) {
        // d for denominator (or distance)
        let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        // Don't need the actual angle, just sin/cos
        let cos_theta = dx / d;
        let sin_theta = dy / d;

        // Points of the arrowhead
        let xs = [-Graph.arrowSize/2, Graph.arrowSize/2, -Graph.arrowSize/2];
        let ys = [Graph.arrowSize/2, 0, -Graph.arrowSize/2];

        // Draw the arrowhead shape
        let ctx = this.ctx;
        let xp = 0, yp = 0;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            xp = x + xs[i] * cos_theta - ys[i] * sin_theta;
            yp = y + xs[i] * sin_theta + ys[i] * cos_theta;
            ctx.lineTo(xp, yp);
        }
        ctx.fill();
    }

    rotatePoint(pt=[0,0], theta=0) {
        // Rotate a point about the origin
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        let x = pt[0] * cos - pt[1] * sin;
        let y = pt[0] * sin + pt[1] * cos;
        return [x,y];
    }
}

class Point {
    constructor(graph, x, y, active="#000", inactive="#000") {
        this.graph = graph;
        this.x = x;
        this.y = y;
        this.active = active;
        this.inactive = inactive;
        this.color = active;
    }

    setActive() {
        this.color = this.active;
    }

    setInactive() {
        this.color = this.inactive;
    }

    draw() {
        this.graph.ctx.strokeStyle = this.color;
        this.graph.ctx.fillStyle = this.color;

        this.graph.drawPoint(this.x, this.y);
    }
}

class Line {
    constructor(graph, params={m:0, b:1}, color="#000", label={on: false, text:'y=f(x)', x: 5}) {
        // Store the graph we're drawing on
        this.graph = graph;
        this.label = label;
        
        // Line parameters a/m, b
        this.b = params.b;
        if (typeof params.m !== 'undefined') {
            this.m = params.m;
        } else if (typeof params.a !== 'undefined') {
            this.m = -params.b / params.a
        } else {
            throw 'Missing parameter a or m';
        }

        // Store the color of this line
        this.color = color;
    }

    f(a) {
        return this.m * a + this.b;
    }

    draw() {
        // Draw the line
        this.graph.ctx.strokeStyle = this.color;
        this.graph.ctx.fillStyle = this.color;

        // Draw from edge to edge of the graph. Assumes x1 is left of x2.
        let x1 = this.graph.xlim[0];
        let y1 = this.m * x1 + this.b;
        if (y1 < this.graph.ylim[0]) {
            y1 = this.graph.ylim[0];
            x1 = (y1 - this.b) / this.m;
        } else if (y1 > this.graph.ylim[1]) {
            y1 = this.graph.ylim[1];
            x1 = (y1 - this.b) / this.m;
        }
        let x2 = this.graph.xlim[1];
        let y2 = this.m * x2 + this.b;
        if (y2 > this.graph.ylim[1]) {
            y2 = this.graph.ylim[1];
            x2 = (y2 - this.b) / this.m;
        } else if (y2 < this.graph.ylim[0]) {
            y2 = this.graph.ylim[0];
            x2 = (y2 - this.b) / this.m;
        }

        // Use the method in graph to actually draw the line
        this.graph.drawLine(x1, y1, x2, y2);

        // Add label
        if (this.label.on) {
            this.labelLine(this.label.text, this.label.x);
        }
    }

    labelLine(text='y=f(x)', x) {
        // Label the line with the passed text
        //let x = this.graph.xlim[1] / 2;
        let y = this.m * x + this.b;

        let theta = Math.atan(this.m);
        this.graph.drawAngledText(text, x, y, theta, -Graph.textOffset);

        // Need to update this to take things like the text position as parameters
    }
}

class Function {
    constructor(graph, f, finv=null, color="#000", label={on: false, text: 'y=f(x)', x: 5}) {
        // This class is for continuous functions. Provide the inverse if available.
        this.graph = graph;
        this.label = label;
        this.f = f;
        if (finv) {
            this.finv = finv;
        } else {
            this.finv = Function.solveFinv;
        }
        this.color = color;
    }

    f(a) {
        // Pretty simple, f(a) is part of the class definition
        return this.f(a);
    }

    static solveFinv(x,y) {
        // Solve for f inverse by Newton's method
        let xn = x;
        let fx = 0
        let df = 0;
        for (let i = 0; i < Graph.calc.runs; i++) {
            fx = this.f(xn) - y;
            if (Math.abs(fx) < Graph.calc.epsilon) {
                break;
            }
            df = (this.f(xn + Graph.calc.h) - this.f(xn)) / Graph.calc.h;
            xn -= fx / df;
        }
        return xn;
    }

    draw() {
        this.graph.ctx.strokeStyle = this.color;
        this.graph.ctx.fillStyle = this.color;

        // Similar to Line, adjust the ends x1,y1 and x2,y2 to fit within graph limits
        let x1 = this.graph.xlim[0];
        let y1 = this.f(x1);
        if (y1 < this.graph.ylim[0]) {
            y1 = this.graph.ylim[0];
            x1 = this.finv(x1,y1);
        } else if (y1 > this.graph.ylim[1]) {
            y1 = this.graph.ylim[1];
            x1 = this.finv(x1,y1);
        }
        let x2 = this.graph.xlim[1];
        let y2 = this.f(x2);
        if (y2 < this.graph.ylim[0]) {
            y2 = this.graph.ylim[0];
            x2 = this.finv(x2,y2);
        } else if (y2 > this.graph.ylim[1]) {
            y2 = this.graph.ylim[1];
            x2 = this.finv(x2,y2);
        }
        
        // Call draw method in graph
        this.graph.drawFunction(this.f, x1, x2)

        // Add label
        if (this.label.on) {
            this.labelFunction(this.label.text, this.label.x);
        }
    }

    labelFunction(text, x) {
        let y = this.f(x);
        let dx = Graph.calc.h;
        let dy = this.f(x+dx) - y;

        let theta = Math.atan(dy/dx);
        this.graph.drawAngledText(text, x, y, theta, Graph.textOffset);
    }
}

class Parametric {
    constructor(graph, x, y, t=[0,1], color="#000", endpoints=['closed', 'closed']) {
        // Store the graph we're drawing on. Endpoints can be 'closed', 'open', or 'arrowhead'.
        this.graph = graph;
        
        this.x = x;
        this.y = y;
        this.t = t;
        this.color = color;
        this.endpoints = endpoints;
    }

    f(a) {
        // Find the height of the function at x, by first solving the corresponding t(s) by bisection
        let ts = [];
        let xs = [];
        let segments = Graph.calc.segments;
        let epsilon = Graph.calc.epsilon;
        let t = 0;
        // Divide t into segments and get x(t)-a at the endpoints of each
        for (let i = 0; i <= segments; i++) {
            t = this.t[0] + (i/segments) * (this.t[1]-this.t[0]);
            ts.push(t);
            xs.push(this.x(t)-a);
        }
        // Get zeros of x(t)-a by bisection within each segment
        let left = 0, mid = 0, right = 0;
        let roots = [];
        let iter = 0;
        let fmid = 0;
        let hleft = 0, hright = 0;
        for (let i = 0; i< segments; i++) {
            left = ts[i];
            right = ts[i+1];
            hleft = this.x(left) - a;
            hright = this.x(right) - a;
            if (Math.abs(hleft) < epsilon) {
                // Only check the left end of the first segment
                if (i == 0) {
                    roots.push(left);
                } else {
                    continue;
                }
            }
            if (Math.abs(hright) < epsilon) {
                // Check all right endpoints
                roots.push(right);
                continue;
            }
            if (hleft * hright < 0) {
                while (iter++ < Graph.calc.runs) {
                    mid = (left + right) / 2;
                    fmid = this.x(mid) - a;
                    // console.log('left', left, 'mid', mid, 'right', right); // For debugging
                    if ((Math.abs(fmid)) < epsilon || (right-left) < epsilon) {
                        // Solution found
                        roots.push(mid);
                        break;
                    }
                    // Squeeze
                    if ((hleft * fmid) < 0) {
                        right = mid;
                        hright = fmid;
                    } else if ((hright * fmid) < 0) {
                        left = mid;
                        hleft = fmid;
                    } else {
                        // What to do if neither interval switches?
                        break;
                    }
                }
            }
        }
        // Get the y values for our t(s) where x=a
        let y = null;
        if (roots.length == 1) {
            y = this.y(roots[0]);
        } else if (roots.length > 1) {
            y = [];
            for (let root of roots) {
                y.push(this.y(root));
            }
        }
        return y;
    }

    draw() {
        // Draw the func
        this.graph.ctx.strokeStyle = this.color;
        this.graph.ctx.fillStyle = this.color;

        this.graph.drawParametric(this.x, this.y, this.t, this.endpoints);
    }
}

class Interactive {
    constructor(graph, type='', call=null, round=1) {
        this.graph = graph;
        this.funcs = graph.funcs;
        this.type = type;
        this.call = call;
        this.round = round;
        switch (type) {
            case 'function height':
                this.draw = this.drawFunctionHeight;
                break;
        }
        this.x = 0;
        this.y = 0;
    }

    updatePosition(x, y) {
        this.x = Graph.round(x,this.round);
        this.y = Graph.round(y,this.round);
        // Add a call to "redraw", needs to be added to graph
        this.graph.redraw();
    }

    drawFunctionHeight() {
        let ctx = this.graph.ctx;
        ctx.setLineDash([10,10]);
        // Draw line from x-axis to function to y-axis

        let y = 0;
        let ys = [];
        let yss = [];
        let xs = [];

        // Get xs, ys for all functions
        for (let func of this.funcs) {
            xs.push(this.x);
            y = func.f(this.x);
            switch (typeof(y)) {
                case 'number':
                    ys.push(y);
                    break;
                case 'object':
                    if (!y) break;
                    for (let yi of y) {
                        ys.push(yi);
                    }
                    break;
            }
            yss.push(ys);
            ys = [];
        }

        // Draw lines and labels
        if (xs.length > 1) {
            let ymin = 0, ymax = 0;
            for (ys of yss) {
                for (y of ys) {
                    if (y < ymin) ymin = y;
                    if (y > ymax) ymax = y;
                }
            }
            ctx.strokeStyle = Graph.colors.black;
            ctx.fillStyle = Graph.colors.black;
            this.graph.drawLinear(this.x, 0, this.x, ymin, ['none', 'none']);
            this.graph.drawLinear(this.x, 0, this.x, ymax, ['none', 'none']);

            let a = Graph.round(this.x, 1);
            this.graph.drawText(a, this.x, 0, 0, Graph.textOffset);

            // Draw the horizontals
            for (let i = 0; i < xs.length; i++) {
                let func = this.funcs[i];
                ctx.strokeStyle = func.color;
                ctx.fillStyle = func.color;
                ys = yss[i];
                for (y of ys) {
                    this.graph.drawLinear(this.x, y, 0, y, ['none', 'none']);
        
                    let fa = Graph.round(y, 1)
                    let os = this.x > 0? -Graph.textOffset : Graph.textOffset;
                    this.graph.drawText(fa, 0, y, os, Graph.textOffset);
                }
            }

        } else if (xs.length == 1) {
            ys = yss[0];
            let func = this.funcs[0];
            this.graph.ctx.strokeStyle = func.color;
            this.graph.ctx.fillStyle = func.color;
            for (y of ys) {
                this.graph.drawLinear(this.x, 0, this.x, y, ['none', 'none']);
                this.graph.drawLinear(this.x, y, 0, y, ['none', 'none']);
    
                let fa = Graph.round(y, 1)
                let os = this.x > 0? -Graph.textOffset : Graph.textOffset;
                this.graph.drawText(fa, 0, y, os, Graph.textOffset);
            }
            let a = Graph.round(this.x, 1);
            this.graph.drawText(a, this.x, 0, 0, Graph.textOffset);
        }

        
        this.graph.ctx.setLineDash([]);

        if (this.call) {
            this.call(xs, yss);
        }
    }
}