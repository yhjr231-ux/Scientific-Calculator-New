// ==========================================
// 🔊 صوت أزرار الآلة
// ==========================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playKeySound(frequency = 520) {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
    frequency,
    audioCtx.currentTime
);

    gain.gain.setValueAtTime(
        0.035,
        audioCtx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.045
    );

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(
        audioCtx.currentTime + 0.045
    );
}
// تشغيل صوت عند الضغط على أي زر
document.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", () => {

        if (
            button.id === "shiftBtn" ||
            button.id === "alphaBtn"
        ) {
            playKeySound(380);
        }

        else if (
            button.id === "ac" ||
            button.id === "delete"
        ) {
            playKeySound(280);
        }

        else if (
            button.id === "equals"
        ) {
            playKeySound(620);
        }

        else {
            playKeySound(520);
        }

    });

});
console.log("🔥 NEW APP.JS LOADED 🔥");

// ==========================================
// مؤشر الكتابة
// ==========================================

let cursorPosition = 0;
let cursorVisible = true;
function updateCursor() {

    if (!display) return;

    const text = display.value || "";

    // منع المؤشر من الخروج عن حدود النص
    cursorPosition = Math.max(
        0,
        Math.min(cursorPosition, text.length)
    );

    // نستخدم selection الحقيقي بتاع input
    display.focus();

    display.setSelectionRange(
        cursorPosition,
        cursorPosition
    );
}

let regressionA = null;
let regressionB = null;
// ==========================================
// 2. العناصر الأساسية ومتغيرات النظام
// ==========================================
const display = document.getElementById("display");
const expression = document.getElementById("expression");
const status = document.getElementById("status");
const screen = document.getElementById("screen");

let answer = 0;
let memory = 0;
let angleMode = "DEG"; // DEG | RAD | GRAD
let shift = false;
let alpha = false;
let currentMode = "COMP"; // COMP | CMPLX | STAT | EQN | MATRIX | VECTOR | TABLE
let historyStack = [];

let absMode = false;
let fractionMode = false;
let fractionStage = 0;
let fractionNumerator = "";
let fractionDenominator = "";
let fractionExpression = "";
let fractionRoot = "";
let fractionParent = "";
let outerFractionNumerator = "";
let outerFractionDenominator = "";


// ==========================================
// Nested Fraction — كسر داخل كسر
// ==========================================

let nestedFractionMode = false;

let nestedFractionStage = 0;

let nestedFractionNumerator = "";

let nestedFractionDenominator = "";

let nestedFractionParentStage = 0;
// ==========================================
// 3. كلاس الأعداد المركبة الشامل (CMPLX)
// ==========================================
class Complex {
    constructor(re = 0, im = 0) {
        this.re = Number(re) || 0;
        this.im = Number(im) || 0;
    }
    static parse(str) {
    str = str.replace(/\s+/g, "");

    if (str === "i") {
        return new Complex(0, 1);
    }

    if (str === "-i") {
        return new Complex(0, -1);
    }

    // a+bi أو a-bi
    const match = str.match(
        /^([+-]?(?:\d+(?:\.\d+)?))([+-](?:\d+(?:\.\d+)?))i$/
    );

    if (match) {
        return new Complex(
            Number(match[1]),
            Number(match[2])
        );
    }

    // a+i أو a-i
    const unitMatch = str.match(
        /^([+-]?(?:\d+(?:\.\d+)?))([+-])i$/
    );

    if (unitMatch) {
        return new Complex(
            Number(unitMatch[1]),
            unitMatch[2] === "+" ? 1 : -1
        );
    }

    // عدد حقيقي فقط
    if (/^[+-]?\d+(?:\.\d+)?$/.test(str)) {
        return new Complex(Number(str), 0);
    }

    throw new Error("Invalid complex number: " + str);
}

    add(c) { return new Complex(this.re + c.re, this.im + c.im); }
    sub(c) { return new Complex(this.re - c.re, this.im - c.im); }
    mul(c) { return new Complex(this.re * c.re - this.im * c.im, this.re * c.im + this.im * c.re); }
    div(c) {
        let den = c.re * c.re + c.im * c.im;
        if (den === 0) throw new Error("Math Error");
        return new Complex((this.re * c.re + this.im * c.im) / den, (this.im * c.re - this.re * c.im) / den);
    }
    toString() {
        let r = Math.abs(this.re) < 1e-10 ? 0 : Number(this.re.toFixed(6));
        let i = Math.abs(this.im) < 1e-10 ? 0 : Number(this.im.toFixed(6));
        if (i === 0) return `${r}`;
        if (r === 0) return i === 1 ? "i" : i === -1 ? "-i" : `${i}i`;
        let sign = i > 0 ? "+" : "-";
        let absI = Math.abs(i) === 1 ? "" : Math.abs(i);
        return `${r}${sign}${absI}i`;
    }
}

// ==========================================
// 4. الدوال الرياضية المتقدمة (Fact, GCD, LCM, Prime)
// ==========================================
function factorial(n) {
    n = Number(n);
    if (n < 0 || !Number.isInteger(n)) throw new Error("Math Error");
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function isPrime(n) {
    n = Number(n);
    if (!Number.isInteger(n) || n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
}

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { let t = a % b; a = b; b = t; } return a; }
function lcm(a, b) { return (a === 0 || b === 0) ? 0 : Math.abs(a * b) / gcd(a, b); }
function permutation(n, r) { return factorial(n) / factorial(n - r); }
function combination(n, r) { return factorial(n) / (factorial(r) * factorial(n - r)); }

function toRadians(val) {
    if (angleMode === "DEG") return val * Math.PI / 180;
    if (angleMode === "RAD") return val;
    return val * Math.PI / 200; // GRAD
}

function fromRadians(val) {
    if (angleMode === "DEG") return val * 180 / Math.PI;
    if (angleMode === "RAD") return val;
    return val * 200 / Math.PI;
}

// ==========================================
// 5. أدوات الشاشة المدمجة لنظام (fx-991)
// ==========================================
function closeCustomPanel() {
    let p = document.getElementById("customModePanel");
    if (p) p.remove();
}

function createScreenPanel(htmlContent) {
    fractionMode = false;
fractionStage = 0;
fractionNumerator = "";
fractionDenominator = "";
fractionExpression = "";

const fractionEditor = document.getElementById("fractionEditor");

if (fractionEditor) {
    fractionEditor.remove();
}
    closeCustomPanel();
    let panel = document.createElement("div");
    panel.id = "customModePanel";
    panel.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:#dfe8c5; color:#000; padding:6px; box-sizing:border-box; z-index:90; font-size:11px; overflow-y:auto; font-family:monospace;";
    panel.innerHTML = htmlContent;
    if (screen) screen.appendChild(panel);
}

function writeToDisplay(val) {

    console.log("WRITE:", val);
    // ==========================================
// TABLE MODE INPUT
// ==========================================
if (currentMode === "TABLE" && activeTableField) {

    const field = document.getElementById(activeTableField);

    if (field) {

        field.value += val;

        console.log(
            "🟦 TABLE INPUT:",
            activeTableField,
            field.value
        );

        return;
    }
}
// ==========================================
// EQN MODE INPUT
// ==========================================

if (currentMode === "EQN" && activeEqnField) {

    if (activeEqnField === "quadratic") {
        eqnEnterNumber(val);
        return;
    }

    if (activeEqnField === "cubic") {
        cubicEnterNumber(val);
        return;
    }

    if (activeEqnField === "quartic") {
        quarticEnterNumber(val);
        return;
    }
}
// ==========================================
// STAT MODE INPUT
// ==========================================

if (currentMode === "STAT") {
    if (activeStatField) {

        const field = document.getElementById(activeStatField);


        if (field) {
            field.value += val;

            console.log(
                "🟢 STAT INPUT:",
                activeStatField,
                field.value
            );

            return;
        }
    }

    const statInput = document.getElementById("statInput");

    if (statInput && statInput.offsetParent !== null) {

        statInput.value += val;

        console.log(
            "🟢 STAT DEFAULT INPUT:",
            statInput.value
        );

        return;
    }
}
    console.log("ABS MODE:", absMode);
    console.log(
    "🔥 FRACTION:",
    fractionMode,
    "STAGE:",
    fractionStage,
    "NUM:",
    fractionNumerator,
    "DEN:",
    fractionDenominator
);

    // ==========================================
    // ABS MODE
    // ==========================================
// الكتابة داخل STAT
// الكتابة داخل خانات STAT
const statInput = document.getElementById("statInput");
const statXInput = document.getElementById("statXInput");
const statYInput = document.getElementById("statYInput");

if (statXInput && statXInput === document.activeElement) {
    statXInput.value += val;
    return;
}

if (statYInput && statYInput === document.activeElement) {
    statYInput.value += val;
    return;
}

if (statInput && statInput.offsetParent !== null) {
    statInput.value += val;
    return;
}
// ==========================================
// منع ABS من التحكم في إدخال CMPLX
// ==========================================


    if (absMode) {

        let current = display.value
            .replace(/^\|\s*/, "")
            .replace(/\s*\|$/, "");

        current += val;

        display.value = "| " + current + " |";

        console.log("ABS DISPLAY:", display.value);

        return;
    }
// ==========================================
// الكتابة بعد الكسر
// ==========================================
if (fractionMode && fractionStage === 2) {

    fractionDenominator += val;

    updateFractionDisplay();

    return;
}
// ==========================================
// الكتابة داخل الكسر
// ==========================================

if (fractionMode) {

    if (fractionStage === 1) {
        fractionNumerator += val;
        updateFractionDisplay();
        return;
    }

    if (fractionStage === 2) {
        fractionDenominator += val;
        updateFractionDisplay();
        return;
    }
}
// ==========================================
// العمليات على الكسر بعد الخروج منه
// ==========================================
if (
    !fractionMode &&
    fractionExpression &&
    display.value === fractionExpression
) {
    if (val === "^2") {
        display.value = `${fractionExpression}^2`;
        cursorPosition = display.value.length;
        updateCursor();
        console.log("🟢 POWER ON FRACTION:", display.value);
        return;
    }

    if (val === "^3") {
        display.value = `${fractionExpression}^3`;
        cursorPosition = display.value.length;
        updateCursor();
        console.log("🟢 CUBE ON FRACTION:", display.value);
        return;
    }

    if (val === "^") {
        display.value = `${fractionExpression}^`;
        cursorPosition = display.value.length;
        updateCursor();
        console.log("🟢 POWER ON FRACTION:", display.value);
        return;
    }
}
    // ==========================================
// الوضع العادي
// ==========================================

if (
    ["Error", "Math Error", "Syntax Error"]
        .includes(display.value)
) {
    display.value = "";
    cursorPosition = 0;
}

// ==========================================
// الكتابة بعد كسر + عملية
// ==========================================

if (
    fractionExpression &&
    !fractionMode &&
    ["+", "−", "×", "÷"].some(op =>
        display.value.endsWith(op)
    )
) {
    cursorPosition = display.value.length;
}

// الكتابة في مكان المؤشر
display.value =
    display.value.slice(0, cursorPosition) +
    val +
    display.value.slice(cursorPosition);

cursorPosition += val.length;

updateCursor();
}
// ==========================================
// مؤشر الآلة
// ==========================================


// ==========================================
// أسهم مؤشر الكتابة
// ==========================================

// ==========================================
// أسهم مؤشر الكتابة
// ==========================================

// ==========================================
// أسهم مؤشر الكتابة
// ==========================================


// ==========================================
// تحديث مؤشر الكتابة
// ==========================================

// ==========================================
// 6. ربط أزرار الذاكرة والعمليات الأساسية
// ==========================================
const acBtn = document.getElementById("ac");

if (acBtn) {
    acBtn.onclick = () => {

        // =====================================
        // STAT
        // =====================================
        if (currentMode === "STAT") {

            const fields = [
                "statInput",
                "statXInput",
                "statYInput",
                "predictX"
            ];

            fields.forEach(id => {
                const field = document.getElementById(id);
                if (field) field.value = "";
            });

            if (typeof statData !== "undefined") {
                statData = [];
            }

            activeStatField = null;

            const statRes = document.getElementById("statRes");
            const regRes = document.getElementById("regRes");

            if (statRes) statRes.innerHTML = "";
            if (regRes) regRes.innerHTML = "";

            return;
        }

        // =====================================
        // EQN
        // =====================================
        if (currentMode === "EQN") {

            const fields = [
                "eqnInput",
                "cubicInput",
                "quarticInput"
            ];

            fields.forEach(id => {
                const field = document.getElementById(id);
                if (field) field.value = "";
            });

            const eqnForm = document.getElementById("eqnForm");

            if (eqnForm) {
                eqnForm.innerHTML = "";
            }

            if (typeof eqnData !== "undefined") {
                eqnData = null;
            }

            if (typeof cubicData !== "undefined") {
                cubicData = null;
            }

            if (typeof quarticData !== "undefined") {
                quarticData = null;
            }

            return;
        }

        // =====================================
        // MATRIX
        // =====================================
        if (currentMode === "MATRIX") {

            if (typeof window.matrixData !== "undefined") {
                window.matrixData = null;
            }

            window.matrixPowerData = null;
            window.matrixScalarData = null;

            const matrixForm = document.getElementById("matrixForm");

            if (matrixForm) {
                matrixForm.innerHTML = "";
            }

            return;
        }

        // =====================================
        // TABLE
        // =====================================
        if (currentMode === "TABLE") {

            const fields = [
                "tableFx",
                "tStart",
                "tEnd",
                "tStep"
            ];

            fields.forEach(id => {
                const field = document.getElementById(id);
                if (field) field.value = "";
            });

            const tableRes = document.getElementById("tableRes");

            if (tableRes) {
                tableRes.innerHTML = "";
            }

            activeTableField = null;

            return;
        }

        // =====================================
        // VECTOR
        // =====================================
        if (currentMode === "VECTOR") {

            const fields = [
                "vectorA",
                "vectorB"
            ];

            fields.forEach(id => {
                const field = document.getElementById(id);
                if (field) field.value = "";
            });

            const vectorRes = document.getElementById("vectorRes");

            if (vectorRes) {
                vectorRes.innerHTML = "";
            }

            activeVectorField = null;

            return;
        }

        // =====================================
        // الوضع العادي
        // =====================================
        display.value = "";
        expression.textContent = "";
        closeCustomPanel();
    };
}

const delBtn = document.getElementById("delete");

if (delBtn) {
    delBtn.onclick = () => {

        // STAT
        if (currentMode === "STAT" && activeStatField) {

            const field = document.getElementById(activeStatField);

            if (field) {
                field.value = field.value.slice(0, -1);
            }

            return;
        }

        // TABLE
        if (currentMode === "TABLE" && activeTableField) {

            const field = document.getElementById(activeTableField);

            if (field) {
                field.value = field.value.slice(0, -1);
            }

            return;
        }

        // VECTOR
        if (currentMode === "VECTOR" && activeVectorField) {

            const field = document.getElementById(
                activeVectorField === "A"
                    ? "vectorA"
                    : "vectorB"
            );

            if (field) {
                field.value = field.value.slice(0, -1);
            }

            return;
        }

        // الوضع العادي
        display.value = display.value.slice(0, -1);
    };
}
// ==========================================
// أزرار الأرقام والعمليات والأقواس
// ==========================================

// ==========================================
// أزرار الأرقام
// ==========================================

// ==========================================
// أزرار الأرقام فقط
// ==========================================
let activeVectorField = null;
let activeTableField = null;
let activeStatField = null;
let activeEqnField = null;
document.querySelectorAll("button").forEach(btn => {

    if (
        btn.textContent.trim() === "−" ||
        btn.textContent.trim() === "-"
    ) {

        btn.onclick = function () {

            // ==========================================
            // السالب داخل الكسر الداخلي
            // ==========================================
            if (fractionMode && nestedFractionMode) {

                if (nestedFractionStage === 1) {
                    nestedFractionNumerator += "−";
                }
                else if (nestedFractionStage === 2) {
                    nestedFractionDenominator += "−";
                }

                updateFractionDisplay();
                return;
            }

            // ==========================================
            // السالب داخل الكسر الخارجي
            // ==========================================
            if (fractionMode) {

                if (fractionStage === 1) {
                    fractionNumerator += "−";
                }
                else if (fractionStage === 2) {
                    fractionDenominator += "−";
                }

                updateFractionDisplay();
                return;
            }

            // ==========================================
            // EQN
            // ==========================================
            if (currentMode === "EQN") {
                eqnEnterNumber("-");
                return;
            }

            // ==========================================
            // الوضع العادي
            // ==========================================
            writeToDisplay("−");
        };
    }
});
document.querySelectorAll(".number-grid button").forEach(btn => {

    btn.onclick = function () {

        const value = this.textContent.trim();
        console.log(
    "🔵 BUTTON VALUE:",
    JSON.stringify(value)
);

        console.log(
    "STAT DEBUG:",
    "mode =", currentMode,
    "value =", value,
    "activeElement =", document.activeElement?.id,
    "activeStatField =", activeStatField
);
       // =====================================
// STAT - إدخال أرقام الآلة في الخانات
// =====================================

if (currentMode === "STAT" && activeStatField) {

    const field = document.getElementById(activeStatField);

    if (field) {

        // أرقام + نقطة + فاصلة
        if (/^[0-9.,]$/.test(value)) {

            field.value += value;

            console.log(
                "🟢 STAT INPUT:",
                activeStatField,
                "VALUE:",
                value,
                "RESULT:",
                field.value
            );

            return;
        }

        // السالب
        if (value === "-" || value === "−") {

            field.value += "-";

            console.log(
                "🟢 STAT MINUS:",
                activeStatField,
                "RESULT:",
                field.value
            );

            return;
        }
    }
}
// ==========================================
// إدخال الأرقام داخل الكسر الداخلي
// ==========================================

if (nestedFractionMode) {

    if (!/^[0-9.]$/.test(value)) {
        return;
    }

    if (nestedFractionStage === 1) {

        if (nestedFractionNumerator === "| |") {
            nestedFractionNumerator = "|" + value + "|";
        } else {
            nestedFractionNumerator += value;
        }

    } else if (nestedFractionStage === 2) {

        if (nestedFractionDenominator === "| |") {
            nestedFractionDenominator = "|" + value + "|";
        } else {
            nestedFractionDenominator += value;
        }
    }

    updateFractionDisplay();

    console.log(
        "🟣 NESTED NUMBER:",
        value,
        "NUM:",
        nestedFractionNumerator,
        "DEN:",
        nestedFractionDenominator
    );

    return;
}
        // ==========================================
// الخروج من الكسر ثم كتابة عملية
// ==========================================

if (
    !fractionMode &&
    fractionExpression &&
    ["+", "−", "×", "÷"].includes(value)
) {

    display.value =
        fractionExpression + value;

    fractionExpression += value;

    return;
}

        // ==========================================
// إدخال الأرقام داخل الكسر
// ==========================================

if (fractionMode) {

    const value = this.textContent.trim();

    if (
        fractionStage === 1 ||
        fractionStage === 2
    ) {

        if (/^[0-9.]$/.test(value)) {

            if (fractionStage === 1) {

                if (fractionNumerator === "| |") {
                    fractionNumerator = "|" + value + "|";
                } else {
                    fractionNumerator += value;
                }

            } else {

                if (fractionDenominator === "| |") {
                    fractionDenominator = "|" + value + "|";
                } else {
                    fractionDenominator += value;
                }
            }

            updateFractionDisplay();

            return;
        }
    }
}

        if (
    currentMode === "VECTOR" &&
    activeVectorField &&
    /^[0-9.]$/.test(value)
) {
    const field = document.getElementById(
        activeVectorField === "A" ? "vectorA" : "vectorB"
    );

    if (field) {
        field.value += value;
    }

    return;
}
// =====================================
// TABLE INPUT
// =====================================

if (currentMode === "TABLE" && activeTableField) {

    if (/^[0-9.]$/.test(value)) {

        const field = document.getElementById(activeTableField);

        if (field) {
            field.value += value;
        }

        return;
    }

    if (value === "X") {

        const field = document.getElementById(activeTableField);

        if (field) {
            field.value += "X";
        }

        return;
    }
}


        console.log("NUMBER CLICKED:", value);
        console.log("fractionMode:", fractionMode);
        console.log("fractionStage:", fractionStage);

        // =====================================
        // الكسر
        // =====================================

       
        // =====================================
// MATRIX
// =====================================

if (
    currentMode === "MATRIX"
) {

    // MatA^n
    if (
        window.matrixPowerData &&
        document.getElementById("matrixPowerInput")
    ) {
        if (/^[0-9.]$/.test(value)) {
            matrixPowerInput(value);
        }

        return;
    }

    // MatA × K
    if (
        window.matrixScalarData &&
        document.getElementById("matrixScalarInput")
    ) {
        if (/^[0-9.]$/.test(value)) {
           matrixEnterNumber(value);
        }

        return;
    }

    // إدخال عناصر المصفوفة
    if (
        window.matrixData &&
        /^[0-9.]$/.test(value)
    ) {
        matrixEnterNumber(value);
    }

    return;
}
        // =====================================
        // باقي الأرقام
        // =====================================

       
if (currentMode === "VECTOR") {
    createScreenPanel(`
        <div style="font-weight:bold; border-bottom:1px solid #000; margin-bottom:6px;">
            VECTOR Mode
        </div>

        <div style="margin-bottom:3px;">A:</div>

        <input id="vectorA"
               type="text"
               style="width:90%; font-size:11px; margin-bottom:6px;"
               placeholder="1,2,3">

        <div style="margin-bottom:3px;">B:</div>

        <input id="vectorB"
               type="text"
               style="width:90%; font-size:11px; margin-bottom:6px;"
               placeholder="4,5,6">

        <button onclick="calcVectorMagnitude()"
                style="width:100%; font-size:10px; margin-bottom:3px;">
            |A| Magnitude
        </button>

        <button onclick="calcVectorDot()"
                style="width:100%; font-size:10px; margin-bottom:3px;">
            A · B
        </button>

        <button onclick="calcVectorCross()"
                style="width:100%; font-size:10px;">
            A × B
        </button>

        <button onclick="calcVectorAdd()"
    style="width:100%; margin:2px 0; font-size:10px;">
    A + B
</button>

<button onclick="calcVectorSub()"
    style="width:100%; margin:2px 0; font-size:10px;">
    A − B
</button>

<button onclick="calcVectorAngle()"
    style="width:100%; margin:2px 0; font-size:10px;">
    Angle A,B
</button>

        <div id="vectorRes"
             style="margin-top:6px; font-weight:bold;">
        </div>
    `);
}


window.calcVectorMagnitude = function() {
    const input = document.getElementById("vectorA");
    const result = document.getElementById("vectorRes");

    const a = input.value
        .split(",")
        .map(Number)
        .filter(Number.isFinite);

    if (!a.length) {
        result.innerHTML = "أدخل المتجه A";
        return;
    }

    const magnitude = Math.sqrt(
        a.reduce((sum, x) => sum + x * x, 0)
    );

    result.innerHTML =
        `|A| = ${magnitude.toFixed(6)}`;
};
window.calcVectorDot = function() {
    const aInput = document.getElementById("vectorA");
    const bInput = document.getElementById("vectorB");
    const result = document.getElementById("vectorRes");

    if (!aInput || !bInput || !result) return;

    const a = aInput.value
        .split(",")
        .map(Number)
        .filter(Number.isFinite);

    const b = bInput.value
        .split(",")
        .map(Number)
        .filter(Number.isFinite);

    if (a.length !== b.length || !a.length) {
        result.innerHTML = "A و B يجب أن يكونا بنفس عدد العناصر";
        return;
    }

    const dot = a.reduce(
        (sum, value, i) => sum + value * b[i],
        0
    );

    result.innerHTML = `A · B = ${dot.toFixed(6)}`;

    console.log("VECTOR DOT:", dot);
};


window.calcVectorCross = function() {
    const a = document.getElementById("vectorA").value
        .split(",").map(Number).filter(Number.isFinite);

    const b = document.getElementById("vectorB").value
        .split(",").map(Number).filter(Number.isFinite);

    const result = document.getElementById("vectorRes");

    if (a.length !== 3 || b.length !== 3) {
        result.innerHTML = "Cross يحتاج متجهين 3D";
        return;
    }

    const cross = [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];

    result.innerHTML =
        `A × B = (${cross.map(x => x.toFixed(6)).join(", ")})`;
};
        // =====================================
// EQN
// =====================================

if (currentMode === "EQN") {

    // السالب
    if (value === "-" || value === "−") {
        eqnEnterNumber("-");
        return;
    }

    // الأرقام
    if (!/^[0-9.]$/.test(value)) return;

    if (
        typeof eqnData !== "undefined" &&
        document.getElementById("eqnInput")
    ) {
        eqnEnterNumber(value);
        return;
    }

    if (
        typeof cubicData !== "undefined" &&
        document.getElementById("cubicInput")
    ) {
        cubicEnterNumber(value);
        return;
    }

    if (
        typeof quarticData !== "undefined" &&
        document.getElementById("quarticInput")
    ) {
        quarticEnterNumber(value);
        return;
    }
}
        // =====================================
        // الآلة العادية
        // =====================================

        writeToDisplay(value);

    };

});
// =====================================
// STAT - تحديد الخانة المختارة
// =====================================

document.addEventListener("click", function (e) {

    if (currentMode !== "STAT") return;

    const id = e.target.id;

    if (
        id === "statXInput" ||
        id === "statYInput" ||
        id === "predictX" ||
        id === "statInput"
    ) {
        activeStatField = id;

        console.log(
            "🟢 STAT FIELD SELECTED:",
            activeStatField
        );
    }
});
// الأقواس
const openBtn = document.getElementById("open");

if (openBtn) {

    openBtn.onclick = () => {

        // ==========================================
        // SHIFT + ( = X
        // ==========================================

        if (shift) {

            // TABLE → إدخال X في f(X)
            if (
                currentMode === "TABLE" &&
                activeTableField === "tableFx"
            ) {

                writeToDisplay("X");

                shift = false;

                if (status) {
                    status.textContent = currentMode;
                }

                console.log("🟦 TABLE X INPUT");

                return;
            }

            // الوضع العادي
            writeToDisplay("X");

            shift = false;

            if (status) {
                status.textContent = currentMode;
            }

            console.log("🟦 SHIFT + ( = X");

            return;
        }

        // ==========================================
        // ( العادي
        // ==========================================

        writeToDisplay("(");

    };

}


const closeBtn = document.getElementById("close");

if (closeBtn) {

    closeBtn.onclick = () => {

        // ==========================================
        // القوس ) داخل الكسر
        // ==========================================

        if (fractionMode) {

    // ==========================================
    // القوس ) داخل الكسر الداخلي
    // ==========================================

   if (nestedFractionStage === 1) {

    if (nestedFractionNumerator.startsWith("abs(")) {
        nestedFractionNumerator =
            "|" +
            nestedFractionNumerator.slice(4) +
            "|";
    } else {
        nestedFractionNumerator += ")";
    }

    updateFractionDisplay();

    console.log(
        "🟣 ) NESTED:",
        nestedFractionNumerator
    );

    return;
}

else if (nestedFractionStage === 2) {

    if (nestedFractionDenominator.startsWith("abs(")) {
        nestedFractionDenominator =
            "|" +
            nestedFractionDenominator.slice(4) +
            "|";
    } else {
        nestedFractionDenominator += ")";
    }

    updateFractionDisplay();

    console.log(
        "🟣 ) NESTED:",
        nestedFractionDenominator
    );

    return;
}
    // ==========================================
    // القوس ) داخل الكسر الخارجي
    // ==========================================

    if (fractionStage === 1) {

        fractionNumerator += ")";

    }
    else if (fractionStage === 2) {

        fractionDenominator += ")";

    }

    updateFractionDisplay();

    return;
}
        // ==========================================
        // الوضع العادي
        // ==========================================

        writeToDisplay(")");

    };

}
// =====================================
// زر الموجب والسالب ±
// =====================================


// أزرار الذاكرة (M+, M-, MR, MC, Ans)
document.querySelectorAll(".memory-row button").forEach(btn => {
    btn.onclick = function () {
        const txt = this.textContent.trim();
        let val = Number(display.value) || 0;
        if (txt === "Ans") writeToDisplay("Ans");
        else if (txt === "M+") { memory += val; expression.textContent = "M = " + memory; }
        else if (txt === "M-") { memory -= val; expression.textContent = "M = " + memory; }
        else if (txt === "MR") { display.value = memory; }
        else if (txt === "MC") { memory = 0; expression.textContent = "M Cleared"; }
    };
});

// تشغيل زرار AC للتنظيف الكامل
document.querySelectorAll("#ac, .btn-ac").forEach(btn => {

    btn.onclick = () => {

        display.value = "";

        if (expression) {
            expression.textContent = "";
        }

        const fractionEditor =
            document.getElementById("fractionEditor");

        if (fractionEditor) {
            fractionEditor.remove();
        }

        display.style.visibility = "visible";

        resetFractionState();

        closeCustomPanel();
    };

});

// تشغيل زرار DEL لمسح آخر رقم
document.querySelectorAll("#delete, .btn-del").forEach(btn => {

    btn.onclick = () => {

        // ==========================================
        // 1. كسر داخلي
        // ==========================================

        if (fractionMode && nestedFractionMode) {

            // بسط الكسر الداخلي
            if (nestedFractionStage === 1) {

                nestedFractionNumerator =
                    nestedFractionNumerator.slice(0, -1);

                updateFractionDisplay();

                console.log(
                    "🗑️ DEL NESTED NUM:",
                    nestedFractionNumerator
                );

                return;
            }

            // مقام الكسر الداخلي
            if (nestedFractionStage === 2) {

                nestedFractionDenominator =
                    nestedFractionDenominator.slice(0, -1);

                updateFractionDisplay();

                console.log(
                    "🗑️ DEL NESTED DEN:",
                    nestedFractionDenominator
                );

                return;
            }
        }

        // ==========================================
        // 2. الكسر الخارجي
        // ==========================================

        if (fractionMode) {

            // بسط الكسر الخارجي
            if (fractionStage === 1) {

                fractionNumerator =
                    fractionNumerator.slice(0, -1);

                updateFractionDisplay();

                console.log(
                    "🗑️ DEL OUTER NUM:",
                    fractionNumerator
                );

                return;
            }

            // مقام الكسر الخارجي
            if (fractionStage === 2) {

                fractionDenominator =
                    fractionDenominator.slice(0, -1);

                updateFractionDisplay();

                console.log(
                    "🗑️ DEL OUTER DEN:",
                    fractionDenominator
                );

                return;
            }
        }

        // ==========================================
        // 3. مسح الكسر بالكامل بعد الانتهاء
        // ==========================================

        if (
            !fractionMode &&
            (
                nestedFractionNumerator !== "" ||
                nestedFractionDenominator !== "" ||
                fractionNumerator !== "" ||
                fractionDenominator !== ""
            )
        ) {

            const editor =
                document.getElementById("fractionEditor");

            if (editor) {
                editor.remove();
            }

            display.style.visibility = "visible";

            resetFractionState();

            display.value = "";

            if (expression) {
                expression.textContent = "";
            }

            console.log("🗑️ FRACTION COMPLETELY DELETED");

            return;
        }

        // ==========================================
        // 4. المسح العادي
        // ==========================================

        display.value =
            display.value.slice(0, -1);

    };

});
// ==========================================
// 7. الأزرار العلمية والمثلثية (Scientific Grid)
// ==========================================
document.querySelectorAll(".scientific-grid button").forEach(btn => {
    btn.onclick = function () {
        const txt = this.textContent.trim();
        // ==========================================
// العمليات العلمية داخل الكسر الداخلي
// ==========================================

if (nestedFractionMode) {

    let nestedValue = "";

    // SHIFT
    if (shift) {
if (txt === "√") {
    nestedValue = "∛(";
}
        if (txt === "sin") {
            nestedValue = "asin(";
        }
        else if (txt === "cos") {
            nestedValue = "acos(";
        }
        else if (txt === "tan") {
            nestedValue = "atan(";
        }
        else if (txt === "sinh") {
            nestedValue = "asinh(";
        }
        else if (txt === "cosh") {
            nestedValue = "acosh(";
        }
        else if (txt === "tanh") {
            nestedValue = "atanh(";
        }

        if (nestedValue !== "") {

            if (nestedFractionStage === 1) {
                nestedFractionNumerator += nestedValue;
            }
            else if (nestedFractionStage === 2) {
                nestedFractionDenominator += nestedValue;
            }

            updateFractionDisplay();

            console.log(
                "🟣 NESTED SHIFT:",
                nestedValue
            );

            shift = false;

            if (status) {
                status.textContent = currentMode;
            }

            return;
        }
    }

    // ==========================================
    // الدوال العادية
    // ==========================================

    switch (txt) {
case "|x|":
    nestedValue = "abs(";
    break;
        case "sin":
            nestedValue = "sin(";
            break;

        case "cos":
            nestedValue = "cos(";
            break;

        case "tan":
            nestedValue = "tan(";
            break;

        case "sinh":
            nestedValue = "sinh(";
            break;

        case "cosh":
            nestedValue = "cosh(";
            break;

        case "tanh":
            nestedValue = "tanh(";
            break;

        case "log":
            nestedValue = "log(";
            break;

        case "ln":
            nestedValue = "ln(";
            break;

        case "√":
            nestedValue = "√(";
            break;

        case "∛":
            nestedValue = "∛(";
            break;

        case "x²":
            nestedValue = "^2";
            break;

        case "x³":
            nestedValue = "^3";
            break;

        case "xʸ":
            nestedValue = "^";
            break;

        case "1/x":
            nestedValue = "1/(";
            break;

        case "|x|":
            nestedValue = "abs(";
            break;

        case "π":
            nestedValue = "π";
            break;

        case "e":
            nestedValue = "e";
            break;

        case "n!":
            nestedValue = "!";
            break;

        case "10ˣ":
        case "10x":
            nestedValue = "10^";
            break;

        case "eˣ":
        case "ex":
            nestedValue = "e^";
            break;

        default:
            nestedValue = "";
    }

    if (nestedValue !== "") {

        if (nestedFractionStage === 1) {
            nestedFractionNumerator += nestedValue;
        }
        else if (nestedFractionStage === 2) {
            nestedFractionDenominator += nestedValue;
        }

        updateFractionDisplay();

        console.log(
            "🟣 NESTED SCIENTIFIC:",
            nestedValue
        );

        return;
    }
}
        // ==========================================
// SHIFT + الدوال العلمية داخل الكسر
// ==========================================
if (shift && fractionMode) {

    let scientificValue = "";

    if (txt === "sin" || txt === "sin⁻¹") {
        scientificValue = "asin(";
    }
    else if (txt === "cos" || txt === "cos⁻¹") {
        scientificValue = "acos(";
    }
    else if (txt === "tan" || txt === "tan⁻¹") {
        scientificValue = "atan(";
    }
    else if (txt === "sinh") {
        scientificValue = "asinh(";
    }
    else if (txt === "cosh") {
        scientificValue = "acosh(";
    }
    else if (txt === "tanh") {
        scientificValue = "atanh(";
    }

    if (scientificValue !== "") {

        if (fractionStage === 1) {
            fractionNumerator += scientificValue;
        }
        else if (fractionStage === 2) {
            fractionDenominator += scientificValue;
        }

        updateFractionDisplay();

        console.log(
            "🟢 SHIFT SCIENTIFIC IN FRACTION:",
            scientificValue
        );

        console.log(
            "NUM:",
            fractionNumerator,
            "DEN:",
            fractionDenominator
        );

        shift = false;

        if (status) {
            status.textContent = currentMode;
        }

        return;
    }
}
        // ==========================================
// العمليات العلمية داخل الكسر
// ==========================================
if (fractionMode) {

    let fractionValue = "";

    switch (txt) {

        case "sin":
            fractionValue = "sin(";
            break;

        case "cos":
            fractionValue = "cos(";
            break;

        case "tan":
            fractionValue = "tan(";
            break;

        case "sin⁻¹":
            fractionValue = "asin(";
            break;

        case "cos⁻¹":
            fractionValue = "acos(";
            break;

        case "tan⁻¹":
            fractionValue = "atan(";
            break;

        case "sinh":
            fractionValue = "sinh(";
            break;

        case "cosh":
            fractionValue = "cosh(";
            break;

        case "tanh":
            fractionValue = "tanh(";
            break;

        case "log":
            fractionValue = "log(";
            break;

        case "ln":
            fractionValue = "ln(";
            break;

        case "√":
            fractionValue = "√(";
            break;

        case "∛":
            fractionValue = "∛(";
            break;

        case "10ˣ":
        case "10x":
            fractionValue = "10^";
            break;

        case "eˣ":
        case "ex":
            fractionValue = "e^";
            break;

        case "x²":
            fractionValue = "^2";
            break;

        case "x³":
            fractionValue = "^3";
            break;

        case "xʸ":
            fractionValue = "^";
            break;

        case "1/x":
            fractionValue = "1/(";
            break;

        case "|x|":
            fractionValue = "abs(";
            break;

        case "π":
            fractionValue = "π";
            break;

        case "e":
            fractionValue = "e";
            break;

        case "n!":
            fractionValue = "!";
            break;

        default:
            fractionValue = "";
    }

    if (fractionValue !== "") {

        if (fractionStage === 1) {
            fractionNumerator += fractionValue;
        } 
        else if (fractionStage === 2) {
            fractionDenominator += fractionValue;
        }

        updateFractionDisplay();

        return;
    }
}

          if (txt === "±") {

    if (currentMode === "EQN") {
        eqnEnterNumber("-");
        return;
    }

    const value = display.value.trim();

    if (!value) return;

    if (value.startsWith("-")) {
        display.value = value.slice(1);
    } else {
        display.value = "-" + value;
    }

    return;
}
        

        // ALPHA Mode
        if (alpha) {
            if (txt === "sin") writeToDisplay("A");
            else if (txt === "cos") writeToDisplay("B");
            else if (txt === "tan") writeToDisplay("C");
            else if (txt === "log") writeToDisplay("D");
            else if (txt === "ln") writeToDisplay("E");
            else if (txt === "π") writeToDisplay("X");
            else if (txt === "e") writeToDisplay("Y");
            alpha = false;
            if (status) status.textContent = currentMode;
            return;
        }
console.log("🔥 SCI BUTTON:", txt, "SHIFT =", shift);
        // SHIFT Mode
        if (shift) {
            // ==========================================
// SHIFT + X²
// ==========================================
if (txt === "x²" && currentMode === "CMPLX") {
    console.log("🟣 SHIFT + X² → z²");
    writeToDisplay("z²");
    shift = false;

    if (status) status.textContent = currentMode;

    return;
}
if (txt === "√") {
    console.log("🔥 SHIFT + √ DETECTED");

    writeToDisplay("∛(");

    shift = false;

    if (status) {
        status.textContent = currentMode;
    }

    return;
}
            // ==========================================
// SHIFT + الدوال العلمية داخل الكسر
// ==========================================
if (fractionMode) {

    console.log("🟢 SHIFT SCIENTIFIC INSIDE FRACTION");
    console.log("fractionStage =", fractionStage);
    console.log("fractionNumerator =", fractionNumerator);
    console.log("fractionDenominator =", fractionDenominator);

    let scientificValue = "";
    if (txt === "sin" || txt === "sin⁻¹") {
        scientificValue = "asin(";
    }
    else if (txt === "cos" || txt === "cos⁻¹") {
        scientificValue = "acos(";
    }
    else if (txt === "tan" || txt === "tan⁻¹") {
        scientificValue = "atan(";
    }
    else if (txt === "sinh") {
        scientificValue = "asinh(";
    }
    else if (txt === "cosh") {
        scientificValue = "acosh(";
    }
    else if (txt === "tanh") {
        scientificValue = "atanh(";
    }
console.log("🟡 SCIENTIFIC VALUE =", scientificValue);
    if (scientificValue) {

        if (fractionStage === 1) {
            fractionNumerator += scientificValue;
        }
        else if (fractionStage === 2) {
            fractionDenominator += scientificValue;
        }
 console.log(
        "🟣 AFTER SCIENTIFIC:",
        fractionNumerator,
        "/",
        fractionDenominator
          );
        updateFractionDisplay();

        shift = false;

        if (status) {
            status.textContent = currentMode;
        }

        return;
    }
}
            if (txt === "sin" || txt === "sin⁻¹") writeToDisplay("asin(");
            else if (txt === "cos" || txt === "cos⁻¹") writeToDisplay("acos(");
            else if (txt === "tan" || txt === "tan⁻¹") writeToDisplay("atan(");
            else if (txt === "sinh") writeToDisplay("asinh(");
            else if (txt === "cosh") writeToDisplay("acosh(");
           else if (txt === "tanh") {

    if (shift) {
        writeToDisplay("atanh(");
    } else {
        writeToDisplay("tanh(");
    }

    shift = false;

    if (status) {
        status.textContent = currentMode;
    }

    return;
}
           else if (txt === "x²") {
    if (currentMode === "CMPLX") {
        const value = display.value.trim();

        if (!value) return;

        try {
            console.log("🟣 SQRT CMPLX INPUT:", value);
            const z = Complex.parse(value);

            const result = new Complex(
                z.re * z.re - z.im * z.im,
                2 * z.re * z.im
            );

            display.value = result.toString();
            answer = result;

        } catch (err) {
            console.error("z² ERROR:", err);
            display.value = "Math Error";
        }
    }
} 
                else if (txt === "x³") {
            if (currentMode === "CMPLX") {
                const value = display.value.trim();

                if (!value) return;

                try {
                    const z = Complex.parse(value);

                    const a = z.re;
                    const b = z.im;

                    const result = new Complex(
                        a * a * a - 3 * a * b * b,
                        3 * a * a * b - b * b * b
                    );

                    display.value = result.toString();
                    answer = result;

                } catch (err) {
                    console.error("z³ ERROR:", err);
                    display.value = "Math Error";
                }
            }
           
        }
        else if (txt === "√") {

    // ==========================================
    // SHIFT + √ = ∛
    // ==========================================

    const value = display.value.trim();

    // ==========================================
    // لو الشاشة فيها كسر كامل
    // مثال: (1/8)
    // ==========================================

    if (
        !fractionMode &&
        /^\(-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?\)$/.test(value)
    ) {

        display.value = `∛(${value})`;

        cursorPosition = display.value.length;

        updateCursor();

        console.log(
            "🟣 SHIFT + √ → ∛ FRACTION:",
            display.value
        );

        shift = false;

        if (status) {
            status.textContent = currentMode;
        }

        return;
    }

    // ==========================================
    // الوضع العادي
    // ==========================================
if (currentMode === "CMPLX") {

    const value = display.value.trim();

    if (!value) {
        return;
    }

    try {

        const z = Complex.parse(value);

        const modulus =
            Math.sqrt(
                z.re * z.re +
                z.im * z.im
            );

        const angle =
            Math.atan2(z.im, z.re);

        const r =
            Math.sqrt(modulus);

        const theta =
            angle / 2;

        const result =
            new Complex(
                r * Math.cos(theta),
                r * Math.sin(theta)
            );

        display.value =
            result.toString();

        answer = result;

        cursorPosition =
            display.value.length;

        updateCursor();

        console.log(
            "🟣 CMPLX √ RESULT:",
            result
        );

    } catch (err) {

        console.error(
            "CMPLX √ ERROR:",
            err
        );

        display.value =
            "Math Error";
    }

    shift = false;

    if (status) {
        status.textContent =
            currentMode;
    }

    return;
}
    writeToDisplay("∛(");

    shift = false;

    if (status) {
        status.textContent = currentMode;
    }

    return;
}
        else if (txt === "xʸ") {
    if (currentMode === "CMPLX") {
        writeToDisplay("^");
    } else {
        writeToDisplay("^");
    }
}       
        else if (txt === "ln") {
    if (currentMode === "CMPLX") {
        const value = display.value.trim();

        if (!value) return;

        try {
            const z = Complex.parse(value);

            const modulus = Math.sqrt(
                z.re * z.re + z.im * z.im
            );

            const angle = Math.atan2(z.im, z.re);

            const result = new Complex(
                Math.log(modulus),
                angle
            );

            display.value = result.toString();
            answer = result;

        } catch (err) {
            console.error("Complex ln ERROR:", err);
            display.value = "Math Error";
        }
    } else {
        writeToDisplay("ln(");
    }
}       
else if (txt === "10ˣ" || txt === "10x") {
    if (fractionMode) {
        if (fractionStage === 1) {
            fractionNumerator += "10^";
        } else if (fractionStage === 2) {
            fractionDenominator += "10^";
        }

        updateFractionDisplay();

        shift = false;
        if (status) status.textContent = currentMode;

        return;
    }

    writeToDisplay("10^");
}
        else if (txt === "eˣ" || txt === "ex") {
    if (currentMode === "CMPLX") {
        const value = display.value.trim();

        if (!value) return;

        try {
            const z = Complex.parse(value);

            const expReal = Math.exp(z.re);

            const result = new Complex(
                expReal * Math.cos(z.im),
                expReal * Math.sin(z.im)
            );

            display.value = result.toString();
            answer = result;

        } catch (err) {
            console.error("Complex EXP ERROR:", err);
            display.value = "Math Error";
        }
    } else {
        writeToDisplay("e^");
    }
}
        else if (txt === "log") {

    if (currentMode === "CMPLX") {

        const value = display.value.trim();

        if (!value) return;

        try {

            const z = parseCMPLX(value);

            const modulus = Math.hypot(z.re, z.im);
            const angle = Math.atan2(z.im, z.re);

            if (modulus === 0) {
                throw new Error("log(0)");
            }

            const result = new Complex(
                Math.log10(modulus),
                angle / Math.LN10
            );

            display.value = result.toString();
            answer = result;

        } catch (err) {

            console.error(
                "Complex LOG ERROR:",
                err
            );

            display.value = "Math Error";
        }

    } else {

        writeToDisplay("log(");
    }
}
            shift = false;
            if (status) status.textContent = currentMode;
            return;
        }

        // الضغط العادي
        switch (txt) {
            case "−":
case "-":

    // السالب داخل الكسر الداخلي
    if (fractionMode && nestedFractionMode) {

        if (nestedFractionStage === 1) {
            nestedFractionNumerator += "−";
        }
        else if (nestedFractionStage === 2) {
            nestedFractionDenominator += "−";
        }

        updateFractionDisplay();
        return;
    }

    // السالب داخل الكسر الخارجي
    if (fractionMode) {

        if (fractionStage === 1) {
            fractionNumerator += "−";
        }
        else if (fractionStage === 2) {
            fractionDenominator += "−";
        }

        updateFractionDisplay();
        return;
    }

    // EQN
    if (currentMode === "EQN") {
        eqnEnterNumber("-");
    } else {
        writeToDisplay("−");
    }

    break;
            case "sin": writeToDisplay("sin("); break;
            case "cos": writeToDisplay("cos("); break;
            case "tan": writeToDisplay("tan("); break;
            case "sin⁻¹": writeToDisplay("asin("); break;
            case "cos⁻¹": writeToDisplay("acos("); break;
            case "tan⁻¹": writeToDisplay("atan("); break;
            case "sinh": writeToDisplay("sinh("); break;
            case "cosh": writeToDisplay("cosh("); break;
           case "tanh": writeToDisplay("tanh("); break;
            case "log": writeToDisplay("log("); break;
            case "ln": writeToDisplay("ln("); break;
            case "10ˣ": case "10x": writeToDisplay("10^"); break;
            case "eˣ": case "ex": writeToDisplay("e^"); break;
            case "∛":
    console.log("🔥 ∛ CASE");

    writeToDisplay("∛(");

    break;
            case "√":

    if (fractionMode) {

        // الجذر داخل البسط
        if (nestedFractionMode) {

            if (nestedFractionStage === 1) {
                nestedFractionNumerator += "√(";
            }
            else if (nestedFractionStage === 2) {
                nestedFractionDenominator += "√(";
            }

            updateFractionDisplay();
            break;
        }

        if (fractionStage === 1) {
            fractionNumerator += "√(";
        }
        else if (fractionStage === 2) {
            fractionDenominator += "√(";
        }

        updateFractionDisplay();
        break;
    }

    // ==========================================
// √ بعد كسر كامل مثل x²
// ==========================================

const value = display.value;
const pos = cursorPosition;

const before = value.slice(0, pos);
const after = value.slice(pos);

// لو آخر عنصر قبل المؤشر هو كسر كامل
if (
    before.endsWith(")") &&
    before.startsWith("(") &&
    before.includes("/")
) {

    const newValue =
        `√(${before})${after}`;

    display.value = newValue;

    cursorPosition =
        `√(${before})`.length;

    updateCursor();

    console.log(
        "🟢 √ FRACTION:",
        display.value
    );

    return;
}

// الحالة العادية
writeToDisplay("√(");
    break;
         
const cbrtBtn = document.getElementById("sqrtBtn");

if (cbrtBtn) {
    cbrtBtn.onclick = () => {

        // ==========================================
        // SHIFT + √ = ∛
        // ==========================================

        if (shift) {

            if (fractionMode) {

                if (nestedFractionMode) {

                    if (nestedFractionStage === 1) {
                        nestedFractionNumerator += "∛(";
                    }
                    else if (nestedFractionStage === 2) {
                        nestedFractionDenominator += "∛(";
                    }

                    updateFractionDisplay();

                    console.log(
                        "🟣 NESTED ∛:",
                        nestedFractionStage === 1
                            ? nestedFractionNumerator
                            : nestedFractionDenominator
                    );

                }
                else {

                    if (fractionStage === 1) {
                        fractionNumerator += "∛(";
                    }
                    else if (fractionStage === 2) {
                        fractionDenominator += "∛(";
                    }

                    updateFractionDisplay();

                    console.log("🔵 OUTER ∛");
                }

                shift = false;

                if (status) {
                    status.textContent = currentMode;
                }

                return;
            }

          // ==========================================
// ∛ بعد كسر كامل — نفس فكرة √
// ==========================================

const value = display.value.trim();

// لو الشاشة كلها كسر كامل
if (
    !fractionMode &&
    /^\(-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?\)$/.test(value)
) {

    display.value = `∛(${value})`;

    cursorPosition = display.value.length;

    updateCursor();

    console.log(
        "🟢 ∛ WRAPPED FRACTION:",
        display.value
    );

    shift = false;

    if (status) {
        status.textContent = currentMode;
    }

    return;
}

// ==========================================
// ∛ عادي
// ==========================================

writeToDisplay("∛(");

shift = false;

if (status) {
    status.textContent = currentMode;
}

return;
// ∛ عادي
writeToDisplay("∛(");

shift = false;

if (status) {
    status.textContent = currentMode;
}

return;
        }

        // ==========================================
        // √ العادي
        // ==========================================

        if (fractionMode) {

            if (nestedFractionMode) {

                if (nestedFractionStage === 1) {
                    nestedFractionNumerator += "√(";
                }
                else if (nestedFractionStage === 2) {
                    nestedFractionDenominator += "√(";
                }

                updateFractionDisplay();

                return;
            }

            if (fractionStage === 1) {
                fractionNumerator += "√(";
            }
            else if (fractionStage === 2) {
                fractionDenominator += "√(";
            }

            updateFractionDisplay();

            return;
        }

      // ==========================================
// ∛ خارج محرر الكسر
// لو الشاشة فيها كسر كامل، دخّله داخل الجذر التكعيبي
// ==========================================

const currentValue = display.value.trim();

if (
    !fractionMode &&
    currentValue.startsWith("(") &&
    currentValue.endsWith(")") &&
    currentValue.includes("/")
) {
    display.value = `∛(${currentValue})`;

    cursorPosition = display.value.length;

    updateCursor();

    console.log(
        "🟣 ∛ WRAPPED FRACTION:",
        display.value
    );

    shift = false;

    if (status) {
        status.textContent = currentMode;
    }

    return;
}
    }
}
           case "x²":

    // ==========================================
    // x² على كسر كامل
    // ==========================================
    if (fractionMode &&
        fractionNumerator !== "" &&
        fractionDenominator !== "") {

        console.log("🟣 X² ON FRACTION");

        const numerator = fractionNumerator;
        const denominator = fractionDenominator;

        fractionExpression =
            `(${numerator}/${denominator})^2`;

        fractionMode = false;
        fractionStage = 0;
        fractionNumerator = "";
        fractionDenominator = "";

        display.value = fractionExpression;

        console.log("🟣 FRACTION X² RESULT:", display.value);

        break;
    }

    // ==========================================
    // TABLE
    // ==========================================
    if (currentMode === "TABLE" && activeTableField) {

        const field = document.getElementById(activeTableField);

        if (field) {
            field.value += "X^2";
        }

        return;
    }

    console.log("🔥🔥 X² CASE");
    console.log("SHIFT:", shift, "MODE:", currentMode);

    if (shift && currentMode === "CMPLX") {

        writeToDisplay("z²");

        shift = false;
        updateShift();

    } else {

        writeToDisplay("^2");

    }

    break;
    case "x³":
    console.log("🔥 X³ CASE");

    if (currentMode === "CMPLX") {
        writeToDisplay("^3");
    } else {
        writeToDisplay("^3");
    }

    break;
            case "xʸ": writeToDisplay("^"); break;
            case "1/x": {
    const value = display.value.trim();

    if (!value) break;

    display.value = `1/(${value})`;

    cursorPosition = display.value.length;

    updateCursor();

    console.log("🟢 1/x:", display.value);

    break;
}
            case "|x|": writeToDisplay("abs("); break;
            case "π": writeToDisplay("π"); break;
            case "e": writeToDisplay("e"); break;
            case "n!": writeToDisplay("!"); break;
            case "nPr": writeToDisplay(" P "); break;
            case "nCr": writeToDisplay(" C "); break;
            case "%": writeToDisplay("%"); break;

        }
    };
});

// ==========================================
// 8. تحويل الكسر وإضافات الأزرار المتقدمة
// ==========================================

const fractionBtn = document.getElementById("fractionBtn");

if (fractionBtn) {

    fractionBtn.onclick = function () {

        // لو إحنا في وضع إدخال الكسر
        if (fractionMode) {

            // لو لسه بنكتب البسط أو المقام
            if (fractionStage === 1 || fractionStage === 2) {
                return;
            }

            // لو الكسر مكتمل
            if (
                fractionNumerator !== "" &&
                fractionDenominator !== ""
            ) {
                const numerator = calculateFractionPart(fractionNumerator);

const denominator = calculateFractionPart(fractionDenominator);

console.log("🔥 NUMERATOR =", numerator);
console.log("🔥 DENOMINATOR =", denominator);
console.log("NUMERATOR CALCULATED:", numerator);
console.log("🔥 FRACTION BEFORE SIMPLIFY:", {
    numerator,
    denominator,
    ratio: numerator / denominator
});
console.log("DENOMINATOR CALCULATED:", denominator);

                if (
                    !Number.isFinite(numerator) ||
                    !Number.isFinite(denominator) ||
                    denominator === 0
                ) {
                    display.value = "Math Error";
                    return;
                }

                const result = numerator / denominator;

if (fractionInsideRoot) {

    const root = rootTypeForFraction === "∛"
        ? "∛("
        : "√(";

    display.value =
        fractionExpression +
        root +
        "(" +
        numerator +
        "/" +
        denominator +
        ")";

    console.log(
        "🌳 FRACTION INSIDE ROOT:",
        display.value
    );

    fractionInsideRoot = false;
    rootTypeForFraction = "";

    fractionMode = false;
    fractionStage = 0;
    fractionNumerator = "";
    fractionDenominator = "";

    return;
}
            }
        }

        // ==============================
        // S ⇔ D العادي
        // ==============================

        let val = display.value.trim();

        if (!val) return;

        if (val.includes("/")) {

            let parts = val.split("/");

            if (parts.length !== 2) return;

            let numerator = Number(parts[0]);
            let denominator = Number(parts[1]);

            if (
                !Number.isFinite(numerator) ||
                !Number.isFinite(denominator) ||
                denominator === 0
            ) {
                display.value = "Math Error";
                return;
            }

            let result = numerator / denominator;

            display.value = Number(result.toFixed(10));

            answer = Number(display.value);

            return;
        }

        // ==============================
        // عدد عشري → كسر
        // ==============================

        let num = Number(val);

        if (!Number.isFinite(num)) return;

        if (Number.isInteger(num)) {
            display.value = num + "/1";
            return;
        }

        let decimalPart = val.split(".")[1] || "";

        let denominator = Math.pow(10, decimalPart.length);

        let numerator = Math.round(num * denominator);

        let divisor = gcd(
            Math.abs(numerator),
            denominator
        );

        numerator /= divisor;
        denominator /= divisor;

        display.value =
            numerator + "/" + denominator;

        answer = numerator / denominator;
    };
}

const fractionInputBtn =
    document.getElementById("fractionInputBtn");
function resetFractionState() {

    fractionMode = false;
    fractionStage = 0;

    fractionNumerator = "";
    fractionDenominator = "";
    fractionExpression = "";

    nestedFractionMode = false;
    nestedFractionStage = 0;

    nestedFractionNumerator = "";
    nestedFractionDenominator = "";
    nestedFractionParentStage = 0;

    outerFractionNumerator = "";
    outerFractionDenominator = "";
}
let fractionInsideRoot = false;
let rootTypeForFraction = "";
function startFraction() {
// ==========================================
// معرفة العنصر الموجود قبل الكسر
// ==========================================

const currentDisplay = display.value.trim();

if (currentDisplay.endsWith("√(")) {
    fractionParent = "√";
}
else if (currentDisplay.endsWith("∛(")) {
    fractionParent = "∛";
}
else {
    fractionParent = "";
}

console.log("🌳 FRACTION PARENT:", fractionParent);
    // ==========================================
    // هل الكسر داخل √ أو ∛ ؟
    // ==========================================

    if (display.value.endsWith("√(")) {
        fractionInsideRoot = true;
        rootTypeForFraction = "√";
    }
    else if (display.value.endsWith("∛(")) {
        fractionInsideRoot = true;
        rootTypeForFraction = "∛";
    }
    else {
        fractionInsideRoot = false;
        rootTypeForFraction = "";
    }

    // حفظ التعبير الموجود قبل إدخال الكسر
    if (!fractionMode) {

    const current = display.value.trim();

    if (current.endsWith("√(")) {
        fractionInsideRoot = true;
        rootTypeForFraction = "√";

        // نحفظ كل شيء قبل √(
        fractionExpression = current.slice(0, -2);
    }
    else if (current.endsWith("∛(")) {
        fractionInsideRoot = true;
        rootTypeForFraction = "∛";

        // نحفظ كل شيء قبل ∛(
        fractionExpression = current.slice(0, -3);
    }
    else {
        fractionInsideRoot = false;
        rootTypeForFraction = "";
        fractionExpression = current;
    }
}

    console.log(
        "🔵 FRACTION START:",
        fractionExpression,
        "INSIDE ROOT:",
        fractionInsideRoot,
        rootTypeForFraction
    );

    fractionMode = true;
    fractionStage = 1;
    fractionNumerator = "";
    fractionDenominator = "";

    nestedFractionMode = false;
    nestedFractionStage = 0;
    nestedFractionDenominator = "";

    // باقي الكود كما هو...

    display.style.visibility = "hidden";

    const oldEditor = document.getElementById("fractionEditor");

    if (oldEditor) {
        oldEditor.remove();
    }

    const editor = document.createElement("div");

    editor.id = "fractionEditor";

    editor.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        width: 120px;
        height: 110px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        z-index: 999999;

        background: transparent;
        color: #000;

        box-sizing: border-box;
    `;

    const top = document.createElement("div");

    top.id = "fractionTop";
    top.textContent = "_";

    top.style.cssText = `
        width: 100px;
        height: 35px;

        display: flex;
        align-items: center;
        justify-content: center;

        color: #000 !important;
        background: transparent !important;

        font-size: 28px;
        font-family: Arial, sans-serif;
        font-weight: bold;

        box-sizing: border-box;
    `;

    const line = document.createElement("div");

    line.style.cssText = `
        width: 90px;
        height: 3px;
        background: #000;
        margin: 3px 0;
        flex-shrink: 0;
    `;

    const bottom = document.createElement("div");

    bottom.id = "fractionBottom";
    bottom.textContent = "_";

    bottom.style.cssText = `
        width: 100px;
        height: 35px;

        display: flex;
        align-items: center;
        justify-content: center;

        color: #000 !important;
        background: transparent !important;

        font-size: 28px;
        font-family: Arial, sans-serif;
        font-weight: bold;

        box-sizing: border-box;
    `;

    editor.appendChild(top);
    editor.appendChild(line);
    editor.appendChild(bottom);

    screen.style.position = "relative";

    screen.appendChild(editor);

    updateFractionDisplay();

    console.log("NEW FRACTION EDITOR CREATED");
    console.log("PREVIOUS FRACTION EXPRESSION:", fractionExpression);
}

// ==========================================
// تحديث شكل الكسر
// ==========================================

function formatFractionVisual(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "_";
    }

    let text = String(value);

    // ==========================================
    // ABS مفتوح
    // abs(3  →  |3
    // ==========================================

    text = text.replace(
        /abs\(([^()]*)$/,
        "|$1"
    );

    // ==========================================
    // ABS مغلق
    // abs(3) → |3|
    // ==========================================

    text = text.replace(
        /abs\(([^()]*)\)/g,
        "|$1|"
    );

    return text;
}

function updateFractionDisplay() {

    const editor = document.getElementById("fractionEditor");
    if (!editor) return;

    const top = editor.querySelector("#fractionTop");
    const bottom = editor.querySelector("#fractionBottom");

    // ==========================================
    // كسر داخلي
    // ==========================================

   if (nestedFractionMode) {

    const nestedHTML = `
        <div class="nested-fraction">
            <div class="nested-num">
                ${formatFractionVisual(nestedFractionNumerator)}
            </div>

            <div class="nested-line"></div>

            <div class="nested-den">
                ${formatFractionVisual(nestedFractionDenominator)}
            </div>
        </div>
    `;

    // الكسر الداخلي موجود داخل بسط الكسر الخارجي
    if (nestedFractionParentStage === 1) {

        if (top) {
            top.innerHTML = nestedHTML;
        }

        if (bottom) {
            bottom.textContent =
                fractionDenominator || "_";
        }
    }

    // الكسر الداخلي موجود داخل مقام الكسر الخارجي
    else if (nestedFractionParentStage === 2) {

        if (top) {
            top.textContent =
                fractionNumerator || "_";
        }

        if (bottom) {
            bottom.innerHTML = nestedHTML;
        }
    }

    return;
}

// ==========================================
// كسر خارجي
// ==========================================

// ==========================================
// الكسر الداخلي محفوظ داخل البسط
// ==========================================

if (
    nestedFractionParentStage === 1 &&
    (
        nestedFractionNumerator !== "" ||
        nestedFractionDenominator !== ""
    )
) {

    const nestedHTML = `
        <div class="nested-fraction">

            <div class="nested-num">
                ${formatFractionVisual(nestedFractionNumerator)}
            </div>

            <div class="nested-line"></div>

            <div class="nested-den">
                ${formatFractionVisual(nestedFractionDenominator)}
            </div>

        </div>
    `;

    if (top) {
        top.innerHTML = nestedHTML;
        top.style.opacity = "1";
    }

} else {

    if (top) {

        top.textContent =
            fractionNumerator || "_";

        top.style.opacity =
            fractionStage === 1
                ? "1"
                : "0.55";
    }
}


// ==========================================
// الكسر الداخلي محفوظ داخل المقام
// ==========================================

if (
    nestedFractionParentStage === 2 &&
    (
        nestedFractionNumerator !== "" ||
        nestedFractionDenominator !== ""
    )
) {

    const nestedHTML = `
        <div class="nested-fraction">

            <div class="nested-num">
                ${formatFractionVisual(nestedFractionNumerator)}
            </div>

            <div class="nested-line"></div>

            <div class="nested-den">
                ${formatFractionVisual(nestedFractionDenominator)}
            </div>

        </div>
    `;

    if (bottom) {
        bottom.innerHTML = nestedHTML;
        bottom.style.opacity = "1";
    }

} else {

    if (bottom) {

        bottom.textContent =
            fractionDenominator || "_";

        bottom.style.opacity =
            fractionStage === 2
                ? "1"
                : "0.55";
    }
}
}
// ==========================================
// زر a/b
// ==========================================



    fractionInputBtn.onclick = function () {

    // ==========================================
    // 1. مفيش كسر خارجي → ابدأ كسر جديد
    // ==========================================
    if (!fractionMode) {
        startFraction();
        return;
    }

    // ==========================================
    // 2. إحنا بالفعل داخل كسر داخلي
    // ==========================================
    if (nestedFractionMode) {

        // من بسط الداخلي → مقام الداخلي
        if (nestedFractionStage === 1) {

            nestedFractionStage = 2;

            console.log(
                "🟣 NESTED FRACTION → DENOMINATOR"
            );

            updateFractionDisplay();
            return;
        }

        // لو خلصنا المقام الداخلي
        // لا نمسح البيانات
        if (nestedFractionStage === 2) {

            console.log(
                "🟣 NESTED FRACTION COMPLETE"
            );

            return;
        }
    }

    // ==========================================
    // 3. إنشاء كسر داخلي جديد
    // ==========================================
    if (fractionStage === 1 || fractionStage === 2) {

        nestedFractionParentStage = fractionStage;

        nestedFractionMode = true;
        nestedFractionStage = 1;

        // نصفرهم فقط عند إنشاء كسر داخلي جديد
        nestedFractionNumerator = "";
        nestedFractionDenominator = "";

        console.log("🟣 NESTED FRACTION START");
        console.log(
            "OUTER STAGE:",
            nestedFractionParentStage
        );

        updateFractionDisplay();
        return;
    }

    // ==========================================
    // 4. حالة غير متوقعة
    // ==========================================
    fractionMode = false;
    fractionStage = 0;

    startFraction();
};
const expBtn = document.getElementById("expBtn");

if (expBtn) {

    expBtn.onclick = () => {

        // ==========================================
        // SHIFT + EXP = Polar
        // ==========================================
       // ==========================================
// SHIFT + EXP = Pol(
// ==========================================
if (shift) {

    writeToDisplay("Pol(");

    shift = false;

    if (status) {
        status.textContent = currentMode;
    }

    console.log("🟣 SHIFT + EXP → Pol(");

    return;
}

        // ==========================================
        // EXP العادي
        // ==========================================
        writeToDisplay("e");
    };
}
// ==========================================
// SHIFT + Ans = Rectangular
// ==========================================
const ansBtn = document.getElementById("ansBtn");

if (ansBtn) {

    ansBtn.onclick = () => {

        // ==========================================
        // SHIFT + ANS = Rec(
        // ==========================================
        if (shift) {

            if (currentMode === "CMPLX") {

                writeToDisplay("Rec(");

                shift = false;

                if (status) {
                    status.textContent = currentMode;
                }

                console.log("🟣 SHIFT + ANS → Rec(");

                return;
            }
        }

        // ==========================================
        // ANS العادي
        // ==========================================

        writeToDisplay("Ans");
    };
}

const sciExpBtn = document.getElementById("sciExpBtn");

if (sciExpBtn) {
    sciExpBtn.onclick = () => {

        // ==========================================
        // 10^x داخل الكسر
        // ==========================================

        if (fractionMode) {

            if (nestedFractionMode) {

                if (nestedFractionStage === 1) {
                    nestedFractionNumerator += "10^";
                }
                else if (nestedFractionStage === 2) {
                    nestedFractionDenominator += "10^";
                }

                updateFractionDisplay();

                console.log(
                    "🟣 NESTED 10^:",
                    nestedFractionStage === 1
                        ? nestedFractionNumerator
                        : nestedFractionDenominator
                );

                return;
            }

            if (fractionStage === 1) {
                fractionNumerator += "10^";
            }
            else if (fractionStage === 2) {
                fractionDenominator += "10^";
            }

            updateFractionDisplay();

            console.log("🔵 OUTER 10^");

            return;
        }

        // الاستخدام العادي
        writeToDisplay("10^");
    };
}

// ==========================================
// 9. الأزرار العلوية و القوائم (SHIFT, ALPHA, MODE, SETUP)
// ==========================================
const modeMenu = document.getElementById("modeMenu");
const setupMenu = document.getElementById("setupMenu");

const shiftBtn = document.getElementById("shiftBtn");

if (shiftBtn) {
    shiftBtn.onclick = () => {
        shift = !shift;
        alpha = false;

        console.log("🔥 SHIFT =", shift);

        if (status) {
            status.textContent = shift ? "SHIFT" : currentMode;
        }
    };
}
const dotBtn = document.getElementById("dotBtn");

if (dotBtn) {
    dotBtn.onclick = function () {

        // ==========================================
        // SHIFT + . = فاصلة
        // VECTOR / CMPLX
        // ==========================================

        if (shift) {
// ==========================================
// SHIFT + . = فاصلة داخل STAT
// ==========================================

if (
    currentMode === "STAT" &&
    activeStatField
) {

    const field =
        document.getElementById(activeStatField);

    if (field) {

        field.value += ",";

        console.log(
            "🟢 STAT COMMA:",
            activeStatField,
            field.value
        );

        shift = false;

        if (status) {
            status.textContent = currentMode;
        }

        return;
    }
}
            // VECTOR
            if (
                currentMode === "VECTOR" &&
                activeVectorField
            ) {
                const field = document.getElementById(
                    activeVectorField === "A"
                        ? "vectorA"
                        : "vectorB"
                );

                if (field) {
                    field.value += ",";
                }

                shift = false;

                if (status) {
                    status.textContent = currentMode;
                }

                console.log("VECTOR COMMA");

                return;
            }

            // CMPLX / Pol / Rec
            if (currentMode === "CMPLX") {

                writeToDisplay(",");

                shift = false;

                if (status) {
                    status.textContent = currentMode;
                }

                console.log("🟣 CMPLX COMMA");

                return;
            }
        }

        // ==========================================
        // النقطة داخل الكسر
        // ==========================================

        if (fractionMode) {

            if (nestedFractionMode) {

                if (nestedFractionStage === 1) {
                    nestedFractionNumerator += ".";
                }
                else if (nestedFractionStage === 2) {
                    nestedFractionDenominator += ".";
                }

                updateFractionDisplay();
                return;
            }

            if (fractionStage === 1) {
                fractionNumerator += ".";
            }
            else if (fractionStage === 2) {
                fractionDenominator += ".";
            }

            updateFractionDisplay();
            return;
        }

        // ==========================================
        // النقطة العادية
        // ==========================================

        writeToDisplay(".");
    };
}

const alphaBtn = document.getElementById("alphaBtn");
if (alphaBtn) {
    alphaBtn.onclick = () => {
        alpha = !alpha;
        shift = false;
        if (status) status.textContent = alpha ? "ALPHA" : currentMode;
    };
}

const modeBtn = document.getElementById("modeBtn");
if (modeBtn) {
    modeBtn.onclick = () => {
        if (modeMenu) modeMenu.classList.toggle("hidden");
        if (setupMenu) setupMenu.classList.add("hidden");
    };
}

const setupBtn = document.getElementById("setupBtn");
if (setupBtn) {
    setupBtn.onclick = () => {
        if (setupMenu) setupMenu.classList.toggle("hidden");
        if (modeMenu) modeMenu.classList.add("hidden");
    };
}

document.querySelectorAll("#setupMenu button").forEach(btn => {
    btn.onclick = function () {
        angleMode = this.dataset.angle || "DEG";
        if (status) status.textContent = angleMode;
        if (expression) expression.textContent = "ANGLE: " + angleMode;
        if (setupMenu) setupMenu.classList.add("hidden");
    };
});

// ==========================================
// 10 & 11. الأوضاع المتقدمة والتفاعلية (داخل الشاشة بالكامل)
// ==========================================
document.querySelectorAll("#modeMenu button").forEach(btn => {
    btn.onclick = function () {
        currentMode = this.dataset.mode || "COMP";
        if (status) status.textContent = currentMode;
        if (expression) expression.textContent = "MODE: " + currentMode;
        if (modeMenu) modeMenu.classList.add("hidden");
        closeCustomPanel();

        if (currentMode === "STAT") {
            createScreenPanel(`
                <div style="font-weight:bold; border-bottom:1px solid #000; margin-bottom:4px;">STAT Mode:</div>
                أدخل القيم (بفاصلة):<br>
                <input id="statInput" type="text" inputmode="none" style="width:90%; font-size:10px; margin:4px 0;" placeholder="10,20,30,40"  onpointerdown="event.preventDefault(); activeStatField='statInput'; console.log('SELECT STAT:', activeStatField)"><br>
                <button onclick="addStatData()" style="width:100%; font-size:10px; background:#ccc; border:1px solid #555; cursor:pointer;">
    [ DATA ] أضف القيمة
</button>
                <button onclick="calcStat()" style="width:100%; font-size:10px; background:#ccc; border:1px solid #555; cursor:pointer;">[ = ] احسب</button>
                <button onclick="clearStat()" style="width:100%; font-siz
                e:10px; background:#ccc; border:1px solid #555; cursor:pointer;">[ CLR ] مسح STAT</button>
                <div style="font-weight:bold; margin-top:6px;">
    Linear Regression
</div>


<input id="statXInput"
       type="text"
       inputmode="none"
       style="width:90%; font-size:10px; margin:2px 0;"
       placeholder="X: 1,2,3"
       onpointerdown="event.preventDefault(); activeStatField='statXInput'; console.log('SELECT X:', activeStatField)">

<input id="statYInput"
       type="text"
        inputmode="none"
       style="width:90%; font-size:10px; margin:2px 0;"
       placeholder="Y: 2,4,6"
       onpointerdown="event.preventDefault(); activeStatField='statYInput'; console.log('SELECT Y:', activeStatField)">


<button onclick="calcRegression()"
        style="width:100%; font-size:10px; background:#ccc; border:1px solid #555; cursor:pointer;">
    [ REG ] انحدار خطي
</button>

<div id="regRes" style="margin-top:4px; font-weight:bold;"></div>

<input id="predictX"
       type="text"
       inputmode="none"
       style="width:90%; font-size:10px; margin:3px 0;"
       placeholder="X للتنبؤ"
        onpointerdown="event.preventDefault(); activeStatField='predictX'; console.log('SELECT PREDICT:', activeStatField)">



<button onclick="predictRegression()"
        style="width:100%; font-size:10px; background:#ccc; border:1px solid #555;">
    [ PREDICT ] توقع Y
</button>
                <div id="statRes" style="margin-top:4px; font-weight:bold;"></div>
            `);
        }  if (currentMode === "EQN") {
    createScreenPanel(`
        <div style="font-weight:bold; border-bottom:1px solid #000; margin-bottom:4px;">
            EQN Mode:
        </div>

        <button style="width:100%; margin:2px 0; font-size:10px;"
            onclick="setupEqn(1)">
            1: ax² + bx + c = 0
        </button>

        <button style="width:100%; margin:2px 0; font-size:10px;"
            onclick="setupEqn(2)">
            2: a₁x + b₁y = c₁
        </button>

        <button style="width:100%; margin:2px 0; font-size:10px;"
            onclick="setupEqn(3)">
            3: 3 Unknowns
        </button>

        <button style="width:100%; margin:2px 0; font-size:10px;"
            onclick="setupEqn(4)">
            4: ax³ + bx² + cx + d = 0
        </button>

        <button style="width:100%; margin:2px 0; font-size:10px;"
            onclick="setupEqn(5)">
            5: 4th Degree
        </button>

        <div id="eqnForm" style="margin-top:4px;"></div>
    `);
} else if (currentMode === "TABLE") {
            createScreenPanel(`
                <div style="font-weight:bold; border-bottom:1px solid #000; margin-bottom:2px;">TABLE Mode:</div>
                f(X) = <br><input id="tableFx" value="" style="width:55%; font-size:10px;">
<button onclick="activeTableField='tableFx'">
    اختيار f(X)
</button>
                 Start:
<input id="tStart"
       value=""
       style="width:20px; font-size:10px;">

<button onclick="activeTableField='tStart'">
    Start
</button>
                 End:
<input id="tEnd"
       value=""
       style="width:20px; font-size:10px;">

<button onclick="activeTableField='tEnd'">
    End
</button>
              Step:
<input id="tStep"
       value=""
       style="width:20px; font-size:10px;">

<button onclick="activeTableField='tStep'">
    Step
</button>
                <button onclick="generateTable()" style="width:100%; margin-top:3px; font-size:10px;">[ = ] عرض الجدول</button>
                <div id="tableRes" style="margin-top:2px;"></div>
            `);
            
            } else if (currentMode === "MATRIX") {

    createScreenPanel(`
        <div style="font-weight:bold; border-bottom:1px solid #000; margin-bottom:4px;">
            MATRIX Mode:
        </div>

        <button onclick="matrixSetup('A')"
            style="width:100%; margin:2px 0; font-size:10px;">
            1: MatA
        </button>

        <button onclick="matrixSetup('B')"
            style="width:100%; margin:2px 0; font-size:10px;">
            2: MatB
        </button>

        <button onclick="matrixSetup('C')"
            style="width:100%; margin:2px 0; font-size:10px;">
            3: MatC
        </button>

        <div id="matrixForm" style="margin-top:4px;"></div>
    `);
        } else if (currentMode === "VECTOR") {

    createScreenPanel(`
        <div style="font-weight:bold; border-bottom:1px solid #000; margin-bottom:4px;">
            VECTOR Mode:
        </div>

        <div>A:</div>
<button onclick="activeVectorField='A'">
    اختيار A
</button>

        <input id="vectorA"
            type="text"
            style="width:90%; font-size:10px; margin:3px 0;"
            placeholder="1,2,3">

       <div>B:</div>
<button onclick="activeVectorField='B'">
    اختيار B
</button>
        <input id="vectorB"
            type="text"
            style="width:90%; font-size:10px; margin:3px 0;"
            placeholder="4,5,6">

        <button onclick="calcVectorMagnitude()"
            style="width:100%; margin:2px 0; font-size:10px;">
            |A| مقدار A
        </button>

       <button id="vectorDotBtn"
    style="width:100%; margin:2px 0; font-size:10px;">
    A · B
</button>

        <button onclick="calcVectorCross()"
            style="width:100%; margin:2px 0; font-size:10px;">
            A × B
        </button>

        <button onclick="calcVectorAdd()"
    style="width:100%; margin:2px 0; font-size:10px;">
    A + B
</button>

<button onclick="calcVectorSub()"
    style="width:100%; margin:2px 0; font-size:10px;">
    A − B
</button>

<button onclick="calcVectorAngle()"
    style="width:100%; margin:2px 0; font-size:10px;">
    Angle A,B
</button>

<button onclick="calcVectorUnit()"
    style="width:100%; margin:2px 0; font-size:10px;">
    Unit Vector A
</button>
<button onclick="calcVectorProjection()"
    style="width:100%; margin:2px 0; font-size:10px;">
    Proj(A,B)
</button>
        <div id="vectorRes"
            style="margin-top:5px; font-weight:bold;">
        </div>
    `);
    console.log("VECTOR PANEL CREATED");

const testBtn = document.getElementById("vectorDotBtn");

if (testBtn) {
    testBtn.onclick = function () {
        document.getElementById("vectorRes").textContent = "TEST OK";
        console.log("VECTOR BUTTON CLICKED");
    };
}
const vectorDotBtn = document.getElementById("vectorDotBtn");

if (vectorDotBtn) {
    vectorDotBtn.onclick = function () {
        calcVectorDot();
    };
}
} else if (currentMode === "CMPLX") {
}       
  };
});
// ==========================================
// MATRIX - اختيار المصفوفة والأبعاد
// ==========================================

window.matrixSetup = function(name) {

    const form = document.getElementById("matrixForm");
    if (!form) return;
     form.style.direction = "rtl";
form.style.textAlign = "right";


    form.innerHTML = `
        <div style="font-size:10px; font-weight:bold;">
            Mat${name} - اختر الحجم:
        </div>

        <div style="
            display:grid;
            grid-template-columns:repeat(4, 1fr);
            gap:2px;
            margin-top:4px;
            direction:rtl;
        ">

            <button onclick="matrixCreate('${name}',1,1)"
    style="font-size:9px;">
    1 × 1
</button>
            <button onclick="matrixCreate('${name}',1,2)"
                style="font-size:9px;">1 × 2</button>

            <button onclick="matrixCreate('${name}',1,3)"
                style="font-size:9px;">1 × 3</button>

            <button onclick="matrixCreate('${name}',1,4)"
                style="font-size:9px;">1 × 4</button>

            <button onclick="matrixCreate('${name}',2,1)"
                style="font-size:9px;">2 × 1</button>

            <button onclick="matrixCreate('${name}',2,2)"
                style="font-size:9px;">2 × 2</button>

            <button onclick="matrixCreate('${name}',2,3)"
                style="font-size:9px;">2 × 3</button>

            <button onclick="matrixCreate('${name}',2,4)"
                style="font-size:9px;">2 × 4</button>

            <button onclick="matrixCreate('${name}',3,1)"
                style="font-size:9px;">3 × 1</button>

            <button onclick="matrixCreate('${name}',3,2)"
                style="font-size:9px;">3 × 2</button>

            <button onclick="matrixCreate('${name}',3,3)"
                style="font-size:9px;">3 × 3</button>

            <button onclick="matrixCreate('${name}',3,4)"
                style="font-size:9px;">3 × 4</button>

            <button onclick="matrixCreate('${name}',4,1)"
                style="font-size:9px;">4 × 1</button>

            <button onclick="matrixCreate('${name}',4,2)"
                style="font-size:9px;">4 × 2</button>

            <button onclick="matrixCreate('${name}',4,3)"
                style="font-size:9px;">4 × 3</button>

            <button onclick="matrixCreate('${name}',4,4)"
                style="font-size:9px;">4 × 4</button>

        </div>

        <button onclick="matrixTypeMenu('${name}')"
            style="width:100%; margin-top:4px; font-size:10px;">
            Matrix Type
        </button>

        <button onclick="matrixAdd()"
            style="width:100%; margin:2px 0; font-size:10px;">
            MatA + MatB
        </button>

        <button onclick="matrixSubtract()"
            style="width:100%; margin:2px 0; font-size:10px;">
            MatA - MatB
        </button>

        <button onclick="matrixMultiply()"
            style="width:100%; margin:2px 0; font-size:10px;">
            MatA × MatB
        </button>

        <button onclick="matrixDetA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            det(MatA)
        </button>

        <button onclick="matrixInverseA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            MatA⁻¹
        </button>

        <button onclick="matrixTransposeA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Trn(MatA)
        </button>

        <button onclick="matrixSquareA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            MatA²
        </button>

        <button onclick="matrixPowerA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            MatA^n
        </button>

        <button onclick="matrixScalarA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            MatA × K
        </button>

        <button onclick="matrixRankA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Rank(MatA)
        </button>

        <button onclick="matrixTraceA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Tr(MatA)
        </button>

        <button onclick="matrixAdjA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Adj(MatA)
        </button>

        <button onclick="matrixNormA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Norm(MatA)
        </button>

        <button onclick="matrixCondA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Cond(MatA)
        </button>

        <button onclick="matrixIsSymmetric()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Is Symmetric?
        </button>

        <button onclick="matrixIsSkew()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Is Skew-Symmetric?
        </button>

        <button onclick="matrixIsDiagonal()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Is Diagonal?
        </button>

        <button onclick="matrixIsIdentity()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Is Identity?
        </button>

        <button onclick="matrixIsZero()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Is Zero?
        </button>

        <button onclick="matrixDetA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Det(MatA)
        </button>

        <button onclick="matrixCofactorA()"
            style="width:100%; margin:2px 0; font-size:10px;">
            Cof(MatA)
        </button>

        <button onclick="matrixMultiplyAB()"
            style="width:100%; margin:2px 0; font-size:10px;">
            MatA × MatB
        </button>
    `;
};
window.matrixTypeMenu = function(name) {

    const form = document.getElementById("matrixForm");
    if (!form) return;
   
    form.innerHTML = `
        <div style="font-size:10px; font-weight:bold;">
            Mat${name} - نوع المصفوفة
        </div>

        <button onclick="matrixCreateType('${name}','ZERO')"
            style="width:100%; margin:2px 0; font-size:10px;">
            1: Zero Matrix
        </button>

        <button onclick="matrixCreateType('${name}','IDENTITY')"
            style="width:100%; margin:2px 0; font-size:10px;">
            2: Identity Matrix
        </button>
        <button onclick="matrixCreateType('${name}','DIAGONAL')"
    style="width:100%; margin:2px 0; font-size:10px;">
    3: Diagonal Matrix
</button>

<button onclick="matrixCreateType('${name}','SCALAR')"
    style="width:100%; margin:2px 0; font-size:10px;">
    4: Scalar Matrix
</button>
<button onclick="matrixCreateType('${name}','SYMMETRIC')"
    style="width:100%; margin:2px 0; font-size:10px;">
    5: Symmetric Matrix
</button>
<button onclick="matrixCreateType('${name}','SKEW')"
    style="width:100%; margin:2px 0; font-size:10px;">
    6: Skew-Symmetric Matrix
</button>
    `;
    
};
window.matrixCreateType = function(name, type) {

    const form = document.getElementById("matrixForm");
    if (!form) return;

    if (type === "DIAGONAL" || type === "SCALAR") {

        form.innerHTML = `
            <div style="font-size:10px; font-weight:bold;">
                Mat${name} - ${type}
            </div>

            <div style="font-size:9px; margin:4px 0;">
                أدخل القيم القطرية:
            </div>

            <button onclick="matrixGenerate('${name}','${type}',2)"
                style="width:48%; font-size:10px;">
                2 × 2
            </button>

            <button onclick="matrixGenerate('${name}','${type}',3)"
                style="width:48%; font-size:10px;">
                3 × 3
            </button>
        `;

        return;
    }

    form.innerHTML = `
        <div style="font-size:10px; font-weight:bold;">
            Mat${name} - ${type}
        </div>

        <button onclick="matrixGenerate('${name}','${type}',2)"
            style="width:48%; font-size:10px;">
            2 × 2
        </button>

        <button onclick="matrixGenerate('${name}','${type}',3)"
            style="width:48%; font-size:10px;">
            3 × 3
        </button>
    `;
};
window.matrixGenerate = function(name, type, size) {

    const form = document.getElementById("matrixForm");
    if (!form) return;

    // ==========================================
    // Zero / Identity
    // ==========================================

    if (type === "ZERO" || type === "IDENTITY") {

        let matrix = [];

        for (let r = 0; r < size; r++) {

            let row = [];

            for (let c = 0; c < size; c++) {

                if (type === "ZERO") {
                    row.push(0);
                } else {
                    row.push(r === c ? 1 : 0);
                }

            }

            matrix.push(row);
        }

        window.matrices = window.matrices || {};
        window.matrices[name] = matrix;

        matrixShow(name, matrix);

        return;
    }

    // ==========================================
    // Diagonal
    // ==========================================

    if (type === "DIAGONAL") {

        window.matrixData = {
            name: name,
            type: type,
            size: size,
            values: [],
            current: ""
        };

        form.innerHTML = `
            <div style="font-size:12px;font-weight:bold;">
                Mat${name} Diagonal ${size}×${size}
            </div>

            <div id="matrixInput"
                 style="font-size:11px;font-weight:bold;margin-top:5px;">
                a11 = _
            </div>

            <div style="font-size:9px;margin-top:4px;">
                أدخل قيم القطر واضغط = بعد كل قيمة
            </div>

            <div id="matrixResult"
                 style="margin-top:5px;"></div>
        `;

        return;
    }
     if (type === "SYMMETRIC") {

    window.matrixData = {
        name: name,
        type: type,
        size: size,
        values: [],
        current: ""
    };

    form.innerHTML = `
        <div style="font-size:12px;font-weight:bold;">
            Mat${name} Symmetric ${size}×${size}
        </div>

        <div id="matrixInput"
             style="font-size:11px;font-weight:bold;margin-top:5px;">
            a11 = _
        </div>

        <div style="font-size:9px;margin-top:4px;">
            أدخل عناصر النصف العلوي
        </div>

        <div id="matrixResult"
             style="margin-top:5px;"></div>
    `;

    return;
}

    // ==========================================
    // Scalar
    // ==========================================

    if (type === "SCALAR") {

        window.matrixData = {
            name: name,
            type: type,
            size: size,
            values: [],
            current: ""
        };

        form.innerHTML = `
            <div style="font-size:12px;font-weight:bold;">
                Mat${name} Scalar ${size}×${size}
            </div>

            <div id="matrixInput"
                 style="font-size:11px;font-weight:bold;margin-top:5px;">
                القيمة = _
            </div>

            <div style="font-size:9px;margin-top:4px;">
                أدخل قيمة واحدة واضغط =
            </div>

            <div id="matrixResult"
                 style="margin-top:5px;"></div>
        `;

        return;
    }
     if (type === "SKEW") {

    window.matrixData = {
        name: name,
        type: type,
        size: size,
        values: [],
        current: ""
    };

    form.innerHTML = `
        <div style="font-size:12px;font-weight:bold;">
            Mat${name} Skew-Symmetric ${size}×${size}
        </div>

        <div id="matrixInput"
             style="font-size:11px;font-weight:bold;margin-top:5px;">
            a12 = _
        </div>

        <div style="font-size:9px;margin-top:4px;">
            أدخل عناصر أعلى القطر الرئيسي
        </div>

        <div id="matrixResult"
             style="margin-top:5px;"></div>
    `;

    return;
}
};
function matrixShow(name, matrix) {

    const form = document.getElementById("matrixForm");
    if (!form) return;

    let output = `
        <div style="
            font-size:13px;
            font-weight:bold;
            margin-bottom:4px;
        ">
            Mat${name} =
        </div>
    `;

    matrix.forEach(row => {

        output += `
            <div style="
                font-size:14px;
                font-weight:bold;
                line-height:1.6;
                text-align:center;
            ">
                [ ${row.join("   ")} ]
            </div>
        `;

    });

    form.innerHTML = output;
}
window.matrixAdd = function () {

    if (
        !window.matrices ||
        !window.matrices.A ||
        !window.matrices.B
    ) {
        alert("يجب إدخال MatA و MatB أولاً");
        return;
    }

    const A = window.matrices.A;
    const B = window.matrices.B;

    if (
        A.length !== B.length ||
        A[0].length !== B[0].length
    ) {
        alert("حجم MatA و MatB يجب أن يكون متساويًا");
        return;
    }

    const result = A.map((row, r) =>
        row.map((value, c) =>
            value + B[r][c]
        )
    );

    matrixShow("A+B", result);
};
window.matrixSubtract = function() {

    if (!window.matrices) return;

    const A = window.matrices["A"];
    const B = window.matrices["B"];

    if (!A || !B) {
        alert("MatA و MatB لازم يكونوا موجودين");
        return;
    }

    if (
        A.length !== B.length ||
        A[0].length !== B[0].length
    ) {
        alert("لا يمكن طرح مصفوفتين بأبعاد مختلفة");
        return;
    }

    const result = A.map((row, r) =>
        row.map((value, c) =>
            value - B[r][c]
        )
    );

    matrixShow("A-B", result);
};
window.matrixMultiply = function () {

    if (!window.matrices) return;

    const A = window.matrices.A;
    const B = window.matrices.B;

    if (!A || !B) {
        alert("يجب إدخال MatA و MatB أولاً");
        return;
    }

    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;

    // عدد أعمدة A لازم يساوي عدد صفوف B
    if (colsA !== rowsB) {
        alert("لا يمكن ضرب المصفوفتين");
        return;
    }

    const result = Array.from(
        { length: rowsA },
        () => Array(colsB).fill(0)
    );

    for (let i = 0; i < rowsA; i++) {

        for (let j = 0; j < colsB; j++) {

            for (let k = 0; k < colsA; k++) {

                result[i][j] +=
                    A[i][k] * B[k][j];

            }
        }
    }

    matrixShow("A×B", result);
};
window.matrixDetA = function () {

    if (!window.matrices || !window.matrices.A) {
        alert("MatA غير موجودة");
        return;
    }

    const A = window.matrices.A;

    if (A.length !== A[0].length) {
        alert("المحدد يحتاج مصفوفة مربعة");
        return;
    }

    let det;

    if (A.length === 1) {

        det = A[0][0];

    } else if (A.length === 2) {

        det =
            A[0][0] * A[1][1] -
            A[0][1] * A[1][0];

    } else if (A.length === 3) {

        det =
            A[0][0] * (
                A[1][1] * A[2][2] -
                A[1][2] * A[2][1]
            )
            -
            A[0][1] * (
                A[1][0] * A[2][2] -
                A[1][2] * A[2][0]
            )
            +
            A[0][2] * (
                A[1][0] * A[2][1] -
                A[1][1] * A[2][0]
            );

    } else {

        alert("المحدد متاح حاليًا حتى 3×3");
        return;
    }

    det =
        Math.abs(det) < 1e-12
            ? 0
            : Number(det.toFixed(8));

    matrixShow("det(A)", [[det]]);
};
window.matrixInverseA = function () {

    if (!window.matrices || !window.matrices.A) {
        alert("MatA غير موجودة");
        return;
    }

    const A = window.matrices.A;

    if (
        A.length !== A[0].length ||
        (A.length !== 2 && A.length !== 3)
    ) {
        alert("المعكوس متاح حاليًا لـ 2×2 و 3×3");
        return;
    }

    let det;

    if (A.length === 2) {

        det =
            A[0][0] * A[1][1] -
            A[0][1] * A[1][0];

        if (Math.abs(det) < 1e-12) {
            alert("MatA ليس لها معكوس");
            return;
        }

        const inv = [
            [ A[1][1] / det, -A[0][1] / det ],
            [ -A[1][0] / det, A[0][0] / det ]
        ];

        matrixShow("A⁻¹", inv);
        return;
    }

    // 3×3

    det =
        A[0][0] * (
            A[1][1] * A[2][2] -
            A[1][2] * A[2][1]
        )
        -
        A[0][1] * (
            A[1][0] * A[2][2] -
            A[1][2] * A[2][0]
        )
        +
        A[0][2] * (
            A[1][0] * A[2][1] -
            A[1][1] * A[2][0]
        );

    if (Math.abs(det) < 1e-12) {
        alert("MatA ليس لها معكوس");
        return;
    }

    const cof = [];

    for (let r = 0; r < 3; r++) {

        cof[r] = [];

        for (let c = 0; c < 3; c++) {

            const rows = [0, 1, 2].filter(x => x !== r);
            const cols = [0, 1, 2].filter(x => x !== c);

            const minor =
                A[rows[0]][cols[0]] * A[rows[1]][cols[1]]
                -
                A[rows[0]][cols[1]] * A[rows[1]][cols[0]];

            cof[r][c] =
                ((r + c) % 2 === 0 ? 1 : -1) * minor;
        }
    }

    const inv = [];

    for (let r = 0; r < 3; r++) {

        inv[r] = [];

        for (let c = 0; c < 3; c++) {

            inv[r][c] =
                cof[c][r] / det;
        }
    }

    matrixShow("A⁻¹", inv);
};
window.matrixTransposeA = function () {

    if (!window.matrices || !window.matrices.A) {
        alert("MatA غير موجودة");
        return;
    }

    const A = window.matrices.A;

    const result = A[0].map((_, c) =>
        A.map(row => row[c])
    );

    matrixShow("Aᵀ", result);
};
window.matrixSquareA = function () {

    if (!window.matrices || !window.matrices.A) {
        alert("MatA غير موجودة");
        return;
    }

    const A = window.matrices.A;

    // لازم تكون مربعة
    if (A.length !== A[0].length) {
        alert("MatA لازم تكون مربعة");
        return;
    }

    const n = A.length;

    const result =
        Array.from(
            { length: n },
            () => Array(n).fill(0)
        );

    for (let i = 0; i < n; i++) {

        for (let j = 0; j < n; j++) {

            for (let k = 0; k < n; k++) {

                result[i][j] +=
                    A[i][k] * A[k][j];

            }
        }
    }

    matrixShow("A²", result);
};
window.matrixPowerA = function () {

    if (!window.matrices || !window.matrices.A) {
        alert("MatA غير موجودة");
        return;
    }

    const A = window.matrices.A;

    // لازم تكون مربعة
    if (A.length === 0 || A.length !== A[0].length) {
        alert("MatA لازم تكون مربعة");
        return;
    }

    const form = document.getElementById("matrixForm");

    if (!form) return;

    window.matrixPowerData = {
        current: ""
    };

    form.innerHTML = `
        <div style="
            font-size:11px;
            font-weight:bold;
            text-align:center;
        ">
            MatA^n
        </div>

        <div id="matrixPowerInput"
             style="
                font-size:14px;
                font-weight:bold;
                margin-top:8px;
                text-align:center;
             ">
            n = _
        </div>

        <div style="
            font-size:9px;
            margin-top:5px;
            text-align:center;
        ">
            أدخل قيمة n ثم اضغط =
        </div>
    `;
};
window.matrixPowerInput = function (value) {

    if (!window.matrixPowerData) {
        window.matrixPowerData = {
            current: ""
        };
    }

    window.matrixPowerData.current += String(value);

    const input =
        document.getElementById("matrixPowerInput");

    if (input) {
        input.textContent =
            "n = " + window.matrixPowerData.current;
    }
};
window.matrixPowerCalculate = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;

    const n = Number(window.matrixPowerData?.current);

    if (!Number.isInteger(n) || n < 0) {
        alert("قيمة n يجب أن تكون عددًا صحيحًا موجبًا أو صفرًا");
        return;
    }

    const size = A.length;

    function multiply(X, Y) {

        const result =
            Array.from(
                { length: size },
                () => Array(size).fill(0)
            );

        for (let i = 0; i < size; i++) {

            for (let j = 0; j < size; j++) {

                for (let k = 0; k < size; k++) {

                    result[i][j] +=
                        X[i][k] * Y[k][j];
                }
            }
        }

        return result;
    }

    // مصفوفة الوحدة
    let result =
        Array.from(
            { length: size },
            (_, i) =>
                Array.from(
                    { length: size },
                    (_, j) => i === j ? 1 : 0
                )
        );

    let base = A.map(row => [...row]);

    let power = n;

    // Exponentiation by squaring
    while (power > 0) {

        if (power % 2 === 1) {
            result = multiply(result, base);
        }

        base = multiply(base, base);

        power = Math.floor(power / 2);
    }

    matrixShow("MatA^" + n, result);

    window.matrixPowerData = {
        current: ""
    };
};
window.matrixScalarA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const form = document.getElementById("matrixForm");
    if (!form) return;

    window.matrixScalarData = {
        current: ""
    };

    form.innerHTML = `
        <div style="font-size:11px; font-weight:bold;">
            MatA × K
        </div>

        <div id="matrixScalarInput"
             style="
                font-size:12px;
                font-weight:bold;
                margin-top:6px;
             ">
            K = _
        </div>

        <div style="
            font-size:9px;
            margin-top:4px;
        ">
            أدخل قيمة K ثم اضغط =
        </div>
    `;
};
window.matrixRankA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A.map(row => [...row]);

    const rows = A.length;
    const cols = A[0].length;

    let rank = 0;

    for (let col = 0; col < cols && rank < rows; col++) {

        let pivot = rank;

        while (
            pivot < rows &&
            Math.abs(A[pivot][col]) < 1e-10
        ) {
            pivot++;
        }

        if (pivot === rows) {
            continue;
        }

        [A[rank], A[pivot]] =
            [A[pivot], A[rank]];

        const pivotValue = A[rank][col];

        for (let j = col; j < cols; j++) {
            A[rank][j] /= pivotValue;
        }

        for (let i = 0; i < rows; i++) {

            if (i === rank) continue;

            const factor = A[i][col];

            for (let j = col; j < cols; j++) {
                A[i][j] -= factor * A[rank][j];
            }
        }

        rank++;
    }

    const form =
        document.getElementById("matrixForm");

    if (!form) return;

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            Rank(MatA) = ${rank}
        </div>
    `;
};
window.matrixTraceA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;

    // لازم تكون مربعة
    if (A.length !== A[0].length) {
        return;
    }

    let trace = 0;

    for (let i = 0; i < A.length; i++) {
        trace += A[i][i];
    }

    const form =
        document.getElementById("matrixForm");

    if (!form) return;

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            Tr(MatA) = ${trace}
        </div>
    `;
};
window.matrixAdjA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;

    if (A.length !== A[0].length) {
        return;
    }

    const n = A.length;

    // مصفوفة المحصلات Cofactors
    const cofactors =
        Array.from(
            { length: n },
            () => Array(n).fill(0)
        );

    // مصفوفة 1×1
    if (n === 1) {
        cofactors[0][0] = 1;
        matrixShow("Adj(A)", cofactors);
        return;
    }

    // حساب الـ Cofactors
    for (let i = 0; i < n; i++) {

        for (let j = 0; j < n; j++) {

            const minor = [];

            for (let r = 0; r < n; r++) {

                if (r === i) continue;

                const row = [];

                for (let c = 0; c < n; c++) {

                    if (c === j) continue;

                    row.push(A[r][c]);
                }

                minor.push(row);
            }

            let determinant;

            if (minor.length === 1) {

                determinant = minor[0][0];

            } else {

                determinant = 0;

                for (let c = 0; c < minor.length; c++) {

                    const subMinor = [];

                    for (let r = 1; r < minor.length; r++) {

                        const row = [];

                        for (let k = 0; k < minor.length; k++) {

                            if (k === c) continue;

                            row.push(minor[r][k]);
                        }

                        subMinor.push(row);
                    }

                    let subDet;

                    if (subMinor.length === 1) {
                        subDet = subMinor[0][0];
                    } else {
                        subDet =
                            subMinor[0][0] * subMinor[1][1] -
                            subMinor[0][1] * subMinor[1][0];
                    }

                    determinant +=
                        (c % 2 === 0 ? 1 : -1) *
                        minor[0][c] *
                        subDet;
                }
            }

            cofactors[i][j] =
                ((i + j) % 2 === 0 ? 1 : -1) *
                determinant;
        }
    }

    // Adj(A) = transpose(Cofactor Matrix)
    const adj =
        cofactors[0].map((_, colIndex) =>
            cofactors.map(row => row[colIndex])
        );

    matrixShow("Adj(A)", adj);
};
window.matrixNormA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;

    let sum = 0;

    for (let r = 0; r < A.length; r++) {

        for (let c = 0; c < A[r].length; c++) {

            sum += A[r][c] * A[r][c];

        }
    }

    const norm = Math.sqrt(sum);

    const form =
        document.getElementById("matrixForm");

    if (!form) return;

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            Norm(MatA) = ${Number(norm.toFixed(6))}
        </div>
    `;
};
window.matrixIsSymmetric = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;

    // لازم تكون مربعة
    if (A.length !== A[0].length) {

        const form =
            document.getElementById("matrixForm");

        if (form) {
            form.innerHTML = `
                <div style="
                    font-size:13px;
                    font-weight:bold;
                    text-align:center;
                ">
                    Not Symmetric
                </div>
            `;
        }

        return;
    }

    const n = A.length;

    let symmetric = true;

    for (let i = 0; i < n; i++) {

        for (let j = i + 1; j < n; j++) {

            if (
                Math.abs(A[i][j] - A[j][i])
                > 1e-10
            ) {
                symmetric = false;
                break;
            }
        }

        if (!symmetric) break;
    }

    const form =
        document.getElementById("matrixForm");

    if (!form) return;

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            ${symmetric
                ? "Symmetric"
                : "Not Symmetric"}
        </div>
    `;
};
window.matrixIsSkew = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;

    const form =
        document.getElementById("matrixForm");

    if (!form) return;

    // لازم تكون مربعة
    if (A.length !== A[0].length) {

        form.innerHTML = `
            <div style="
                font-size:13px;
                font-weight:bold;
                text-align:center;
            ">
                Not Skew-Symmetric
            </div>
        `;

        return;
    }

    const n = A.length;

    let skew = true;

    // عناصر القطر الرئيسي لازم تكون صفر
    for (let i = 0; i < n; i++) {

        if (Math.abs(A[i][i]) > 1e-10) {
            skew = false;
            break;
        }
    }

    // aᵢⱼ = -aⱼᵢ
    if (skew) {

        for (let i = 0; i < n; i++) {

            for (let j = i + 1; j < n; j++) {

                if (
                    Math.abs(
                        A[i][j] + A[j][i]
                    ) > 1e-10
                ) {

                    skew = false;
                    break;
                }
            }

            if (!skew) break;
        }
    }

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            ${skew
                ? "Skew-Symmetric"
                : "Not Skew-Symmetric"}
        </div>
    `;
};
window.matrixIsDiagonal = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    let diagonal = true;

    for (let i = 0; i < A.length; i++) {

        for (let j = 0; j < A[i].length; j++) {

            if (i !== j && A[i][j] !== 0) {
                diagonal = false;
                break;
            }

        }

        if (!diagonal) break;
    }

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            ${diagonal ? "Diagonal" : "Not Diagonal"}
        </div>
    `;
};
window.matrixIsIdentity = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    let identity = true;

    // لازم تكون مربعة
    if (A.length === 0 || A.length !== A[0].length) {
        identity = false;
    } else {

        for (let i = 0; i < A.length; i++) {

            for (let j = 0; j < A[i].length; j++) {

                const expected =
                    (i === j) ? 1 : 0;

                if (A[i][j] !== expected) {
                    identity = false;
                    break;
                }
            }

            if (!identity) break;
        }
    }

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            ${identity ? "Identity Matrix" : "Not Identity"}
        </div>
    `;
};
window.matrixIsZero = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    let zero = true;

    for (let i = 0; i < A.length; i++) {

        for (let j = 0; j < A[i].length; j++) {

            if (A[i][j] !== 0) {
                zero = false;
                break;
            }

        }

        if (!zero) break;
    }

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            ${zero ? "Zero Matrix" : "Not Zero Matrix"}
        </div>
    `;
};
window.matrixTraceA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    // لازم تكون مربعة
    if (A.length === 0 || A.length !== A[0].length) {

        form.innerHTML = `
            <div style="
                font-size:13px;
                font-weight:bold;
                text-align:center;
            ">
                Trace requires square matrix
            </div>
        `;

        return;
    }

    let trace = 0;

    for (let i = 0; i < A.length; i++) {
        trace += Number(A[i][i]);
    }

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            Tr(MatA) = ${trace}
        </div>
    `;
};
window.matrixDetA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    if (A.length !== A[0].length) {

        form.innerHTML = `
            <div style="
                font-size:13px;
                font-weight:bold;
                text-align:center;
            ">
                Det requires square matrix
            </div>
        `;

        return;
    }

    function determinant(M) {

        const n = M.length;

        if (n === 1) {
            return M[0][0];
        }

        if (n === 2) {
            return (
                M[0][0] * M[1][1] -
                M[0][1] * M[1][0]
            );
        }

        let det = 0;

        for (let col = 0; col < n; col++) {

            const minor = M
                .slice(1)
                .map(row =>
                    row.filter((_, j) => j !== col)
                );

            det +=
                (col % 2 === 0 ? 1 : -1) *
                M[0][col] *
                determinant(minor);
        }

        return det;
    }

    const det = determinant(A);

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            Det(MatA) = ${Number(det.toFixed(10))}
        </div>
    `;
};
window.matrixRankA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    const M = A.map(row => row.map(Number));

    let rank = 0;
    let row = 0;

    const rows = M.length;
    const cols = M[0].length;

    for (let col = 0; col < cols && row < rows; col++) {

        let pivot = row;

        for (let i = row + 1; i < rows; i++) {

            if (
                Math.abs(M[i][col]) >
                Math.abs(M[pivot][col])
            ) {
                pivot = i;
            }
        }

        if (Math.abs(M[pivot][col]) < 1e-10) {
            continue;
        }

        [M[row], M[pivot]] =
            [M[pivot], M[row]];

        for (let i = row + 1; i < rows; i++) {

            const factor =
                M[i][col] / M[row][col];

            for (let j = col; j < cols; j++) {

                M[i][j] -=
                    factor * M[row][j];
            }
        }

        rank++;
        row++;
    }

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            Rank(MatA) = ${rank}
        </div>
    `;
};
window.matrixCofactorA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    if (A.length !== A[0].length) {

        form.innerHTML = `
            <div style="
                font-size:13px;
                font-weight:bold;
                text-align:center;
            ">
                Cof(MatA) requires square matrix
            </div>
        `;

        return;
    }

    const n = A.length;

    if (n === 1) {

        matrixShow("CofA", [[1]]);
        return;
    }

    function determinant(M) {

        const size = M.length;

        if (size === 1) {
            return M[0][0];
        }

        if (size === 2) {
            return (
                M[0][0] * M[1][1] -
                M[0][1] * M[1][0]
            );
        }

        let det = 0;

        for (let col = 0; col < size; col++) {

            const minor = M
                .slice(1)
                .map(row =>
                    row.filter((_, j) => j !== col)
                );

            det +=
                (col % 2 === 0 ? 1 : -1) *
                M[0][col] *
                determinant(minor);
        }

        return det;
    }

    const cof = [];

    for (let i = 0; i < n; i++) {

        const row = [];

        for (let j = 0; j < n; j++) {

            const minor = A
                .filter((_, r) => r !== i)
                .map(r =>
                    r.filter((_, c) => c !== j)
                );

            const value =
                Math.pow(-1, i + j) *
                determinant(minor);

            row.push(
                Number(value.toFixed(10))
            );
        }

        cof.push(row);
    }

    matrixShow("CofA", cof);
};
window.matrixAdjA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    if (A.length !== A[0].length) {

        form.innerHTML = `
            <div style="
                font-size:13px;
                font-weight:bold;
                text-align:center;
            ">
                Adj(MatA) requires square matrix
            </div>
        `;

        return;
    }

    const n = A.length;

    function determinant(M) {

        const size = M.length;

        if (size === 1) {
            return M[0][0];
        }

        if (size === 2) {
            return (
                M[0][0] * M[1][1] -
                M[0][1] * M[1][0]
            );
        }

        let det = 0;

        for (let col = 0; col < size; col++) {

            const minor = M
                .slice(1)
                .map(row =>
                    row.filter((_, j) => j !== col)
                );

            det +=
                (col % 2 === 0 ? 1 : -1) *
                M[0][col] *
                determinant(minor);
        }

        return det;
    }

    const cof = [];

    for (let i = 0; i < n; i++) {

        const row = [];

        for (let j = 0; j < n; j++) {

            const minor = A
                .filter((_, r) => r !== i)
                .map(r =>
                    r.filter((_, c) => c !== j)
                );

            const value =
                Math.pow(-1, i + j) *
                determinant(minor);

            row.push(
                Number(value.toFixed(10))
            );
        }

        cof.push(row);
    }

    // Adj(A) = transpose(Cof(A))

    const adj =
        cof[0].map((_, col) =>
            cof.map(row => row[col])
        );

    matrixShow("AdjA", adj);
};
window.matrixNormA = function () {

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    let sum = 0;

    for (let i = 0; i < A.length; i++) {

        for (let j = 0; j < A[i].length; j++) {

            sum += Number(A[i][j]) ** 2;

        }
    }

    const norm = Math.sqrt(sum);

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            Norm(MatA) = ${Number(norm.toFixed(10))}
        </div>
    `;
};
window.matrixCondA = function () {

    if (!window.matrices || !window.matrices.A) return;

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    const n = A.length;

    if (n === 0 || n !== A[0].length) {
        form.innerHTML = `
            <div style="font-size:13px;font-weight:bold;text-align:center;">
                Cond(MatA) requires square matrix
            </div>
        `;
        return;
    }

    // ==========================================
    // نسخ A
    // ==========================================

    const M = A.map(row => row.map(Number));

    const I = M.map((row, i) =>
        row.map((_, j) => i === j ? 1 : 0)
    );

    // ==========================================
    // Gauss-Jordan لحساب A⁻¹
    // ==========================================

    for (let col = 0; col < n; col++) {

        let pivot = col;

        for (let r = col + 1; r < n; r++) {

            if (
                Math.abs(M[r][col]) >
                Math.abs(M[pivot][col])
            ) {
                pivot = r;
            }
        }

        if (Math.abs(M[pivot][col]) < 1e-12) {

            form.innerHTML = `
                <div style="font-size:13px;font-weight:bold;text-align:center;">
                    Cond(MatA) = ∞
                </div>
            `;

            return;
        }

        [M[col], M[pivot]] =
            [M[pivot], M[col]];

        [I[col], I[pivot]] =
            [I[pivot], I[col]];

        const p = M[col][col];

        for (let j = 0; j < n; j++) {
            M[col][j] /= p;
            I[col][j] /= p;
        }

        for (let r = 0; r < n; r++) {

            if (r === col) continue;

            const factor = M[r][col];

            for (let j = 0; j < n; j++) {

                M[r][j] -=
                    factor * M[col][j];

                I[r][j] -=
                    factor * I[col][j];
            }
        }
    }

    // ==========================================
    // Frobenius Norm
    // ==========================================

    function frobeniusNorm(X) {

        let sum = 0;

        for (let i = 0; i < X.length; i++) {

            for (let j = 0; j < X[i].length; j++) {

                const v = Number(X[i][j]);

                sum += v * v;
            }
        }

        return Math.sqrt(sum);
    }

    const normA = frobeniusNorm(A);
    const normInv = frobeniusNorm(I);

    const cond = normA * normInv;

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            Cond(MatA) = ${cond.toFixed(6)}
        </div>
    `;
};
window.matrixDetA = function () {

    if (!window.matrices || !window.matrices.A) return;

    const A = window.matrices.A;
    const form = document.getElementById("matrixForm");

    if (!form) return;

    const n = A.length;

    if (n === 0 || n !== A[0].length) {
        form.innerHTML = `
            <div style="font-size:13px;font-weight:bold;text-align:center;">
                Det(MatA) requires square matrix
            </div>
        `;
        return;
    }

    // ==========================================
    // نسخ المصفوفة
    // ==========================================

    const M = A.map(row => row.map(Number));

    let det = 1;

    // ==========================================
    // Gaussian Elimination
    // ==========================================

    for (let col = 0; col < n; col++) {

        let pivot = col;

        for (let r = col + 1; r < n; r++) {

            if (
                Math.abs(M[r][col]) >
                Math.abs(M[pivot][col])
            ) {
                pivot = r;
            }
        }

        // المصفوفة مفردة
        if (Math.abs(M[pivot][col]) < 1e-12) {

            det = 0;
            break;
        }

        // تبديل الصفوف
        if (pivot !== col) {
            [M[col], M[pivot]] =
    [M[pivot], M[col]];

            det *= -1;
        }

        const p = M[col][col];

        det *= p;

        // تصفير العناصر تحت الـ pivot
        for (let r = col + 1; r < n; r++) {

            const factor = M[r][col] / p;

            for (let j = col; j < n; j++) {

                M[r][j] -=
                    factor * M[col][j];
            }
        }
    }

    // ==========================================
    // عرض النتيجة
    // ==========================================

    form.innerHTML = `
        <div style="
            font-size:13px;
            font-weight:bold;
            text-align:center;
        ">
            Det(MatA) = ${det.toFixed(6)}
        </div>
    `;
};
window.matrixCreate = function(name, rows, cols) {

    const form = document.getElementById("matrixForm");
    if (!form) return;

    window.matrixData = {
    name: name,
    type: "NORMAL",
    size: rows,
    rows: rows,
    cols: cols,
    values: [],
    current: ""
};

    form.innerHTML = `
      <div style="font-size:13px; font-weight:bold; margin-bottom:5px;">
    Mat${name} ${rows}×${cols}
</div>

        <div id="matrixInput"
             style="font-size:11px; font-weight:bold; margin-top:4px;">
            a₁₁ = _
        </div>

        <div id="matrixResult"
     style="
        margin-top:6px;
        font-size:14px;
        font-weight:bold;
        line-height:1.6;
        text-align:center;
    ">
</div>
    `;
};
function matrixEnterNumber(value) {

    if (currentMode !== "MATRIX") return;

    // ==========================================
    // إدخال K في MatA × K
    // ==========================================

    if (
        window.matrixScalarData &&
        document.getElementById("matrixScalarInput")
    ) {

        if (value === "-" || value === "−") {

            if (window.matrixScalarData.current === "") {

                window.matrixScalarData.current = "-";

            } else if (
                !window.matrixScalarData.current.startsWith("-")
            ) {

                window.matrixScalarData.current =
                    "-" + window.matrixScalarData.current;
            }

        } else {

            window.matrixScalarData.current += value;
        }

        const input =
            document.getElementById("matrixScalarInput");

        input.textContent =
            "K = " +
            window.matrixScalarData.current;

        return;
    }

    // ==========================================
    // التأكد من وجود بيانات المصفوفة
    // ==========================================

    if (!window.matrixData) return;

    const data = window.matrixData;

    const input =
        document.getElementById("matrixInput");

    if (!input) return;

    // ==========================================
    // السالب
    // ==========================================

    if (value === "-" || value === "−") {

        if (data.current === "") {

            data.current = "-";

        } else if (!data.current.startsWith("-")) {

            data.current = "-" + data.current;
        }

    } else {

        data.current += value;
    }

    // ==========================================
    // Scalar
    // ==========================================

    if (data.type === "SCALAR") {

        input.textContent =
            "القيمة = " + data.current;

        return;
    }

    // ==========================================
    // Skew-Symmetric
    // ==========================================

    if (data.type === "SKEW") {

        const positions = [];

        for (let r = 0; r < data.size; r++) {

            for (let c = r + 1; c < data.size; c++) {

                positions.push([r, c]);

            }
        }

        const index = data.values.length;

        if (index < positions.length) {

            const [r, c] =
                positions[index];

            input.textContent =
                `a${r + 1}${c + 1} = ${data.current}`;
        }

        return;
    }

    // ==========================================
    // Symmetric
    // ==========================================

    if (data.type === "SYMMETRIC") {

        const positions = [];

        for (let r = 0; r < data.size; r++) {

            for (let c = r; c < data.size; c++) {

                positions.push([r, c]);

            }
        }

        const index = data.values.length;

        if (index < positions.length) {

            const [r, c] =
                positions[index];

            input.textContent =
                `a${r + 1}${c + 1} = ${data.current}`;
        }

        return;
    }
// ==========================================
// Normal Matrix
// ==========================================

const index = data.values.length;

const r = Math.floor(index / data.cols);
const c = index % data.cols;

input.textContent =
    `a${r + 1}${c + 1} = ${data.current}`;
}
// --- وضع المعادلات EQN ---
window.setupEqn = function(type) {

    let form = document.getElementById("eqnForm");
    if (!form) return;

    if (type === 1) {

        form.innerHTML = `
            <div style="font-size:10px; margin-bottom:3px;">
                ax² + bx + c = 0
            </div>

            <div id="eqnInput"
                 style="font-size:11px; font-weight:bold;">
                a = _
            </div>

            <div id="eqnResult"
                 style="margin-top:5px; font-weight:bold;">
            </div>
        `;

        window.eqnData = {
            values: [],
            current: "",
            index: 0,
            total: 3,
            type: 1
        };

        eqnUpdateScreen();

    } else if (type === 2) {

        form.innerHTML = `
            <div style="font-size:10px; margin-bottom:3px;">
                a₁x + b₁y = c₁
            </div>

            <div style="font-size:9px;">
                a₁x + b₁y = c₁<br>
                a₂x + b₂y = c₂
            </div>

            <div id="eqnInput"
                 style="font-size:11px; font-weight:bold; margin-top:4px;">
                a₁ = _
            </div>

            <div id="eqnResult"
                 style="margin-top:5px; font-weight:bold;">
            </div>
        `;

        window.eqnData = {
            values: [],
            current: "",
            index: 0,
            total: 6,
            type: 2
        };

        eqnUpdateScreen();

    } else if (type === 3) {

        form.innerHTML = `
            <div style="font-size:10px; margin-bottom:3px;">
                3 Unknowns
            </div>

            <div style="font-size:9px;">
                a₁x+b₁y+c₁z=d₁<br>
                a₂x+b₂y+c₂z=d₂<br>
                a₃x+b₃y+c₃z=d₃
            </div>

            <div id="eqnInput"
                 style="font-size:11px; font-weight:bold; margin-top:4px;">
                a₁ = _
            </div>

            <div id="eqnResult"
                 style="margin-top:5px; font-weight:bold;">
            </div>
        `;

        window.eqnData = {
            values: [],
            current: "",
            index: 0,
            total: 12,
            type: 3
        };

        eqnUpdateScreen();

    } else if (type === 4) {

    form.innerHTML = `
        <div style="font-size:10px; margin-bottom:3px;">
            ax³ + bx² + cx + d = 0
        </div>

        <div id="cubicInput"
             style="font-size:11px; font-weight:bold;">
            a = _
        </div>

        <div id="eqnResult"
             style="margin-top:5px; font-weight:bold;">
        </div>
    `;

    window.cubicData = {
        values: [],
        current: "",
        index: 0
    };

    cubicUpdateScreen();
}
else if (type === 5) {

    form.innerHTML = `
        <div style="font-size:10px; margin-bottom:3px;">
            ax⁴ + bx³ + cx² + dx + e = 0
        </div>

        <div id="quarticInput"
             style="font-size:11px; font-weight:bold;">
            a = _
        </div>

        <div id="eqnResult"
             style="margin-top:5px; font-weight:bold;">
        </div>
    `;

    window.quarticData = {
        values: [],
        current: "",
        index: 0
    };

    quarticUpdateScreen();
}
};
function quarticEnterNumber(value) {

    if (currentMode !== "EQN") return;

    const box = document.getElementById("quarticInput");

    if (!box) return;

    if (quarticData.index >= 5) return;

    quarticData.current += value;

    quarticUpdateScreen();
}

function quarticUpdateScreen() {

    const box = document.getElementById("quarticInput");

    if (!box) return;

    const names = ["a", "b", "c", "d", "e"];

    box.textContent =
        names[quarticData.index] +
        " = " +
        (quarticData.current || "_");
}



function eqnUpdateScreen() {

    const box = document.getElementById("eqnInput");

    if (!box) return;

    let names;

    if (eqnData.type === 2) {

        names = [
            "a₁",
            "b₁",
            "c₁",
            "a₂",
            "b₂",
            "c₂"
        ];

    } else if (eqnData.type === 3) {

        names = [
            "a₁",
            "b₁",
            "c₁",
            "d₁",
            "a₂",
            "b₂",
            "c₂",
            "d₂",
            "a₃",
            "b₃",
            "c₃",
            "d₃"
        ];

    } else {

        names = [
            "a",
            "b",
            "c"
        ];
    }

    if (eqnData.index >= names.length) {
        return;
    }

    box.textContent =
        names[eqnData.index] +
        " = " +
        (eqnData.current || "_");
}
function eqnEnterNumber(value) {

    if (currentMode !== "EQN") return;

    if (!document.getElementById("eqnInput")) return;

    if (eqnData.index >= (eqnData.total || 3)) return;

    eqnData.current += value;

    eqnUpdateScreen();
}

function eqnNext() {

    if (!document.getElementById("eqnInput")) return;

    if (eqnData.current === "") return;
 // حفظ الرقم الحالي
    eqnData.values.push(Number(eqnData.current));

    // تصفير الرقم الحالي
    eqnData.current = "";

    // الانتقال للمعامل التالي
    eqnData.index++;

    // 2×2
    if (eqnData.type === 2) {

        if (eqnData.index < 6) {
            eqnUpdateScreen();
        } else {
            solveLinearFromValues();
        }

        return;
    }

    // 2nd degree
    if (eqnData.type === 1) {

        if (eqnData.index < 3) {
            eqnUpdateScreen();
        } else {
            solveQuadFromValues();
        }

        return;
    }

    // 3 Unknowns
    if (eqnData.type === 3) {

        if (eqnData.index < 12) {
            eqnUpdateScreen();
        } else {
            solve3Unknowns();
        }

        return;
    }
}

function solveLinearFromValues() {

    const values = eqnData.values;

    if (values.length !== 6) return;

    const a1 = values[0];
    const b1 = values[1];
    const c1 = values[2];

    const a2 = values[3];
    const b2 = values[4];
    const c2 = values[5];

    const resDiv = document.getElementById("eqnResult");

    if (!resDiv) return;

    const D = a1 * b2 - a2 * b1;

    if (D === 0) {

        resDiv.innerHTML = "لا يوجد حل فريد";

        return;
    }

    const x = (c1 * b2 - c2 * b1) / D;
    const y = (a1 * c2 - a2 * c1) / D;

    resDiv.innerHTML =
        `X = ${x.toFixed(4)}<br>` +
        `Y = ${y.toFixed(4)}`;
}
function solveQuadFromValues() {

    const values = eqnData.values;

    if (values.length !== 3) return;

    const a = values[0];
    const b = values[1];
    const c = values[2];

    const resDiv = document.getElementById("eqnResult");

    if (!resDiv) return;

    if (a === 0) {
        resDiv.innerHTML = "خطأ: a لا تساوي 0";
        return;
    }

    const d = b * b - 4 * a * c;

    if (d > 0) {

        const x1 = (-b + Math.sqrt(d)) / (2 * a);
        const x2 = (-b - Math.sqrt(d)) / (2 * a);

        resDiv.innerHTML =
            `X1 = ${x1.toFixed(4)}<br>` +
            `X2 = ${x2.toFixed(4)}`;

    } else if (d === 0) {

        const x = -b / (2 * a);

        resDiv.innerHTML =
            `X1 = X2 = ${x.toFixed(4)}`;

    } else {

        const real = -b / (2 * a);
        const imag = Math.sqrt(-d) / (2 * a);

        resDiv.innerHTML =
            `X1 = ${real.toFixed(4)} + ${imag.toFixed(4)}i<br>` +
            `X2 = ${real.toFixed(4)} - ${imag.toFixed(4)}i`;
    }
}
// ==========================================
// المعادلة التكعيبية
// ax³ + bx² + cx + d = 0
// ==========================================

window.cubicData = {
    values: [],
    current: "",
    index: 0
};

cubicUpdateScreen();
// عرض المعامل الحالي
function cubicUpdateScreen() {

    const box = document.getElementById("cubicInput");

    if (!box) return;

    const names = ["a", "b", "c", "d"];

    box.textContent =
        names[cubicData.index] +
        " = " +
        (cubicData.current || "_");
}


// إدخال رقم من الآلة
function cubicEnterNumber(value) {

    if (currentMode !== "EQN") return;

    const box = document.getElementById("cubicInput");

    if (!box) return;

    if (cubicData.index >= 4) return;

    // السماح بالسالب في بداية المعامل فقط
    if (value === "-") {

        if (cubicData.current === "") {
            cubicData.current = "-";
            cubicUpdateScreen();
        }

        return;
    }

    // الأرقام
    if (/^[0-9.]$/.test(value)) {

        cubicData.current += value;
        cubicUpdateScreen();
    }
}


// الضغط على =
function cubicNext() {

    const box = document.getElementById("cubicInput");

    if (!box) return;

    // لازم يكون فيه رقم
    if (cubicData.current === "") return;

    // حفظ المعامل
    cubicData.values.push(
        Number(cubicData.current)
    );

    // تصفير الإدخال
    cubicData.current = "";

    // الانتقال للمعامل التالي
    cubicData.index++;

    // لسه فيه معاملات
    if (cubicData.index < 4) {

        cubicUpdateScreen();

    } else {

        // تم إدخال a,b,c,d
        solveCubicFromValues();
    }
}


// ==========================================
// حل المعادلة التكعيبية
// ==========================================

window.solveCubicFromValues = function () {

    const values = cubicData.values;

    if (values.length !== 4) return;

    const a = values[0];
    const b = values[1];
    const c = values[2];
    const d = values[3];

    const resDiv = document.getElementById("eqnResult");

    if (!resDiv) return;

    // a لا يمكن أن تساوي صفر
    if (a === 0) {

        resDiv.innerHTML =
            "خطأ: a لا تساوي 0";

        return;
    }

    // تحويل المعادلة إلى:
    // x³ + Ax² + Bx + C = 0

    const A = b / a;
    const B = c / a;
    const C = d / a;

    // تحويلها إلى المعادلة المختزلة:
    // y³ + py + q = 0

    const p =
        B - (A * A) / 3;

    const q =
        (2 * A * A * A) / 27
        - (A * B) / 3
        + C;

    // المميز
    const delta =
        (q * q) / 4 +
        (p * p * p) / 27;

    let roots = [];

    // ==========================================
    // حالة جذر حقيقي واحد
    // ==========================================

    if (delta > 1e-12) {

    const sqrtDelta = Math.sqrt(delta);

    const u = Math.cbrt(-q / 2 + sqrtDelta);
    const v = Math.cbrt(-q / 2 - sqrtDelta);

    const x1 = u + v - A / 3;

    // الجذر الحقيقي
    roots.push(
        `X₁ = ${x1.toFixed(6)}`
    );

    // الجذور المركبة
    const realPart = -(u + v) / 2 - A / 3;
    const imagPart = (Math.sqrt(3) / 2) * (u - v);

    roots.push(
        `X₂ = ${realPart.toFixed(6)} + ${imagPart.toFixed(6)}i`
    );

    roots.push(
        `X₃ = ${realPart.toFixed(6)} - ${imagPart.toFixed(6)}i`
    );
}

    // ==========================================
    // حالة الجذور المتكررة
    // ==========================================

    else if (Math.abs(delta) <= 1e-12) {

        const u =
            Math.cbrt(-q / 2);

        const x1 =
            2 * u - A / 3;

        const x2 =
            -u - A / 3;

        roots.push(
            `X₁ = ${x1.toFixed(6)}`
        );

        roots.push(
            `X₂ = ${x2.toFixed(6)}`
        );

        roots.push(
            `X₃ = ${x2.toFixed(6)}`
        );
    }

    // ==========================================
    // ثلاثة جذور حقيقية مختلفة
    // ==========================================

    else {

        const r =
            2 * Math.sqrt(-p / 3);

        let cosValue =
            (3 * q / (2 * p)) *
            Math.sqrt(-3 / p);

        // منع خطأ التقريب
        cosValue =
            Math.max(
                -1,
                Math.min(1, cosValue)
            );

        const theta =
            Math.acos(cosValue);

        const x1 =
            r * Math.cos(theta / 3)
            - A / 3;

        const x2 =
            r * Math.cos(
                (theta + 2 * Math.PI) / 3
            )
            - A / 3;

        const x3 =
            r * Math.cos(
                (theta + 4 * Math.PI) / 3
            )
            - A / 3;

        roots.push(
            `X₁ = ${x1.toFixed(6)}`
        );

        roots.push(
            `X₂ = ${x2.toFixed(6)}`
        );

        roots.push(
            `X₃ = ${x3.toFixed(6)}`
        );
    }

    // عرض النتيجة
    resDiv.innerHTML =
        roots.join("<br>");
};

function solve3Unknowns() {

    const values = eqnData.values;

    if (values.length !== 12) return;

    const a1 = values[0];
    const b1 = values[1];
    const c1 = values[2];
    const d1 = values[3];

    const a2 = values[4];
    const b2 = values[5];
    const c2 = values[6];
    const d2 = values[7];

    const a3 = values[8];
    const b3 = values[9];
    const c3 = values[10];
    const d3 = values[11];

    const resDiv = document.getElementById("eqnResult");

    if (!resDiv) return;

    // المحدد الرئيسي
    const D =
        a1 * (b2 * c3 - b3 * c2)
        - b1 * (a2 * c3 - a3 * c2)
        + c1 * (a2 * b3 - a3 * b2);

    // لا يوجد حل فريد
    if (D === 0) {
        resDiv.innerHTML = "لا يوجد حل فريد";
        return;
    }

    // محدد X
    const Dx =
        d1 * (b2 * c3 - b3 * c2)
        - b1 * (d2 * c3 - d3 * c2)
        + c1 * (d2 * b3 - d3 * b2);

    // محدد Y
    const Dy =
        a1 * (d2 * c3 - d3 * c2)
        - d1 * (a2 * c3 - a3 * c2)
        + c1 * (a2 * d3 - a3 * d2);

    // محدد Z
    const Dz =
        a1 * (b2 * d3 - b3 * d2)
        - b1 * (a2 * d3 - a3 * d2)
        + d1 * (a2 * b3 - a3 * b2);

    const x = Dx / D;
    const y = Dy / D;
    const z = Dz / D;

    resDiv.innerHTML =
        `X = ${x.toFixed(4)}<br>` +
        `Y = ${y.toFixed(4)}<br>` +
        `Z = ${z.toFixed(4)}`;
}

function quarticNext() {

    if (!document.getElementById("quarticInput")) return;

    if (quarticData.current === "") return;

    quarticData.values.push(
        Number(quarticData.current)
    );

    quarticData.current = "";
    quarticData.index++;

    if (quarticData.index < 5) {

        quarticUpdateScreen();

    } else {

        solveQuarticFromValues();

    }
}


// ==========================================
// المعادلة التربيعية
// ==========================================

window.solveQuad = function() {

    let a = Number(document.getElementById("ea").value);
    let b = Number(document.getElementById("eb").value);
    let c = Number(document.getElementById("ec").value);

    let resDiv = document.getElementById("eqnResult");

    if (a === 0) {
        resDiv.innerHTML = "خطأ: a لا تساوي 0";
        return;
    }

    let d = b * b - 4 * a * c;

    if (d >= 0) {

        let x1 = (-b + Math.sqrt(d)) / (2 * a);
        let x2 = (-b - Math.sqrt(d)) / (2 * a);

        resDiv.innerHTML =
            `X1 = ${x1.toFixed(4)}<br>` +
            `X2 = ${x2.toFixed(4)}`;

    } else {

        let r = -b / (2 * a);
        let i = Math.sqrt(-d) / (2 * a);

        resDiv.innerHTML =
            `X1 = ${r.toFixed(3)} + ${i.toFixed(3)}i<br>` +
            `X2 = ${r.toFixed(3)} - ${i.toFixed(3)}i`;
    }
};


// ==========================================
// المعادلات الخطية
// ==========================================

window.solveLin = function() {

    let a1 = Number(document.getElementById("ea1").value);
    let b1 = Number(document.getElementById("eb1").value);
    let c1 = Number(document.getElementById("ec1").value);

    let a2 = Number(document.getElementById("ea2").value);
    let b2 = Number(document.getElementById("eb2").value);
    let c2 = Number(document.getElementById("ec2").value);

    let resDiv = document.getElementById("eqnResult");

    let D = a1 * b2 - a2 * b1;

    if (D === 0) {

        resDiv.innerHTML = "لا يوجد حل فريد";

    } else {

        let x = (c1 * b2 - c2 * b1) / D;
        let y = (a1 * c2 - a2 * c1) / D;

        resDiv.innerHTML =
            `X = ${x.toFixed(4)}<br>` +
            `Y = ${y.toFixed(4)}`;
    }
};


// ==========================================
// حل الدرجة الرابعة
// ax⁴ + bx³ + cx² + dx + e = 0
// ==========================================

window.solveQuarticFromValues = function() {

    const values = quarticData.values;

    if (values.length !== 5) return;

    const a = values[0];
    const b = values[1];
    const c = values[2];
    const d = values[3];
    const e = values[4];

    const resDiv = document.getElementById("eqnResult");

    if (!resDiv) return;

    if (a === 0) {
        resDiv.innerHTML = "خطأ: a لا تساوي 0";
        return;
    }

    // ==========================================
    // تحويل المعادلة إلى الصورة:
    // x⁴ + A x³ + B x² + C x + D = 0
    // ==========================================

    const A = b / a;
    const B = c / a;
    const C = d / a;
    const D = e / a;

    // ==========================================
    // نحولها إلى:
    // y⁴ + p y² + q y + r = 0
    // ==========================================

    const p = B - (3 * A * A) / 8;

    const q =
        C -
        (A * B) / 2 +
        (A * A * A) / 8;

    const r =
        D -
        (A * C) / 4 +
        (A * A * B) / 16 -
        (3 * A * A * A * A) / 256;

    const EPS = 1e-10;

    // ==========================================
    // حالة q = 0
    // المعادلة تصبح:
    // y⁴ + p y² + r = 0
    // ==========================================

    if (Math.abs(q) < EPS) {

        const roots = [];

        const disc = p * p - 4 * r;

        if (disc >= -EPS) {

            const sqrtDisc = Math.sqrt(Math.max(0, disc));

            const y1sq = (-p + sqrtDisc) / 2;
            const y2sq = (-p - sqrtDisc) / 2;

            if (y1sq >= -EPS) {

                const s = Math.sqrt(Math.max(0, y1sq));

                roots.push(
                    -A / 4 + s,
                    -A / 4 - s
                );
            }

            if (y2sq >= -EPS) {

                const s = Math.sqrt(Math.max(0, y2sq));

                roots.push(
                    -A / 4 + s,
                    -A / 4 - s
                );
            }

        } else {

            const realY2 = -p / 2;
            const imagY2 = Math.sqrt(-disc) / 2;

            const realS = Math.sqrt(
                (Math.sqrt(realY2 * realY2 + imagY2 * imagY2) + realY2) / 2
            );

            const imagS =
                imagY2 / (2 * realS);

            roots.push(
                `${(-A / 4 + realS).toFixed(6)} + ${imagS.toFixed(6)}i`,
                `${(-A / 4 + realS).toFixed(6)} - ${imagS.toFixed(6)}i`,
                `${(-A / 4 - realS).toFixed(6)} + ${imagS.toFixed(6)}i`,
                `${(-A / 4 - realS).toFixed(6)} - ${imagS.toFixed(6)}i`
            );
        }

        resDiv.innerHTML = roots
            .map((x, i) =>
                `X${i + 1} = ${
                    typeof x === "number"
                        ? x.toFixed(6)
                        : x
                }`
            )
            .join("<br>");

        return;
    }

    // ==========================================
    // حل المعادلة المكعبة المساعدة
    // ==========================================

    const cubicA = -p / 2;
    const cubicB = -r;
    const cubicC = r * p / 2 - q * q / 8;

    const cubicRoots = solveCubicNumerically(
        1,
        cubicA,
        cubicC,
        cubicB
    );

    // نحتاج جذرًا حقيقيًا مناسبًا
    let z = null;

    for (const root of cubicRoots) {

        if (
            typeof root === "number" &&
            Number.isFinite(root) &&
            root >= -EPS
        ) {
            z = root;
            break;
        }
    }

    if (z === null) {
        resDiv.innerHTML = "تعذر حل المعادلة";
        return;
    }

    const alpha = Math.sqrt(Math.max(0, 2 * z - p));

    if (Math.abs(alpha) < EPS) {
        resDiv.innerHTML = "تعذر حل المعادلة";
        return;
    }

    const beta = q / (2 * alpha);

    const disc1 =
        -(2 * z + p + 2 * beta);

    const disc2 =
        -(2 * z + p - 2 * beta);

    const roots = [];

    // ==========================================
    // الجذر الأول والثاني
    // ==========================================

    if (disc1 >= -EPS) {

        const s = Math.sqrt(Math.max(0, disc1));

        roots.push(
            -A / 4 + (alpha + s) / 2,
            -A / 4 + (alpha - s) / 2
        );

    } else {

        const s = Math.sqrt(-disc1);

        roots.push(
            {
                re: -A / 4 + alpha / 2,
                im: s / 2
            },
            {
                re: -A / 4 + alpha / 2,
                im: -s / 2
            }
        );
    }

    // ==========================================
    // الجذر الثالث والرابع
    // ==========================================

    if (disc2 >= -EPS) {

        const s = Math.sqrt(Math.max(0, disc2));

        roots.push(
            -A / 4 + (-alpha + s) / 2,
            -A / 4 + (-alpha - s) / 2
        );

    } else {

        const s = Math.sqrt(-disc2);

        roots.push(
            {
                re: -A / 4 - alpha / 2,
                im: s / 2
            },
            {
                re: -A / 4 - alpha / 2,
                im: -s / 2
            }
        );
    }

    // ==========================================
    // تنسيق النتائج
    // ==========================================

    resDiv.innerHTML = roots
        .map((root, i) => {

            if (typeof root === "number") {

                const clean =
                    Math.abs(root) < 1e-8
                        ? 0
                        : root;

                return `X${i + 1} = ${clean.toFixed(6)}`;
            }

            const re =
                Math.abs(root.re) < 1e-8
                    ? 0
                    : root.re;

            const im =
                Math.abs(root.im) < 1e-8
                    ? 0
                    : root.im;

            const sign = im >= 0 ? "+" : "-";

            return `X${i + 1} = ${re.toFixed(6)} ${sign} ${Math.abs(im).toFixed(6)}i`;
        })
        .join("<br>");
};


// ==========================================
// مساعد حل المعادلة التكعيبية
// ==========================================

function solveCubicNumerically(a, b, c, d) {

    const A = b / a;
    const B = c / a;
    const C = d / a;

    const p = B - A * A / 3;

    const q =
        2 * A * A * A / 27 -
        A * B / 3 +
        C;

    const delta =
        q * q / 4 +
        p * p * p / 27;

    const roots = [];

    if (delta > 1e-12) {

        const sqrtDelta = Math.sqrt(delta);

        const u = Math.cbrt(-q / 2 + sqrtDelta);
        const v = Math.cbrt(-q / 2 - sqrtDelta);

        roots.push(
            u + v - A / 3
        );

    } else if (Math.abs(delta) <= 1e-12) {

        const u = Math.cbrt(-q / 2);

        roots.push(
            2 * u - A / 3,
            -u - A / 3
        );

    } else {

        const r =
            2 * Math.sqrt(-p / 3);

        let cosValue =
            (3 * q / (2 * p)) *
            Math.sqrt(-3 / p);

        cosValue =
            Math.max(
                -1,
                Math.min(1, cosValue)
            );

        const theta =
            Math.acos(cosValue);

        roots.push(
            r * Math.cos(theta / 3) - A / 3,
            r * Math.cos((theta + 2 * Math.PI) / 3) - A / 3,
            r * Math.cos((theta + 4 * Math.PI) / 3) - A / 3
        );
    }

    return roots;
}
let statData = [];
let activeRegressionField = null;
window.addStatData = function () {

    const input = document.getElementById("statInput");

    if (!input) return;

    const value = Number(input.value);

    if (!Number.isFinite(value)) return;

    statData.push(value);

    console.log("🟢 STAT DATA:", statData);

    input.value = "";
};
// --- وضع الإحصاء STAT ---
window.calcStat = function() {
   let val = document.getElementById("statInput").value.trim();

let arr = statData.length
    ? [...statData]
    : val.split(",").map(Number).filter(n => !isNaN(n));
    let resDiv = document.getElementById("statRes");
    
    if (!arr.length) {
        resDiv.innerHTML = "أدخل أرقاماً صالحة";
        return;
    }
    
    let n = arr.length;
let sum = arr.reduce((a, b) => a + b, 0);
let sumSq = arr.reduce((a, b) => a + b * b, 0);

let mean = sum / n;

let sumDevSq = arr.reduce(
    (a, b) => a + Math.pow(b - mean, 2),
    0
);

let variance = sumDevSq / n;
let sd = Math.sqrt(variance);

let sampleVariance = n > 1
    ? sumDevSq / (n - 1)
    : 0;

let sampleSd = Math.sqrt(sampleVariance);
let sorted = [...arr].sort((a, b) => a - b);

let median = n % 2 === 1
    ? sorted[Math.floor(n / 2)]
    : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

let min = sorted[0];
let max = sorted[n - 1];
let range = max - min;

function percentile(arr, p) {
    if (arr.length === 1) return arr[0];

    const index = (arr.length - 1) * p;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) return arr[lower];

    return arr[lower] + (arr[upper] - arr[lower]) * (index - lower);
}

let q1 = percentile(sorted, 0.25);
let q3 = percentile(sorted, 0.75);
let frequency = {};

arr.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1;
});

let maxFreq = Math.max(...Object.values(frequency));

let modes = Object.keys(frequency)
    .filter(value => frequency[value] === maxFreq)
    .map(Number);

let modeText = maxFreq > 1
    ? modes.map(v => v.toFixed(3)).join(" , ")
    : "لا يوجد";
    let frequencyText = Object.entries(frequency)
    .map(([value, count]) => `${Number(value).toFixed(3)} → ${count}`)
    .join("<br>");
    
  resDiv.innerHTML = `
        n = ${n}<br>
        Σx (المجموع) = ${sum.toFixed(3)}<br>
        Σx² = ${sumSq.toFixed(3)}<br>
        Σ(x−x̄)² = ${sumDevSq.toFixed(3)}<br>
        x̄ (المتوسط) = ${mean.toFixed(3)}<br>
        Median = ${median.toFixed(3)}<br>
Min = ${min.toFixed(3)}<br>
Max = ${max.toFixed(3)}<br>
Range = ${range.toFixed(3)}<br>
Q1 = ${q1.toFixed(3)}<br>
Q3 = ${q3.toFixed(3)}<br>
Mode = ${modeText}<br>
التكرارات:<br>${frequencyText}<br>
        σ (الانحراف) = ${sd.toFixed(3)}<br>
        s² (التباين) = ${variance.toFixed(3)}<br>
        s (انحراف العينة) = ${sampleSd.toFixed(3)}<br>
s² (تباين العينة) = ${sampleVariance.toFixed(3)}
`;
};
window.clearStat = function() {
    const input = document.getElementById("statInput");
    const xInput = document.getElementById("statXInput");
    const yInput = document.getElementById("statYInput");
    const result = document.getElementById("statRes");
    const regResult = document.getElementById("regRes");

    statData = [];

    if (input) input.value = "";
    if (xInput) xInput.value = "";
    if (yInput) yInput.value = "";

    if (result) result.innerHTML = "";
    if (regResult) regResult.innerHTML = "";

    activeStatField = null;
};
window.calcRegression = function() {
    const xInput = document.getElementById("statXInput");
    const yInput = document.getElementById("statYInput");
    const result = document.getElementById("regRes");

    const x = xInput.value
        .trim()
        .split(",")
        .map(v => Number(v.trim()))
        .filter(v => Number.isFinite(v));

    const y = yInput.value
        .trim()
        .split(",")
        .map(v => Number(v.trim()))
        .filter(v => Number.isFinite(v));

    if (x.length < 2 || y.length < 2) {
        result.innerHTML = "أدخل X و Y";
        return;
    }

    if (x.length !== y.length) {
        result.innerHTML =
            `عدد X = ${x.length}<br>عدد Y = ${y.length}`;
        return;
    }

    const n = x.length;

    const sumX = x.reduce((a,b) => a+b, 0);
    const sumY = y.reduce((a,b) => a+b, 0);

    const sumXY = x.reduce((s,xi,i) => s + xi*y[i], 0);
    const sumX2 = x.reduce((s,xi) => s + xi*xi, 0);

    const denominator = n * sumX2 - sumX * sumX;

    if (denominator === 0) {
        result.innerHTML = "لا يمكن حساب الانحدار";
        return;
    }

    const b =
        (n * sumXY - sumX * sumY) / denominator;

    const a =
        (sumY - b * sumX) / n;

    // حفظ معادلة الانحدار
    regressionA = a;
    regressionB = b;

    const meanY = sumY / n;

    const ssTot = y.reduce(
        (s,yi) => s + Math.pow(yi - meanY, 2),
        0
    );

    const ssRes = y.reduce(
        (s,yi,i) =>
            s + Math.pow(yi - (a + b*x[i]), 2),
        0
    );

    const r2 =
        ssTot === 0 ? 1 : 1 - ssRes / ssTot;

    const r = Math.sqrt(Math.max(0, r2));

    result.innerHTML = `
        a = ${a.toFixed(6)}<br>
        b = ${b.toFixed(6)}<br>
        y = ${a.toFixed(6)} + ${b.toFixed(6)}x<br>
        R = ${r.toFixed(6)}<br>
        R² = ${r2.toFixed(6)}
    `;
};
window.predictRegression = function() {
    const input = document.getElementById("predictX");
    const result = document.getElementById("regRes");

    const x = Number(input.value);

    if (!Number.isFinite(x)) {
        result.innerHTML = "أدخل قيمة X صحيحة";
        return;
    }

    if (regressionA === null || regressionB === null) {
        result.innerHTML = "احسب REG أولًا";
        return;
    }

    const y = regressionA + regressionB * x;

    result.innerHTML += `
        <br>عند X = ${x.toFixed(3)}
        → Y = ${y.toFixed(6)}
    `;
};
// --- وضع جدول الدوال TABLE ---
window.generateTable = function() {
    let expr = document.getElementById("tableFx").value;
    let start = Number(document.getElementById("tStart").value);
    let end = Number(document.getElementById("tEnd").value);
    let step = Number(document.getElementById("tStep").value) || 1;
    let resDiv = document.getElementById("tableRes");

    let html = `<table border='1' style='width:100%; text-align:center; background:#fff; font-size:10px; border-collapse:collapse; margin-top:3px;'>
                    <tr style='background:#ccc;'><th>X</th><th>f(X)</th></tr>`;
    
    for (let x = start; x <= end; x += step) {
        try {
           let parsedFx = expr
    .replace(/X/g, `(${x})`)
    .replace(/\^/g, "**")
    .replace(/(\d|\))\s*\(/g, "$1*(");
            let fx = eval(parsedFx);
            html += `<tr><td>${x}</td><td>${Number(fx).toFixed(3)}</td></tr>`;
        } catch(e) {
            html += `<tr><td>${x}</td><td>ERROR</td></tr>`;
        }
    }
    html += "</table>";
    resDiv.innerHTML = html;
};
// ==========================================
// محرك حساب الكسور
// ==========================================

function fractionResult(value) {

    value = value
        .replaceAll("×", "*")
        .replaceAll("÷", "/")
        .replace(/\s+/g, "");

    // ==========================================
    // تحويل الكسور إلى قيم كسرية دقيقة
    // ==========================================

    const fractionPattern =
        /(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/g;

    let foundFraction = false;

    value = value.replace(
        fractionPattern,
        function (match, numerator, denominator) {

            foundFraction = true;

            numerator = Number(numerator);
            denominator = Number(denominator);

            if (denominator === 0) {
                throw new Error("Math Error");
            }

            // تحويل الكسر إلى رقم عشري مؤقت
            // للحساب العام
            return `(${numerator / denominator})`;
        }
    );
// ==========================================
// تحويل الجذر والجذر التكعيبي
// ==========================================

value = value
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/∛\(/g, "Math.cbrt(");
    // ==========================================
    // لو مفيش كسر
    // ==========================================

    if (!foundFraction) {
        throw new Error("Not a fraction expression");
    }

    // ==========================================
    // الحساب
    // ==========================================

    let result = Function(
        `"use strict"; return (${value})`
    )();

    if (!Number.isFinite(result)) {
        throw new Error("Math Error");
    }

    // ==========================================
    // تحويل الناتج إلى كسر مبسط
    // ==========================================

    result = Number(result.toFixed(10));

    if (Number.isInteger(result)) {

        return {
            numerator: result,
            denominator: 1
        };
    }

    // التعامل مع السالب
    let sign = result < 0 ? -1 : 1;

    result = Math.abs(result);

    const decimalString =
        result.toString();

    let decimalPlaces = 0;

    if (decimalString.includes(".")) {
        decimalPlaces =
            decimalString.split(".")[1].length;
    }

    let denominator =
        Math.pow(10, decimalPlaces);

    let numerator =
        Math.round(result * denominator);

    numerator *= sign;

    // ==========================================
    // تبسيط الكسر
    // ==========================================

    const divisor =
        gcd(
            Math.abs(numerator),
            denominator
        );

    numerator /= divisor;
    denominator /= divisor;

    return {
        numerator,
        denominator
    };
}
// ==========================================
// 12. محرك تنفيذ المعادلة عند الضغط على (=)
// ==========================================
 function calculateFractionPart(expr) {
    // تحويل شكل ABS الظاهري |x| إلى abs(x)
expr = expr.replace(/\|([^|]*)\|/g, "abs($1)");
// ==========================================
// √ أو ∛ يحتويان على كسر
// مثال: √(1/4)  →  0.5
//       ∛(1/8)  →  0.5
// ==========================================

expr = expr.replace(/√\(([^()]*)\)/g, (match, inside) => {

    if (inside.includes("/")) {

        const parts = inside.split("/");

        if (parts.length === 2) {

            const numerator =
                calculateFractionPart(parts[0]);

            const denominator =
                calculateFractionPart(parts[1]);

            if (
                !Number.isFinite(numerator) ||
                !Number.isFinite(denominator) ||
                denominator === 0
            ) {
                throw new Error("Math Error");
            }

            return String(
                Math.sqrt(numerator / denominator)
            );
        }
    }

    return match;
});

expr = expr.replace(/∛\(([^()]*)\)/g, (match, inside) => {

    if (inside.includes("/")) {

        const parts = inside.split("/");

        if (parts.length === 2) {

            const numerator =
                calculateFractionPart(parts[0]);

            const denominator =
                calculateFractionPart(parts[1]);

            if (
                !Number.isFinite(numerator) ||
                !Number.isFinite(denominator) ||
                denominator === 0
            ) {
                throw new Error("Math Error");
            }

            return String(
                Math.cbrt(numerator / denominator)
            );
        }
    }

    return match;
});
        // ==========================================
    // CMPLX داخل الكسر
    // ==========================================

    if (currentMode === "CMPLX" && /i/.test(expr)) {
        console.log("🟣 FRACTION CMPLX PART:", expr);

        return parseCMPLX(expr);
    }
    // ==========================================
    // CMPLX داخل الكسر
    // ==========================================
    
            let parsed = expr
                .replaceAll("×", "*")
                .replaceAll("÷", "/")
                .replaceAll("−", "-")
                .replaceAll("π", "Math.PI")
                .replace(/\be\b/g, "Math.E")
                .replaceAll("^", "**");
console.log("🔥 POWER FRACTION TEST:", parsed);

            parsed = parsed.replace(
                /asin\(([^()]*)\)/g,
                "fromRadians(Math.asin($1))"
            );

            parsed = parsed.replace(
                /acos\(([^()]*)\)/g,
                "fromRadians(Math.acos($1))"
            );

            parsed = parsed.replace(
                /atan\(([^()]*)\)/g,
                "fromRadians(Math.atan($1))"
            );

            // ==========================================
// Hyperbolic + Inverse Hyperbolic
// ==========================================

// نحمي الدوال العكسية أولًا
parsed = parsed
    .replace(/asinh\(([^()]*)\)/g, "___ASINH___($1)")
    .replace(/acosh\(([^()]*)\)/g, "___ACOSH___($1)")
    .replace(/atanh\(([^()]*)\)/g, "___ATANH___($1)");

// الدوال الزائدية العادية
parsed = parsed
    .replace(/sinh\(([^()]*)\)/g, "Math.sinh($1)")
    .replace(/cosh\(([^()]*)\)/g, "Math.cosh($1)")
    .replace(/tanh\(([^()]*)\)/g, "Math.tanh($1)");

// نعيد الدوال العكسية بعد انتهاء التحويلات
parsed = parsed
    .replace(/___ASINH___\(([^()]*)\)/g, "Math.asinh($1)")
    .replace(/___ACOSH___\(([^()]*)\)/g, "Math.acosh($1)")
    .replace(/___ATANH___\(([^()]*)\)/g, "Math.atanh($1)");

            parsed = parsed.replace(
                /(?<!a)sin\(([^()]*)\)/g,
                "Math.sin(toRadians($1))"
            );

            parsed = parsed.replace(
                /(?<!a)cos\(([^()]*)\)/g,
                "Math.cos(toRadians($1))"
            );

            parsed = parsed.replace(
                /(?<!a)tan\(([^()]*)\)/g,
                "Math.tan(toRadians($1))"
            );
// ==========================================
// Hyperbolic functions
// ==========================================


// ==========================================
// Inverse Hyperbolic Functions
// ==========================================

// ==========================================
// Hyperbolic functions
// ==========================================

          // ==========================================
// √ و ∛ مع الكسور
// مثال:
// √((1/4)) → Math.sqrt((1/4))
// ∛((1/8)) → Math.cbrt((1/8))
// ==========================================

parsed = parsed
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/∛\(/g, "Math.cbrt(")
    .replace(/abs\(/g, "Math.abs(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(");
            parsed = parsed.replace(
                /(\d+)!/g,
                "factorial($1)"
            );

            parsed = parsed.replace(
                /(\d+)\s*P\s*(\d+)/g,
                "permutation($1,$2)"
            );

            parsed = parsed.replace(
                /(\d+)\s*C\s*(\d+)/g,
                "combination($1,$2)"
            );

            parsed = parsed.replace(
                /(\d+(?:\.\d+)?)%/g,
                "($1/100)"
            );
console.log("🔥 FRACTION PART INPUT:", expr);
console.log("🔥 FRACTION PART PARSED:", parsed);
console.log("🚨 FINAL PARSED BEFORE FUNCTION:", parsed);
console.log("🚨 ORIGINAL FRACTION EXPR:", expr);
            const result = Function(
                "toRadians",
                "fromRadians",
                "factorial",
                "permutation",
                "combination",
                `"use strict"; return (${parsed})`
            )(
                toRadians,
                fromRadians,
                factorial,
                permutation,
                combination
            );

            if (!Number.isFinite(result)) {
                throw new Error("Math Error");
            }

            return result;
        }
const equalsBtn = document.getElementById("equals");

if (equalsBtn) {
function parseCMPLX(str) {
console.log("🟢 parseCMPLX INPUT:", str);
            str = str.trim();
// ==========================================
// إزالة الأقواس الخارجية
// مثال: (1+i) → 1+i
// ==========================================

while (
    str.startsWith("(") &&
    str.endsWith(")")
) {
    let depth = 0;
    let isOuterPair = true;

    for (let i = 0; i < str.length - 1; i++) {

        if (str[i] === "(") depth++;
        if (str[i] === ")") depth--;

        // القوس الأول اتقفل قبل نهاية التعبير
        if (depth === 0) {
            isOuterPair = false;
            break;
        }
    }

    if (isOuterPair) {
        str = str.slice(1, -1).trim();
    } else {
        break;
    }
}
            // i
            if (str === "i" || str === "+i") {
                return new Complex(0, 1);
            }

            // -i
            if (str === "-i") {
                return new Complex(0, -1);
            }
// ==========================================
// 🟣 كسر في الجزء الحقيقي للمركب
// مثال: 1/2+2i
// ==========================================

const complexFractionMatch = str.match(
    /^([+-]?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)i$/
);

if (complexFractionMatch) {

    const numerator = Number(complexFractionMatch[1]);
    const denominator = Number(complexFractionMatch[2]);
    const imaginary = Number(complexFractionMatch[3]);

    if (denominator === 0) {
        throw new Error("Division by zero");
    }

    const real = numerator / denominator;

    console.log(
        "🟣 COMPLEX FRACTION:",
        numerator,
        "/",
        denominator,
        "+",
        imaginary,
        "i"
    );

    return new Complex(
        real,
        imaginary
    );
}
            // رقم حقيقي
            if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(str)) {
                return new Complex(Number(str), 0);
            }

            // =====================================
// عدد تخيلي فقط: bi
// =====================================

const imaginaryOnly = str.match(
    /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))i$/
);

if (imaginaryOnly) {

    let coefficient = imaginaryOnly[1];

    if (coefficient === "+") {
        coefficient = "1";
    }

    if (coefficient === "-") {
        coefficient = "-1";
    }

    return new Complex(
        0,
        Number(coefficient)
    );
}
          // =====================================
// a+bi أو a-bi
// =====================================
const match = str.match(
    /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))([+-](?:\d+(?:\.\d+)?|\.\d+))i$/
);

if (match) {
    return new Complex(
        Number(match[1]),
        Number(match[2])
    );
}

// =====================================
// a+i أو a-i
// =====================================
const matchUnit = str.match(
    /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))([+-])i$/
);

if (matchUnit) {
    return new Complex(
        Number(matchUnit[1]),
        matchUnit[2] === "+" ? 1 : -1
    );
}  
            throw new Error(
                "Cannot parse complex number: " + str
            );
        }


        // =====================================
        // Tokenizer جديد
        // =====================================

        // =====================================
// Tokenizer جديد للـ CMPLX
// =====================================
function tokenizeComplexExpression(str) {

    const tokens = [];
    let current = "";

    for (let i = 0; i < str.length; i++) {

        const ch = str[i];

        // =====================================
        // Operators
        // =====================================
        if (
            ch === "+" ||
            ch === "-" ||
            ch === "*" ||
            ch === "/"
        ) {

            // + أو - في بداية العدد
            if (
                current === "" &&
                (ch === "+" || ch === "-")
            ) {
                current += ch;
                continue;
            }

            // + أو - بعد Operator
            if (
                current === "" &&
                tokens.length > 0 &&
                (
                    tokens[tokens.length - 1] === "+" ||
                    tokens[tokens.length - 1] === "-" ||
                    tokens[tokens.length - 1] === "*" ||
                    tokens[tokens.length - 1] === "/"
                )
            ) {
                current += ch;
                continue;
            }

            if (current !== "") {
                tokens.push(current);
                current = "";
            }

            tokens.push(ch);
            continue;
        }

        current += ch;
    }

    if (current !== "") {
        tokens.push(current);
    }

    console.log("🟡 TOKENIZER RESULT:", tokens);

    return tokens;
}

        // =====================================
        // تنفيذ العملية
        // =====================================

        // =====================================
// تنفيذ العملية
// =====================================
function applyComplexOperation(a, op, b) {

    if (op === "+") return a.add(b);

    if (op === "-") return a.sub(b);

    if (op === "*") return a.mul(b);

    if (op === "/") return a.div(b);

    throw new Error(
        "Unknown operator: " + op
    );
}

function convertFractionsInComplexExpression(str) {

    let result = str;

    // (a/b) → decimal
    result = result.replace(
        /\(\s*([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)\s*\)/g,
        (match, numerator, denominator) => {

            const n = Number(numerator);
            const d = Number(denominator);

            if (d === 0) {
                throw new Error("Division by zero");
            }

            return String(n / d);
        }
    );

    // a/b → decimal
    result = result.replace(
        /([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)/g,
        (match, numerator, denominator) => {

            const n = Number(numerator);
            const d = Number(denominator);

            if (d === 0) {
                throw new Error("Division by zero");
            }

            return String(n / d);
        }
    );

    return result;
}
        // =====================================
        // حساب التعبير
        // =====================================

      function calculateComplexExpression(s) {

    let str = s.trim();

    str = str
        .replace(/\s+/g, "")
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

    console.log("🟣 CMPLX BEFORE FRACTION:", str);

    str = convertFractionsInComplexExpression(str);

    console.log("🟣 CMPLX AFTER FRACTION:", str);

    // ==========================================
    // 🟢 ROOT HANDLER — MUST BE FIRST
    // ==========================================

if (s.startsWith("√(") && s.endsWith(")")) {

    const inside = s.slice(2, -1).trim();

    console.log("🌳 ROOT INPUT:", inside);

    // بدون i → حساب عادي
   // بدون i
if (!inside.includes("i")) {

    const value = calculateFractionPart(inside);

    console.log("🌳 ROOT VALUE:", value);

    if (!Number.isFinite(value)) {
        throw new Error("Math Error");
    }

    // موجب → جذر عادي
    if (value >= 0) {
        const result = Math.sqrt(value);

        console.log("🌳 ROOT RESULT:", result);

        return new Complex(result, 0);
    }

    // سالب في CMPLX → نتيجة تخيلية
    const result = new Complex(
        0,
        Math.sqrt(Math.abs(value))
    );

    console.log(
        "🟣 COMPLEX NEGATIVE ROOT RESULT:",
        result.toString()
    );

    return result;
}

    // فيه i → Complex
    const z = calculateComplexExpression(inside);

    const r = Math.hypot(z.re, z.im);
    const theta = Math.atan2(z.im, z.re);

    const result = new Complex(
        Math.sqrt(r) * Math.cos(theta / 2),
        Math.sqrt(r) * Math.sin(theta / 2)
    );

    console.log(
        "🟣 COMPLEX ROOT RESULT:",
        result.toString()
    );

    return result;
}


// ==========================================
// 🟢 CUBE ROOT HANDLER — MUST BE FIRST
// ==========================================

if (s.startsWith("∛(") && s.endsWith(")")) {

    const inside = s.slice(2, -1).trim();

    console.log("🌳 CUBE ROOT INPUT:", inside);

    // بدون i → حساب عادي
    if (!inside.includes("i")) {

        const value = calculateFractionPart(inside);

        console.log("🌳 CUBE ROOT VALUE:", value);

        if (!Number.isFinite(value)) {
            throw new Error("Math Error");
        }

        const result = Math.cbrt(value);

        console.log("🌳 CUBE ROOT RESULT:", result);

        return new Complex(result, 0);
    }

    // فيه i → Complex
    const z = calculateComplexExpression(inside);

    const r = Math.hypot(z.re, z.im);
    const theta = Math.atan2(z.im, z.re);

    const result = new Complex(
        Math.cbrt(r) * Math.cos(theta / 3),
        Math.cbrt(r) * Math.sin(theta / 3)
    );

    console.log(
        "🟣 COMPLEX CUBE ROOT RESULT:",
        result.toString()
    );

    return result;
}
    // ==========================================
// CMPLX PARENTHESES
// ==========================================

if (s.startsWith("(") && s.endsWith(")")) {

    let depth = 0;
    let isOuterOnly = true;

    for (let i = 0; i < s.length; i++) {

        if (s[i] === "(") depth++;
        if (s[i] === ")") depth--;

        if (depth === 0 && i < s.length - 1) {
            isOuterOnly = false;
            break;
        }
    }

    if (isOuterOnly) {
        return calculateComplexExpression(
            s.slice(1, -1)
        );
    }
}
// ==========================================
// CMPLX FRACTION INSIDE PARENTHESES
// ==========================================

const fractionMatch = s.match(
    /^\((-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)\)$/
);

if (fractionMatch) {

    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);

    if (denominator === 0) {
        throw new Error("Division by zero");
    }

    return new Complex(
        numerator / denominator,
        0
    );
}
    // ==========================================
// COMPLEX RE
// ==========================================

const reMatch = s.match(/^Re\((.*)\)$/);

if (reMatch) {

    const inside =
        reMatch[1].trim();

    console.log(
        "🟣 RE INSIDE:",
        inside
    );

    const z =
        calculateComplexExpression(inside);

    const result =
        Number(z.re.toFixed(8));

    console.log(
        "🟢 RE RESULT:",
        result
    );

    return new Complex(result, 0);
}
    // ==========================================
// COMPLEX IM
// ==========================================

const imMatch = s.match(/^Im\((.*)\)$/);

if (imMatch) {

    const inside = imMatch[1].trim();

    console.log("🟣 IM INSIDE:", inside);

    const z =
        calculateComplexExpression(inside);

    const result =
        Number(z.im.toFixed(8));

    console.log(
        "🟢 IM RESULT:",
        result
    );

    return new Complex(result, 0);
}
    // ==========================================
// COMPLEX ARG
// ==========================================
const argMatch = s.match(/^Arg\((.*)\)$/);

if (argMatch) {

    const inside = argMatch[1].trim();

    console.log("🟣 ARG INSIDE:", inside);

    const z = calculateComplexExpression(inside);

    let result = Math.atan2(z.im, z.re);

    if (angleMode === "DEG") {
        result = result * 180 / Math.PI;
    }
    else if (angleMode === "GRAD") {
        result = result * 200 / Math.PI;
    }

    result = Number(result.toFixed(8));

    console.log("🟢 ARG RESULT:", result);

    return new Complex(result, 0);
}
// ==========================================
// CMPLX Conjg(z)
// ==========================================

const conjgMatch = s.match(/^Conjg\((.*)\)$/);

if (conjgMatch) {

    const inside = conjgMatch[1].trim();

    console.log("🟣 CONJG INSIDE:", inside);

    const z = calculateComplexExpression(inside);

    const result = new Complex(
        z.re,
        -z.im
    );

    console.log(
        "🟢 CONJG RESULT:",
        result.toString()
    );

    return result;
}
    console.log("🟣 CMPLX CALCULATE:", s);
    // ==========================================
// CMPLX: إزالة الأقواس الخارجية
// ==========================================

if (
    s.startsWith("(") &&
    s.endsWith(")")
) {
    let depth = 0;
    let wrapsWholeExpression = true;

    for (let i = 0; i < s.length; i++) {

        if (s[i] === "(") {
            depth++;
        }
        else if (s[i] === ")") {
            depth--;
        }

        // القوس الأول اتقفل قبل نهاية التعبير
        if (depth === 0 && i < s.length - 1) {
            wrapsWholeExpression = false;
            break;
        }
    }

    if (wrapsWholeExpression && depth === 0) {

        const inside = s.slice(1, -1);

        console.log(
            "🟢 CMPLX OUTER PARENTHESES:",
            inside
        );

        return calculateComplexExpression(inside);
    }
}
    // ==========================================
// COMPLEX LOG
// ==========================================
const logMatch = s.match(/^log\(([^()]+)\)$/);

if (logMatch) {

    const z = parseCMPLX(logMatch[1]);

    const modulus = Math.hypot(
        z.re,
        z.im
    );

    if (modulus === 0) {
        throw new Error("log(0)");
    }

    const angle = Math.atan2(
        z.im,
        z.re
    );

    const result = new Complex(
        Math.log10(modulus),
        angle / Math.LN10
    );

    console.log(
        "🟢 COMPLEX LOG RESULT:",
        result
    );

    return result;
}
    // ==========================================
// COMPLEX SIN
// ==========================================
const sinMatch = s.match(/^sin\(([^()]+)\)$/);

if (sinMatch) {

    const z = parseCMPLX(sinMatch[1]);

    const a = z.re;
    const b = z.im;

    const result = new Complex(
        Math.sin(a) * Math.cosh(b),
        Math.cos(a) * Math.sinh(b)
    );

    console.log(
        "🟢 COMPLEX SIN RESULT:",
        result
    );

    return result;
}
// ==========================================
// COMPLEX COS
// ==========================================
const cosMatch = s.match(/^cos\(([^()]+)\)$/);

if (cosMatch) {

    const z = parseCMPLX(cosMatch[1]);

    const a = z.re;
    const b = z.im;

    const result = new Complex(
        Math.cos(a) * Math.cosh(b),
        -Math.sin(a) * Math.sinh(b)
    );

    console.log(
        "🟢 COMPLEX COS RESULT:",
        result
    );

    return result;
}
// ==========================================
// COMPLEX TAN
// ==========================================
const tanMatch = s.match(/^tan\(([^()]+)\)$/);

if (tanMatch) {

    const z = parseCMPLX(tanMatch[1]);

    const a = z.re;
    const b = z.im;

    const denominator =
        Math.cos(2 * a) +
        Math.cosh(2 * b);

    if (Math.abs(denominator) < 1e-12) {
        throw new Error("Math Error");
    }

    const result = new Complex(
        Math.sin(2 * a) / denominator,
        Math.sinh(2 * b) / denominator
    );

    console.log(
        "🟢 COMPLEX TAN RESULT:",
        result
    );

    return result;
}
// ==========================================
// COMPLEX SINH
// ==========================================
const sinhMatch = s.match(/^sinh\(([^()]+)\)$/);

if (sinhMatch) {

    const z = parseCMPLX(sinhMatch[1]);

    const a = z.re;
    const b = z.im;

    const result = new Complex(
        Math.sinh(a) * Math.cos(b),
        Math.cosh(a) * Math.sin(b)
    );

    console.log(
        "🟢 COMPLEX SINH RESULT:",
        result
    );

    return result;
}
// ==========================================
// COMPLEX COSH
// ==========================================
const coshMatch = s.match(/^cosh\(([^()]+)\)$/);

if (coshMatch) {

    const z = parseCMPLX(coshMatch[1]);

    const a = z.re;
    const b = z.im;

    const result = new Complex(
        Math.cosh(a) * Math.cos(b),
        Math.sinh(a) * Math.sin(b)
    );

    console.log(
        "🟢 COMPLEX COSH RESULT:",
        result
    );

    return result;
}
// ==========================================
// COMPLEX BASIC HELPERS
// ==========================================

function complexMul(a, b) {
    return new Complex(
        a.re * b.re - a.im * b.im,
        a.re * b.im + a.im * b.re
    );
}

function complexDiv(a, b) {
    const den = b.re * b.re + b.im * b.im;

    if (Math.abs(den) < 1e-15) {
        throw new Error("Division by zero");
    }

    return new Complex(
        (a.re * b.re + a.im * b.im) / den,
        (a.im * b.re - a.re * b.im) / den
    );
}

function complexAdd(a, b) {
    return new Complex(
        a.re + b.re,
        a.im + b.im
    );
}

function complexSub(a, b) {
    return new Complex(
        a.re - b.re,
        a.im - b.im
    );
}

function complexNeg(a) {
    return new Complex(-a.re, -a.im);
}

function complexSqrt(z) {
    const r = Math.hypot(z.re, z.im);

    const real = Math.sqrt(
        Math.max(0, (r + z.re) / 2)
    );

    const imagSign = z.im < 0 ? -1 : 1;

    const imag = imagSign * Math.sqrt(
        Math.max(0, (r - z.re) / 2)
    );

    return new Complex(real, imag);
}

function complexExp(z) {
    const e = Math.exp(z.re);

    return new Complex(
        e * Math.cos(z.im),
        e * Math.sin(z.im)
    );
}

function complexLn(z) {
    const modulus = Math.hypot(z.re, z.im);

    if (modulus === 0) {
        throw new Error("ln(0)");
    }

    return new Complex(
        Math.log(modulus),
        Math.atan2(z.im, z.re)
    );
}
// ==========================================
// COMPLEX TANH
// ==========================================
const tanhMatch = s.match(/^tanh\(([^()]+)\)$/);

if (tanhMatch) {

    const z = parseCMPLX(tanhMatch[1]);

    const a = z.re;
    const b = z.im;

    const denominator =
        Math.cosh(2 * a) +
        Math.cos(2 * b);

    if (Math.abs(denominator) < 1e-12) {
        throw new Error("Math Error");
    }

    const result = new Complex(
        Math.sinh(2 * a) / denominator,
        Math.sin(2 * b) / denominator
    );

    console.log("🟢 COMPLEX TANH RESULT:", result);

    return result;
}


// ==========================================
// COMPLEX ASIN
// ==========================================
const asinMatch = s.match(
    /^(?:asin|sin⁻¹)\(([^()]+)\)$/
);

if (asinMatch) {

    const z = parseCMPLX(asinMatch[1]);

    const z2 = complexMul(z, z);

    const oneMinusZ2 = new Complex(
        1 - z2.re,
        -z2.im
    );

    const root = complexSqrt(oneMinusZ2);

    const iz = new Complex(
        -z.im,
        z.re
    );

    const inside = complexAdd(iz, root);

    const ln = complexLn(inside);

    const result = new Complex(
        ln.im,
        -ln.re
    );

    console.log("🟢 COMPLEX ASIN RESULT:", result);

    return result;
}


// ==========================================
// COMPLEX ACOS
// ==========================================
const acosMatch = s.match(
    /^(?:acos|cos⁻¹)\(([^()]+)\)$/
);

if (acosMatch) {

    const z = parseCMPLX(acosMatch[1]);

    const z2 = complexMul(z, z);

    const oneMinusZ2 = new Complex(
        1 - z2.re,
        -z2.im
    );

    const root = complexSqrt(oneMinusZ2);

    const iz = new Complex(
        -z.im,
        z.re
    );

    const inside = complexAdd(iz, root);

    const ln = complexLn(inside);

    const asin = new Complex(
        ln.im,
        -ln.re
    );

    const result = new Complex(
        Math.PI / 2 - asin.re,
        -asin.im
    );

    console.log("🟢 COMPLEX ACOS RESULT:", result);

    return result;
}


// ==========================================
// COMPLEX ATAN
// ==========================================
const atanMatch = s.match(
    /^(?:atan|tan⁻¹)\(([^()]+)\)$/
);

if (atanMatch) {

    const z = parseCMPLX(atanMatch[1]);

    const iz = new Complex(
        -z.im,
        z.re
    );

    const oneMinusIz = complexSub(
        new Complex(1, 0),
        iz
    );

    const onePlusIz = complexAdd(
        new Complex(1, 0),
        iz
    );

    const ln1 = complexLn(oneMinusIz);
    const ln2 = complexLn(onePlusIz);

    const diff = complexSub(ln1, ln2);

    const result = new Complex(
        -diff.im / 2,
        diff.re / 2
    );

    console.log("🟢 COMPLEX ATAN RESULT:", result);

    return result;
}


// ==========================================
// COMPLEX ASINH
// ==========================================
const asinhMatch = s.match(
    /^(?:asinh|sinh⁻¹)\(([^()]+)\)$/
);

if (asinhMatch) {

    const z = parseCMPLX(asinhMatch[1]);

    const z2 = complexMul(z, z);

    const insideRoot = new Complex(
        z2.re + 1,
        z2.im
    );

    const root = complexSqrt(insideRoot);

    const inside = complexAdd(z, root);

    const result = complexLn(inside);

    console.log("🟢 COMPLEX ASINH RESULT:", result);

    return result;
}


// ==========================================
// COMPLEX ACOSH
// ==========================================
const acoshMatch = s.match(
    /^(?:acosh|cosh⁻¹)\(([^()]+)\)$/
);

if (acoshMatch) {

    const z = parseCMPLX(acoshMatch[1]);

    const zp = new Complex(
        z.re + 1,
        z.im
    );

    const zm = new Complex(
        z.re - 1,
        z.im
    );

    const root1 = complexSqrt(zp);
    const root2 = complexSqrt(zm);

    const product = complexMul(
        root1,
        root2
    );

    const inside = complexAdd(
        z,
        product
    );

    const result = complexLn(inside);

    console.log("🟢 COMPLEX ACOSH RESULT:", result);

    return result;
}


// ==========================================
// COMPLEX ATANH
// ==========================================
const atanhMatch = s.match(
    /^(?:atanh|tanh⁻¹)\(([^()]+)\)$/
);

if (atanhMatch) {

    const z = parseCMPLX(atanhMatch[1]);

    const numerator = complexAdd(
        new Complex(1, 0),
        z
    );

    const denominator = complexSub(
        new Complex(1, 0),
        z
    );

    const fraction = complexDiv(
        numerator,
        denominator
    );

    const ln = complexLn(fraction);

    const result = new Complex(
        ln.re / 2,
        ln.im / 2
    );

    console.log("🟢 COMPLEX ATANH RESULT:", result);

    return result;
}
    // ==========================================
// COMPLEX POWER: z^w
// يدعم الأقواس
// ==========================================

const powerIndex = s.lastIndexOf("^");

if (powerIndex !== -1) {

    try {

        const baseText =
            s.slice(0, powerIndex).trim();

        const exponentText =
            s.slice(powerIndex + 1).trim();

        if (!baseText || !exponentText) {
            throw new Error("Invalid power");
        }

        const base =
            calculateComplexExpression(baseText);

        const exponent =
            calculateComplexExpression(exponentText);

        console.log(
            "🟣 POWER BASE:",
            base.toString()
        );

        console.log(
            "🟣 POWER EXP:",
            exponent.toString()
        );

        // ln(z)
        const modulus =
            Math.hypot(base.re, base.im);

        if (modulus === 0) {
            throw new Error("Math Error");
        }

        const angle =
            Math.atan2(base.im, base.re);

        const lnZ =
            new Complex(
                Math.log(modulus),
                angle
            );

        // w × ln(z)
        const realPart =
            exponent.re * lnZ.re -
            exponent.im * lnZ.im;

        const imagPart =
            exponent.re * lnZ.im +
            exponent.im * lnZ.re;

        // e^(real + i imag)
        const expReal =
            Math.exp(realPart);

        const result =
            new Complex(
                expReal * Math.cos(imagPart),
                expReal * Math.sin(imagPart)
            );

        console.log(
            "🟢 COMPLEX POWER RESULT:",
            result.toString()
        );

        return result;

    } catch (err) {

        console.error(
            "🟣 COMPLEX POWER ERROR:",
            err
        );

        throw err;
    }
}
// ==========================================
// 1 / z
// ==========================================
if (
    s.startsWith("1/(") &&
    s.endsWith(")")
) {

    const inside = s.slice(3, -1);

    console.log(
        "🟢 CMPLX 1/z INSIDE:",
        inside
    );

    const z = parseCMPLX(inside);

    const denominator =
        z.re * z.re +
        z.im * z.im;

    if (denominator === 0) {
        throw new Error("Math Error");
    }

    const result = new Complex(
        z.re / denominator,
        -z.im / denominator
    );

    console.log(
        "🟢 CMPLX 1/z RESULT:",
        result
    );

    return result;
}
    // ==========================================
// CMPLX ROOTS
// لو مفيش i → جذر عادي
// لو فيه i → جذر Complex
// ==========================================

if (s.startsWith("√(") && s.endsWith(")")) {

    const inside = s.slice(2, -1).trim();

    // ======================================
    // ROOT عادي بدون i
    // ======================================
    if (!inside.includes("i")) {

        const value = calculateFractionPart(inside);

        if (!Number.isFinite(value)) {
            throw new Error("Math Error");
        }

        if (value < 0) {
            throw new Error("Math Error");
        }

        const result = Math.sqrt(value);

        console.log(
            "🟢 NORMAL √ RESULT:",
            result
        );

        return new Complex(result, 0);
    }

    // ======================================
    // ROOT Complex
    // ======================================

    const z = calculateComplexExpression(inside);

    const modulus = Math.hypot(
        z.re,
        z.im
    );

    const angle = Math.atan2(
        z.im,
        z.re
    );

    const r = Math.sqrt(modulus);

    const result = new Complex(
        r * Math.cos(angle / 2),
        r * Math.sin(angle / 2)
    );

    console.log(
        "🟣 COMPLEX √ RESULT:",
        result.toString()
    );

    return result;
}


if (s.startsWith("∛(") && s.endsWith(")")) {

    const inside = s.slice(2, -1).trim();

    // ======================================
    // ROOT عادي بدون i
    // ======================================
    if (!inside.includes("i")) {

        const value = calculateFractionPart(inside);

        if (!Number.isFinite(value)) {
            throw new Error("Math Error");
        }

        const result = Math.cbrt(value);

        console.log(
            "🟢 NORMAL ∛ RESULT:",
            result
        );

        return new Complex(result, 0);
    }

    // ======================================
    // ROOT Complex
    // ======================================

    const z = calculateComplexExpression(inside);

    const modulus = Math.hypot(
        z.re,
        z.im
    );

    const angle = Math.atan2(
        z.im,
        z.re
    );

    const r = Math.cbrt(modulus);

    const result = new Complex(
        r * Math.cos(angle / 3),
        r * Math.sin(angle / 3)
    );

    console.log(
        "🟣 COMPLEX ∛ RESULT:",
        result.toString()
    );

    return result;
}
    // ==========================================
// CMPLX TOP-LEVEL OPERATIONS WITH PARENTHESES
// يحافظ على الأقواس ولا يفقد أولوية العمليات
// مثال: (2+i)*(1+i)
// ==========================================

let depth = 0;

// ------------------------------------------
// + و - على المستوى الخارجي
// ------------------------------------------

for (let i = s.length - 1; i >= 0; i--) {

    if (s[i] === ")") depth++;
    else if (s[i] === "(") depth--;

    if (
        depth === 0 &&
        (s[i] === "+" || s[i] === "-") &&
        i > 0
    ) {

        const left = s.slice(0, i).trim();
        const right = s.slice(i + 1).trim();

        if (left && right) {

            const a =
                calculateComplexExpression(left);

            const b =
                calculateComplexExpression(right);

            return s[i] === "+"
                ? complexAdd(a, b)
                : complexSub(a, b);
        }
    }
}

// ------------------------------------------
// * و / على المستوى الخارجي
// ------------------------------------------

depth = 0;

for (let i = s.length - 1; i >= 0; i--) {

    if (s[i] === ")") depth++;
    else if (s[i] === "(") depth--;

    if (
        depth === 0 &&
        (s[i] === "*" || s[i] === "/")
    ) {

        const left = s.slice(0, i).trim();
        const right = s.slice(i + 1).trim();

        if (left && right) {

            const a =
                calculateComplexExpression(left);

            const b =
                calculateComplexExpression(right);

            return s[i] === "*"
                ? complexMul(a, b)
                : complexDiv(a, b);
        }
    }
}
// ==========================================
// CMPLX PARENTHESES WITH OPERATIONS
// ==========================================



// ==========================================
// COMPLEX CONJG
// ==========================================
// ==========================================
// الجذر العادي بدون i
// ==========================================

if (!s.includes("i")) {

    if (s.startsWith("√(") && s.endsWith(")")) {
        const inside = s.slice(2, -1);

        const value = Number(
            calculateFractionPart(inside)
        );

        if (!Number.isFinite(value) || value < 0) {
            throw new Error("Math Error");
        }

        return new Complex(
            Math.sqrt(value),
            0
        );
    }

    if (s.startsWith("∛(") && s.endsWith(")")) {
        const inside = s.slice(2, -1);

        const value = Number(
            calculateFractionPart(inside)
        );

        if (!Number.isFinite(value)) {
            throw new Error("Math Error");
        }

        return new Complex(
            Math.cbrt(value),
            0
        );
    }
}

    // ==========================================
    // باقي التعبيرات العادية
    // ==========================================

    const tokens =
        tokenizeComplexExpression(s);

    console.log("TOKENS:", tokens);

    if (tokens.length === 0) {
        throw new Error("Empty expression");
    }

    const values = tokens.map(token => {

        if (
            token === "+" ||
            token === "-" ||
            token === "*" ||
            token === "/"
        ) {
            return token;
        }

        return parseCMPLX(token);
    });

    // ==========================================
    // × و ÷ أولاً
    // ==========================================

    const firstPass = [];

    let i = 0;

    while (i < values.length) {

        if (values[i] instanceof Complex) {

            let result = values[i];

            i++;

            while (
                i < values.length &&
                (
                    values[i] === "*" ||
                    values[i] === "/"
                )
            ) {

                const op = values[i];
                const right = values[i + 1];

                if (!(right instanceof Complex)) {
                    throw new Error(
                        "Invalid complex expression"
                    );
                }

                result =
                    applyComplexOperation(
                        result,
                        op,
                        right
                    );

                i += 2;
            }

            firstPass.push(result);

        }
        else {

            firstPass.push(values[i]);
            i++;
        }
    }

    // ==========================================
    // + و -
    // ==========================================

    let result = firstPass[0];

    i = 1;

    while (i < firstPass.length) {

        const op = firstPass[i];
        const right = firstPass[i + 1];

        if (
            !(result instanceof Complex) ||
            !(right instanceof Complex)
        ) {
            throw new Error(
                "Invalid complex operation"
            );
        }

        result =
            applyComplexOperation(
                result,
                op,
                right
            );

        i += 2;
    }

    return result;
}


    equalsBtn.onclick = function () {



        console.log(
    "EQUALS TEST:",
    currentMode,
    window.matrixData
);
   // ==========================================
// MATRIX POWER: MatA^n
// ==========================================

if (
    currentMode === "MATRIX" &&
    window.matrixPowerData &&
    document.getElementById("matrixPowerInput")
) {

    const n =
        Number(window.matrixPowerData.current);

    if (!Number.isInteger(n) || n < 0) {
        return;
    }

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;

    // n = 0 → Identity Matrix
    if (n === 0) {

        const size = A.length;

        const result =
            Array.from(
                { length: size },
                (_, r) =>
                    Array.from(
                        { length: size },
                        (_, c) => r === c ? 1 : 0
                    )
            );

        window.matrixPowerData = null;

        matrixShow("A^0", result);

        return;
    }

    // نسخ MatA
    let result =
        A.map(row => [...row]);

    // ضرب المصفوفات n مرات
    for (let power = 1; power < n; power++) {

        const size = A.length;

        const next =
            Array.from(
                { length: size },
                () => Array(size).fill(0)
            );

        for (let i = 0; i < size; i++) {

            for (let j = 0; j < size; j++) {

                for (let k = 0; k < size; k++) {

                    next[i][j] +=
                        result[i][k] * A[k][j];
                }
            }
        }

        result = next;
    }

    window.matrixPowerData = null;

    matrixShow("A^" + n, result);

    return;
}

        if (
    currentMode === "MATRIX" &&
    window.matrixScalarData &&
    document.getElementById("matrixScalarInput")
) {

    const K =
        Number(window.matrixScalarData.current);

    if (!Number.isFinite(K)) {
        return;
    }

    if (!window.matrices || !window.matrices.A) {
        return;
    }

    const A = window.matrices.A;

    const result = A.map(row =>
        row.map(value => value * K)
    );

    window.matrixScalarData = null;

    matrixShow("A × " + K, result);

    return;
}

       if (currentMode === "MATRIX" && window.matrixData) {

    const data = window.matrixData;
console.log("MATRIX EQUALS:", data);
    if (data.current === "") return;

    if (data.type === "SYMMETRIC") {

    data.values.push(Number(data.current));
    data.current = "";

    const needed =
        (data.size * (data.size + 1)) / 2;

    if (data.values.length < needed) {

        const positions = [];

        for (let r = 0; r < data.size; r++) {
            for (let c = r; c < data.size; c++) {
                positions.push([r, c]);
            }
        }

        const [r, c] =
            positions[data.values.length];

        const input =
            document.getElementById("matrixInput");

        if (input) {
            input.textContent =
                `a${r + 1}${c + 1} = _`;
        }

        return;
    }

    const matrix =
        Array.from(
            { length: data.size },
            () => Array(data.size).fill(0)
        );

    let index = 0;

    for (let r = 0; r < data.size; r++) {

        for (let c = r; c < data.size; c++) {

            matrix[r][c] =
                data.values[index];

            matrix[c][r] =
                data.values[index];

            index++;
        }
    }

    window.matrices = window.matrices || {};
    window.matrices[data.name] = matrix;

    matrixShow(data.name, matrix);

    return;
}
if (data.type === "SKEW") {

    data.values.push(Number(data.current));
    data.current = "";

    const needed =
        (data.size * (data.size - 1)) / 2;

    if (data.values.length < needed) {

        const positions = [];

        for (let r = 0; r < data.size; r++) {
            for (let c = r + 1; c < data.size; c++) {
                positions.push([r, c]);
            }
        }

        const [r, c] =
            positions[data.values.length];

        input.textContent =
            `a${r + 1}${c + 1} = _`;

        return;
    }

    const matrix =
        Array.from(
            { length: data.size },
            () => Array(data.size).fill(0)
        );

    let index = 0;

    for (let r = 0; r < data.size; r++) {

        for (let c = r + 1; c < data.size; c++) {

            const value = data.values[index];

            matrix[r][c] = value;
            matrix[c][r] = -value;

            index++;
        }
    }

    window.matrices = window.matrices || {};
    window.matrices[data.name] = matrix;

    matrixShow(data.name, matrix);

    return;
}
// ============================
// Normal Matrix
// ============================

if (data.type === "NORMAL") {

    data.values.push(Number(data.current));
    data.current = "";

    const total =
        data.rows * data.cols;

    const input =
        document.getElementById("matrixInput");

    if (data.values.length < total) {

        const index = data.values.length;

        const r =
            Math.floor(index / data.cols);

        const c =
            index % data.cols;

        if (input) {
            input.textContent =
                `a${r + 1}${c + 1} = _`;
        }

        return;
    }

    const matrix = [];

    for (let r = 0; r < data.rows; r++) {

        const row = [];

        for (let c = 0; c < data.cols; c++) {

            row.push(
                data.values[
                    r * data.cols + c
                ]
            );

        }

        matrix.push(row);
    }

    window.matrices =
        window.matrices || {};

    window.matrices[data.name] =
        matrix;

    matrixShow(
        data.name,
        matrix
    );

    return;
}
    // ============================
    // Scalar
    // ============================

    if (data.type === "SCALAR") {

        const value = Number(data.current);

        if (!Number.isFinite(value)) return;

        const matrix = [];

        for (let r = 0; r < data.size; r++) {

            const row = [];

            for (let c = 0; c < data.size; c++) {

                row.push(r === c ? value : 0);

            }

            matrix.push(row);
        }

        window.matrices = window.matrices || {};
        window.matrices[data.name] = matrix;

        matrixShow(data.name, matrix);

        data.current = "";

        return;
    }

    // ============================
    // Diagonal
    // ============================

    data.values.push(Number(data.current));
    data.current = "";

    const input =
        document.getElementById("matrixInput");

    if (data.values.length < data.size) {

        if (input) {
            input.textContent =
                `a${data.values.length + 1}${data.values.length + 1} = _`;
        }

        return;
    }

    const matrix = [];

    for (let r = 0; r < data.size; r++) {

        const row = [];

        for (let c = 0; c < data.size; c++) {

            row.push(
                r === c
                    ? data.values[r]
                    : 0
            );

        }

        matrix.push(row);
    }

    window.matrices = window.matrices || {};
    window.matrices[data.name] = matrix;

    matrixShow(data.name, matrix);

    return;
}

        console.log("=== EQUALS VERSION TEST ===");
        console.log("🔥 FRACTION STATE:", {
    fractionMode,
    fractionStage,
    fractionNumerator,
    fractionDenominator,
    fractionExpression
});
console.log("🔥 EQUALS DISPLAY:", display.value);
console.log("🔥 EQUALS FRACTION EXPRESSION:", fractionExpression);
console.log("🔥 FULL DISPLAY FOR CALC:", display.value);
      if (fractionMode) {

    // ==============================
    // من البسط إلى المقام
    // ==============================
    if (fractionStage === 1) {

    if (fractionNumerator === "") {
        return;
    }

    // لو لسه مفيش مقام، ننقل للمقام
    fractionStage = 2;

    const bottom =
        document.getElementById("fractionBottom");

    if (bottom) {
        bottom.textContent = "_";
    }

    return;
}
    // ==============================
    // حساب الكسر
    // ==============================
    if (fractionStage === 2) {

    if (fractionDenominator === "") {
        return;
    }

    if (Number(fractionDenominator) === 0) {

        const bottom =
            document.getElementById("fractionBottom");

        if (bottom) {
            bottom.textContent = "Error";
        }

        return;
    }

    // ==========================================
// حساب البسط والمقام
// ==========================================

let numerator;
let denominator;

// لو فيه كسر داخلي داخل بسط الكسر الخارجي
if (
    nestedFractionParentStage === 1 &&
    nestedFractionNumerator !== "" &&
    nestedFractionDenominator !== ""
) {

    const innerNum =
        calculateFractionPart(nestedFractionNumerator);

    const innerDen =
        calculateFractionPart(nestedFractionDenominator);

    if (innerDen === 0) {
        display.value = "Math Error";
        return;
    }

    numerator = innerNum / innerDen;

    console.log(
        "🟣 NESTED NUMERATOR:",
        innerNum,
        "/",
        innerDen,
        "=",
        numerator
    );

} else {

    numerator =
        calculateFractionPart(fractionNumerator);
}

// المقام الخارجي
denominator =
    calculateFractionPart(fractionDenominator);

console.log("🔥 NUMERATOR =", numerator);
console.log("🔥 DENOMINATOR =", denominator);
console.log("🔥 NUMERATOR =", numerator);
console.log("🔥 DENOMINATOR =", denominator);

console.log("NUMERATOR CALCULATED:", numerator);
// ==========================================
// تجهيز الكسر المتداخل قبل الحساب
// ==========================================


    // ==========================================
    // كسر بعد كسر + عملية حسابية
    // ==========================================

    if (fractionExpression) {

        const match = fractionExpression.match(
            /^\(\s*(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)\s*\)([+\-×÷])$/
        );

        if (match) {

            const n1 = Number(match[1]);
            const d1 = Number(match[2]);
            const operator = match[3];

            let resultNumerator;
            let resultDenominator;

            if (operator === "+") {

                resultNumerator =
                    n1 * denominator +
                    numerator * d1;

                resultDenominator =
                    d1 * denominator;

            } else if (operator === "-") {

                resultNumerator =
                    n1 * denominator -
                    numerator * d1;

                resultDenominator =
                    d1 * denominator;

            } else if (operator === "×") {

                resultNumerator =
                    n1 * numerator;

                resultDenominator =
                    d1 * denominator;

            } else if (operator === "÷") {

                if (numerator === 0) {
                    display.style.visibility = "visible";
                    display.value = "Math Error";

                    fractionMode = false;
                    fractionStage = 0;

                    return;
                }

                resultNumerator =
                    n1 * denominator;

                resultDenominator =
                    d1 * numerator;
            }

            // ==========================================
            // تبسيط النتيجة
            // ==========================================

            if (resultDenominator < 0) {
                resultNumerator *= -1;
                resultDenominator *= -1;
            }

            const divisor = gcd(
                Math.abs(resultNumerator),
                Math.abs(resultDenominator)
            );

            const simpleNumerator =
                resultNumerator / divisor;

            const simpleDenominator =
                resultDenominator / divisor;

            display.style.visibility = "visible";

            display.value =
    simpleNumerator +
    "/" +
    simpleDenominator;

display.style.fontSize = "28px";
display.style.textAlign = "center";

            answer =
                simpleNumerator /
                simpleDenominator;

            expression.textContent =
                `${simpleNumerator}/${simpleDenominator}`;

            const editor =
                document.getElementById("fractionEditor");

            if (editor) {
                editor.remove();
            }

            fractionMode = false;
            fractionStage = 0;
            fractionNumerator = "";
            fractionDenominator = "";
            fractionExpression = "";

            console.log(
                "FRACTION OPERATION RESULT:",
                simpleNumerator + "/" + simpleDenominator
            );

            return;
        }
        
    }

    // ==========================================
    // كسر واحد عادي
    // ==========================================
// ==========================================
// CMPLX FRACTION RESULT
// ==========================================

if (numerator instanceof Complex) {

    console.log("🟣 CMPLX FRACTION RESULT:", numerator);
    console.log("🟣 CMPLX FRACTION DENOMINATOR:", denominator);

    const realPart =
        numerator.re / denominator;

    const imagPart =
        numerator.im / denominator;

    console.log("🟣 CMPLX FRACTION REAL:", realPart);
    console.log("🟣 CMPLX FRACTION IMAG:", imagPart);

   let resultText = "";

    if (Math.abs(realPart) > 1e-10) {
        resultText += Number(realPart.toFixed(10));
    }

    if (Math.abs(imagPart) > 1e-10) {

        const imagValue =
            Number(Math.abs(imagPart).toFixed(10));

        if (resultText !== "") {
            resultText += imagPart >= 0 ? " + " : " - ";
        } else if (imagPart < 0) {
            resultText += "-";
        }

        if (imagValue === 1) {
            resultText += "i";
        } else {
            resultText += imagValue + "i";
        }
    }

    if (resultText === "") {
        resultText = "0";
    }

   

console.log("🟢 CMPLX FRACTION FINAL:", resultText);

// إجبار النتيجة على شاشة الآلة الرئيسية
display.value = "";
display.value = resultText;

display.style.visibility = "visible";
display.style.display = "block";

expression.textContent =
    `${fractionNumerator}/${fractionDenominator} =`;

answer = complexResult;
    const editor =
        document.getElementById("fractionEditor");

    if (editor) {
        editor.remove();
    }

    fractionMode = false;
    fractionStage = 0;
    fractionNumerator = "";
    fractionDenominator = "";
    fractionExpression = "";

    return;
}
   const roundedNumerator =
    Number(numerator.toFixed(10));

const roundedDenominator =
    Number(denominator.toFixed(10));

console.log("🔥 ROUNDED NUMERATOR:", roundedNumerator);
console.log("🔥 ROUNDED DENOMINATOR:", roundedDenominator);
const scale = 1000000000;

const scaledNumerator =
    Math.round(roundedNumerator * scale);

const scaledDenominator =
    Math.round(roundedDenominator * scale);

console.log(
    "🔥 SCALED NUMERATOR:",
    scaledNumerator
);

console.log(
    "🔥 SCALED DENOMINATOR:",
    scaledDenominator
);

const divisor = gcd(
    Math.abs(scaledNumerator),
    Math.abs(scaledDenominator)
);

const simpleNumerator =
    scaledNumerator / divisor;

const simpleDenominator =
    scaledDenominator / divisor;
    display.style.visibility = "visible";

    display.style.visibility = "visible";

if (simpleDenominator === 1) {
    display.value = String(simpleNumerator);
} else {
    display.value =
        simpleNumerator +
        "/" +
        simpleDenominator;
}

answer =
    simpleNumerator /
    simpleDenominator;

    expression.textContent =
        `${simpleNumerator}/${simpleDenominator}`;

    const editor =
        document.getElementById("fractionEditor");

    if (editor) {
        editor.remove();
    }

    fractionMode = false;
    fractionStage = 0;
    fractionNumerator = "";
    fractionDenominator = "";
    fractionExpression = "";

    return;
}
}
        if (
    currentMode === "EQN" &&
    document.getElementById("eqnInput")
) {
    eqnNext();
    return;
}
if (
    currentMode === "EQN" &&
    document.getElementById("cubicInput")
) {
    cubicNext();
    return;
}

if (
    currentMode === "EQN" &&
    document.getElementById("quarticInput")
) {
    quarticNext();
    return;
}


       try {

   let expr = display.value.trim();       

// ==========================================
// ABS MODE
// ==========================================

if (absMode) {

    // إزالة علامات | | من الشاشة قبل الحساب
    expr = expr
        .replace(/^\|\s*/, "")
        .replace(/\s*\|$/, "")
        .trim();

    if (!expr) return;

    try {

        // CMPLX
        if (currentMode === "CMPLX" && expr.includes("i")) {

           const clean = expr
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/");
let complexClean = clean;

// =====================================
// تحويل الكسور داخل CMPLX
// =====================================

// (a/b)i → decimal i
complexClean = complexClean.replace(
    /\((-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)\)i/g,
    (_, numerator, denominator) => {

        const n = Number(numerator);
        const d = Number(denominator);

        if (d === 0) {
            throw new Error("Division by zero");
        }

        return `${n / d}i`;
    }
);

// (a/b) → decimal
complexClean = complexClean.replace(
    /\((-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)\)/g,
    (_, numerator, denominator) => {

        const n = Number(numerator);
        const d = Number(denominator);

        if (d === 0) {
            throw new Error("Division by zero");
        }

        return String(n / d);
    }
);

// a/bi → decimal i
complexClean = complexClean.replace(
    /(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)i/g,
    (_, numerator, denominator) => {

        const n = Number(numerator);
        const d = Number(denominator);

        if (d === 0) {
            throw new Error("Division by zero");
        }

        return `${n / d}i`;
    }
);

// 1/2 → 0.5
complexClean = complexClean.replace(
    /(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/g,
    (_, numerator, denominator) => {

        const n = Number(numerator);
        const d = Number(denominator);

        if (d === 0) {
            throw new Error("Division by zero");
        }

        return String(n / d);
    }
);

console.log("CMPLX ORIGINAL:", clean);
console.log("CMPLX FINAL BEFORE CALC:", complexClean);
// =====================================
// تحويل الكسور داخل CMPLX
// =====================================



// (a/b)i  →  decimal i
complexClean = complexClean.replace(
    /\((-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)\)i/g,
    (_, numerator, denominator) => {

        const n = Number(numerator);
        const d = Number(denominator);

        if (d === 0) {
            throw new Error("Division by zero");
        }

        return `${n / d}i`;
    }
);

// a/bi → decimal i
complexClean = complexClean.replace(
    /(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)i/g,
    (_, numerator, denominator) => {

        const n = Number(numerator);
        const d = Number(denominator);

        if (d === 0) {
            throw new Error("Division by zero");
        }

        return `${n / d}i`;
    }
);

// (a/b) → decimal
complexClean = complexClean.replace(
    /\((-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)\)/g,
    (_, numerator, denominator) => {

        const n = Number(numerator);
        const d = Number(denominator);

        if (d === 0) {
            throw new Error("Division by zero");
        }

        return String(n / d);
    }
);

console.log("CMPLX ORIGINAL:", clean);
console.log("CMPLX CLEAN:", complexClean);
console.log("CMPLX FINAL BEFORE CALC:", complexClean);
            const match = clean.match(
                /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))([+-](?:\d+(?:\.\d+)?|\.\d+))i$/
            );

            const unitMatch = clean.match(
                /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))([+-])i$/
            );
const imaginaryOnly = clean.match(
    /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))i$/
);
            let real;
            let imag;

            if (match) {
    real = Number(match[1]);
    imag = Number(match[2]);
} else if (unitMatch) {
    real = Number(unitMatch[1]);
    imag = unitMatch[2] === "+" ? 1 : -1;
} else if (imaginaryOnly) {
    real = 0;
    imag = Number(imaginaryOnly[1]);
} else {
    throw new Error("Invalid complex number");
}

            const result = Math.sqrt(
                real * real + imag * imag
            );

            display.value = result;
            answer = result;

        } else {

            // رقم عادي
            const result = Math.abs(Number(expr));

            if (!Number.isFinite(result)) {
                display.value = "Math Error";
                absMode = false;
                return;
            }

            display.value = result;
            answer = result;
        }

        expression.textContent = "|" + expr + "|";

        absMode = false;

        return;

    } catch (error) {

        console.error("ABS MODE ERROR:", error);

        display.value = "Math Error";

        absMode = false;

        return;
    }
}
// ==========================================
// إنهاء إدخال الكسر عند الضغط على =
// ==========================================

// ==========================================
// حساب كسر بتعبيرات كاملة
// ==========================================
console.log("🔥 BEFORE FRACTION CONDITION");
console.log(
    fractionMode,
    fractionStage,
    fractionNumerator,
    fractionDenominator
);
if (
    fractionMode &&
    fractionStage === 2 &&
    fractionNumerator !== "" &&
    fractionDenominator !== ""
) {
    console.log("🔥 FRACTION FINAL TEST");
console.log("NUM:", fractionNumerator);
console.log("DEN:", fractionDenominator);
console.log("🔥 FRACTION EQUAL TEST");
console.log("NUMERATOR:", fractionNumerator);
console.log("DENOMINATOR:", fractionDenominator);
console.log("STAGE:", fractionStage);
    try {

        // ==========================================
        // حساب البسط
        // ==========================================

        const numeratorExpression =
            fractionNumerator.trim();

        // ==========================================
        // حساب المقام
        // ==========================================

        const denominatorExpression =
            fractionDenominator.trim();

            console.log("🔥 FRACTION DEBUG");
console.log("NUMERATOR TEXT:", numeratorExpression);
console.log("DENOMINATOR TEXT:", denominatorExpression);
console.log("NUMERATOR NUMBER:", Number(numeratorExpression));
console.log("DENOMINATOR NUMBER:", Number(denominatorExpression));

        if (!numeratorExpression || !denominatorExpression) {
            return;
        }

        console.log(
            "FRACTION NUMERATOR:",
            numeratorExpression
        );

        console.log(
            "FRACTION DENOMINATOR:",
            denominatorExpression
        );

        // ==========================================
        // حساب التعبيرين باستخدام محرك الآلة
        // ==========================================

       let numeratorValue;
let denominatorValue;

// ==========================================
// CMPLX داخل الكسر
// ==========================================
if (
    currentMode === "CMPLX" &&
    (
        numeratorExpression.includes("i") ||
        denominatorExpression.includes("i")
    )
) {
    try {

        // البسط
        const numeratorComplex =
            calculateComplexExpression(numeratorExpression);

        // المقام
        const denominatorComplex =
            calculateComplexExpression(denominatorExpression);

        // القسمة
        const complexResult =
            numeratorComplex.div(denominatorComplex);
const resultText = complexResult.toString();

console.log("🟣 CMPLX FRACTION FINAL:", resultText);
console.log("🟣 DISPLAY BEFORE:", display);
console.log("🟣 DISPLAY ID:", display.id);
        console.log(
            "🟣 COMPLEX FRACTION RESULT:",
            complexResult.toString()
        );

       display.style.visibility = "visible";
display.style.display = "block";
display.style.position = "absolute";

display.style.left = "10px";
display.style.right = "10px";
display.style.bottom = "10px";
display.style.top = "auto";

display.style.width = "calc(100% - 20px)";
display.style.height = "38px";

display.style.fontFamily = "monospace";
display.style.fontSize = "29px";
display.style.fontWeight = "900";
display.style.lineHeight = "38px";

display.style.color = "#11180b";
display.style.textAlign = "right";
display.style.direction = "ltr";

display.value = complexResult.toString();
        answer =
            complexResult;

        expression.textContent =
            `${numeratorExpression}/${denominatorExpression} =`;

        const editor =
            document.getElementById("fractionEditor");

        if (editor) {
            editor.remove();
        }

        fractionMode = false;
        fractionStage = 0;
        fractionNumerator = "";
        fractionDenominator = "";
        fractionExpression = "";

        return;

    } catch (err) {

        console.error(
            "🟣 COMPLEX FRACTION ERROR:",
            err
        );

        display.value =
            "Math Error";

        fractionMode = false;
        fractionStage = 0;

        return;
    }
}

// ==========================================
// الكسور العادية
// ==========================================
numeratorValue =
    calculateFractionPart(
        numeratorExpression
    );

denominatorValue =
    calculateFractionPart(
        denominatorExpression
    );
console.log(
    "🔥 NUMERATOR VALUE:",
    numeratorValue
);

console.log(
    "🔥 DENOMINATOR VALUE:",
    denominatorValue
);

console.log("🔥 NUMERATOR VALUE:", numeratorValue);
console.log("🔥 DENOMINATOR VALUE:", denominatorValue);

        // ==========================================
        // منع القسمة على صفر
        // ==========================================

        if (denominatorValue === 0) {
            display.style.visibility = "visible";
            display.value = "Math Error";

            fractionMode = false;
            fractionStage = 0;

            return;
        }

        // ==========================================
        // تحويل النتيجة إلى كسر
        // ==========================================

        let resultNumerator =
            numeratorValue;

        let resultDenominator =
            denominatorValue;

        // تقريب الأعداد العشرية
        resultNumerator =
            Number(resultNumerator.toFixed(10));

        resultDenominator =
            Number(resultDenominator.toFixed(10));

        // ==========================================
        // لو الناتج أعداد صحيحة
        // ==========================================

        if (
            Number.isInteger(resultNumerator) &&
            Number.isInteger(resultDenominator)
        ) {

            let divisor = gcd(
                Math.abs(resultNumerator),
                Math.abs(resultDenominator)
            );

            resultNumerator /= divisor;
            resultDenominator /= divisor;

        } else {

            // تحويل عشري إلى كسر تقريبي
            const scale = 1000000;

            let n =
                Math.round(resultNumerator * scale);

            let d =
                Math.round(resultDenominator * scale);

                console.log("🔴 BEFORE GCD:", {
    resultNumerator,
    resultDenominator,
    n,
    d
});

            const divisor = gcd(
                Math.abs(n),
                Math.abs(d)
            );

            resultNumerator =
                n / divisor;

            resultDenominator =
                d / divisor;
        }

        // ==========================================
        // جعل الإشارة في البسط
        // ==========================================

        // ==========================================
// جعل الإشارة في البسط
// ==========================================

if (resultDenominator < 0) {
    resultNumerator *= -1;
    resultDenominator *= -1;
}

// ==========================================
// إذا كان المقام = 1 لا تعرض /1
// ==========================================

if (resultDenominator === 1) {
    resultNumerator = Number(resultNumerator);
}
console.log("🟢 FINAL FRACTION:", {
    numerator: resultNumerator,
    denominator: resultDenominator,
    denominatorType: typeof resultDenominator
});
        // ==========================================
        // عرض النتيجة
        // ==========================================

        display.style.visibility = "visible";

        // ==========================================
// عرض النتيجة
// ==========================================

display.style.visibility = "visible";

if (resultDenominator === 1) {
    display.value = String(resultNumerator);
} else {
    display.value =
        resultNumerator +
        "/" +
        resultDenominator;
}
answer =
    resultNumerator /
    resultDenominator;

        expression.textContent =
            `${numeratorExpression}/${denominatorExpression} =`;

        // ==========================================
        // حذف محرر الكسر
        // ==========================================

        const editor =
            document.getElementById("fractionEditor");

        if (editor) {
            editor.remove();
        }

        fractionMode = false;
        fractionStage = 0;
        fractionNumerator = "";
        fractionDenominator = "";
        fractionExpression = "";

        console.log(
            "FRACTION FINAL RESULT:",
            display.value
        );

        return;

    } catch (err) {

        console.error(
            "FRACTION CALC ERROR:",
            err
        );

        display.style.visibility = "visible";
        display.value = "Math Error";

        fractionMode = false;
        fractionStage = 0;

        return;
    }
}
if (!expr) return;

   // =====================================
// CMPLX ENGINE
// =====================================
if (
    currentMode === "CMPLX" &&
    (
        expr.includes("i") ||
        expr.startsWith("Pol(") ||
        expr.startsWith("Rec(")
    )
) {
    try {

        const clean = expr
            .replace(/\s+/g, "")
            .replace(/×/g, "*")
            .replace(/÷/g, "/");

        console.log("========== CMPLX ==========");
        console.log("INPUT:", clean);
        // ==========================================
// CMPLX RECTANGULAR
// Rec(r,θ) → a+bi
// ==========================================

const recMatch = clean.match(
    /^Rec\(([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)\)$/
);

if (recMatch) {

    try {

        const r = Number(recMatch[1]);
        let theta = Number(recMatch[2]);

        if (angleMode === "DEG") {
            theta = theta * Math.PI / 180;
        }
        else if (angleMode === "GRAD") {
            theta = theta * Math.PI / 200;
        }

        const real = r * Math.cos(theta);
        const imag = r * Math.sin(theta);

        const result = new Complex(
            Number(real.toFixed(8)),
            Number(imag.toFixed(8))
        );

        console.log(
            "🟣 REC RESULT:",
            result
        );

        display.value = result.toString();

        expression.textContent =
            clean + " =";

        answer = result;

        cursorPosition =
            display.value.length;

        updateCursor();

        return;

    } catch (err) {

        console.error(
            "REC ERROR:",
            err
        );

        display.value =
            "Math Error";

        return;
    }
}
        // ==========================================
// CMPLX POLAR
// Pol(x,y) → r∠θ
// ==========================================

const polMatch = clean.match(
    /^Pol\(([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)\)$/
);

if (polMatch) {

    try {

        const x = Number(polMatch[1]);
        const y = Number(polMatch[2]);

        const r = Math.hypot(x, y);

        let theta = Math.atan2(y, x);

        if (angleMode === "DEG") {
            theta = theta * 180 / Math.PI;
        }
        else if (angleMode === "GRAD") {
            theta = theta * 200 / Math.PI;
        }

        const result =
            new Complex(r, theta);

        console.log(
            "🟣 POL RESULT:",
            r,
            theta
        );

        display.value =
            `${r.toFixed(6)}∠${theta.toFixed(6)}`;

        expression.textContent =
            clean + " =";

        answer = result;

        cursorPosition =
            display.value.length;

        updateCursor();

        return;

    } catch (err) {

        console.error(
            "POL ERROR:",
            err
        );

        display.value =
            "Math Error";

        return;
    }
}
        console.log("🟣 LN TEST:", clean.startsWith("ln("));
console.log("🟣 LN END:", clean.endsWith(")"));
     // ==========================================
// CMPLX √
// ==========================================

if (
    clean.startsWith("√(") &&
    clean.endsWith(")")
) {

    try {

        const inside =
            clean.slice(2, -1);

        console.log(
            "🟣 CMPLX √ INSIDE:",
            inside
        );

        const z =
            parseCMPLX(inside);

        console.log(
            "🟣 CMPLX √ PARSED:",
            z
        );

        const modulus =
            Math.sqrt(
                z.re * z.re +
                z.im * z.im
            );

        const r =
            Math.sqrt(modulus);

        const theta =
            Math.atan2(z.im, z.re) / 2;

        const result =
            new Complex(
                r * Math.cos(theta),
                r * Math.sin(theta)
            );

        console.log(
            "🟣 CMPLX √ RESULT:",
            result
        );

        display.value =
            result.toString();

        answer = result;

        cursorPosition =
            display.value.length;

        updateCursor();

        return;

    } catch (err) {

        console.error(
            "🟣 CMPLX √ ERROR:",
            err
        );

        display.value =
            "Math Error";

        return;
    }
}
// ==========================================
// CMPLX ln
// ==========================================

if (
    clean.startsWith("ln(") &&
    clean.endsWith(")")
) {

    try {

        const inside =
            clean.slice(3, -1);

        console.log(
            "🟣 CMPLX ln INSIDE:",
            inside
        );

        const z =
            parseCMPLX(inside);

        console.log(
            "🟣 CMPLX ln PARSED:",
            z
        );

        const modulus =
            Math.sqrt(
                z.re * z.re +
                z.im * z.im
            );

        const angle =
            Math.atan2(z.im, z.re);

        const result =
            new Complex(
                Math.log(modulus),
                angle
            );

        console.log(
            "🟣 CMPLX ln RESULT:",
            result
        );

        display.value =
            result.toString();

        answer = result;

        cursorPosition =
            display.value.length;

        updateCursor();

        return;

    } catch (err) {

        console.error(
            "🟣 CMPLX ln ERROR:",
            err
        );

        display.value =
            "Math Error";

        return;
    }
}
// ==========================================
// CMPLX e^()
// ==========================================

if (
    clean.startsWith("e^(") &&
    clean.endsWith(")")
) {

    try {

        const inside =
            clean.slice(3, -1);

        console.log(
            "🟣 CMPLX EXP INSIDE:",
            inside
        );

        const z =
            parseCMPLX(inside);

        console.log(
            "🟣 CMPLX EXP PARSED:",
            z
        );

        const expReal =
            Math.exp(z.re);

        const result =
            new Complex(
                expReal * Math.cos(z.im),
                expReal * Math.sin(z.im)
            );

        console.log(
            "🟣 CMPLX EXP RESULT:",
            result
        );

        display.value =
            result.toString();

        answer = result;

        cursorPosition =
            display.value.length;

        updateCursor();

        return;

    } catch (err) {

        console.error(
            "🟣 CMPLX EXP ERROR:",
            err
        );

        display.value =
            "Math Error";

        return;
    }
}
        


        // =====================================
        // Parse Complex Number
        // =====================================

        
        // =====================================
        // الحساب النهائي
        // =====================================

      // ==========================================
// CMPLX FRACTION CLEAN
// ==========================================

let cmplxFractionClean = clean;

// ------------------------------------------
// (a/b)i
// ------------------------------------------
cmplxFractionClean =
    cmplxFractionClean.replace(
        /\((-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)\)i/g,
        (_, numerator, denominator) => {

            const n = Number(numerator);
            const d = Number(denominator);

            if (d === 0) {
                throw new Error("Division by zero");
            }

            return `${n / d}i`;
        }
    );

// ------------------------------------------
// (a/b)
// ------------------------------------------
cmplxFractionClean =
    cmplxFractionClean.replace(
        /\((-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)\)/g,
        (_, numerator, denominator) => {

            const n = Number(numerator);
            const d = Number(denominator);

            if (d === 0) {
                throw new Error("Division by zero");
            }

            return String(n / d);
        }
    );

console.log(
    "CMPLX ORIGINAL:",
    clean
);

console.log(
    "CMPLX FRACTION CLEAN:",
    cmplxFractionClean
);

const result =
    calculateComplexExpression(
        cmplxFractionClean
    );
        display.value =
            result.toString();

        expression.textContent =
            clean + " =";

        answer = result;

        historyStack.push({
            expr: clean,
            res: display.value
        });

        console.log("RESULT:", result.toString());
        console.log("==========================");

        return;

    }
    catch (err) {

        console.error("CMPLX ERROR:", err);

        display.value = "Math Error";

        return;
    }
}
// =====================================
// قوة كسر: (a/b)^n
// =====================================

const fractionPowerMatch = expr.match(
    /^\(\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\s*\)\s*\^\s*(-?\d+)\s*$/
);

if (fractionPowerMatch) {

    const numerator = Number(fractionPowerMatch[1]);
    const denominator = Number(fractionPowerMatch[2]);
    const exponent = Number(fractionPowerMatch[3]);

    console.log("🔥 FRACTION POWER DETECTED");
    console.log("NUMERATOR:", numerator);
    console.log("DENOMINATOR:", denominator);
    console.log("EXPONENT:", exponent);

    if (denominator === 0) {
        display.value = "Math Error";
        return;
    }

    if (numerator === 0 && exponent < 0) {
        display.value = "Math Error";
        return;
    }

    let resultNumerator;
    let resultDenominator;

    if (exponent >= 0) {

        resultNumerator =
            Math.pow(numerator, exponent);

        resultDenominator =
            Math.pow(denominator, exponent);

    } else {

        resultNumerator =
            Math.pow(denominator, Math.abs(exponent));

        resultDenominator =
            Math.pow(numerator, Math.abs(exponent));
    }

    // جعل الإشارة في البسط
    if (resultDenominator < 0) {
        resultNumerator *= -1;
        resultDenominator *= -1;
    }

    // تبسيط
    const divisor = gcd(
        Math.abs(resultNumerator),
        Math.abs(resultDenominator)
    );

    resultNumerator /= divisor;
    resultDenominator /= divisor;

    if (resultDenominator === 1) {

        display.value =
            String(resultNumerator);

        answer =
            resultNumerator;

    } else {

        display.value =
            resultNumerator +
            "/" +
            resultDenominator;

        answer =
            resultNumerator /
            resultDenominator;
    }

    expression.textContent =
        expr + " =";

    historyStack.push({
        expr: expr,
        res: display.value
    });

    console.log(
        "🟢 FRACTION POWER RESULT:",
        display.value
    );

    return;
}
    // =====================================
    // حساب العمليات التي تحتوي على كسور
    // =====================================

    if (expr.includes("/")) {

        const fraction = fractionResult(expr);

        if (fraction.denominator === 1) {

            display.value =
                fraction.numerator;

            answer =
                fraction.numerator;

        } else {

            display.value =
                fraction.numerator +
                "/" +
                fraction.denominator;

            answer =
                fraction.numerator /
                fraction.denominator;
        }

        expression.textContent =
            expr + " =";

        historyStack.push({
            expr: expr,
            res: display.value
        });

        return;
    }

            // منع إعادة حساب رسالة الخطأ
            if (

                expr === "Math Error" ||
                expr === "Error" ||
                expr === "Syntax Error"
            ) {
                display.value = "";
                return;
            }

            expression.textContent = expr + " =";

            // =====================================
            // إغلاق الأقواس الناقصة
            // =====================================

            let openCount = (expr.match(/\(/g) || []).length;
            let closeCount = (expr.match(/\)/g) || []).length;

            if (openCount > closeCount) {
                expr += ")".repeat(openCount - closeCount);
            }
            // ==========================================

            // =====================================
            // تحويل الرموز
            // =====================================

            let parsed = expr
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("π", "Math.PI")
    .replaceAll("Ans", String(answer))
    .replace(/\be\b/g, "Math.E")
    .replaceAll("^", "**");

            // =====================================
            // الدوال المثلثية
            // =====================================

            parsed = parsed.replace(
                /asin\(([^()]*)\)/g,
                "fromRadians(Math.asin($1))"
            );

            parsed = parsed.replace(
                /acos\(([^()]*)\)/g,
                "fromRadians(Math.acos($1))"
            );

            parsed = parsed.replace(
                /atan\(([^()]*)\)/g,
                "fromRadians(Math.atan($1))"
            );

            parsed = parsed.replace(
    /asinh\(([^()]*)\)/g,
    "Math.asinh($1)"
);

parsed = parsed.replace(
    /acosh\(([^()]*)\)/g,
    "Math.acosh($1)"
);

parsed = parsed.replace(
    /atanh\(([^()]*)\)/g,
    "Math.atanh($1)"
);

            // =====================================
            // الدوال المثلثية العادية
            // =====================================

            // =====================================
// الدوال المثلثية العادية
// =====================================

parsed = parsed.replace(
    /(?<!a)sin\(([^()]*)\)/g,
    "Math.sin(toRadians($1))"
);

parsed = parsed.replace(
    /(?<!a)cos\(([^()]*)\)/g,
    "Math.cos(toRadians($1))"
);

parsed = parsed.replace(
    /(?<!a)tan\(([^()]*)\)/g,
    "Math.tan(toRadians($1))"
);

            // =====================================
            // الدوال الأخرى
            // =====================================

         parsed = parsed
    .replace(/√\(/g, "sqrt(")
    .replace(/∛\(/g, "cbrt(")
    .replace(/abs\(/g, "abs(")
    .replace(/log\(/g, "log(")
    .replace(/ln\(/g, "ln(");
            // =====================================
            // e^x
            // =====================================

            parsed = parsed.replace(
                /e\*\*/g,
                "Math.E**"
            );

            // =====================================
            // المضروب
            // =====================================

            parsed = parsed.replace(
                /(\d+)!/g,
                "factorial($1)"
            );

            // =====================================
            // التباديل والتوافيق
            // =====================================

            parsed = parsed
                .replace(
                    /(\d+)\s*P\s*(\d+)/g,
                    "permutation($1,$2)"
                )
                .replace(
                    /(\d+)\s*C\s*(\d+)/g,
                    "combination($1,$2)"
                );

            // =====================================
            // النسبة المئوية
            // =====================================

            parsed = parsed.replace(
                /(\d+(?:\.\d+)?)%/g,
                "($1/100)"
            );

        

            console.log("Expression:", expr);
            console.log("Parsed:", parsed);

            

       
            // =====================================
            // التنفيذ
            // =====================================
 // ==========================================
// 🟣 CMPLX CALCULATION
// ==========================================

if (currentMode === "CMPLX") {

    try {

        const complexExpression =
            display.value.trim();

        console.log(
            "🟣 CMPLX EXPRESSION:",
            complexExpression
        );

        const complexResult =
    calculateComplexExpression(complexExpression);

        console.log(
            "🟣 CMPLX RESULT:",
            complexResult
        );

        display.value =
            complexResult.toString();

        answer = complexResult;

        cursorPosition =
            display.value.length;

        updateCursor();

        return;

    } catch (err) {

        console.error(
            "🟣 CMPLX ERROR:",
            err
        );

        display.value = "Math Error";

        return;
    }
}

            const result = Function(
    "toRadians",
    "fromRadians",
    "factorial",
    "permutation",
    "combination",
    "sqrt",
    "cbrt",
    "abs",
    "log",
    "ln",

    `"use strict"; return (${parsed})`

)(
    toRadians,
    fromRadians,
    factorial,
    permutation,
    combination,
    Math.sqrt,
    Math.cbrt,
    Math.abs,
    Math.log10,
    Math.log
);

            // =====================================
            // عرض النتيجة
            // =====================================

            if (typeof result === "number") {

                if (!Number.isFinite(result)) {
                    throw new Error("Math Error");
                }

                let cleanResult =
                    Math.abs(result) < 1e-12
                        ? 0
                        : Number(result.toFixed(8));

                display.value = cleanResult;

                answer = cleanResult;

            } else {

                display.value = result;

            }

            // =====================================
            // History
            // =====================================

            historyStack.push({
                expr: expr,
                res: display.value
            });

        } catch (err) {

            console.error("Calculator Error:", err);

            display.value = "Math Error";

        }

    };
    // أزرار العمليات الحسابية الأربعة
// ==========================================

document.querySelectorAll(".operator").forEach(btn => {

    btn.onclick = function () {

        const value = this.textContent.trim();

        // ==========================================
// الخروج من الكسر وكتابة العملية
// ==========================================

if (
    !fractionMode &&
    fractionExpression &&
    ["+", "−", "×", "÷"].includes(value)
) {

    display.style.visibility = "visible";

    display.value =
        fractionExpression + value;

    fractionExpression += value;

    console.log("🔥 OPERATION AFTER FRACTION:", fractionExpression);
console.log(
    "🧪 DISPLAY AFTER OPERATOR:",
    display.value
);
    return;
}

      if (currentMode === "EQN") {

    if (value === "-" || value === "−") {

        if (document.getElementById("quarticInput")) {
            quarticEnterNumber("-");
        } else if (document.getElementById("cubicInput")) {
            cubicEnterNumber("-");
        } else {
            eqnEnterNumber("-");
        }

        return;
    }
}

        // =====================================
        // EQN - المعادلة التكعيبية
        // =====================================

        if (
            currentMode === "EQN" &&
            document.getElementById("cubicInput")
        ) {
            cubicEnterNumber(value);
            return;
        }

        // =====================================
        // العمليات على الكسور
        // =====================================

       // ==========================================
// العمليات داخل الكسر
// ==========================================
// ==========================================
// السالب داخل الكسر الداخلي
// ==========================================

// ==========================================
// السالب داخل الكسر الداخلي
// ==========================================

if (nestedFractionMode) {

    // ==========================================
    // السالب في بسط الكسر الداخلي
    // ==========================================

    if (
        (value === "-" || value === "−") &&
        nestedFractionStage === 1
    ) {

        if (nestedFractionNumerator === "| |") {

            nestedFractionNumerator = "|-|";

        } else if (nestedFractionNumerator === "") {

            nestedFractionNumerator = "-";

        } else {

            nestedFractionNumerator += value;
        }

        updateFractionDisplay();

        console.log(
            "🟣 NESTED NEGATIVE NUMERATOR:",
            nestedFractionNumerator
        );

        return;
    }

    // ==========================================
    // السالب في مقام الكسر الداخلي
    // ==========================================

    if (
        (value === "-" || value === "−") &&
        nestedFractionStage === 2
    ) {

        if (nestedFractionDenominator === "| |") {

            nestedFractionDenominator = "|-|";

        } else if (nestedFractionDenominator === "") {

            nestedFractionDenominator = "-";

        } else {

            nestedFractionDenominator += value;
        }

        updateFractionDisplay();

        console.log(
            "🟣 NESTED NEGATIVE DENOMINATOR:",
            nestedFractionDenominator
        );

        return;
    }
}
if (fractionMode) {

    const value = this.textContent.trim();

    if (fractionStage === 1) {

    // السماح بالسالب في بداية البسط
    if (
        (value === "-" || value === "−") &&
        fractionNumerator === ""
    ) {
        fractionNumerator = "-";
        updateFractionDisplay();
        return;
    }

    if (fractionNumerator !== "") {
        fractionNumerator += value;
        updateFractionDisplay();
    }

    return;
}

if (fractionStage === 2) {

    // السماح بالسالب في بداية المقام
    if (
        (value === "-" || value === "−") &&
        fractionDenominator === ""
    ) {
        fractionDenominator = "-";
        updateFractionDisplay();
        return;
    }

    if (fractionDenominator !== "") {
        fractionDenominator += value;
        updateFractionDisplay();
    }

    return;
}
}
writeToDisplay(value);
    };

});

}
// أزرار History و Prime
const historyBtn = document.getElementById("historyBtn");
if (historyBtn) {
    historyBtn.onclick = () => {
        if (!historyStack.length) {
            createScreenPanel(`<b>History Log:</b><br><br>لا يوجد سجل سابق`);
        } else {
            createScreenPanel(`
                <b>History Log:</b><br>
                ${historyStack.slice(-5).map(h => `<div style="font-size:10px; margin:2px 0;">${h.expr} = <b>${h.res}</b></div>`).join("")}
            `);
        }
    
    };

}


const primeBtn = document.getElementById("primeBtn");
if (primeBtn) {
    primeBtn.onclick = () => {
        let n = Number(display.value);
        if (!n) return;
        display.value = isPrime(n) ? "PRIME" : "NOT PRIME";
    };
}
// =====================================
// زر ABS
// =====================================

// ==========================================
// ABS BUTTON
// ==========================================

// ==========================================
// ABS BUTTON
// ==========================================

const absBtn = document.getElementById("absBtn");

if (absBtn) {

    absBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        // ==========================================
        // SHIFT + ABS = Re
        // ==========================================
        // ==========================================
// SHIFT + ABS = Re(
// ==========================================
// ==========================================
// SHIFT + ABS = Re(
// ==========================================
if (shift && currentMode === "CMPLX") {

    absMode = false;

    writeToDisplay("Re(");

    shift = false;

    if (status) {
        status.textContent = currentMode;
    }

    console.log("🟣 RE INPUT");

    return;
}

        // ==========================================
        // ABS العادي
        // ==========================================
// ==========================================
// ABS داخل الكسر الداخلي
// ==========================================
// ==========================================
// ABS داخل الكسر الداخلي
// ==========================================

// ==========================================
// ABS داخل الكسر الداخلي
// ==========================================
console.log(
    "🧪 ABS STATE:",
    "fractionMode =", fractionMode,
    "nestedFractionMode =", nestedFractionMode,
    "fractionStage =", fractionStage,
    "nestedFractionStage =", nestedFractionStage
);
if (nestedFractionMode) {

    // ==========================================
    // ABS داخل الكسر الداخلي
    // ==========================================

    if (nestedFractionStage === 1) {

        // لو ABS مفتوح بالفعل، لا تفتحه مرة ثانية
        if (nestedFractionNumerator.startsWith("abs(")) {
            console.log("🟣 NESTED ABS ALREADY OPEN");
            return;
        }

        nestedFractionNumerator += "abs(";

    } else if (nestedFractionStage === 2) {

        // لو ABS مفتوح بالفعل، لا تفتحه مرة ثانية
        if (nestedFractionDenominator.startsWith("abs(")) {
            console.log("🟣 NESTED ABS ALREADY OPEN");
            return;
        }

        nestedFractionDenominator += "abs(";
    }

    
}
// ==========================================
// ABS داخل الكسر الداخلي - أولوية أعلى
// ==========================================

if (nestedFractionMode) {

    if (nestedFractionStage === 1) {

        if (!nestedFractionNumerator.startsWith("abs(")) {
            nestedFractionNumerator += "abs(";
        }

    } else if (nestedFractionStage === 2) {

        if (!nestedFractionDenominator.startsWith("abs(")) {
            nestedFractionDenominator += "abs(";
        }
    }

    updateFractionDisplay();

    console.log(
        "🟣 NESTED ABS:",
        nestedFractionStage === 1
            ? nestedFractionNumerator
            : nestedFractionDenominator
    );

    return;
}
// ==========================================
// ABS داخل الكسر الخارجي
// ==========================================
if (fractionMode) {

    if (fractionStage === 1) {

        fractionNumerator += "|";

        updateFractionDisplay();

        console.log(
            "🔵 OUTER ABS OPEN:",
            fractionNumerator
        );

    } else if (fractionStage === 2) {

        fractionDenominator += "|";

        updateFractionDisplay();

        console.log(
            "🔵 OUTER ABS OPEN:",
            fractionDenominator
        );
    }

    return;
}

   

        absMode = true;

        display.value = "|  |";

        console.log(
            "========== ABS MODE =========="
        );

        console.log(
            "ABS MODE ON"
        );

    }, true);

}
const percentBtn = document.getElementById("percentBtn");

if (percentBtn) {

    percentBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        // ==========================================
        // SHIFT + % = Im
        // ==========================================
        // ==========================================
// SHIFT + % = Im(
// ==========================================
if (shift && currentMode === "CMPLX") {

    writeToDisplay("Im(");

    shift = false;

    if (status) {
        status.textContent = currentMode;
    }

    console.log("🟣 IM INPUT");

    return;
}

        // ==========================================
        // % العادي
        // ==========================================

        writeToDisplay("%");

    }, true);
}
// ==========================================
// SHIFT + i = Polar
// i العادي = i
// ==========================================


// ==========================================
// Arg - زاوية العدد المركب
// ==========================================
const argBtn = document.getElementById("argBtn");

if (argBtn) {
    argBtn.onclick = () => {
        // ==========================================
// SHIFT + Arg = Conjg(
// ==========================================
if (shift && currentMode === "CMPLX") {

    writeToDisplay("Conjg(");

    shift = false;

    if (status) {
        status.textContent = currentMode;
    }

    console.log("🟣 CONJG INPUT");

    return;
}

        // ==========================================
// ARG INPUT
// ==========================================
if (currentMode === "CMPLX") {

    writeToDisplay("Arg(");

    if (shift) {
        shift = false;
    }

    if (status) {
        status.textContent = currentMode;
    }

    console.log("🟣 ARG INPUT");

    return;
}
    };
}
const complexIBtn = document.getElementById("complexIBtn");

if (complexIBtn) {

    complexIBtn.onclick = () => {
if (
    currentMode === "CMPLX" &&
    fractionMode
) {
    if (fractionStage === 1) {
        fractionNumerator += "i";
        updateFractionDisplay();

        console.log(
            "🟣 CMPLX i → FRACTION NUMERATOR:",
            fractionNumerator
        );

        return;
    }

    if (fractionStage === 2) {
        fractionDenominator += "i";
        updateFractionDisplay();

        console.log(
            "🟣 CMPLX i → FRACTION DENOMINATOR:",
            fractionDenominator
        );

        return;
    }
}
        // ==========================================
        // i بعد كسر في CMPLX
        // ==========================================

        if (
            currentMode === "CMPLX" &&
            !fractionMode &&
            display.value
        ) {

            const value = display.value.trim();

            // لو الشاشة فيها كسر فقط
            if (/^-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?$/.test(value)) {

                display.value = "(" + value + ")i";

                console.log(
                    "CMPLX FRACTION i:",
                    display.value
                );

                return;
            }

            // لو فيه عملية تنتهي بكسر
            const match = value.match(
                /(\(-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?\))$/
            );

            if (match) {

                display.value += "i";

                console.log(
                    "CMPLX FRACTION i:",
                    display.value
                );

                return;
            }
        }

        // السلوك العادي
        writeToDisplay("i");
    };
}

const dmsBtn = document.getElementById("dmsBtn");

if (dmsBtn) {
    dmsBtn.onclick = () => {

        let value = Number(display.value);

        if (!Number.isFinite(value)) return;

        // تحويل القيمة إلى درجات حسب وضع الزاوية
        if (angleMode === "RAD") {
            value = value * 180 / Math.PI;
        } 
        else if (angleMode === "GRAD") {
            value = value * 0.9;
        }

        let sign = value < 0 ? "-" : "";
        value = Math.abs(value);

        let degrees = Math.floor(value);

        let minutesFull = (value - degrees) * 60;
        let minutes = Math.floor(minutesFull);

        let seconds = (minutesFull - minutes) * 60;

        // معالجة التقريب
        if (seconds >= 59.995) {
            seconds = 0;
            minutes++;

            if (minutes >= 60) {
                minutes = 0;
                degrees++;
            }
        }

        display.value =
            `${sign}${degrees}° ${minutes}′ ${seconds.toFixed(2)}″`;
    };
}
const navLeft = document.getElementById("navLeft");
const navUp = document.getElementById("navUp");
const navDown = document.getElementById("navDown");

if (navDown) {

    navDown.onclick = function () {

        // ==========================================
        // الكسر الداخلي
        // ==========================================
        if (fractionMode && nestedFractionMode) {

            // بسط الداخلي → مقام الداخلي
            if (nestedFractionStage === 1) {

                nestedFractionStage = 2;

                updateFractionDisplay();

                console.log(
                    "🟣 NESTED DOWN → DENOMINATOR"
                );

                return;
            }

            // مقام الداخلي → مقام الخارجي
            if (
    nestedFractionStage === 2 &&
    nestedFractionParentStage === 1
) {

    // نخرج من إدخال الكسر الداخلي
    // لكن لا نمسح بياناته
    nestedFractionMode = false;
    nestedFractionStage = 0;

    // ننتقل لمقام الكسر الخارجي
    fractionStage = 2;

    updateFractionDisplay();

    console.log(
        "🟣 NESTED DOWN → OUTER DENOMINATOR"
    );

    return;
}
        }

        // ==========================================
        // الكسر الخارجي
        // ==========================================
        if (fractionMode) {

            if (fractionStage === 1) {

                if (fractionNumerator === "") {
                    return;
                }

                fractionStage = 2;

                updateFractionDisplay();

                console.log(
                    "🔵 OUTER DOWN → DENOMINATOR"
                );

                return;
            }
        }

        // خارج الكسر
        moveSelection("down");
    };
}
const navRight = document.getElementById("navRight");

if (navRight) {
    navRight.onclick = function () {

        // لو داخل الكسر ووصلنا للمقام
        if (fractionMode && fractionStage === 2) {

            if (
                fractionNumerator === "" ||
                fractionDenominator === ""
            ) {
                return;
            }

            // حفظ الكسر الحالي
            fractionExpression =
                `(${fractionNumerator}/${fractionDenominator})`;

            // إنهاء وضع إدخال الكسر
            fractionMode = false;
            fractionStage = 0;

            // إظهار الشاشة
            display.style.visibility = "visible";

            // وضع الكسر في الشاشة
            display.value = fractionExpression;

            // حذف محرر الكسر
            const editor =
                document.getElementById("fractionEditor");

            if (editor) {
                editor.remove();
            }

            console.log(
                "🔥 FRACTION EXIT:",
                fractionExpression
            );

            return;
        }
    };
}
const navButtons = Array.from(
    document.querySelectorAll(".number-grid button")
);

let selectedButtonIndex = 0;

function updateSelectedButton() {

    navButtons.forEach(btn => {
        btn.classList.remove("nav-selected");
    });

    if (navButtons[selectedButtonIndex]) {
        navButtons[selectedButtonIndex].classList.add("nav-selected");
    }
}

function moveSelection(direction) {

    let row = Math.floor(selectedButtonIndex / 5);
    let col = selectedButtonIndex % 5;

    if (direction === "left") {
        col--;
    }

    if (direction === "right") {
        col++;
    }

    if (direction === "up") {
        row--;
    }

    if (direction === "down") {
        row++;
    }

    // منع الخروج من حدود الجدول
    row = Math.max(0, Math.min(3, row));
    col = Math.max(0, Math.min(4, col));

    selectedButtonIndex = row * 5 + col;

    updateSelectedButton();
}

if (navLeft) {
    navLeft.onclick = () => {
        if (fractionMode) {
            console.log("◀");
        } else {
            moveSelection("left");
        }
    };
}

if (navRight) {
    navRight.onclick = () => {
        if (fractionMode) {
            console.log("▶");
            console.log("DISPLAY BEFORE PLUS:", display.value);
console.log("FRACTION EXPRESSION:", fractionExpression);
            const fraction =
    `(${fractionNumerator}/${fractionDenominator})`;

if (fractionParent === "√") {

    fractionExpression =
        `√(${fraction})`;

}
else if (fractionParent === "∛") {

    fractionExpression =
        `∛(${fraction})`;

}
else {

    fractionExpression = fraction;

}

console.log(
    "🔥 FINAL FRACTION EXPRESSION:",
    fractionExpression
);
fractionMode = false;
fractionStage = 0;

display.style.visibility = "visible";
display.value = fractionExpression;
cursorPosition = display.value.length;
updateCursor();
const editor =
    document.getElementById("fractionEditor");

if (editor) {
    editor.remove();
}

console.log(
    "🔥 FRACTION EXIT:",
    fractionExpression
);

console.log(
    "🔥 AFTER EXIT DISPLAY:",
    display.value
);

// ==========================================
// 🧹 مسح بيانات محرر الكسر بعد الخروج
// ==========================================
fractionNumerator = "";
fractionDenominator = "";
fractionParent = "";
console.log("🧹 FRACTION EDITOR DATA CLEARED");

console.log(
    "🔥 FINAL FRACTION STATE:",
    {
        fractionMode,
        fractionStage,
        fractionNumerator,
        fractionDenominator,
        fractionExpression
    }
);

return; {

    
}
        } else {
            moveSelection("right");
        }
    };
}

if (navUp) {
    navUp.onclick = () => {

        if (fractionMode) {
            fractionStage = 1;
            updateFractionDisplay();
            console.log("البسط");
        } else {
            moveSelection("up");
        }
    };
}



updateSelectedButton();

// =====================================
// زر الموجب / السالب ±
// =====================================
document.getElementById("plusMinus").addEventListener("click", () => {

    if (!display.value) return;

    if (display.value.startsWith("-")) {
        display.value = display.value.slice(1);
    } else {
        display.value = "-" + display.value;
    }

});
setTimeout(() => {

    const btn = document.getElementById("plusMinus");

    console.log("========== PLUS MINUS ==========");
    console.log("BUTTON:", btn);
    console.log("DISPLAY:", btn ? getComputedStyle(btn).display : "NOT FOUND");
    console.log("VISIBILITY:", btn ? getComputedStyle(btn).visibility : "NOT FOUND");
    console.log("PARENT:", btn ? btn.parentElement : "NOT FOUND");
    console.log("===============================");

}, 3000);
const plusMinusTest = document.getElementById("plusMinus");

console.log("PLUS MINUS TEST:", plusMinusTest);

if (plusMinusTest) {
    plusMinusTest.style.display = "block";
    plusMinusTest.style.visibility = "visible";
    plusMinusTest.style.opacity = "1";
}
window.addEventListener("load", () => {

    const btn = document.getElementById("plusMinus");

    console.log("===== FINAL PLUS MINUS CHECK =====");
    console.log("BUTTON:", btn);

    if (btn) {
        btn.textContent = "±";
        btn.style.display = "block";
        btn.style.visibility = "visible";
        btn.style.opacity = "1";
    }

});
const plusMinusBtn = document.getElementById("plusMinus");

if (plusMinusBtn) {

    plusMinusBtn.onclick = function () {

        // ==========================================
        // MATRIX ±
        // ==========================================

        if (
            currentMode === "MATRIX" &&
            window.matrixData
        ) {

            const data = window.matrixData;

            if (data.current === "") {
                return;
            }

            if (data.current.startsWith("-")) {
                data.current =
                    data.current.substring(1);
            } else {
                data.current =
                    "-" + data.current;
            }

            const input =
                document.getElementById("matrixInput");

            if (!input) return;

            // NORMAL
            if (data.type === "NORMAL") {

                const index = data.values.length;

const r = Math.floor(index / data.cols);
const c = index % data.cols;

input.textContent =
    `a${r + 1}${c + 1} = ${data.current}`;
                return;
            }

            // SKEW
            if (data.type === "SKEW") {

                const positions = [];

                for (let r = 0; r < data.size; r++) {
                    for (
                        let c = r + 1;
                        c < data.size;
                        c++
                    ) {
                        positions.push([r, c]);
                    }
                }

                const index =
                    data.values.length;

                if (index < positions.length) {

                    const [r, c] =
                        positions[index];

                    input.textContent =
                        `a${r + 1}${c + 1} = ${data.current}`;
                }

                return;
            }

            // SYMMETRIC
            if (data.type === "SYMMETRIC") {

                const positions = [];

                for (let r = 0; r < data.size; r++) {
                    for (
                        let c = r;
                        c < data.size;
                        c++
                    ) {
                        positions.push([r, c]);
                    }
                }

                const index =
                    data.values.length;

                if (index < positions.length) {

                    const [r, c] =
                        positions[index];

                    input.textContent =
                        `a${r + 1}${c + 1} = ${data.current}`;
                }

                return;
            }

            // SCALAR
            if (data.type === "SCALAR") {

                input.textContent =
                    "القيمة = " + data.current;

                return;
            }

        }

        // ==========================================
        // الوضع العادي
        // ==========================================

        let value =
            display.value.trim();

        if (!value) return;

        if (
            /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value)
        ) {

            if (value.startsWith("-")) {
                value = value.substring(1);
            } else {
                value = "-" + value;
            }

            display.value = value;
            answer = Number(value);

            return;
        }

        if (
            value.startsWith("-(") &&
            value.endsWith(")")
        ) {

            display.value =
                value.slice(2, -1);

        } else {

            display.value =
                "-(" + value + ")";
        }
    };
}
// =====================================
// VECTOR CALCULATIONS
// =====================================

window.calcVectorMagnitude = function () {

    const A = document.getElementById("vectorA");
    const R = document.getElementById("vectorRes");

    if (!A || !R) return;

    const a = A.value
        .split(",")
        .map(Number);

    if (!a.length || a.some(Number.isNaN)) {
        R.innerHTML = "أدخل A بشكل صحيح";
        return;
    }

    const mag = Math.sqrt(
        a.reduce((sum, x) => sum + x * x, 0)
    );

    R.innerHTML = `|A| = ${mag.toFixed(6)}`;
};


window.calcVectorDot = function () {

    const A = document.getElementById("vectorA");
    const B = document.getElementById("vectorB");
    const R = document.getElementById("vectorRes");

    if (!A || !B || !R) return;

    const a = A.value.split(",").map(Number);
    const b = B.value.split(",").map(Number);

    if (
        !a.length ||
        !b.length ||
        a.some(Number.isNaN) ||
        b.some(Number.isNaN) ||
        a.length !== b.length
    ) {
        R.innerHTML = "A و B يجب أن يكونا بنفس عدد العناصر";
        return;
    }

    const dot = a.reduce(
        (sum, x, i) => sum + x * b[i],
        0
    );

    R.innerHTML = `A · B = ${dot.toFixed(6)}`;
};
window.calcVectorProjection = function () {

    const A = document.getElementById("vectorA");
    const B = document.getElementById("vectorB");
    const R = document.getElementById("vectorRes");

    if (!A || !B || !R) return;

    const a = A.value.split(",").map(Number);
    const b = B.value.split(",").map(Number);

    if (
        !a.length ||
        !b.length ||
        a.some(Number.isNaN) ||
        b.some(Number.isNaN) ||
        a.length !== b.length
    ) {
        R.innerHTML = "A و B يجب أن يكونا بنفس عدد العناصر";
        return;
    }

    const dot = a.reduce(
        (sum, x, i) => sum + x * b[i],
        0
    );

    const bMag2 = b.reduce(
        (sum, x) => sum + x * x,
        0
    );

    if (bMag2 === 0) {
        R.innerHTML = "ERROR";
        return;
    }

    const factor = dot / bMag2;

    const projection = b.map(
        x => factor * x
    );

    R.innerHTML =
        `Proj(A,B) = (${projection
            .map(x => x.toFixed(6))
            .join(", ")})`;
};

window.calcVectorCross = function () {

    const A = document.getElementById("vectorA");
    const B = document.getElementById("vectorB");
    const R = document.getElementById("vectorRes");

    if (!A || !B || !R) return;

    const a = A.value.split(",").map(Number);
    const b = B.value.split(",").map(Number);

    if (
        a.length !== 3 ||
        b.length !== 3 ||
        a.some(Number.isNaN) ||
        b.some(Number.isNaN)
    ) {
        R.innerHTML = "A × B يحتاج متجهين 3D";
        return;
    }

    const x = a[1] * b[2] - a[2] * b[1];
    const y = a[2] * b[0] - a[0] * b[2];
    const z = a[0] * b[1] - a[1] * b[0];

    R.innerHTML =
        `A × B = (${x.toFixed(6)}, ${y.toFixed(6)}, ${z.toFixed(6)})`;
};
window.calcVectorAdd = function () {

    const A = document.getElementById("vectorA");
    const B = document.getElementById("vectorB");
    const R = document.getElementById("vectorRes");

    if (!A || !B || !R) return;

    const a = A.value.split(",").map(Number);
    const b = B.value.split(",").map(Number);

    if (
        a.length !== b.length ||
        a.some(Number.isNaN) ||
        b.some(Number.isNaN)
    ) {
        R.innerHTML = "A و B يجب أن يكونا بنفس عدد العناصر";
        return;
    }

    const result = a.map((x, i) => x + b[i]);

    R.innerHTML =
        `A + B = (${result.map(x => x.toFixed(6)).join(", ")})`;
};


window.calcVectorSub = function () {

    const A = document.getElementById("vectorA");
    const B = document.getElementById("vectorB");
    const R = document.getElementById("vectorRes");

    if (!A || !B || !R) return;

    const a = A.value.split(",").map(Number);
    const b = B.value.split(",").map(Number);

    if (
        a.length !== b.length ||
        a.some(Number.isNaN) ||
        b.some(Number.isNaN)
    ) {
        R.innerHTML = "A و B يجب أن يكونا بنفس عدد العناصر";
        return;
    }

    const result = a.map((x, i) => x - b[i]);

    R.innerHTML =
        `A − B = (${result.map(x => x.toFixed(6)).join(", ")})`;
};
window.calcVectorAngle = function () {

    const A = document.getElementById("vectorA");
    const B = document.getElementById("vectorB");
    const R = document.getElementById("vectorRes");

    if (!A || !B || !R) return;

    const a = A.value.split(",").map(Number);
    const b = B.value.split(",").map(Number);

    if (
        a.length !== b.length ||
        !a.length ||
        a.some(Number.isNaN) ||
        b.some(Number.isNaN)
    ) {
        R.innerHTML = "A و B يجب أن يكونا بنفس عدد العناصر";
        return;
    }

    const dot = a.reduce((s, x, i) => s + x * b[i], 0);

    const magA = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
    const magB = Math.sqrt(b.reduce((s, x) => s + x * x, 0));

    if (!magA || !magB) {
        R.innerHTML = "لا يمكن حساب الزاوية";
        return;
    }

    const cosTheta = Math.max(
        -1,
        Math.min(1, dot / (magA * magB))
    );

    const angle =
        Math.acos(cosTheta) * 180 / Math.PI;

    R.innerHTML = `θ = ${angle.toFixed(6)}°`;
};
window.calcVectorUnit = function () {

    const A = document.getElementById("vectorA");
    const R = document.getElementById("vectorRes");

    if (!A || !R) return;

    const a = A.value.split(",").map(Number);

    if (!a.length || a.some(Number.isNaN)) {
        R.innerHTML = "أدخل A بشكل صحيح";
        return;
    }

    const mag = Math.sqrt(
        a.reduce((sum, x) => sum + x * x, 0)
    );

    if (mag === 0) {
        R.innerHTML = "لا يمكن عمل Unit Vector للصفر";
        return;
    }

    const unit = a.map(x => x / mag);

    R.innerHTML =
        `Unit A = (${unit.map(x => x.toFixed(6)).join(", ")})`;
};
console.log("========== SHIFT BUTTONS ==========");

document.querySelectorAll(".scientific-grid button").forEach(btn => {

    const txt = btn.textContent.trim();

    if (
        txt === "sin" ||
        txt === "cos" ||
        txt === "tan" ||
        txt === "sin⁻¹" ||
        txt === "cos⁻¹" ||
        txt === "tan⁻¹" ||
        txt === "sinh" ||
        txt === "cosh" ||
        txt === "tanh" ||
        txt === "x²" ||
        txt === "x³" ||
        txt === "√" ||
        txt === "xʸ" ||
        txt === "ln" ||
        txt === "log" ||
        txt === "eˣ"
    ) {
        console.log("SHIFT:", txt);
    }
});

// Reliability layer for the two structured-entry features below.  It runs
// before the legacy handler and leaves all of the existing calculator modes
// in place.
if (equalsBtn) {
    equalsBtn.addEventListener("click", event => {
        // ABS originally converted its contents with Number(...), which makes
        // expressions such as |1+2| fail.  Use the calculator's own parser.
        if (absMode && currentMode !== "CMPLX") {
            event.stopImmediatePropagation();
            const inside = display.value
                .replace(/^\|\s*/, "")
                .replace(/\s*\|$/, "")
                .trim();

            try {
                if (!inside) return;
                const value = Math.abs(calculateFractionPart(inside));
                display.value = Number(value.toFixed(10));
                answer = Number(display.value);
                expression.textContent = "|" + inside + "| =";
            } catch (error) {
                display.value = "Math Error";
            } finally {
                absMode = false;
            }
            return;
        }

        // Complete an inner fraction explicitly before handing evaluation back
        // to the original outer-fraction code.  This supports an inner
        // fraction in either the numerator or denominator.
        if (fractionMode && nestedFractionMode) {
            event.stopImmediatePropagation();

            if (nestedFractionStage === 1) {
                if (nestedFractionNumerator) {
                    nestedFractionStage = 2;
                    updateFractionDisplay();
                }
                return;
            }

            if (!nestedFractionNumerator || !nestedFractionDenominator) {
                return;
            }

            const inner = "(" + nestedFractionNumerator + ")/(" +
                nestedFractionDenominator + ")";

            if (nestedFractionParentStage === 1) {
                fractionNumerator = inner;
            } else {
                fractionDenominator = inner;
            }

            nestedFractionMode = false;
            nestedFractionStage = 0;
            fractionStage = nestedFractionParentStage;
            updateFractionDisplay();

            // Resume the original flow with the normalized inner fraction.
            equalsBtn.onclick();
        }
    }, true);
}

document.addEventListener("focusin", function (e) {
    console.log(
        "🎯 FOCUS:",
        "id =", e.target.id,
        "tag =", e.target.tagName,
        "readonly =", e.target.readOnly,
        "inputMode =", e.target.inputMode
    );
});

document.addEventListener("focusout", function (e) {
    console.log(
        "❌ BLUR:",
        "id =", e.target.id
    );
});