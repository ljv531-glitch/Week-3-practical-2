import { TestResults, TestTriangle, advanceToFrame, canvasStatus, getShapes, testShapesMatchWithoutOrder } from "../../lib/test-utils.js";

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

// star call tracking
let stars = [];

// star mock
try {
    const user_star = star;
    window.star = function star(...args) {
        console.log("star", args);
        try {
            const returnValue = user_star.apply(this, args);
            stars.push([...args]);
            return returnValue;
        }
        catch (e) { throw e; }
    }
    for (const prop in user_star) {
        if (user_star.hasOwnProperty(prop)) {
            window.star[prop] = user_star[prop];
        }
    }
}
catch (e) {
    
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    if (window.hasOwnProperty("star") && typeof star === "function") {
        TestResults.addPass("The sketch contains a function called <code>star</code>.");
        // Check it's called three times
        const stars1 = [...stars];
        stars = [];
        // check random is called 6 times
        if (canvasStatus.randomCalls.length === 6) {
            TestResults.addPass("<code>random()</code> is called as expected.");
        } else {
            TestResults.addFail(`<code>random()</code> should be called 6 times. It was called ${canvasStatus.randomCalls.length} times.`);
        }
        advanceToFrame(frameCount+1);
        if (stars.length === 3) {
            TestResults.addPass("<code>star()</code> is called three times per frame.");
        } else {
            TestResults.addFail(`<code>star()</code> was called ${stars.length} times. Expected it to be called three times per frame.`);
        }
        // check it has two arguments and...
        // check the star is drawn around the arguments
        const actualShapes = getShapes();
        const expectedShapes = [];
        let alwaysTwo = true;
        for (const call of stars) {
            if (call.length !== 2) {
                TestResults.addFail("<code>star()</code> should always be called with two arguments representing the x and y coordinates of a star.");
                alwaysTwo = false;
                break;
            } else {
                expectedShapes.push(new TestTriangle(call[0], call[1] - 50, call[0] - 20, call[1], call[0] + 20, call[1]));
                expectedShapes.push(new TestTriangle(call[0] - 50, call[1] - 20, call[0], call[1] - 20, call[0], call[1] + 10));
                expectedShapes.push(new TestTriangle(call[0] + 50, call[1] - 20, call[0], call[1] - 20, call[0], call[1] + 10));
                expectedShapes.push(new TestTriangle(call[0] - 20, call[1] - 5, call[0], call[1] + 10, call[0] - 35, call[1] + 30));
                expectedShapes.push(new TestTriangle(call[0], call[1] + 10, call[0] + 20, call[1] - 5, call[0] + 35, call[1] + 30));
            }
        }
        if (alwaysTwo && stars.length > 0) {
            TestResults.addPass("<code>star()</code> is always called with two arguments.");
            if (testShapesMatchWithoutOrder(expectedShapes, actualShapes, false)) {
                TestResults.addPass("The stars are drawn around the coordinates passed to <code>star()</code>.");
            } else {
                TestResults.addFail("The stars do not appear to be drawn around the coordinates passed to <code>star()</code>. Or, <code>star()</code> is not called correctly.");
            }
        }
        if (canvasStatus.randomCalls.length > 0) {
            TestResults.addWarning("<code>random()</code> appears to be called in <code>draw()</code>. It should only be called in <code>setup()</code> for this exercise.");
            if (stars1.length === stars.length) {
                for (let i = 0; i < stars1.length; i++) {
                    if (stars1[i].length === 2 && stars[i].length === 2) {
                        if (stars1[i][0] !== stars[i][1]) {
                            TestResults.addFail("The stars appear to move each frame. You might be calling <code>random()</code> each frame.");
                            break;
                        }
                    }
                }
            }
        }
        // check the stars don't move
    } else {
        TestResults.addFail("The sketch does not contain a function called <code>star</code>.");
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
