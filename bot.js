const {
    createCanvas
} = require('canvas');

const data = require('./data/yarns.json');
const Post = require('./Post');

const WIDTH = 1600;
const HEIGHT = 900;

let canvas = createCanvas(WIDTH, HEIGHT);
let ctx = canvas.getContext("2d");

function main() {

    const path = '/output/test.png';

    let beige = getBeige();
    drawBeige(beige.hex);
    savePng(path);

    let text = stripNumbers(beige.name);
    text = text.toLowerCase();
    console.log(text);

    let content = {
        text: text,
        media: __dirname + path,
    }

    setTimeout(function () {

        const post = new Post();
        post.send(content);

    }, 1000 * 5);
}

function getColorways() {

    let a = getRandom(data.yarns);
    let b;

    do {
        b = getRandom(data.yarns);
    } while (a == b);

    return [a, b];
}

function getRandom(list) {

    let index = Math.floor(Math.random() * list.length);
    return list[index];
}

function stripNumbers(str) {

    return str.replace(/[0-9]/g, '').trim();
}

function getBeige() {

    let beige;

    do {
        beige = getRandom(data.yarns);

    } while (colorDistance(beige.hex, "#ebd5b8") > 30);

    return beige;
}

function drawBeige(beige) {

    ctx.fillStyle = beige;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function colorDistance(first, second) {

    first = HEXtoRGB(first);
    second = HEXtoRGB(second);

    let r = Math.abs(first.r - second.r);
    let g = Math.abs(first.g - second.g);
    let b = Math.abs(first.b - second.b);

    return r + g + b;
}

function HEXtoRGB(hex) {

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function savePng(filename) {

    let fs = require('fs'),
        out = fs.createWriteStream(__dirname + filename),
        stream = canvas.pngStream();

    stream.on("data", function (chunk) {
        out.write(chunk);
    });

    stream.on("end", function () {
        console.log("saved png");
    });
}

main();
