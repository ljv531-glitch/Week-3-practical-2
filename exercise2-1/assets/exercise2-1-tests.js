import { TestResults, getShapes, RECT, CIRCLE, coloursMatch, advanceToFrame, getFunctionContents, testSettingIsCalled } from "../../lib/test-utils.js";

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

function checkShapes() {
    let xLeftTested = false;
    let xRightTested = false;
    let yTopTested = false;
    let yBottomTested = false;
    let bothInTested = false;
    while ((!xLeftTested || !xRightTested || !yTopTested || !yBottomTested || !bothInTested) && frameCount < 1000) {
        const shapes = getShapes();
        if (shapes.length === 2 && shapes[0].type === RECT && shapes[1].type === CIRCLE) {
            const userRect = shapes[0];
            const userCircle = shapes[1];
            if (!xLeftTested && userCircle.x < userRect.x && userCircle.y >= userRect.y && userCircle.y <= userRect.y + userRect.h) {
                if (coloursMatch(userCircle.fillColour, userRect.fillColour)) {
                    TestResults.addPass("When the circle's x coordinate is to the left of the rectangle, the circle and rect have the same fill colour.");
                } else {
                    TestResults.addFail("When the circle's x coordinate is to the left of the rectangle, it should have the same fill colour as the rectangle.");
                }
                xLeftTested = true;
            }
            else if (!xRightTested && userCircle.x > userRect.x + userRect.w && userCircle.y >= userRect.y && userCircle.y <= userRect.y + userRect.h) {
                if (coloursMatch(userCircle.fillColour, userRect.fillColour)) {
                    TestResults.addPass("When the circle's x coordinate is to the right of the rectangle, the circle and rect have the same fill colour.");
                } else {
                    TestResults.addFail("When the circle's x coordinate is to the right of the rectangle, it should have the same fill colour as the rectangle.");
                }
                xRightTested = true;
            }
            else if (!yTopTested && userCircle.y < userRect.y && userCircle.x >= userRect.x && userCircle.x <= userRect.x + userRect.w) {
                if (coloursMatch(userCircle.fillColour, userRect.fillColour)) {
                    TestResults.addPass("When the circle's y coordinate is above the rectangle, the circle and rect have the same fill colour.");
                } else {
                    TestResults.addFail("When the circle's y coordinate is above the rectangle, it should have the same fill colour as the rectangle.");
                }
                yTopTested = true;
            }
            else if (!yBottomTested && userCircle.y > userRect.y + userRect.h && userCircle.x >= userRect.x && userCircle.x <= userRect.x + userRect.w) {
                if (coloursMatch(userCircle.fillColour, userRect.fillColour)) {
                    TestResults.addPass("When the circle's y coordinate is below the rectangle, the circle and rect have the same fill colour.");
                } else {
                    TestResults.addFail("When the circle's y coordinate is below the rectangle, it should have the same fill colour as the rectangle.");
                }
                yBottomTested = true;
            }
            else if (!bothInTested && userCircle.x >= userRect.x && userCircle.x <= userRect.x + userRect.w && userCircle.y >= userRect.y && userCircle.y <= userRect.y + userRect.h) {
                if (!coloursMatch(userCircle.fillColour, userRect.fillColour)) {
                    TestResults.addPass("When the circle is over the rectangle, the circle and rect have different fill colours.");
                } else {
                    TestResults.addFail("When the circle is over the rectangle, it should have a different fill colour to the rectangle.");
                }
                bothInTested = true;
            }
        } else {
            TestResults.addFail(`Expected a rect and a circle. Found ${shapes.length} shapes.${shapes.length > 0 ? " Shapes: " + shapes.map(s => s.type).join(",") :""}`);
            break;
        }
        advanceToFrame(frameCount+1);
    }
}


async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    if (window.hasOwnProperty("isOutOfBounds") && typeof isOutOfBounds === "function") {
        TestResults.addPass("The sketch has a function called <code>isOutOfBounds</code>.");
        const testOut1 = isOutOfBounds(0, 10, 30)
        if (testOut1 === true) {
            TestResults.addPass("<code>isOutOfBounds(0, 10, 30)</code> returns <code>true</code>.");
        } else if (testOut1 === false) {
            TestResults.addFail("<code>isOutOfBounds(0, 10, 30)</code> returns <code>false</code>. Shoud return <code>true</code>.");
        } else {
            TestResults.addFail(`<code>isOutOfBounds(0, 10, 30)</code> should return <code>true</code>. Your implementation returns <code>${testOut1}</code>.`);
        }
        const testOut2 = isOutOfBounds(31, 10, 30)
        if (testOut2 === true) {
            TestResults.addPass("<code>isOutOfBounds(31, 10, 30)</code> returns <code>true</code>.");
        } else if (testOut2 === false) {
            TestResults.addFail("<code>isOutOfBounds(31, 10, 30)</code> returns <code>false</code>. Shoud return <code>true</code>.");
        } else {
            TestResults.addFail(`<code>isOutOfBounds(31, 10, 30)</code> should return <code>true</code>. Your implementation returns <code>${testOut2}</code>.`);
        }
        const testIn1 = isOutOfBounds(10, 10, 30)
        if (testIn1 === false) {
            TestResults.addPass("<code>isOutOfBounds(10, 10, 30)</code> returns <code>false</code>.");
        } else if (testIn1 === true) {
            TestResults.addFail("<code>isOutOfBounds(10, 10, 30)</code> returns <code>true</code>. Shoud return <code>false</code>.");
        } else {
            TestResults.addFail(`<code>isOutOfBounds(10, 10, 30)</code> should return <code>false</code>. Your implementation returns <code>${testIn1}</code>.`);
        }
        if (testSettingIsCalled(/isOutOfBounds\(/g, false, true)) {
            TestResults.addPass("<code>isOutOfBounds()</code> is called at least once in <code>draw()</code>.");
        } else {
            TestResults.addWarning("<code>isOutOfBounds()</code> is not called in <code>draw()</code>. Make sure the function is called appropriately!");
        }
    } else {
        TestResults.addFail("The sketch does not contain a function called <code>isOutOfBounds</code>.");
    }
    checkShapes();
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
