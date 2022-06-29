/*

Utility for drawing number lines with points and open or closed intervals.

For closed intervals, use an open interval and the endpoints.

When drawing intervals and points, pass an array of numbers and 2-element arrays.
An array of 2 represents an open interval.
A number represents a point (closed).

*/

class Numberline {
    static width = 1024;
    static height = 256;

    static canvasWidth = 256;
    static canvasHeight = 64;

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

    // Drawing params
    static lineWidth = 24;
    static axisWidth = 8;
    static pointSize = 24;
    static pointThickness = 8;
    static arrowSize = 32;
    static tickLength = 16;
    static font = "64px monospace";
    static textOffset = 128;
    
    // Force array to be read as floats
    static parseArray(array) {
        for (let i = 0; i < array.length; i++) {
            array[i] = parseFloat(array[i]);
            return array;
        }
    }

    constructor(canvas, xlim=[-10,10], independent='x') {
        // Get canvas and context
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        // Get limits and set scale
        this.lim = Numberline.parseArray(xlim);
        this.scale = Numberline.width / (xlim[1] - xlim[0]);

        // Set variable name
        this.var = independent;

        // Size canvas
        this.canvas.width = Numberline.width;
        this.canvas.height = Numberline.height;

        // Center the numberline
        this.ctx.translate(-xlim[0] * this.scale, Numberline.height / 2);

        // Draw and label axes
        this.drawAxes();

        // Placeholders for intervals and points
        this.points = [];
        this.intervals = [];
        this.interact = null;

        // Subscription
        this.observers = [];
        let numberline = this;
        for (let type of ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove', 'mouseover']) {
            this.canvas.addEventListener(type, (event) => {
                numberline.broadcast(event);
            })
        }
    }

    subscribe(obj) {
        this.observers.push(obj);
    }

    unsubscribe(obj) {
        this.observers = this.observers.filter((subscriber) => subscriber !== obj);
    }

    broadcast(data) {
        this.observers.forEach((subscriber) => subscriber.handleEvent(data));
    }

    drawAxes() {
        let ctx = this.ctx;
        ctx.strokeStyle = Numberline.colors.black;
        ctx.fillStyle = Numberline.colors.black;
        ctx.lineWidth = Numberline.axisWidth;

        let left = this.lim[0] * this.scale + Numberline.arrowSize / 2;
        let right = this.lim[1] * this.scale - Numberline.arrowSize / 2;

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(left, 0);
        ctx.lineTo(right, 0);
        ctx.stroke();

        // Points of the arrowhead
        let xs = [-Numberline.arrowSize / 2, Numberline.arrowSize / 2, -Numberline.arrowSize / 2];
        let ys = [Numberline.arrowSize / 2, 0, -Numberline.arrowSize / 2];
        let xp = 0, yp = 0;
        // Right arrowhead
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            xp = right + xs[i];
            yp = ys[i];
            ctx.lineTo(xp, yp)
        }
        ctx.fill();
        // Left arrowhead
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            xp = left - xs[i];
            yp = ys[i];
            ctx.lineTo(xp, yp)
        }
        ctx.fill();

        // Draw the tick marks
        left = Math.floor(this.lim[0] + 1);
        right = Math.ceil(this.lim[1] - 1);

        let x = 0;
        ctx.font = Numberline.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        let text = null;
        for (let i = left; i <= right; i++) {
            x = i * this.scale;
            // Draw the tick mark
            ctx.beginPath();
            ctx.moveTo(x, -Numberline.tickLength);
            ctx.lineTo(x, Numberline.tickLength);
            ctx.stroke();
            // Label it
            text = i;
            ctx.fillText(text, x, Numberline.textOffset);
        }

    }

    addPoint(x) {
        let point = new Point(this, x, Numberline.colors.base);
        point.draw();
        this.points.push(point);
    }

    addInterval(a,b) {
        let int = new Interval(this, a, b, Numberline.colors.base);
        int.draw();
        this.intervals.push(int);
    }

    addSet(array) {
        // Sort array into points and intervals
        for (let elem of array) {
            switch (typeof(elem)) {
                case 'number':
                    this.addPoint(elem);
                    break;
                case 'object':
                    elem = Numberline.parseArray(elem);
                    this.addInterval(elem[0], elem[1]);
                    break;
            }
        }
    }

    addInteractive(initial) {
        let interact = new Interactive(this, initial);
        this.interact = interact;
    }

    drawPoint(x, closed=true) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(this.scale*x, 0, Numberline.pointSize, 0, 2 * Math.PI);
        if (closed) {
            ctx.fill();
        } else {
            ctx.lineWidth = Numberline.pointThickness;
            ctx.stroke();
        }
    }

    drawLine(a,b) {
        let ctx = this.ctx;
        ctx.lineWidth = Numberline.lineWidth;
        ctx.beginPath();
        ctx.moveTo(a*this.scale + Numberline.pointSize - Numberline.pointThickness, 0);
        ctx.lineTo(b*this.scale - Numberline.pointSize + Numberline.pointThickness, 0);
        ctx.stroke();
        this.drawPoint(a, false);
        this.drawPoint(b, false);
    }
}

class Interval {
    constructor(numberline, a, b, color="#000") {
        this.numberline = numberline;
        this.a = a;
        this.b = b;
        this.color = color;
    }

    draw() {
        this.numberline.ctx.strokeStyle = this.color;
        this.numberline.ctx.fillStyle = this.color;
        this.numberline.drawLine(this.a, this.b);
    }
}

class Point {
    constructor(numberline, x, color) {
        this.numberline = numberline;
        this.x = x;
        this.color = color;
    }

    draw() {
        this.numberline.ctx.strokeStyle = this.color;
        this.numberline.ctx.fillStyle = this.color;
        this.numberline.drawPoint(this.x);
    }
}

class Interactive {
    /*
        This section is not finished and never will be. Next iteration will use D3 instead.
    */
    static clickRadiusSquared = 1/16;

    constructor(numberline, initial) {
        this.type = 'Interactive';
        this.numberline = numberline;
        this.points = [];
        this.intervals = [];
        this.addSet(initial);
        this.numberline.subscribe(this);

        this.circleID = null;
    }

    addSet(set) {
        for (let element of set) {
            switch (typeof(element)) {
                case 'number':
                    this.addPoint(element);
                    break;
                // add interval (object) case later
            }
        }
    }

    addPoint(x) {
        let point = new Point(this.numberline, x, Numberline.colors.complement);
        point.draw();
        this.points.push(point);
    }

    handleEvent(event) {
        switch (event.type) {
            case 'mousedown':
                console.log(this);
                break;
            case 'mouseup':
                // console.log('mouse up');
                break;
            case 'mousemove':
                this.mouseHover(event);
                break;
            case 'mouseover':
                this.mouseHover(event);
                break;
        }
    }

    mouseHover(event) {
        let x = event.offsetX;
        let y = event.offsetY;

        [x,y] = this.translateToGraph(x, y);
        let point = this.checkPoint(x, y);
        if (point) {
            console.log(point.x);
            this.circleID = setInterval(this.circleIndicator, 10);
        } else {

        }
    }

    circleIndicator() {
        
    }

    checkPoint(x, y) {
        for (let point of this.points) {
            if (this.squareDistance(x, y, point.x, 0) <= Interactive.clickRadiusSquared) {
                return point;
            }
            // Change this to deal with multiple points and return the closest
        }
    }

    translateToGraph(x, y) {
        x = (x / Numberline.canvasWidth)
            * (this.numberline.lim[1] - this.numberline.lim[0]) 
            + this.numberline.lim[0];
        y = (y / Numberline.canvasHeight) - (1/2);
        return [x, y];
    }

    squareDistance(x1, y1, x2, y2) {
        return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
    }
    
}