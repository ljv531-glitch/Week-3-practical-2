import { TestResults, checkCanvasSize, getShapes, testSettingIsCalled, BACKGROUND, canvasStatus } from "../../lib/test-utils.js";

/**
 * A hacky solution to wait for p5js to load the canvas. Include in all exercise test files.
 */
function waitForP5() {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length > 0) {
        clearInterval(loadTimer);
        runTests(canvases[0]);
    }
}

let drawTriangleCount = 0;

// star mock
try {
    const user_drawTriangle = drawTriangle;
    window.drawTriangle = function drawTriangle(...args) {
        console.log("drawTriangle", args);
        try {
            const returnValue = user_drawTriangle.apply(this, args);
            drawTriangleCount++;
            return returnValue;
        }
        catch (e) { throw e; }
    }
    for (const prop in user_drawTriangle) {
        if (user_drawTriangle.hasOwnProperty(prop)) {
            window.drawTriangle[prop] = user_drawTriangle[prop];
        }
    }
}
catch (e) {
    
}

function matchFillToRandom(fillCol, randomCalls) {
    const r = red(fillCol);
    const g = green(fillCol);
    const b = blue(fillCol);
    let redFound = false;
    let blueFound = false;
    let greenFound = false;
    const randomColours = randomCalls.filter(call => call.maxVal === 255 || call.maxVal === 256).sort();
    for (const col of randomColours) {
        if (col.returnVal === r) {
            redFound = true;
        } else if (col.returnVal === g) {
            greenFound = true;
        } else if (col.returnVal === b) {
            blueFound = true;
        }
    }
    if ((redFound && greenFound && blueFound) || (redFound && g === 0 && b === 0)) {
        TestResults.addPass("The fill colour is randomly generated.");
    } else {
        TestResults.addWarning("It does not appear that the fill colour is randomly generated.");
    }
}

function checkTrianglePosition(shapes, mX, mY) {
    if (shapes.length === 0) {
        TestResults.addFail("Calling <code>drawTriangle()</code> does not draw a triangle.");
    } else {
        const lastShape = shapes[shapes.length - 1];
        if (lastShape.type === "triangle") {
            if ((lastShape.x1 === mX && lastShape.y1 === mY) || (lastShape.x2 === mX && lastShape.y2 === mY) || (lastShape.x3 === mX && lastShape.y3 === mY)) {
                TestResults.addPass("Calling <code>drawTriangle()</code> draws a triangle with one point at the mouse position.");
            } else {
                TestResults.addFail("Calling <code>drawTriangle()</code> draws a triangle but it does not have a point at the mouse location.");
            }
         } else {
            TestResults.addFail("The last shape drawn is not a triangle.");
        }
    }
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    checkCanvasSize(600, 600);
    if (testSettingIsCalled(BACKGROUND, false, true)) {
        TestResults.addFail("<code>background()</code> should not be called in <code>draw()</code> for this exercise.");
    } else {
        TestResults.addPass("<code>background()</code> is not called in <code>draw()</code>.");
    }
    if (window.hasOwnProperty("drawTriangle") && typeof drawTriangle === "function") {
        TestResults.addPass("The sketch contains a function called <code>drawTriangle</code>.");
        mouseX = 173;
        mouseY = 356;
        drawTriangle();
        const firstShapes = getShapes();
        const firstFill = canvasStatus.fillColour;
        matchFillToRandom(firstFill, canvasStatus.randomCalls);
        checkTrianglePosition(firstShapes, mouseX, mouseY);
        const clickedFunc = window.hasOwnProperty("mouseClicked");
        const pressedFunc = window.hasOwnProperty("mousePressed");
        const releasedFunc = window.hasOwnProperty("mouseReleased");
        if (!clickedFunc && !pressedFunc && !releasedFunc) {
            TestResults.addFail("The sketch does not implement a mouse event function.");
        } else {
            const lastClickCount = drawTriangleCount;
            if (clickedFunc) {
                mouseClicked();
            }
            if (pressedFunc) {
                mousePressed();
            }
            if (releasedFunc) {
                mouseReleased();
            }
            if (drawTriangleCount > lastClickCount) {
                TestResults.addPass("A mouse event function calls <code>drawTriangle()</code>.");
            } else {
                TestResults.addFail("<code>drawTriangle()</code> is not called by a mouse event function.");
            }
        }
    } else {
        TestResults.addFail("The sketch does not contain a function called <code>drawTriangle</code>.");
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
