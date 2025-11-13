import { TestResults, testSettingIsCalled, checkCanvasSize, advanceToFrame, getShapes } from "../../lib/test-utils.js";

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

function checkShapesAtCoords(mX, mY) {
    mouseX = mX;
    mouseY = mY;
    advanceToFrame(frameCount + 1);
    const shapes = getShapes();
    if (shapes.length !== 4) {
        TestResults.addFail(`Expected four circles when the mouse is at ${mX}, ${mY}. Found ${shapes.length} shapes.`);
    } else {
        const mXMirror = width - mX;
        const mYMirror = height - mY;
        let rawFound = false;
        let fullMirrorFound = false;
        let mirrorXFound = false;
        let mirrorYFound = false;
        for (const s of shapes) {
            if (s.x === mX && s.y === mY) {
                rawFound = true;
            } else if (s.x === mXMirror && s.y === mYMirror) {
                fullMirrorFound = true;
            } else if (s.x === mXMirror && s.y === mY) {
                mirrorXFound = true;
            } else if (s.x === mX && s.y === mYMirror) {
                mirrorYFound = true;
            }
        }
        if (rawFound && fullMirrorFound && mirrorXFound && mirrorYFound) {
            TestResults.addPass(`When the mouse is at ${mX}, ${mY}, all shapes' coordinates are correctly calculated.`);
        } else {
            if (rawFound) {
                TestResults.addPass(`When the mouse is at ${mX}, ${mY}, one of the shapes is at the mouse coordinates.`);
            } else {
                TestResults.addFail(`When the mouse is at ${mX}, ${mY}, one of the shapes should be at the mouse coordinates.`);
            }
            if (fullMirrorFound) {
                TestResults.addPass(`When the mouse is at ${mX}, ${mY}, one of the shapes is at the mirrored mouse coordinates.`);
            } else {
                TestResults.addFail(`When the mouse is at ${mX}, ${mY}, one of the shapes should be at the mirrored mouse coordinates (${width - mX}, ${height - mY}).`);
            }
            if (mirrorXFound) {
                TestResults.addPass(`When the mouse is at ${mX}, ${mY}, one of the shapes uses the mirrored mouse x coordinate and the original y coordinate.`);
            } else {
                TestResults.addFail(`When the mouse is at ${mX}, ${mY}, one of the shapes should be at the mirrored mouse x coordinate and the original y coordinate. ${width - mX}, ${mY}).`);
            }
            if (mirrorYFound) {
                TestResults.addPass(`When the mouse is at ${mX}, ${mY}, one of the shapes uses the original mouse x coordinate and the mirrored y coordinate.`);
            } else {
                TestResults.addFail(`When the mouse is at ${mX}, ${mY}, one of the shapes should be at the original mouse x coordinate and the mirrored y coordinate. ${mX}, ${height - mY}).`);
            }
        }
    }
}

function checkShapes() {
    checkShapesAtCoords(0, 0);
    checkShapesAtCoords(width / 2 - 50, 10);
    checkShapesAtCoords(10, height / 2 - 50);
    checkShapesAtCoords(width / 2 + 50, 10);
    checkShapesAtCoords(10, height / 2 + 50);
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    checkCanvasSize(600, 600);
    if (window.hasOwnProperty("mirrorCoordinate") && typeof mirrorCoordinate === "function") {
        TestResults.addPass("The sketch has a function called <code>mirrorCoordinate</code>.");
        const test1 = mirrorCoordinate(0)
        if (test1 === width) {
            TestResults.addPass(`<code>mirrorCoordinate(0)</code> returns ${width}.`);
        } else {
            TestResults.addFail(`<code>mirrorCoordinate(0)</code> returns ${test1}. Expected <code>${width}</code>.`);
        }
        const test2 = mirrorCoordinate(width / 2);
        if (test2 === width / 2) {
            TestResults.addPass(`<code>mirrorCoordinate(${width / 2})</code> returns ${test2}.`);
        } else {
            TestResults.addFail(`<code>mirrorCoordinate(${width / 2})</code> returns ${test2}. Expected <code>${width / 2}</code>.`);
        }
        const test3 = mirrorCoordinate(width / 2 + 30);
        if (test3 === width / 2 - 30) {
            TestResults.addPass(`<code>mirrorCoordinate(${width / 2 + 30})</code> returns ${test3}.`);
        } else {
            TestResults.addFail(`<code>mirrorCoordinate(${width / 2 + 30})</code> returns ${test3}. Expected <code>${width / 2 - 30}</code>.`);
        }
        if (testSettingIsCalled(/mirrorCoordinate\(/g, false, true)) {
            TestResults.addPass("<code>mirrorCoordinate()</code> is called at least once in <code>draw()</code>.");
        } else {
            TestResults.addWarning("<code>mirrorCoordinate()</code> is not called in <code>draw()</code>. Make sure the function is called appropriately!");
        }
    } else {
        TestResults.addFail("The sketch does not contain a function called <code>mirrorCoordinate</code>.");
    }
    checkShapes();
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
