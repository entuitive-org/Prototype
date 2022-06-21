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
    static lineWidth = 12;
    static axisWidth = 8;
    static pointSize = 16;
    static arrowSize = 32;
    static tickLength = 16;
    static font = "64px monospace";
    static textOffset = 64;
    

    constructor(canvas, xlim=[-10,10], independent='x') {
        // Get canvas and context
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        // Force xlim array to be read as floats
        function parseArray(array) {
            for (let i = 0; i < array.length; i++) {
                array[i] = parseFloat(array[i]);
                return array;
            }
        }
        this.lim = parseArray(xlim);
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
        for (let i = left; i <= right; i++) {
            x = i * this.scale;
            ctx.beginPath();
            ctx.moveTo(x, -Numberline.tickLength);
            ctx.lineTo(x, Numberline.tickLength);
            ctx.stroke();
        }

    }

    addPoint(x) {

    }

    addInterval(a,b) {

    }

    addSet(array) {

    }
}

