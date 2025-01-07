const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function constrain (num, lower, upper) {
    return num < lower ? lower : num > upper ? upper : num;
};

function toHex (num) {
    var chars = "0123456789ABCDEF";
    
    return chars[(num - (num % 16)) / 16] + chars[num % 16];
}

function color (r, g, b, a) {
    if (g === undefined && b === undefined && a === undefined) {
        g = r;
        b = r;
        a = 255;
    }
    if (b === undefined && a === undefined) {
        a = g;
        g = r;
        b = r;
    }
    if (a === undefined) {
        a = 255;
    }
    
    ctx.globalAlpha = constrain(a / 255, 0, 1);
    return "0x" + toHex(r) + toHex(g) + toHex(b);
}

function fill (r, g, b, a) {
    if (typeof r === "string") {
        ctx.fillStyle = r;
    }
    else {
        if (g === undefined && b === undefined && a === undefined) {
            g = r;
            b = r;
            a = 255;
        }
        if (b === undefined && a === undefined) {
            a = g;
            g = r;
            b = r;
        }
        if (a === undefined) {
            a = 255;
        }
        
        ctx.globalAlpha = constrain(a / 255, 0, 1);
        ctx.fillStyle = "0x" + toHex(r) + toHex(g) + toHex(b);
    }
}

function stroke (r, g, b, a) {
    if (typeof r === "string") {
        ctx.strokeStyle = r;
    }
    else {
        if (g === undefined && b === undefined && a === undefined) {
            g = r;
            b = r;
            a = 255;
        }
        if (b === undefined && a === undefined) {
            a = g;
            g = r;
            b = r;
        }
        if (a === undefined) {
            a = 255;
        }
        
        ctx.globalAlpha = constrain(a / 255, 0, 1);
        ctx.strokeStyle = "0x" + toHex(r) + toHex(g) + toHex(b);
    }
}

function background (r, g, b, a) {
    fill(r, g, b, a);
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function textAlign (ALIGN, YALIGN) {
    if (ALIGN === "LEFT") {
        ALIGN = "start";
    }
    if (ALIGN === "CENTER") {
        ALIGN === "center";
    }
    if (ALIGN === "RIGHT") {
        ALIGN = "end";
    }

    if (YALIGN === "BASELINE") {
        YALIGN === "alphabetic";
    }
    if (YALIGN === "CENTER") {
        YALIGN === "middle";
    }
    if (YALIGN === "BOTTOM") {
        YALIGN === "bottom";
    }
    
    ctx.textAlign = ALIGN;
    ctx.textBaseline = YALIGN;
}

function text (message, x, y) {
    ctx.fillText(message, x, y);
}

function rect (x, y, w, h) {
    ctx.fillRect(x, y, w, h);
}

function arc (x, y, w, h, start, stop) {
    if (w < 0) w = 0;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, h / 2);

    ctx.beginPath();
    ctx.arc(0, 0, w / 2, start, stop * 180 / Math.PI);
    ctx.fill();
    
    ctx.restore();
}

function ellipse (x, y, w, h) {
    arc(x, y, w, h, 0, 360);
}

function angle (theta) {
    return theta * Math.PI / 180;
}

function sin (theta) {
    return Math.sin(angle(theta));
}

function cos (theta) {
    return Math.cos(angle(theta));
}

export { color, fill, stroke, background, textAlign, text, rect, arc, ellipse, sin, cos };