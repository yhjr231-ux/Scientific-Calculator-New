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

let currentCalculationType = "math";

let answer = 0;
let memory = 0;
let angleMode = "DEG"; // DEG | RAD | GRAD
let shift = false;
let alpha = false;
let currentMode = "COMP"; // COMP | CMPLX | STAT | EQN | MATRIX | VECTOR | TABLE
function removeCustomModePanel() {

    document.querySelectorAll("#customModePanel").forEach(panel => {
        panel.remove();
    });

}
// ==========================================
// 🏠 شاشة اختيار طريقة الحساب
// ==========================================

const calculatorHome =
    document.getElementById("calculatorHome");

const homeChoices =
    document.querySelectorAll(".home-choice");


// ==========================================
// 🧹 حذف شاشة القسم الحالية
// ==========================================

function clearSectionScreen() {

    closeCustomPanel();

    const fractionEditor = document.getElementById('fractionEditor');
    if (fractionEditor) fractionEditor.remove();

    fractionMode = false;
    fractionStage = 0;
    fractionNumerator = '';
    fractionDenominator = '';
    fractionExpression = '';

    // ����� ���� ����� ������ �������
    document.body.classList.remove('physics-mode');
    document.body.classList.remove('chemistry-mode');
    document.body.classList.remove('programming-mode');
    document.body.classList.remove('math-mode');

    // ����� �� ���� ��� �����
    removeCustomModePanel();

}

function openCalculatorHome() {

    console.log("🏠 فتح قائمة اختيار طريقة الحساب");

    // حذف أي شاشة قسم مفتوحة
    closeCustomPanel();

    // إظهار شاشة اختيار طريقة الحساب
    if (calculatorHome) {

        calculatorHome.classList.remove("hidden");
        calculatorHome.style.display = "flex";

    }

    // إخفاء الآلة الحاسبة
    const calculator = document.querySelector(".calculator");

    if (calculator) {

        calculator.classList.add("hidden");
        calculator.style.display = "none";

    }

    console.log("✅ رجعنا لقائمة اختيار طريقة الحساب");
}


// ==========================================
// ❌ إغلاق شاشة اختيار طريقة الحساب
// ==========================================

function closeCalculatorHome() {

    if (calculatorHome) {
        calculatorHome.style.display = "none";
    }

}


// ==========================================
// 🎯 اختيار القسم
// ==========================================

homeChoices.forEach(button => {

    button.addEventListener("click", () => {

        const calculationType =
            button.dataset.calculation;

        saveOriginalCalculatorUI();

        // تنظيف شاشة القسم السابق قبل فتح القسم الجديد
        clearSectionScreen();
        currentCalculationType = calculationType;
        playKeySound(620);


        // ==========================================
        // 🧹 امسح أي قسم قديم قبل فتح الجديد
        // ==========================================

        clearSectionScreen();

if (calculationType === "math") {
    currentCalculationType = "math";
    currentMode = "COMP";
    clearSectionScreen();
    closeCustomPanel();

    currentMode = "COMP";

    if (status) {
        status.textContent = "DEG";
    }

    if (expression) {
        expression.textContent = "";
    }

    if (display) {
        display.value = "";
    }

    const calculator = document.querySelector(".calculator");

    if (calculator) {
        calculator.classList.remove("hidden");
        calculator.style.display = "";
    }

    closeCalculatorHome();

    restoreOriginalCalculatorUI();
    restoreMathKeys();
    showFractionButton();
    return;
}

       
// ==========================================
// ⚛️ الفيزياء
// ==========================================

if (calculationType === "physics") {
    currentCalculationType = "physics";
currentMode = "PHYSICS";
window.activePhysicsField = "physicsInput1";
    closeCalculatorHome();
setupPhysicsKeys();
hideFractionButton();
    createScreenPanel(`
    <div style="
        font-size:18px;
        font-weight:bold;
        text-align:center;
        margin-bottom:12px;
    ">
        ⚛️ الفيزياء
    </div>

    <div style="
        font-size:14px;
        font-weight:bold;
        margin-bottom:8px;
    ">
        اختر القسم:
    </div>

    <button onclick="openPhysicsMechanics()"
        style="width:100%; padding:10px; margin:3px 0;">
        🏎️ الميكانيكا والحركة
    </button>

    <button onclick="openPhysicsElectricity()"
        style="width:100%; padding:10px; margin:3px 0;">
        ⚡ الكهرباء
    </button>

    <button onclick="openPhysicsHeat()"
        style="width:100%; padding:10px; margin:3px 0;">
        🌡️ الحرارة والديناميكا الحرارية
    </button>

    <button onclick="openPhysicsFluids()"
        style="width:100%; padding:10px; margin:3px 0;">
        💧 الموائع والضغط
    </button>

    <button onclick="openPhysicsWaves()"
        style="width:100%; padding:10px; margin:3px 0;">
        🌊 الموجات والصوت
    </button>

    <button onclick="openPhysicsOptics()"
        style="width:100%; padding:10px; margin:3px 0;">
        🔦 البصريات
    </button>

    <button onclick="openPhysicsMagnetism()"
        style="width:100%; padding:10px; margin:3px 0;">
        🧲 المغناطيسية
    </button>

    <button onclick="openPhysicsModern()"
        style="width:100%; padding:10px; margin:3px 0;">
        ⚛️ الفيزياء الحديثة
    </button>

    <button onclick="openCalculatorHome()"
        style="width:100%; padding:10px; margin-top:10px;">
        ← الرجوع
    </button>
 `);
    return;
}

// ==========================================
// ⚡ قائمة الكهرباء
// ==========================================

window.openPhysicsElectricity = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:15px;
        ">
            ⚡ الكهرباء
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:15px;
        ">
            اختر الحاسبة:
        </div>

        <button onclick="physicsOhm()"
            style="
                width:100%;
                padding:10px;
                margin:3px 0;
                font-size:13px;
            ">
            🔌 قانون أوم
        </button>

        <button onclick="physicsVoltage()"
    style="width:100%; padding:10px; margin:3px 0;">
    ⚡ الجهد الكهربائي
</button>

       <button onclick="physicsCurrent()"
    style="width:100%; padding:10px; margin:3px 0;">
    🔋 التيار الكهربائي
</button>

        <button onclick="physicsResistance()"
    style="width:100%; padding:10px; margin:3px 0;">
    🧱 المقاومة الكهربائية
</button>

        <button onclick="physicsElectricalPower()"
    style="width:100%; padding:10px; margin:3px 0;">
    💡 القدرة الكهربائية
</button>

       <button onclick="physicsElectricalEnergy()"
    style="width:100%; padding:10px; margin:3px 0;">
    🔋 الطاقة الكهربائية
</button>

        <button onclick="physicsSeriesResistance()"
    style="width:100%; padding:10px; margin:3px 0;">
    🔗 مقاومات التوالي
</button>

        <button onclick="physicsParallelResistance()"
    style="width:100%; padding:10px; margin:3px 0;">
    🔗 مقاومات التوازي
</button>

        <button onclick="physicsKirchhoff()"
    style="width:100%; padding:10px; margin:3px 0;">
    ⚡ قانون كيرشوف
</button>

        <button onclick="physicsElectricCharge()">
    🔋 الشحنة الكهربائية
</button>

        <button onclick="physicsCapacitance()">
    ⚛️ السعة الكهربائية
</button>
        <button onclick="physicsElectromagneticInduction()">
    🌀 الحث الكهرومغناطيسي
</button>

        <button onclick="openPhysicsHome()"
            style="
                width:100%;
                padding:10px;
                margin-top:10px;
                font-size:13px;
            ">
            ← رجوع للفيزياء
        </button>
    `);
    // ==========================================
// 🌡️ الحرارة والديناميكا الحرارية
// ==========================================

window.openPhysicsThermal = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🌡️ الحرارة والديناميكا الحرارية
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:12px;
            font-weight:bold;
        ">
            اختر الحاسبة:
        </div>

        <button onclick="physicsTemperature()">
    🌡️ درجة الحرارة
</button>

        <button onclick="physicsHeatQuantity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔥 كمية الحرارة
        </button>

        <button onclick="physicsHeatCapacity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚖️ السعة الحرارية
        </button>

        <button onclick="physicsSpecificHeat()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ♨️ الحرارة النوعية
        </button>

        <button onclick="physicsLatentHeat()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🧊 الحرارة الكامنة
        </button>

        <button onclick="physicsIdealGas()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            💨 قانون الغاز المثالي
        </button>

        <button onclick="physicsThermalExpansion()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📈 التمدد الحراري
        </button>

        <button onclick="physicsThermalWork()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔄 الشغل الحراري
        </button>

        <button onclick="physicsFirstLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚙️ القانون الأول للديناميكا الحرارية
        </button>

        <button onclick="physicsThermalEfficiency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📊 الكفاءة الحرارية
        </button>

        <button onclick="backToPhysics()"
        style="
            width:100%;
            padding:9px;
            margin-top:10px;
        ">
    ← رجوع للفيزياء
</button>
    `);
};
// ==========================================
// 🔄 حاسبة تحويل درجات الحرارة
// ==========================================

window.physicsTemperatureConversion = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🔄 تحويل درجات الحرارة
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:12px;
            font-weight:bold;
        ">
            اختر نوع التحويل:
        </div>

        <button onclick="convertTemperature('CtoF')"
            style="width:100%; padding:10px; margin:3px 0;">
            °C → °F
        </button>

        <button onclick="convertTemperature('FtoC')"
            style="width:100%; padding:10px; margin:3px 0;">
            °F → °C
        </button>

        <button onclick="convertTemperature('CtoK')"
            style="width:100%; padding:10px; margin:3px 0;">
            °C → K
        </button>

        <button onclick="convertTemperature('KtoC')"
            style="width:100%; padding:10px; margin:3px 0;">
            K → °C
        </button>

        <button onclick="convertTemperature('FtoK')"
            style="width:100%; padding:10px; margin:3px 0;">
            °F → K
        </button>

        <button onclick="convertTemperature('KtoF')"
            style="width:100%; padding:10px; margin:3px 0;">
            K → °F
        </button>

        <button onclick="openPhysicsThermal()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            ">
            ← رجوع للحرارة
        </button>
    `);
};


// ==========================================
// 🧮 تنفيذ تحويل درجة الحرارة
// ==========================================

window.convertTemperature = function (type) {

    let title = "";
    let unit = "";

    if (type === "CtoF") {
        title = "°C → °F";
        unit = "°C";
    }

    if (type === "FtoC") {
        title = "°F → °C";
        unit = "°F";
    }

    if (type === "CtoK") {
        title = "°C → K";
        unit = "°C";
    }

    if (type === "KtoC") {
        title = "K → °C";
        unit = "K";
    }

    if (type === "FtoK") {
        title = "°F → K";
        unit = "°F";
    }

    if (type === "KtoF") {
        title = "K → °F";
        unit = "K";
    }

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:15px;
        ">
            🔄 ${title}
        </div>

        <input
            id="temperatureConversionInput"
            type="number"
            placeholder="أدخل درجة الحرارة"
            style="
                width:100%;
                box-sizing:border-box;
                padding:12px;
                margin-bottom:10px;
                font-size:16px;
                text-align:center;
            "
        >

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            الوحدة: ${unit}
        </div>

        <button onclick="calculateTemperatureConversion('${type}')"
            style="
                width:100%;
                padding:11px;
                margin:3px 0;
                font-weight:bold;
            ">
            =
        </button>

        <div id="temperatureConversionResult"
            style="
                margin-top:12px;
                padding:10px;
                text-align:center;
                font-weight:bold;
            ">
        </div>

        <button onclick="physicsTemperatureConversion()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            ">
            ← أنواع التحويل
        </button>
    `);

    setTimeout(() => {
        document.getElementById("temperatureConversionInput")?.focus();
    }, 50);
};


// ==========================================
// 🧮 حساب التحويل
// ==========================================

window.calculateTemperatureConversion = function (type) {

    const input = document.getElementById("temperatureConversionInput");
    const result = document.getElementById("temperatureConversionResult");

    if (!input || !result) return;

    const value = Number(input.value);

    if (input.value === "" || !Number.isFinite(value)) {
        result.innerHTML = "⚠️ أدخل قيمة صحيحة";
        return;
    }

    let answer;
    let unit;

    switch (type) {

        case "CtoF":
            answer = (value * 9 / 5) + 32;
            unit = "°F";
            break;

        case "FtoC":
            answer = (value - 32) * 5 / 9;
            unit = "°C";
            break;

        case "CtoK":
            answer = value + 273.15;
            unit = "K";
            break;

        case "KtoC":
            answer = value - 273.15;
            unit = "°C";
            break;

        case "FtoK":
            answer = (value - 32) * 5 / 9 + 273.15;
            unit = "K";
            break;

        case "KtoF":
            answer = (value - 273.15) * 9 / 5 + 32;
            unit = "°F";
            break;

        default:
            result.innerHTML = "⚠️ نوع تحويل غير معروف";
            return;
    }

    result.innerHTML = `✅ ${answer.toFixed(6)} ${unit}`;
};
// 🎯 تحديد خانة الفيزياء النشطة
const physicsInput1 = document.getElementById("physicsInput1");
const physicsInput2 = document.getElementById("physicsInput2");

if (physicsInput1) {
    physicsInput1.addEventListener("focus", () => {
        window.activePhysicsField = "physicsInput1";
    });
}

if (physicsInput2) {
    physicsInput2.addEventListener("focus", () => {
        window.activePhysicsField = "physicsInput2";
    });
}
    // ==========================================
    // ⚛️ تغيير القانون
    // ==========================================

    const formulaSelect =
        document.getElementById("physicsFormula");

    const input1 =
        document.getElementById("physicsInput1");

    const input2 =
        document.getElementById("physicsInput2");


    function updatePhysicsInputs() {

        const formula = formulaSelect.value;

        if (formula === "speed") {
            input1.placeholder = "المسافة d";
            input2.placeholder = "الزمن t";
        }

        else if (formula === "distance") {
            input1.placeholder = "السرعة v";
            input2.placeholder = "الزمن t";
        }

        else if (formula === "time") {
            input1.placeholder = "المسافة d";
            input2.placeholder = "السرعة v";
        }

        else if (formula === "force") {
            input1.placeholder = "الكتلة m";
            input2.placeholder = "التسارع a";
        }

        else if (formula === "mass") {
            input1.placeholder = "القوة F";
            input2.placeholder = "التسارع a";
        }

        else if (formula === "acceleration") {
            input1.placeholder = "القوة F";
            input2.placeholder = "الكتلة m";
        }
    }


    formulaSelect.addEventListener("change", updatePhysicsInputs);


    // ==========================================
    // 🧮 الحساب
    // ==========================================

    document
        .getElementById("physicsCalculateBtn")
        .addEventListener("click", () => {

            const a = Number(input1.value);
            const b = Number(input2.value);

            const formula = formulaSelect.value;

            let result;
            let unit;
            let symbol;

            if (
                input1.value === "" ||
                input2.value === ""
            ) {
                document.getElementById("physicsResult").textContent =
                    "⚠️ من فضلك أدخل القيمتين";
                return;
            }


            if (formula === "speed") {

                if (b === 0) {
                    result = "لا يمكن القسمة على صفر";
                } else {
                    result = a / b;
                    unit = "m/s";
                    symbol = "v";
                }

            }

            else if (formula === "distance") {

                result = a * b;
                unit = "m";
                symbol = "d";

            }

            else if (formula === "time") {

                if (b === 0) {
                    result = "لا يمكن القسمة على صفر";
                } else {
                    result = a / b;
                    unit = "s";
                    symbol = "t";
                }

            }

            else if (formula === "force") {

                result = a * b;
                unit = "N";
                symbol = "F";

            }

            else if (formula === "mass") {

                if (b === 0) {
                    result = "لا يمكن القسمة على صفر";
                } else {
                    result = a / b;
                    unit = "kg";
                    symbol = "m";
                }

            }

            else if (formula === "acceleration") {

                if (b === 0) {
                    result = "لا يمكن القسمة على صفر";
                } else {
                    result = a / b;
                    unit = "m/s²";
                    symbol = "a";
                }

            }


            if (typeof result === "number") {

                result = Number(result.toFixed(10));

                document.getElementById("physicsResult").textContent =
                    `✅ ${symbol} = ${result} ${unit}`;

            } else {

                document.getElementById("physicsResult").textContent =
                    `⚠️ ${result}`;

            }

        });


    updatePhysicsInputs();

    return;
}

if (calculationType === "chemistry") {
currentCalculationType = "chemistry";
    closeCalculatorHome();

    openChemistryMenu();

    return;
}

        // ==========================================
// 💻 البرمجة
// ==========================================

if (calculationType === "programming") {
currentCalculationType = "programming";
    closeCalculatorHome();
setupProgrammingKeys();
    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:15px;
        ">
            💻 البرمجة
        </div>

        <button
            onclick="programmingNumberSystems()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            1️⃣ 🔢 التحويل بين الأنظمة
        </button>

        <button
            onclick="programmingAND()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            2️⃣ ⚙️ AND
        </button>

        <button
            onclick="programmingOR()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            3️⃣ ⚙️ OR
        </button>

        <button
            onclick="programmingXOR()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            4️⃣ ⚙️ XOR
        </button>

        <button
            onclick="programmingNOT()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            5️⃣ 🚫 NOT
        </button>

        <button
            onclick="programmingShiftLeft()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            6️⃣ ⬅️ إزاحة لليسار
        </button>

        <button
            onclick="programmingShiftRight()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            7️⃣ ➡️ إزاحة لليمين
        </button>

        <button
            onclick="programmingBitwise()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            8️⃣ 🧮 العمليات الثنائية
        </button>
<button
    onclick="programmingComplements()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    9️⃣ 🔄 المكملات والمتممات
</button>
<button
    onclick="programmingArithmetic()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    🔟 🧮 العمليات الحسابية
</button>
<button
    onclick="programmingComplementArithmetic()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    1️⃣1️⃣ 🔄 العمليات باستخدام المكملات
</button>
<button
    onclick="programmingHexArithmetic()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    1️⃣2️⃣ 🧮 حسابات Hexadecimal
</button>
<button
    onclick="programmingOctalArithmetic()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    1️⃣3️⃣ 🧮 حسابات Octal
</button>
<button
    onclick="programmingAdvancedComplements()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    1️⃣4️⃣ 🔄 مكملات Hex وOctal
</button>
        <button
            onclick="openCalculatorHome()"
            style="
                width:100%;
                padding:10px;
                margin-top:12px;
                font-size:14px;
            "
        >
            ← الرجوع للقائمة الرئيسية
        </button>

        
    `);

    return;

}
});
});
window.openPhysicsMechanics = function() {

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🏎️ الميكانيكا والحركة
        </div>

        <button onclick="physicsSpeed()"
            style="width:100%; padding:9px; margin:2px 0;">
            🚗 السرعة
        </button>

        <button onclick="physicsAcceleration()"
            style="width:100%; padding:9px; margin:2px 0;">
            🏎️ العجلة
        </button>

        <button onclick="physicsForce()"
            style="width:100%; padding:9px; margin:2px 0;">
            💪 القوة
        </button>

        <button onclick="physicsWeight()"
            style="width:100%; padding:9px; margin:2px 0;">
            ⚖️ الوزن
        </button>

        <button onclick="physicsKineticEnergy()">
    🔋 الطاقة الحركية
</button>
       <button onclick="physicsPotentialEnergy()">
    🏔️ طاقة الوضع
</button>

        <button onclick="physicsMomentum()">
    🏎️ الزخم
</button>

        <button onclick="physicsWork()"
            style="width:100%; padding:9px; margin:2px 0;">
            🔨 الشغل
        </button>

        <button onclick="physicsPower()"
            style="width:100%; padding:9px; margin:2px 0;">
            ⚡ القدرة
        </button>

        <button onclick="openCalculatorHome()"
            style="width:100%; padding:9px; margin-top:8px;">
            ← الرجوع
        </button>
    `);
};
// ==========================================
// 🚗 PHYSICS - حاسبة السرعة
// ==========================================

window.physicsSpeed = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🚗 حاسبة السرعة
        </div>

        <div style="margin:6px 0;">
            المسافة (m):
        </div>

        <input id="physicsSpeedDistance"
               type="text"
              readonly
onclick="window.activePhysicsField='physicsSpeedDistance'"
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الزمن (s):
        </div>

        <input id="physicsSpeedTime"
               type="text"
              readonly
onclick="window.activePhysicsField='physicsSpeedTime'"
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsSpeed()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب السرعة
        </button>

        <div id="physicsSpeedResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMechanics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للميكانيكا
        </button>
    `);

    // جعل أول خانة هي النشطة
    window.activePhysicsField = "physicsSpeedDistance";
    document.getElementById("physicsSpeedDistance")
    ?.addEventListener("focus", () => {
        window.activePhysicsField =
            "physicsSpeedDistance";
    });

document.getElementById("physicsSpeedTime")
    ?.addEventListener("focus", () => {
        window.activePhysicsField =
            "physicsSpeedTime";
    });
};


// ==========================================
// 🏎️ حاسبة العجلة
// a = (v₂ - v₁) / t
// ==========================================

window.physicsAcceleration = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🏎️ حاسبة العجلة
        </div>

        <div style="margin:6px 0;">
            السرعة الابتدائية v₁ (m/s):
        </div>

        <input id="physicsAccelerationV1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            السرعة النهائية v₂ (m/s):
        </div>

        <input id="physicsAccelerationV2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الزمن t (s):
        </div>

        <input id="physicsAccelerationTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsAcceleration()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب العجلة
        </button>

        <div id="physicsAccelerationResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMechanics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للميكانيكا
        </button>
    `);

    // أول خانة نشطة
    window.activePhysicsField = "physicsAccelerationV1";

    document.getElementById("physicsAccelerationV1")
        ?.addEventListener("focus", () => {
            window.activePhysicsField =
                "physicsAccelerationV1";
        });

    document.getElementById("physicsAccelerationV2")
        ?.addEventListener("focus", () => {
            window.activePhysicsField =
                "physicsAccelerationV2";
        });

    document.getElementById("physicsAccelerationTime")
        ?.addEventListener("focus", () => {
            window.activePhysicsField =
                "physicsAccelerationTime";
        });
};


// ==========================================
// 🧮 حساب العجلة
// ==========================================

window.calculatePhysicsAcceleration = function () {

    const v1 = Number(
        document.getElementById("physicsAccelerationV1")?.value
    );

    const v2 = Number(
        document.getElementById("physicsAccelerationV2")?.value
    );

    const t = Number(
        document.getElementById("physicsAccelerationTime")?.value
    );

    const result =
        document.getElementById("physicsAccelerationResult");

    if (!result) return;

    if (!Number.isFinite(v1) ||
        !Number.isFinite(v2) ||
        !Number.isFinite(t)) {

        result.innerHTML = "❌ أدخل جميع القيم";
        return;
    }

    if (t === 0) {

        result.innerHTML =
            "❌ الزمن لا يمكن أن يساوي صفر";

        return;
    }

    const acceleration = (v2 - v1) / t;

    result.innerHTML =
        `✅ a = ${acceleration} m/s²`;

    console.log(
        "🏎️ ACCELERATION:",
        acceleration,
        "m/s²"
    );
};

// ==========================================
// 💪 حاسبة القوة
// F = m × a
// ==========================================

window.physicsForce = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            💪 حاسبة القوة
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsForceMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            العجلة a (m/s²):
        </div>

        <input id="physicsForceAcceleration"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsForce()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب القوة
        </button>

        <div id="physicsForceResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMechanics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للميكانيكا
        </button>
    `);

    // أول خانة نشطة
    window.activePhysicsField = "physicsForceMass";

    document.getElementById("physicsForceMass")
        ?.addEventListener("focus", () => {
            window.activePhysicsField = "physicsForceMass";
        });

    document.getElementById("physicsForceAcceleration")
        ?.addEventListener("focus", () => {
            window.activePhysicsField = "physicsForceAcceleration";
        });
};


// ==========================================
// 🧮 حساب القوة
// ==========================================

window.calculatePhysicsForce = function () {

    const mass = Number(
        document.getElementById("physicsForceMass")?.value
    );

    const acceleration = Number(
        document.getElementById("physicsForceAcceleration")?.value
    );

    const result =
        document.getElementById("physicsForceResult");

    if (!result) return;

    if (!Number.isFinite(mass) ||
        !Number.isFinite(acceleration)) {

        result.innerHTML = "❌ أدخل جميع القيم";
        return;
    }

    const force = mass * acceleration;

    result.innerHTML =
        `✅ F = ${force} N`;

    console.log(
        "💪 FORCE:",
        force,
        "N"
    );
};

// ==========================================
// ⚖️ حاسبة الوزن
// W = m × g
// ==========================================
window.physicsWeightGravityEdited = false;
window.physicsWeight = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚖️ حاسبة الوزن
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsWeightMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            عجلة الجاذبية g (m/s²):
        </div>

        <input id="physicsWeightGravity"
               type="text"               
               value="9.80665"
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsWeight()"
                style="
                   width:100%;
                   padding:10px;
                   margin:4px 0;
                ">
            🧮 احسب الوزن
        </button>

        <div id="physicsWeightResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMechanics()"
                style="
                   width:100%;
                   padding:9px;
                   margin-top:8px;
                ">
            ← رجوع للميكانيكا
        </button>
    `);

  window.activePhysicsField = "physicsWeightMass";

window.physicsWeightNewInput = true;

document.getElementById("physicsWeightMass")
    ?.addEventListener("focus", () => {
        window.activePhysicsField = "physicsWeightMass";
        window.physicsWeightNewInput = true;
    });

document.getElementById("physicsWeightGravity")
    ?.addEventListener("focus", () => {
        window.activePhysicsField = "physicsWeightGravity";
        window.physicsWeightNewInput = true;
    });


};


// ==========================================
// 🧮 حساب الوزن
// ==========================================

window.calculatePhysicsWeight = function () {

    const mass = Number(
        document.getElementById("physicsWeightMass")?.value
    );

    const gravity = Number(
        document.getElementById("physicsWeightGravity")?.value
    );

    const result =
        document.getElementById("physicsWeightResult");

    if (!result) return;

    if (!Number.isFinite(mass) ||
        !Number.isFinite(gravity)) {

        result.innerHTML = "❌ أدخل جميع القيم";
        return;
    }

    const weight = mass * gravity;

    result.innerHTML =
        `✅ W = ${weight.toFixed(6)} N`;

    console.log(
        "⚖️ WEIGHT:",
        weight,
        "N"
    );
};

// ==========================================
// 🔋 الطاقة الحركية
// KE = 1/2 × m × v²
// ==========================================

window.physicsKineticEnergy = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔋 حاسبة الطاقة الحركية
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsKEMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            السرعة v (m/s):
        </div>

        <input id="physicsKEVelocity"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsKineticEnergy()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الطاقة الحركية
        </button>

        <div id="physicsKEResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMechanics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للميكانيكا
        </button>
    `);

    window.activePhysicsField = "physicsKEMass";

    document.getElementById("physicsKEMass")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsKEMass";
            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsKEVelocity")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsKEVelocity";
            window.physicsWeightNewInput = true;
        });
};


// ==========================================
// 🧮 حساب الطاقة الحركية
// ==========================================

window.calculatePhysicsKineticEnergy = function () {

    const mass =
        parseFloat(
            document.getElementById("physicsKEMass")?.value
        );

    const velocity =
        parseFloat(
            document.getElementById("physicsKEVelocity")?.value
        );

    const result =
        document.getElementById("physicsKEResult");

    if (!Number.isFinite(mass) ||
        !Number.isFinite(velocity)) {

        result.innerHTML =
            "⚠️ أدخل الكتلة والسرعة أولاً";

        return;
    }

    const kineticEnergy =
        0.5 * mass * velocity * velocity;

    result.innerHTML =
        `✅ KE = ${kineticEnergy.toFixed(6)} J`;
};
// ==========================================
// 🏔️ طاقة الوضع
// PE = m × g × h
// ==========================================

window.physicsPotentialEnergy = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🏔️ حاسبة طاقة الوضع
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsPEMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            عجلة الجاذبية g (m/s²):
        </div>

        <input id="physicsPEGravity"
               type="text"
               value="9.80665"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الارتفاع h (m):
        </div>

        <input id="physicsPEHeight"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsPotentialEnergy()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب طاقة الوضع
        </button>

        <div id="physicsPEResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMechanics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للميكانيكا
        </button>
    `);

    window.activePhysicsField = "physicsPEMass";
    window.physicsWeightNewInput = true;

    document.getElementById("physicsPEMass")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsPEMass";
            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsPEGravity")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsPEGravity";
            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsPEHeight")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsPEHeight";
            window.physicsWeightNewInput = true;
        });
};


// ==========================================
// 🧮 حساب طاقة الوضع
// ==========================================

window.calculatePhysicsPotentialEnergy = function () {

    const mass =
        parseFloat(
            document.getElementById("physicsPEMass")?.value
        );

    const gravity =
        parseFloat(
            document.getElementById("physicsPEGravity")?.value
        );

    const height =
        parseFloat(
            document.getElementById("physicsPEHeight")?.value
        );

    const result =
        document.getElementById("physicsPEResult");

    if (
        !Number.isFinite(mass) ||
        !Number.isFinite(gravity) ||
        !Number.isFinite(height)
    ) {

        result.innerHTML =
            "⚠️ أدخل الكتلة والجاذبية والارتفاع أولاً";

        return;
    }

    const potentialEnergy =
        mass * gravity * height;

    result.innerHTML =
        `✅ PE = ${potentialEnergy.toFixed(6)} J`;
};
// ==========================================
// 🏎️ الزخم
// p = m × v
// ==========================================

window.physicsMomentum = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🏎️ حاسبة الزخم
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsMomentumMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            السرعة v (m/s):
        </div>

        <input id="physicsMomentumVelocity"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsMomentum()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الزخم
        </button>

        <div id="physicsMomentumResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMechanics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للميكانيكا
        </button>
    `);

    window.activePhysicsField = "physicsMomentumMass";
    window.physicsWeightNewInput = true;

    document.getElementById("physicsMomentumMass")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsMomentumMass";
            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsMomentumVelocity")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsMomentumVelocity";
            window.physicsWeightNewInput = true;
        });
};


// ==========================================
// 🧮 حساب الزخم
// ==========================================

window.calculatePhysicsMomentum = function () {

    const mass =
        parseFloat(
            document.getElementById("physicsMomentumMass")?.value
        );

    const velocity =
        parseFloat(
            document.getElementById("physicsMomentumVelocity")?.value
        );

    const result =
        document.getElementById("physicsMomentumResult");

    if (
        !Number.isFinite(mass) ||
        !Number.isFinite(velocity)
    ) {
        result.innerHTML =
            "⚠️ أدخل الكتلة والسرعة أولاً";
        return;
    }

    const momentum = mass * velocity;

    result.innerHTML =
        `✅ p = ${momentum.toFixed(6)} kg·m/s`;
};
// ==========================================
// 🔨 الشغل
// W = F × d × cos(θ)
// ==========================================

window.physicsWork = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔨 حاسبة الشغل
        </div>

        <div style="margin:6px 0;">
            القوة F (N):
        </div>

        <input id="physicsWorkForce"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الإزاحة d (m):
        </div>

        <input id="physicsWorkDistance"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الزاوية θ (درجة):
        </div>

        <input id="physicsWorkAngle"
               type="text"
               value="0"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsWork()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الشغل
        </button>

        <div id="physicsWorkResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMechanics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للميكانيكا
        </button>
    `);

    window.activePhysicsField = "physicsWorkForce";
    window.physicsWeightNewInput = true;

    document.getElementById("physicsWorkForce")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsWorkForce";
            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsWorkDistance")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsWorkDistance";
            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsWorkAngle")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsWorkAngle";
            window.physicsWeightNewInput = true;
        });
};


// ==========================================
// 🧮 حساب الشغل
// ==========================================

window.calculatePhysicsWork = function () {

    const force =
        parseFloat(
            document.getElementById("physicsWorkForce")?.value
        );

    const distance =
        parseFloat(
            document.getElementById("physicsWorkDistance")?.value
        );

    const angle =
        parseFloat(
            document.getElementById("physicsWorkAngle")?.value
        );

    const result =
        document.getElementById("physicsWorkResult");

    if (
        !Number.isFinite(force) ||
        !Number.isFinite(distance) ||
        !Number.isFinite(angle)
    ) {
        result.innerHTML =
            "⚠️ أدخل القوة والإزاحة والزاوية أولاً";
        return;
    }

    const radians = angle * Math.PI / 180;

    const work =
        force * distance * Math.cos(radians);

    result.innerHTML =
        `✅ W = ${work.toFixed(6)} J`;
};
// ==========================================
// ⚡ القدرة
// P = W ÷ t
// ==========================================

window.physicsPower = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚡ حاسبة القدرة
        </div>

        <div style="margin:6px 0;">
            الشغل W (J):
        </div>

        <input id="physicsPowerWork"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الزمن t (s):
        </div>

        <input id="physicsPowerTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsPower()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب القدرة
        </button>

        <div id="physicsPowerResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMechanics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للميكانيكا
        </button>
    `);

    window.activePhysicsField = "physicsPowerWork";
    window.physicsWeightNewInput = true;

    document.getElementById("physicsPowerWork")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsPowerWork";
            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsPowerTime")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsPowerTime";
            window.physicsWeightNewInput = true;
        });
};


// ==========================================
// 🧮 حساب القدرة
// ==========================================

window.calculatePhysicsPower = function () {

    const work =
        parseFloat(
            document.getElementById("physicsPowerWork")?.value
        );

    const time =
        parseFloat(
            document.getElementById("physicsPowerTime")?.value
        );

    const result =
        document.getElementById("physicsPowerResult");

    if (!Number.isFinite(work) ||
        !Number.isFinite(time)) {

        result.innerHTML =
            "⚠️ أدخل الشغل والزمن أولاً";

        return;
    }

    if (time === 0) {

        result.innerHTML =
            "❌ الزمن لا يمكن أن يساوي صفر";

        return;
    }

    const power = work / time;

    result.innerHTML =
        `✅ P = ${power.toFixed(6)} W`;
};
// ==========================================
// 🔌 قانون أوم
// V = I × R
// I = V ÷ R
// R = V ÷ I
// ==========================================

window.physicsOhm = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔌 حاسبة قانون أوم
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            V = I × R
        </div>

        <div style="margin:6px 0;">
            الجهد V (Volt):
        </div>

        <input id="physicsOhmVoltage"
               type="text"
               readonly
               dir="ltr"
               placeholder="اتركها فارغة للحساب"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التيار I (Ampere):
        </div>

        <input id="physicsOhmCurrent"
               type="text"
               readonly
               dir="ltr"
               placeholder="اتركها فارغة للحساب"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            المقاومة R (Ohm):
        </div>

        <input id="physicsOhmResistance"
               type="text"
               readonly
               dir="ltr"
               placeholder="اتركها فارغة للحساب"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsOhm()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب
        </button>

        <div id="physicsOhmResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    window.activePhysicsField = "physicsOhmVoltage";
    window.physicsWeightNewInput = true;

    [
        "physicsOhmVoltage",
        "physicsOhmCurrent",
        "physicsOhmResistance"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب قانون أوم
// ==========================================

window.calculatePhysicsOhm = function () {

    const voltageField =
        document.getElementById("physicsOhmVoltage");

    const currentField =
        document.getElementById("physicsOhmCurrent");

    const resistanceField =
        document.getElementById("physicsOhmResistance");

    const result =
        document.getElementById("physicsOhmResult");

    const V = parseFloat(voltageField?.value);
    const I = parseFloat(currentField?.value);
    const R = parseFloat(resistanceField?.value);

    const hasV = Number.isFinite(V);
    const hasI = Number.isFinite(I);
    const hasR = Number.isFinite(R);

    const count =
        [hasV, hasI, hasR].filter(Boolean).length;

    if (count !== 2) {

        result.innerHTML =
            "⚠️ أدخل قيمتين فقط لحساب الثالثة";

        return;
    }

    // V = I × R
    if (!hasV) {

        voltageField.value = I * R;

        result.innerHTML =
            `✅ V = ${(I * R).toFixed(6)} V`;

        return;
    }

    // I = V ÷ R
    if (!hasI) {

        if (R === 0) {
            result.innerHTML =
                "❌ المقاومة لا يمكن أن تساوي صفر";
            return;
        }

        currentField.value = V / R;

        result.innerHTML =
            `✅ I = ${(V / R).toFixed(6)} A`;

        return;
    }

    // R = V ÷ I
    if (!hasR) {

        if (I === 0) {
            result.innerHTML =
                "❌ التيار لا يمكن أن يساوي صفر";
            return;
        }

        resistanceField.value = V / I;

        result.innerHTML =
            `✅ R = ${(V / I).toFixed(6)} Ω`;

        return;
    }
};
// ==========================================
// ⚡ حاسبة الجهد الكهربائي
// V = W ÷ Q
// ==========================================

window.physicsVoltage = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚡ حاسبة الجهد الكهربائي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            V = W ÷ Q
        </div>

        <div style="margin:6px 0;">
            الشغل W (J):
        </div>

        <input id="physicsVoltageWork"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الشحنة Q (C):
        </div>

        <input id="physicsVoltageCharge"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsVoltage()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الجهد
        </button>

        <div id="physicsVoltageResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    window.activePhysicsField = "physicsVoltageWork";

    document.getElementById("physicsVoltageWork")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsVoltageWork";
        });

    document.getElementById("physicsVoltageCharge")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsVoltageCharge";
        });
};


// ==========================================
// 🧮 حساب الجهد
// ==========================================

window.calculatePhysicsVoltage = function () {

    const work =
        parseFloat(
            document.getElementById("physicsVoltageWork")?.value
        );

    const charge =
        parseFloat(
            document.getElementById("physicsVoltageCharge")?.value
        );

    const result =
        document.getElementById("physicsVoltageResult");

    if (!Number.isFinite(work) ||
        !Number.isFinite(charge)) {

        result.innerHTML =
            "⚠️ أدخل الشغل والشحنة أولاً";

        return;
    }

    if (charge === 0) {

        result.innerHTML =
            "❌ الشحنة لا يمكن أن تساوي صفر";

        return;
    }

    const voltage = work / charge;

    result.innerHTML =
        `✅ V = ${voltage.toFixed(6)} V`;
};
// ==========================================
// 🔋 حاسبة التيار الكهربائي
// I = Q ÷ t
// ==========================================

window.physicsCurrent = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔋 حاسبة التيار الكهربائي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            I = Q ÷ t
        </div>

        <div style="margin:6px 0;">
            الشحنة Q (C):
        </div>

        <input id="physicsCurrentCharge"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الزمن t (s):
        </div>

        <input id="physicsCurrentTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsCurrent()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب التيار
        </button>

        <div id="physicsCurrentResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    window.activePhysicsField = "physicsCurrentCharge";

    document.getElementById("physicsCurrentCharge")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsCurrentCharge";
            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsCurrentTime")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "physicsCurrentTime";
            window.physicsWeightNewInput = true;
        });
};


// ==========================================
// 🧮 حساب التيار
// ==========================================

window.calculatePhysicsCurrent = function () {

    const charge =
        parseFloat(
            document.getElementById("physicsCurrentCharge")?.value
        );

    const time =
        parseFloat(
            document.getElementById("physicsCurrentTime")?.value
        );

    const result =
        document.getElementById("physicsCurrentResult");

    if (!Number.isFinite(charge) ||
        !Number.isFinite(time)) {

        result.innerHTML =
            "⚠️ أدخل الشحنة والزمن أولاً";

        return;
    }

    if (time === 0) {

        result.innerHTML =
            "❌ الزمن لا يمكن أن يساوي صفر";

        return;
    }

    const current = charge / time;

    result.innerHTML =
        `✅ I = ${current.toFixed(6)} A`;
};
// ==========================================
// 🧱 حاسبة المقاومة الكهربائية
// R = V ÷ I
// ==========================================

window.physicsResistance = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🧱 حاسبة المقاومة الكهربائية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            R = V ÷ I
        </div>

        <div style="margin:6px 0;">
            الجهد V (V):
        </div>

        <input id="physicsResistanceVoltage"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التيار I (A):
        </div>

        <input id="physicsResistanceCurrent"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsResistance()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب المقاومة
        </button>

        <div id="physicsResistanceResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    window.activePhysicsField = "physicsResistanceVoltage";

    document.getElementById("physicsResistanceVoltage")
        ?.addEventListener("click", () => {
            window.activePhysicsField =
                "physicsResistanceVoltage";
            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsResistanceCurrent")
        ?.addEventListener("click", () => {
            window.activePhysicsField =
                "physicsResistanceCurrent";
            window.physicsWeightNewInput = true;
        });
};


// ==========================================
// 🧮 حساب المقاومة
// ==========================================

window.calculatePhysicsResistance = function () {

    const voltage =
        parseFloat(
            document.getElementById(
                "physicsResistanceVoltage"
            )?.value
        );

    const current =
        parseFloat(
            document.getElementById(
                "physicsResistanceCurrent"
            )?.value
        );

    const result =
        document.getElementById(
            "physicsResistanceResult"
        );

    if (!Number.isFinite(voltage) ||
        !Number.isFinite(current)) {

        result.innerHTML =
            "⚠️ أدخل الجهد والتيار أولاً";

        return;
    }

    if (current === 0) {

        result.innerHTML =
            "❌ التيار لا يمكن أن يساوي صفر";

        return;
    }

    const resistance = voltage / current;

    result.innerHTML =
        `✅ R = ${resistance.toFixed(6)} Ω`;
};
// ==========================================
// 💡 حاسبة القدرة الكهربائية
// P = V × I
// P = I² × R
// P = V² ÷ R
// ==========================================

window.physicsElectricalPower = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            💡 القدرة الكهربائية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
            line-height:1.8;
        ">
            P = V × I<br>
            P = I² × R<br>
            P = V² ÷ R
        </div>

        <div style="margin:6px 0;">
            الجهد V (V):
        </div>

        <input id="physicsEPVoltage"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التيار I (A):
        </div>

        <input id="physicsEPCurrent"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            المقاومة R (Ω):
        </div>

        <input id="physicsEPResistance"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsElectricalPower()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب القدرة
        </button>

        <div id="physicsEPResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    window.activePhysicsField = "physicsEPVoltage";

    [
        "physicsEPVoltage",
        "physicsEPCurrent",
        "physicsEPResistance"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;

            });

    });
};


// ==========================================
// 🧮 حساب القدرة الكهربائية
// ==========================================

window.calculatePhysicsElectricalPower = function () {

    const voltage =
        parseFloat(
            document.getElementById("physicsEPVoltage")?.value
        );

    const current =
        parseFloat(
            document.getElementById("physicsEPCurrent")?.value
        );

    const resistance =
        parseFloat(
            document.getElementById("physicsEPResistance")?.value
        );

    const result =
        document.getElementById("physicsEPResult");

    const hasV = Number.isFinite(voltage);
    const hasI = Number.isFinite(current);
    const hasR = Number.isFinite(resistance);

    // V + I
    if (hasV && hasI) {

        const power = voltage * current;

        result.innerHTML =
            `✅ P = ${power.toFixed(6)} W`;

        return;
    }

    // I + R
    if (hasI && hasR) {

        const power = current * current * resistance;

        result.innerHTML =
            `✅ P = ${power.toFixed(6)} W`;

        return;
    }

    // V + R
    if (hasV && hasR) {

        if (resistance === 0) {

            result.innerHTML =
                "❌ المقاومة لا يمكن أن تساوي صفر";

            return;
        }

        const power =
            (voltage * voltage) / resistance;

        result.innerHTML =
            `✅ P = ${power.toFixed(6)} W`;

        return;
    }

    result.innerHTML =
        "⚠️ أدخل أي قيمتين من V و I و R";
};
// ==========================================
// 🔋 حاسبة الطاقة الكهربائية
// E = P × t
// E = V × I × t
// ==========================================

window.physicsElectricalEnergy = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔋 الطاقة الكهربائية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
            line-height:1.8;
        ">
            E = P × t<br>
            E = V × I × t
        </div>

        <div style="margin:6px 0;">
            القدرة P (W):
        </div>

        <input id="physicsEEPower"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الجهد V (V):
        </div>

        <input id="physicsEEVoltage"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التيار I (A):
        </div>

        <input id="physicsEECurrent"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الزمن t (s):
        </div>

        <input id="physicsEETime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsElectricalEnergy()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الطاقة
        </button>

        <div id="physicsEEResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    window.activePhysicsField = "physicsEEPower";

    [
        "physicsEEPower",
        "physicsEEVoltage",
        "physicsEECurrent",
        "physicsEETime"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;

            });

    });
};


// ==========================================
// 🧮 حساب الطاقة الكهربائية
// ==========================================

window.calculatePhysicsElectricalEnergy = function () {

    const power =
        parseFloat(
            document.getElementById("physicsEEPower")?.value
        );

    const voltage =
        parseFloat(
            document.getElementById("physicsEEVoltage")?.value
        );

    const current =
        parseFloat(
            document.getElementById("physicsEECurrent")?.value
        );

    const time =
        parseFloat(
            document.getElementById("physicsEETime")?.value
        );

    const result =
        document.getElementById("physicsEEResult");

    // P + t
    if (
        Number.isFinite(power) &&
        Number.isFinite(time)
    ) {

        const energy = power * time;

        result.innerHTML =
            `✅ E = ${energy.toFixed(6)} J`;

        return;
    }

    // V + I + t
    if (
        Number.isFinite(voltage) &&
        Number.isFinite(current) &&
        Number.isFinite(time)
    ) {

        const energy =
            voltage * current * time;

        result.innerHTML =
            `✅ E = ${energy.toFixed(6)} J`;

        return;
    }

    result.innerHTML =
        "⚠️ أدخل P و t أو أدخل V و I و t";
};
// ==========================================
// 🔗 مقاومات التوالي
// ==========================================

window.physicsSeriesResistance = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔗 مقاومات التوالي
        </div>

        <div style="
            text-align:center;
            margin-bottom:10px;
            font-weight:bold;
        ">
            Rt = R1 + R2 + R3 + ...
        </div>

        <div style="margin:6px 0;">
            عدد المقاومات:
        </div>

        <input id="seriesCount"
               type="number"
               min="1"
               value="2"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="createSeriesInputs()"
                style="
                    width:100%;
                    padding:9px;
                    margin-bottom:8px;
                ">
            ➕ إنشاء الخانات
        </button>

        <div id="seriesInputs"
             style="
                 display:block;
                 width:100%;
                 margin-top:5px;
                 min-height:10px;
             ">
        </div>

        <button onclick="calculateSeriesResistance()"
                style="
                    width:100%;
                    padding:10px;
                    margin-top:8px;
                ">
            🧮 احسب المقاومة المكافئة
        </button>

        <div id="seriesResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    // لا ننشئ الخانات تلقائيًا
};
window.createSeriesInputs = function () {

    const count =
        parseInt(
            document.getElementById("seriesCount")?.value
        );

    const container =
        document.getElementById("seriesInputs");

    if (!container) {
        console.log("❌ seriesInputs غير موجود");
        return;
    }

    if (!Number.isInteger(count) || count < 1) {
        console.log("❌ عدد المقاومات غير صحيح");
        return;
    }

    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {

        const input = document.createElement("input");

        input.id = `seriesR${i}`;
        input.type = "text";
        input.readOnly = true;
        input.dir = "ltr";

        input.placeholder = `R${i} (Ω)`;

        input.style.cssText = `
            display:block;
            width:90%;
            box-sizing:border-box;
            padding:8px;
            margin:5px auto;
            direction:ltr;
            text-align:left;
            font-size:14px;
            visibility:visible;
            opacity:1;
        `;

        input.addEventListener("click", function () {

            window.activePhysicsField =
                `seriesR${i}`;

        });

        container.appendChild(input);
    }

    window.activePhysicsField = "seriesR1";

    console.log(
        "✅ تم إنشاء",
        count,
        "خانة مقاومة"
    );
};


// ==========================================
// 🧮 حساب مقاومات التوالي
// ==========================================

window.calculateSeriesResistance = function () {

    const count =
        parseInt(document.getElementById("seriesCount")?.value);

    const result =
        document.getElementById("seriesResult");

    let total = 0;

    for (let i = 1; i <= count; i++) {

        const field =
            document.getElementById(`seriesR${i}`);

        const value =
            parseFloat(field?.value);

        if (!Number.isFinite(value)) {

            result.innerHTML =
                `⚠️ أدخل قيمة R${i}`;

            return;
        }

        total += value;
    }

    result.innerHTML =
        `✅ Rt = ${total.toFixed(6)} Ω`;
};
// ==========================================
// 🔗 مقاومات التوازي
// 1/Rt = 1/R1 + 1/R2 + 1/R3 + ...
// ==========================================

window.physicsParallelResistance = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔗 مقاومات التوازي
        </div>

        <div style="
            text-align:center;
            margin-bottom:10px;
            font-weight:bold;
        ">
            1/Rt = 1/R1 + 1/R2 + 1/R3 + ...
        </div>

        <div style="margin:6px 0;">
            عدد المقاومات:
        </div>

        <input id="parallelCount"
               type="number"
               min="1"
               value="2"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="createParallelInputs()"
                style="
                    width:100%;
                    padding:9px;
                    margin-bottom:8px;
                ">
            ➕ إنشاء الخانات
        </button>

        <div id="parallelInputs"
             style="
                 display:block;
                 width:100%;
                 margin-top:5px;
                 min-height:10px;
             ">
        </div>

        <button onclick="calculateParallelResistance()"
                style="
                    width:100%;
                    padding:10px;
                    margin-top:8px;
                ">
            🧮 احسب المقاومة المكافئة
        </button>

        <div id="parallelResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);
};


// ==========================================
// إنشاء خانات التوازي
// ==========================================

window.createParallelInputs = function () {

    const count =
        parseInt(
            document.getElementById("parallelCount")?.value
        );

    const container =
        document.getElementById("parallelInputs");

    if (!container) {
        console.log("❌ parallelInputs غير موجود");
        return;
    }

    if (!Number.isInteger(count) || count < 1) {
        console.log("❌ عدد المقاومات غير صحيح");
        return;
    }

    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {

        const input = document.createElement("input");

        input.id = `parallelR${i}`;
        input.type = "text";
        input.readOnly = true;
        input.dir = "ltr";

        input.placeholder = `R${i} (Ω)`;

        input.style.cssText = `
            display:block;
            width:90%;
            box-sizing:border-box;
            padding:8px;
            margin:5px auto;
            direction:ltr;
            text-align:left;
            font-size:14px;
            visibility:visible;
            opacity:1;
        `;

        input.addEventListener("click", function () {

            window.activePhysicsField =
                `parallelR${i}`;

        });

        container.appendChild(input);
    }

    window.activePhysicsField = "parallelR1";

    console.log(
        "✅ تم إنشاء",
        count,
        "خانة مقاومة توازي"
    );
};


// ==========================================
// 🧮 حساب المقاومة المكافئة للتوازي
// ==========================================

window.calculateParallelResistance = function () {

    const count =
        parseInt(
            document.getElementById("parallelCount")?.value
        );

    const result =
        document.getElementById("parallelResult");

    if (!result) return;

    if (!Number.isInteger(count) || count < 1) {

        result.innerHTML =
            "⚠️ أدخل عددًا صحيحًا للمقاومات";

        return;
    }

    let reciprocalTotal = 0;

    for (let i = 1; i <= count; i++) {

        const field =
            document.getElementById(`parallelR${i}`);

        const value =
            parseFloat(field?.value);

        if (!Number.isFinite(value)) {

            result.innerHTML =
                `⚠️ أدخل قيمة R${i}`;

            return;
        }

        if (value <= 0) {

            result.innerHTML =
                `❌ قيمة R${i} يجب أن تكون أكبر من صفر`;

            return;
        }

        reciprocalTotal += 1 / value;
    }

    const total =
        1 / reciprocalTotal;

    result.innerHTML =
        `✅ Rt = ${total.toFixed(6)} Ω`;
};
// ==========================================
// ⚡ حاسبة قوانين كيرشوف
// KCL + KVL
// ==========================================

window.physicsKirchhoff = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚡ قوانين كيرشوف
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:12px;
        ">
            اختر القانون:
        </div>

        <button onclick="kirchhoffCurrent()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔋 قانون التيار KCL
        </button>

        <button onclick="kirchhoffVoltage()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚡ قانون الجهد KVL
        </button>
<button onclick="physicsKVLMinus()"
        style="
            width:100%;
            padding:9px;
            margin:4px 0;
            font-size:14px;
        ">
    − السالب
</button>
        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:10px;
                ">
            ← رجوع للكهرباء
        </button>
    `);
};


// ==========================================
// 🔋 KCL
// مجموع التيارات الداخلة = مجموع التيارات الخارجة
// ==========================================

window.kirchhoffCurrent = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔋 قانون التيار KCL
        </div>

        <div style="
            text-align:center;
            margin-bottom:10px;
            font-weight:bold;
        ">
            مجموع التيارات الداخلة = الخارجة
        </div>

        <div style="margin:6px 0;">
            التيارات الداخلة (A):
        </div>

        <input id="kclIn"
               type="text"
               readonly
               placeholder="مثال: 2,3,4"
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            التيارات الخارجة (A):
        </div>

        <input id="kclOut"
               type="text"
               readonly
               placeholder="مثال: 1,5"
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculateKCL()"
                style="
                    width:100%;
                    padding:10px;
                ">
            🧮 تحقق من KCL
        </button>

        <div id="kclResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
             ">
        </div>

        <button onclick="physicsKirchhoff()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع لكيرشوف
        </button>
    `);

    window.activePhysicsField = "kclIn";

    document.getElementById("kclIn")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "kclIn";
        });

    document.getElementById("kclOut")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "kclOut";
        });
};


// ==========================================
// 🧮 حساب KCL
// ==========================================

window.calculateKCL = function () {

    const input =
        document.getElementById("kclIn")?.value || "";

    const output =
        document.getElementById("kclOut")?.value || "";

    const result =
        document.getElementById("kclResult");

    const incoming =
        input.split(",")
            .map(Number)
            .filter(Number.isFinite);

    const outgoing =
        output.split(",")
            .map(Number)
            .filter(Number.isFinite);

    if (!incoming.length || !outgoing.length) {

        result.innerHTML =
            "⚠️ أدخل التيارات مفصولة بفواصل";

        return;
    }

    const sumIn =
        incoming.reduce((a, b) => a + b, 0);

    const sumOut =
        outgoing.reduce((a, b) => a + b, 0);

    const difference =
        sumIn - sumOut;

    if (Math.abs(difference) < 1e-10) {

        result.innerHTML =
            `✅ KCL صحيح<br>
             الداخل = ${sumIn.toFixed(6)} A<br>
             الخارج = ${sumOut.toFixed(6)} A`;

    } else {

        result.innerHTML =
            `❌ KCL غير متحقق<br>
             الداخل = ${sumIn.toFixed(6)} A<br>
             الخارج = ${sumOut.toFixed(6)} A<br>
             الفرق = ${difference.toFixed(6)} A`;
    }
};


// ==========================================
// ⚡ KVL
// مجموع فروق الجهد في الحلقة = 0
// ==========================================

window.kirchhoffVoltage = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚡ قانون الجهد KVL
        </div>

        <div style="
            text-align:center;
            margin-bottom:10px;
            font-weight:bold;
        ">
            مجموع فروق الجهد = 0
        </div>

        <div style="margin:6px 0;">
            فروق الجهد (V):
        </div>

        <input id="kvlValues"
               type="text"
               readonly
               placeholder="مثال: 12,-5,-7"
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">
<button id="kvlMinusBtn"
        style="
            width:100%;
            padding:9px;
            margin:4px 0;
            font-size:14px;
        ">
    − السالب
</button>
        <button onclick="calculateKVL()"
                style="
                    width:100%;
                    padding:10px;
                ">
            🧮 تحقق من KVL
        </button>

        <div id="kvlResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
             ">
        </div>

        <button onclick="physicsKirchhoff()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع لكيرشوف
        </button>
    `);

    window.activePhysicsField = "kvlValues";

    document.getElementById("kvlValues")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "kvlValues";
        });
};

// ==========================================
// ⚛️ السالب داخل KVL
// ==========================================

window.physicsKVLMinus = function () {

    const field = document.getElementById(
        window.activePhysicsField
    );

    if (!field) return;

    field.value += "-";

    console.log(
        "⚡ KVL MINUS:",
        field.value
    );
};
// ==========================================
// ⚡ KVL — تحديد خانة الإدخال
// ==========================================

document.addEventListener("click", function (e) {

    if (e.target.id === "kvlValues") {

        window.activePhysicsField = "kvlValues";

        console.log(
            "⚡ KVL FIELD ACTIVE:",
            window.activePhysicsField
        );
    }

});

// ==========================================
// 🧮 حساب KVL
// ==========================================

window.calculateKVL = function () {

    const input =
        document.getElementById("kvlValues")?.value || "";

    const result =
        document.getElementById("kvlResult");

    const values =
        input.split(",")
            .map(Number)
            .filter(Number.isFinite);

    if (!values.length) {

        result.innerHTML =
            "⚠️ أدخل فروق الجهد مفصولة بفواصل";

        return;
    }

    const total =
        values.reduce((a, b) => a + b, 0);

    if (Math.abs(total) < 1e-10) {

        result.innerHTML =
            `✅ KVL صحيح<br>
             المجموع = ${total.toFixed(6)} V`;

    } else {

        result.innerHTML =
            `❌ KVL غير متحقق<br>
             المجموع = ${total.toFixed(6)} V`;
    }
};
// ==========================================
// 🔋 حاسبة الشحنة الكهربائية
// Q = I × t
// ==========================================

window.physicsElectricCharge = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔋 حاسبة الشحنة الكهربائية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Q = I × t
        </div>

        <div style="margin:6px 0;">
            التيار I (A):
        </div>

        <input id="physicsChargeCurrent"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الزمن t (s):
        </div>

        <input id="physicsChargeTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsElectricCharge()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الشحنة
        </button>

        <div id="physicsChargeResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    window.activePhysicsField = "physicsChargeCurrent";

    document.getElementById("physicsChargeCurrent")
        ?.addEventListener("click", () => {

            window.activePhysicsField =
                "physicsChargeCurrent";

            window.physicsWeightNewInput = true;
        });

    document.getElementById("physicsChargeTime")
        ?.addEventListener("click", () => {

            window.activePhysicsField =
                "physicsChargeTime";

            window.physicsWeightNewInput = true;
        });
};


// ==========================================
// 🧮 حساب الشحنة الكهربائية
// ==========================================

window.calculatePhysicsElectricCharge = function () {

    const current =
        parseFloat(
            document.getElementById(
                "physicsChargeCurrent"
            )?.value
        );

    const time =
        parseFloat(
            document.getElementById(
                "physicsChargeTime"
            )?.value
        );

    const result =
        document.getElementById(
            "physicsChargeResult"
        );

    if (!Number.isFinite(current) ||
        !Number.isFinite(time)) {

        result.innerHTML =
            "⚠️ أدخل التيار والزمن أولاً";

        return;
    }

    const charge = current * time;

    result.innerHTML =
        `✅ Q = ${charge.toFixed(6)} C`;
};
// ==========================================
// ⚛️ حاسبة السعة الكهربائية
// C = Q ÷ V
// ==========================================

window.physicsCapacitance = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚛️ حاسبة السعة الكهربائية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            C = Q ÷ V
        </div>

        <div style="margin:6px 0;">
            الشحنة Q (C):
        </div>

        <input id="physicsCapacitanceCharge"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الجهد V (V):
        </div>

        <input id="physicsCapacitanceVoltage"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsCapacitance()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب السعة
        </button>

        <div id="physicsCapacitanceResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    window.activePhysicsField =
        "physicsCapacitanceCharge";

    document.getElementById(
        "physicsCapacitanceCharge"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsCapacitanceCharge";

        window.physicsWeightNewInput = true;
    });

    document.getElementById(
        "physicsCapacitanceVoltage"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsCapacitanceVoltage";

        window.physicsWeightNewInput = true;
    });
};


// ==========================================
// 🧮 حساب السعة الكهربائية
// ==========================================

window.calculatePhysicsCapacitance = function () {

    const charge =
        parseFloat(
            document.getElementById(
                "physicsCapacitanceCharge"
            )?.value
        );

    const voltage =
        parseFloat(
            document.getElementById(
                "physicsCapacitanceVoltage"
            )?.value
        );

    const result =
        document.getElementById(
            "physicsCapacitanceResult"
        );

    if (!Number.isFinite(charge) ||
        !Number.isFinite(voltage)) {

        result.innerHTML =
            "⚠️ أدخل الشحنة والجهد أولاً";

        return;
    }

    if (voltage === 0) {

        result.innerHTML =
            "❌ الجهد لا يمكن أن يساوي صفر";

        return;
    }

    const capacitance =
        charge / voltage;

    result.innerHTML =
        `✅ C = ${capacitance.toFixed(6)} F`;
};
// ==========================================
// 🌀 حاسبة الحث الكهرومغناطيسي
// قانون فاراداي
// ε = -N × ΔΦ ÷ Δt
// ==========================================

window.physicsElectromagneticInduction = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌀 الحث الكهرومغناطيسي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
            line-height:1.8;
        ">
            قانون فاراداي<br>
            ε = −N × ΔΦ ÷ Δt
        </div>

        <div style="margin:6px 0;">
            عدد اللفات N:
        </div>

        <input id="physicsEMIN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التغير في الفيض ΔΦ (Wb):
        </div>

        <input id="physicsEMIFlux"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التغير في الزمن Δt (s):
        </div>

        <input id="physicsEMITime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsElectromagneticInduction()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب القوة الدافعة
        </button>

        <div id="physicsEMIResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsElectricity()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للكهرباء
        </button>
    `);

    window.activePhysicsField = "physicsEMIN";

    [
        "physicsEMIN",
        "physicsEMIFlux",
        "physicsEMITime"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الحث الكهرومغناطيسي
// ==========================================

window.calculatePhysicsElectromagneticInduction = function () {

    const N =
        parseFloat(
            document.getElementById("physicsEMIN")?.value
        );

    const flux =
        parseFloat(
            document.getElementById("physicsEMIFlux")?.value
        );

    const time =
        parseFloat(
            document.getElementById("physicsEMITime")?.value
        );

    const result =
        document.getElementById("physicsEMIResult");

    if (!Number.isFinite(N) ||
        !Number.isFinite(flux) ||
        !Number.isFinite(time)) {

        result.innerHTML =
            "⚠️ أدخل عدد اللفات والفيض والزمن أولاً";

        return;
    }

    if (N < 0) {

        result.innerHTML =
            "❌ عدد اللفات لا يمكن أن يكون سالبًا";

        return;
    }

    if (time === 0) {

        result.innerHTML =
            "❌ الزمن لا يمكن أن يساوي صفر";

        return;
    }

    const emf =
        -(N * flux) / time;

    result.innerHTML =
        `✅ ε = ${emf.toFixed(6)} V`;
};
// ==========================================
// 🌡️ قائمة الحرارة والديناميكا الحرارية
// ==========================================

window.openPhysicsHeat = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🌡️ الحرارة والديناميكا الحرارية
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:12px;
            font-weight:bold;
        ">
            اختر الحاسبة:
        </div>

        <button onclick="physicsTemperature()">
    🌡️ درجة الحرارة
</button>


        <button onclick="physicsHeatQuantity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔥 كمية الحرارة
        </button>

        <button onclick="physicsSpecificHeat()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🧪 الحرارة النوعية
        </button>

        <button onclick="physicsLatentHeat()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🧊 الحرارة الكامنة
        </button>

        <button onclick="physicsThermalExpansion()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📏 التمدد الحراري
        </button>

        <button onclick="physicsGasLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            💨 قانون الغازات
        </button>

        <button onclick="physicsPressureTemperature()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🎈 العلاقة بين الضغط ودرجة الحرارة
        </button>

        <button onclick="physicsIdealGas()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚛️ قانون الغاز المثالي
        </button>

        <button onclick="physicsThermalEfficiency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚙️ الكفاءة الحرارية
        </button>

        <button onclick="physicsFirstLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ♨️ القانون الأول للديناميكا الحرارية
        </button>

        <button onclick="physicsHeatPower()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔥 معدل انتقال الحرارة
        </button>

        <button onclick="backToPhysics()"
        style="
            width:100%;
            padding:9px;
            margin-top:10px;
        ">
    ← رجوع للفيزياء
</button>
    `);
};
// ==========================================
// 🔙 الرجوع من الحرارة إلى قائمة الفيزياء
// ==========================================

window.backToPhysics = function () {
    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ⚛️ الفيزياء
        </div>

        <div style="
            font-size:14px;
            font-weight:bold;
            margin-bottom:8px;
        ">
            اختر القسم:
        </div>

        <button onclick="openPhysicsMechanics()"
            style="width:100%; padding:10px; margin:3px 0;">
            🏎️ الميكانيكا والحركة
        </button>

        <button onclick="openPhysicsElectricity()"
            style="width:100%; padding:10px; margin:3px 0;">
            ⚡ الكهرباء
        </button>

        <button onclick="openPhysicsHeat()"
            style="width:100%; padding:10px; margin:3px 0;">
            🌡️ الحرارة والديناميكا الحرارية
        </button>

        <button onclick="openPhysicsFluids()"
            style="width:100%; padding:10px; margin:3px 0;">
            💧 الموائع والضغط
        </button>

        <button onclick="openPhysicsWaves()"
            style="width:100%; padding:10px; margin:3px 0;">
            🌊 الموجات والصوت
        </button>

        <button onclick="openPhysicsOptics()"
            style="width:100%; padding:10px; margin:3px 0;">
            🔦 البصريات
        </button>

        <button onclick="openPhysicsMagnetism()"
            style="width:100%; padding:10px; margin:3px 0;">
            🧲 المغناطيسية
        </button>

        <button onclick="openPhysicsModern()"
            style="width:100%; padding:10px; margin:3px 0;">
            ⚛️ الفيزياء الحديثة
        </button>

        <button onclick="openCalculatorHome()"
            style="width:100%; padding:10px; margin-top:10px;">
            ← الرجوع
        </button>
    `);
};
// ==========================================
// 💧 قائمة الموائع والضغط
// ==========================================

window.openPhysicsFluids = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            💧 الموائع والضغط
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:12px;
            font-weight:bold;
        ">
            اختر الحاسبة:
        </div>

        <button onclick="physicsDensity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            💧 الكثافة
        </button>

        <button onclick="physicsPressure()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚖️ الضغط
        </button>

        <button onclick="physicsFluidPressure()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🌊 ضغط السائل
        </button>

        <button onclick="physicsPascalLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🏗️ مبدأ باسكال
        </button>

        <button onclick="physicsBuoyantForce()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🚢 قوة الطفو
        </button>

        <button onclick="physicsArchimedes()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚓ مبدأ أرخميدس
        </button>

        <button onclick="physicsContinuity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            💨 معادلة الاستمرارية
        </button>

        <button onclick="physicsBernoulli()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🌪️ معادلة برنولي
        </button>

        <button onclick="physicsAtmosphericPressure()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🧭 الضغط الجوي
        </button>

        <button onclick="physicsTotalFluidPressure()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🪣 الضغط الكلي في السائل
        </button>

        <button onclick="window.physicsVolumetricFlow()"
        style="
            width:100%;
            padding:10px;
            margin:3px 0;
        ">
    💦 معدل التدفق الحجمي
</button>

        <button onclick="physicsViscosity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🧪 اللزوجة
        </button>

        <button onclick="openPhysics()"
        style="
            width:100%;
            padding:9px;
            margin-top:10px;
        ">
    ← رجوع للفيزياء
</button>
    `);
};
// ==========================================
// 🌊 الموجات والصوت
// ==========================================

window.openPhysicsWaves = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🌊 الموجات والصوت
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:12px;
            font-weight:bold;
        ">
            اختر الحاسبة:
        </div>

        <button onclick="physicsWaveSpeed()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🌊 سرعة الموجة
        </button>

        <button onclick="physicsWavelength()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📏 الطول الموجي
        </button>

        <button onclick="physicsFrequency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔄 التردد
        </button>

        <button onclick="physicsPeriod()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⏱️ الزمن الدوري
        </button>

        <button onclick="physicsSoundIntensity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📢 شدة الصوت
        </button>

        <button onclick="physicsSoundLevel()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔊 مستوى شدة الصوت
        </button>

        <button onclick="physicsWaveFrequency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🎵 تردد الموجة
        </button>

        <button onclick="physicsStringFrequency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🪕 تردد الوتر
        </button>

        <button onclick="physicsSoundSpeed()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🌡️ سرعة الصوت في الهواء
        </button>

        <button onclick="physicsDopplerEffect()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📡 تأثير دوبلر
        </button>

        <button onclick="physicsResonance()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🎶 الرنين
        </button>

        <button onclick="physicsHarmonics()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔔 التوافقيات
        </button>

        <button onclick="openPhysics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:10px;
                ">
            ← رجوع للفيزياء
        </button>
    `);
};
// ==========================================
// ⚛️ فتح قائمة الفيزياء
// ==========================================

window.openPhysics = function () {

    currentMode = "PHYSICS";
    window.activePhysicsField = null;

    closeCalculatorHome();

    createScreenPanel(`
        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ⚛️ الفيزياء
        </div>

        <div style="
            font-size:14px;
            font-weight:bold;
            margin-bottom:8px;
        ">
            اختر القسم:
        </div>

        <button onclick="openPhysicsMechanics()"
            style="width:100%; padding:10px; margin:3px 0;">
            🏎️ الميكانيكا والحركة
        </button>

        <button onclick="openPhysicsElectricity()"
            style="width:100%; padding:10px; margin:3px 0;">
            ⚡ الكهرباء
        </button>

        <button onclick="openPhysicsHeat()"
            style="width:100%; padding:10px; margin:3px 0;">
            🌡️ الحرارة والديناميكا الحرارية
        </button>

        <button onclick="openPhysicsFluids()"
            style="width:100%; padding:10px; margin:3px 0;">
            💧 الموائع والضغط
        </button>

        <button onclick="openPhysicsWaves()"
            style="width:100%; padding:10px; margin:3px 0;">
            🌊 الموجات والصوت
        </button>

        <button onclick="openPhysicsOptics()"
            style="width:100%; padding:10px; margin:3px 0;">
            🔦 البصريات
        </button>

        <button onclick="openPhysicsMagnetism()"
            style="width:100%; padding:10px; margin:3px 0;">
            🧲 المغناطيسية
        </button>

        <button onclick="openPhysicsModern()"
            style="width:100%; padding:10px; margin:3px 0;">
            ⚛️ الفيزياء الحديثة
        </button>

        <button onclick="openCalculatorHome()"
            style="width:100%; padding:10px; margin-top:10px;">
            ← الرجوع
        </button>
    `);
};
// ==========================================
// 🌡️ حاسبة درجة الحرارة
// تحويل بين °C و °F و K
// ==========================================

window.physicsTemperature = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌡️ حاسبة درجة الحرارة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            اختر نوع التحويل
        </div>

        <button onclick="temperatureCtoF()" style="
            width:100%;
            padding:10px;
            margin:3px 0;
        ">
            °C → °F
        </button>

        <button onclick="temperatureFtoC()" style="
            width:100%;
            padding:10px;
            margin:3px 0;
        ">
            °F → °C
        </button>

        <button onclick="temperatureCtoK()" style="
            width:100%;
            padding:10px;
            margin:3px 0;
        ">
            °C → K
        </button>

        <button onclick="temperatureKtoC()" style="
            width:100%;
            padding:10px;
            margin:3px 0;
        ">
            K → °C
        </button>

        <button onclick="temperatureFtoK()" style="
            width:100%;
            padding:10px;
            margin:3px 0;
        ">
            °F → K
        </button>

        <button onclick="temperatureKtoF()" style="
            width:100%;
            padding:10px;
            margin:3px 0;
        ">
            K → °F
        </button>

        <div id="temperatureResult" style="
            margin-top:12px;
            text-align:center;
            font-weight:bold;
            font-size:15px;
        "></div>

        <button onclick="openPhysicsHeat()" style="
            width:100%;
            padding:9px;
            margin-top:10px;
        ">
            ← رجوع للحرارة
        </button>
    `);
};


// ==========================================
// 🌡️ دالة إدخال درجة الحرارة
// ==========================================

window.temperatureInput = function (title, unit, calculate) {

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🌡️ ${title}
        </div>

        <div style="margin:6px 0;">
            درجة الحرارة (${unit}):
        </div>

        <input id="temperatureValue"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="${calculate}()" style="
            width:100%;
            padding:10px;
            margin:4px 0;
        ">
            🧮 احسب
        </button>

        <div id="temperatureResult" style="
            margin-top:10px;
            text-align:center;
            font-weight:bold;
            font-size:15px;
        "></div>

        <button onclick="physicsTemperature()" style="
            width:100%;
            padding:9px;
            margin-top:8px;
        ">
            ← رجوع
        </button>
    `);

    window.activePhysicsField = "temperatureValue";

    document.getElementById("temperatureValue")
        ?.addEventListener("click", () => {
            window.activePhysicsField = "temperatureValue";
        });
};


// ==========================================
// °C → °F
// ==========================================

window.temperatureCtoF = function () {

    temperatureInput(
        "تحويل السيلسيوس إلى فهرنهايت",
        "°C",
        "calculateCtoF"
    );
};

window.calculateCtoF = function () {

    const c = Number(
        document.getElementById("temperatureValue")?.value
    );

    const result =
        document.getElementById("temperatureResult");

    if (!Number.isFinite(c)) {
        result.innerHTML = "⚠️ أدخل درجة الحرارة";
        return;
    }

    const f = (c * 9 / 5) + 32;

    result.innerHTML =
        `✅ ${f.toFixed(6)} °F`;
};


// ==========================================
// °F → °C
// ==========================================

window.temperatureFtoC = function () {

    temperatureInput(
        "تحويل الفهرنهايت إلى سيلسيوس",
        "°F",
        "calculateFtoC"
    );
};

window.calculateFtoC = function () {

    const f = Number(
        document.getElementById("temperatureValue")?.value
    );

    const result =
        document.getElementById("temperatureResult");

    if (!Number.isFinite(f)) {
        result.innerHTML = "⚠️ أدخل درجة الحرارة";
        return;
    }

    const c = (f - 32) * 5 / 9;

    result.innerHTML =
        `✅ ${c.toFixed(6)} °C`;
};


// ==========================================
// °C → K
// ==========================================

window.temperatureCtoK = function () {

    temperatureInput(
        "تحويل السيلسيوس إلى كلفن",
        "°C",
        "calculateCtoK"
    );
};

window.calculateCtoK = function () {

    const c = Number(
        document.getElementById("temperatureValue")?.value
    );

    const result =
        document.getElementById("temperatureResult");

    if (!Number.isFinite(c)) {
        result.innerHTML = "⚠️ أدخل درجة الحرارة";
        return;
    }

    const k = c + 273.15;

    result.innerHTML =
        `✅ ${k.toFixed(6)} K`;
};


// ==========================================
// K → °C
// ==========================================

window.temperatureKtoC = function () {

    temperatureInput(
        "تحويل الكلفن إلى سيلسيوس",
        "K",
        "calculateKtoC"
    );
};

window.calculateKtoC = function () {

    const k = Number(
        document.getElementById("temperatureValue")?.value
    );

    const result =
        document.getElementById("temperatureResult");

    if (!Number.isFinite(k)) {
        result.innerHTML = "⚠️ أدخل درجة الحرارة";
        return;
    }

    if (k < 0) {
        result.innerHTML =
            "❌ درجة الحرارة بالكلفن لا يمكن أن تكون سالبة";
        return;
    }

    const c = k - 273.15;

    result.innerHTML =
        `✅ ${c.toFixed(6)} °C`;
};


// ==========================================
// °F → K
// ==========================================

window.temperatureFtoK = function () {

    temperatureInput(
        "تحويل الفهرنهايت إلى كلفن",
        "°F",
        "calculateFtoK"
    );
};

window.calculateFtoK = function () {

    const f = Number(
        document.getElementById("temperatureValue")?.value
    );

    const result =
        document.getElementById("temperatureResult");

    if (!Number.isFinite(f)) {
        result.innerHTML = "⚠️ أدخل درجة الحرارة";
        return;
    }

    const k = (f - 32) * 5 / 9 + 273.15;

    if (k < 0) {
        result.innerHTML =
            "❌ درجة الحرارة الناتجة أقل من الصفر المطلق";
        return;
    }

    result.innerHTML =
        `✅ ${k.toFixed(6)} K`;
};


// ==========================================
// K → °F
// ==========================================

window.temperatureKtoF = function () {

    temperatureInput(
        "تحويل الكلفن إلى فهرنهايت",
        "K",
        "calculateKtoF"
    );
};

window.calculateKtoF = function () {

    const k = Number(
        document.getElementById("temperatureValue")?.value
    );

    const result =
        document.getElementById("temperatureResult");

    if (!Number.isFinite(k)) {
        result.innerHTML = "⚠️ أدخل درجة الحرارة";
        return;
    }

    if (k < 0) {
        result.innerHTML =
            "❌ درجة الحرارة بالكلفن لا يمكن أن تكون سالبة";
        return;
    }

    const f = (k - 273.15) * 9 / 5 + 32;

    result.innerHTML =
        `✅ ${f.toFixed(6)} °F`;
};


// ==========================================
// 🌡️ حاسبة كمية الحرارة
// Q = m × c × ΔT
// ==========================================

window.physicsHeatQuantity = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌡️ حاسبة كمية الحرارة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Q = m × c × ΔT
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsHeatMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            السعة الحرارية النوعية c (J/kg·°C):
        </div>

        <input id="physicsHeatSpecific"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التغير في درجة الحرارة ΔT (°C):
        </div>

        <input id="physicsHeatDeltaT"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsHeatQuantity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب كمية الحرارة
        </button>

        <div id="physicsHeatResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

       <button onclick="openPhysicsHeat()"
        style="
            width:100%;
            padding:9px;
            margin-top:8px;
        ">
    ← رجوع للحرارة
</button>
    `);

    window.activePhysicsField = "physicsHeatMass";

    [
        "physicsHeatMass",
        "physicsHeatSpecific",
        "physicsHeatDeltaT"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};
// ==========================================
// 🔙 رجوع لقائمة الحرارة
// ==========================================

window.backToPhysicsThermal = function () {
    openPhysicsThermal();
};
// ==========================================
// 🧪 حاسبة الحرارة النوعية
// c = Q ÷ (m × ΔT)
// ==========================================

window.physicsSpecificHeat = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🧪 حاسبة الحرارة النوعية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            c = Q ÷ (m × ΔT)
        </div>

        <div style="margin:6px 0;">
            كمية الحرارة Q (J):
        </div>

        <input id="physicsSpecificHeatQ"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsSpecificHeatMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التغير في درجة الحرارة ΔT (°C):
        </div>

        <input id="physicsSpecificHeatDeltaT"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsSpecificHeat()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الحرارة النوعية
        </button>

        <div id="physicsSpecificHeatResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsHeat()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للحرارة
        </button>
    `);

    window.activePhysicsField = "physicsSpecificHeatQ";

    [
        "physicsSpecificHeatQ",
        "physicsSpecificHeatMass",
        "physicsSpecificHeatDeltaT"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الحرارة النوعية
// ==========================================

window.calculatePhysicsSpecificHeat = function () {

    const Q = Number(
        document.getElementById("physicsSpecificHeatQ")?.value
    );

    const m = Number(
        document.getElementById("physicsSpecificHeatMass")?.value
    );

    const deltaT = Number(
        document.getElementById("physicsSpecificHeatDeltaT")?.value
    );

    const result =
        document.getElementById("physicsSpecificHeatResult");

    if (!result) return;

    if (
        !Number.isFinite(Q) ||
        !Number.isFinite(m) ||
        !Number.isFinite(deltaT)
    ) {
        result.innerHTML = "⚠️ أدخل جميع القيم";
        return;
    }

    if (m === 0) {
        result.innerHTML = "❌ الكتلة لا يمكن أن تساوي صفرًا";
        return;
    }

    if (deltaT === 0) {
        result.innerHTML =
            "❌ التغير في درجة الحرارة لا يمكن أن يساوي صفرًا";
        return;
    }

    const c = Q / (m * deltaT);

    result.innerHTML =
        `✅ c = ${c.toFixed(6)} J/kg·°C`;
};
// ==========================================
// 🧊 حاسبة الحرارة الكامنة
// Q = m × L
// ==========================================

window.physicsLatentHeat = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🧊 حاسبة الحرارة الكامنة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Q = m × L
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsLatentMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الحرارة الكامنة النوعية L (J/kg):
        </div>

        <input id="physicsLatentL"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsLatentHeat()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الحرارة الكامنة
        </button>

        <div id="physicsLatentResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsHeat()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للحرارة
        </button>
    `);

    window.activePhysicsField = "physicsLatentMass";

    [
        "physicsLatentMass",
        "physicsLatentL"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الحرارة الكامنة
// ==========================================

window.calculatePhysicsLatentHeat = function () {

    const m = Number(
        document.getElementById("physicsLatentMass")?.value
    );

    const L = Number(
        document.getElementById("physicsLatentL")?.value
    );

    const result =
        document.getElementById("physicsLatentResult");

    if (!result) return;

    if (!Number.isFinite(m) || !Number.isFinite(L)) {
        result.innerHTML = "⚠️ أدخل جميع القيم";
        return;
    }

    if (m < 0) {
        result.innerHTML = "❌ الكتلة لا يمكن أن تكون سالبة";
        return;
    }

    const Q = m * L;

    result.innerHTML =
        `✅ Q = ${Q.toFixed(6)} J`;
};
// ==========================================
// 📏 حاسبة التمدد الحراري
// ΔL = α × L₀ × ΔT
// L = L₀ + ΔL
// ==========================================

window.physicsThermalExpansion = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📏 حاسبة التمدد الحراري
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            ΔL = α × L₀ × ΔT
        </div>

        <div style="margin:6px 0;">
            الطول الأصلي L₀ (m):
        </div>

        <input id="physicsExpansionLength"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            معامل التمدد الخطي α (1/°C):
        </div>

        <input id="physicsExpansionAlpha"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التغير في درجة الحرارة ΔT (°C):
        </div>

        <input id="physicsExpansionDeltaT"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsThermalExpansion()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب التمدد
        </button>

        <div id="physicsExpansionResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsHeat()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للحرارة
        </button>
    `);

    window.activePhysicsField = "physicsExpansionLength";

    [
        "physicsExpansionLength",
        "physicsExpansionAlpha",
        "physicsExpansionDeltaT"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب التمدد الحراري
// ==========================================

window.calculatePhysicsThermalExpansion = function () {

    const L0 = Number(
        document.getElementById("physicsExpansionLength")?.value
    );

    const alpha = Number(
        document.getElementById("physicsExpansionAlpha")?.value
    );

    const deltaT = Number(
        document.getElementById("physicsExpansionDeltaT")?.value
    );

    const result =
        document.getElementById("physicsExpansionResult");

    if (!result) return;

    if (
        !Number.isFinite(L0) ||
        !Number.isFinite(alpha) ||
        !Number.isFinite(deltaT)
    ) {
        result.innerHTML = "⚠️ أدخل جميع القيم";
        return;
    }

    if (L0 < 0) {
        result.innerHTML =
            "❌ الطول الأصلي لا يمكن أن يكون سالبًا";
        return;
    }

    if (alpha < 0) {
        result.innerHTML =
            "❌ معامل التمدد لا يمكن أن يكون سالبًا";
        return;
    }

    const deltaL = alpha * L0 * deltaT;
    const finalLength = L0 + deltaL;

    result.innerHTML = `
        ✅ ΔL = ${deltaL.toFixed(6)} m<br>
        📏 L = ${finalLength.toFixed(6)} m
    `;
};
// ==========================================
// 💨 حاسبة قانون الغازات العام
// P₁V₁ / T₁ = P₂V₂ / T₂
// ==========================================

window.physicsGasLaw = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            💨 حاسبة قانون الغازات
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            P₁V₁ / T₁ = P₂V₂ / T₂
        </div>

        <div style="margin:6px 0;">
            اختر القيمة المجهولة:
        </div>

        <select id="physicsGasUnknown"
                style="
                    width:95%;
                    padding:9px;
                    margin-bottom:12px;
                    font-size:14px;
                    direction:ltr;
                ">
            <option value="P1">P₁ الضغط الأول</option>
            <option value="V1">V₁ الحجم الأول</option>
            <option value="T1">T₁ درجة الحرارة الأولى</option>
            <option value="P2">P₂ الضغط الثاني</option>
            <option value="V2">V₂ الحجم الثاني</option>
            <option value="T2">T₂ درجة الحرارة الثانية</option>
        </select>

        <div style="margin:6px 0;">
            P₁ الضغط الأول:
        </div>
        <input id="physicsGasP1"
               type="text"
               readonly
               dir="ltr"
               style="width:90%; padding:8px; margin-bottom:7px;">

        <div style="margin:6px 0;">
            V₁ الحجم الأول:
        </div>
        <input id="physicsGasV1"
               type="text"
               readonly
               dir="ltr"
               style="width:90%; padding:8px; margin-bottom:7px;">

        <div style="margin:6px 0;">
            T₁ درجة الحرارة الأولى (K):
        </div>
        <input id="physicsGasT1"
               type="text"
               readonly
               dir="ltr"
               style="width:90%; padding:8px; margin-bottom:7px;">

        <div style="margin:6px 0;">
            P₂ الضغط الثاني:
        </div>
        <input id="physicsGasP2"
               type="text"
               readonly
               dir="ltr"
               style="width:90%; padding:8px; margin-bottom:7px;">

        <div style="margin:6px 0;">
            V₂ الحجم الثاني:
        </div>
        <input id="physicsGasV2"
               type="text"
               readonly
               dir="ltr"
               style="width:90%; padding:8px; margin-bottom:7px;">

        <div style="margin:6px 0;">
            T₂ درجة الحرارة الثانية (K):
        </div>
        <input id="physicsGasT2"
               type="text"
               readonly
               dir="ltr"
               style="width:90%; padding:8px; margin-bottom:8px;">

        <button onclick="calculatePhysicsGasLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب
        </button>

        <div id="physicsGasResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsHeat()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للحرارة
        </button>
    `);

    const fields = [
        "physicsGasP1",
        "physicsGasV1",
        "physicsGasT1",
        "physicsGasP2",
        "physicsGasV2",
        "physicsGasT2"
    ];

    window.activePhysicsField = fields[0];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب قانون الغازات
// ==========================================

window.calculatePhysicsGasLaw = function () {

    const unknown =
        document.getElementById("physicsGasUnknown")?.value;

    const ids = [
        "P1",
        "V1",
        "T1",
        "P2",
        "V2",
        "T2"
    ];

    const values = {};

    for (const id of ids) {

        const element =
            document.getElementById("physicsGas" + id);

        if (id === unknown) {
            continue;
        }

        const value = Number(element?.value);

        if (!Number.isFinite(value)) {
            document.getElementById("physicsGasResult").innerHTML =
                "⚠️ أدخل جميع القيم المطلوبة";
            return;
        }

        values[id] = value;
    }

    const result =
        document.getElementById("physicsGasResult");

    let answer;

    switch (unknown) {

        case "P1":
            if (values.V1 === 0 || values.T1 === 0) {
                result.innerHTML = "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer =
                (values.P2 * values.V2 * values.T1) /
                (values.V1 * values.T2);
            break;

        case "V1":
            if (values.P1 === 0 || values.T1 === 0) {
                result.innerHTML = "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer =
                (values.P2 * values.V2 * values.T1) /
                (values.P1 * values.T2);
            break;

        case "T1":
            if (values.P1 === 0 || values.V1 === 0) {
                result.innerHTML = "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer =
                (values.P1 * values.V1 * values.T2) /
                (values.P2 * values.V2);
            break;

        case "P2":
            if (values.V2 === 0 || values.T1 === 0) {
                result.innerHTML = "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer =
                (values.P1 * values.V1 * values.T2) /
                (values.V2 * values.T1);
            break;

        case "V2":
            if (values.P2 === 0 || values.T1 === 0) {
                result.innerHTML = "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer =
                (values.P1 * values.V1 * values.T2) /
                (values.P2 * values.T1);
            break;

        case "T2":
            if (values.P2 === 0 || values.V2 === 0) {
                result.innerHTML = "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer =
                (values.P2 * values.V2 * values.T1) /
                (values.P1 * values.V1);
            break;
    }

    if (!Number.isFinite(answer)) {
        result.innerHTML = "❌ لا يمكن حساب النتيجة بهذه القيم";
        return;
    }

    result.innerHTML =
        `✅ ${unknown} = ${answer.toFixed(6)}`;
};
// ==========================================
// 🎈 العلاقة بين الضغط ودرجة الحرارة
// P₁ / T₁ = P₂ / T₂
// ==========================================

window.physicsPressureTemperature = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🎈 العلاقة بين الضغط ودرجة الحرارة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            P₁ / T₁ = P₂ / T₂
        </div>

        <div style="margin:6px 0;">
            اختر القيمة المجهولة:
        </div>

        <select id="physicsPTUnknown"
                style="
                    width:95%;
                    padding:9px;
                    margin-bottom:12px;
                    font-size:14px;
                    direction:ltr;
                ">
            <option value="P1">P₁ الضغط الأول</option>
            <option value="T1">T₁ درجة الحرارة الأولى</option>
            <option value="P2">P₂ الضغط الثاني</option>
            <option value="T2">T₂ درجة الحرارة الثانية</option>
        </select>

        <div style="margin:6px 0;">
            P₁ الضغط الأول:
        </div>

        <input id="physicsPTP1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            T₁ درجة الحرارة الأولى (K):
        </div>

        <input id="physicsPTT1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            P₂ الضغط الثاني:
        </div>

        <input id="physicsPTP2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            T₂ درجة الحرارة الثانية (K):
        </div>

        <input id="physicsPTT2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsPressureTemperature()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب
        </button>

        <div id="physicsPTResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsHeat()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للحرارة
        </button>
    `);

    const fields = [
        "physicsPTP1",
        "physicsPTT1",
        "physicsPTP2",
        "physicsPTT2"
    ];

    window.activePhysicsField = fields[0];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب العلاقة بين الضغط ودرجة الحرارة
// ==========================================

window.calculatePhysicsPressureTemperature = function () {

    const unknown =
        document.getElementById("physicsPTUnknown")?.value;

    const ids = ["P1", "T1", "P2", "T2"];

    const values = {};

    for (const id of ids) {

        if (id === unknown) continue;

        const element =
            document.getElementById("physicsPT" + id);

        const value = Number(element?.value);

        if (!Number.isFinite(value)) {

            document.getElementById("physicsPTResult").innerHTML =
                "⚠️ أدخل جميع القيم المطلوبة";

            return;
        }

        values[id] = value;
    }

    const result =
        document.getElementById("physicsPTResult");

    let answer;

    switch (unknown) {

        case "P1":

            if (values.T1 === 0) {
                result.innerHTML =
                    "❌ درجة الحرارة لا يمكن أن تساوي صفرًا";
                return;
            }

            answer =
                (values.P2 * values.T1) /
                values.T2;

            break;

        case "T1":

            if (values.P2 === 0) {
                result.innerHTML =
                    "❌ الضغط لا يمكن أن يساوي صفرًا";
                return;
            }

            answer =
                (values.P1 * values.T2) /
                values.P2;

            break;

        case "P2":

            if (values.T1 === 0) {
                result.innerHTML =
                    "❌ درجة الحرارة لا يمكن أن تساوي صفرًا";
                return;
            }

            answer =
                (values.P1 * values.T2) /
                values.T1;

            break;

        case "T2":

            if (values.P1 === 0) {
                result.innerHTML =
                    "❌ الضغط لا يمكن أن يساوي صفرًا";
                return;
            }

            answer =
                (values.P2 * values.T1) /
                values.P1;

            break;
    }

    if (!Number.isFinite(answer)) {

        result.innerHTML =
            "❌ لا يمكن حساب النتيجة بهذه القيم";

        return;
    }

    result.innerHTML =
        `✅ ${unknown} = ${answer.toFixed(6)}`;
};
// ==========================================
// ⚛️ حاسبة قانون الغاز المثالي
// PV = nRT
// ==========================================

window.physicsIdealGas = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚛️ حاسبة قانون الغاز المثالي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            PV = nRT
        </div>

        <div style="margin:6px 0;">
            اختر القيمة المجهولة:
        </div>

        <select id="physicsIdealUnknown"
                style="
                    width:95%;
                    padding:9px;
                    margin-bottom:12px;
                    font-size:14px;
                    direction:ltr;
                ">
            <option value="P">P الضغط</option>
            <option value="V">V الحجم</option>
            <option value="n">n عدد المولات</option>
            <option value="T">T درجة الحرارة</option>
        </select>

        <div style="margin:6px 0;">
            P الضغط (Pa):
        </div>

        <input id="physicsIdealP"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            V الحجم (m³):
        </div>

        <input id="physicsIdealV"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            n عدد المولات (mol):
        </div>

        <input id="physicsIdealN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            T درجة الحرارة (K):
        </div>

        <input id="physicsIdealT"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            R ثابت الغاز العام:
        </div>

        <input id="physicsIdealR"
               type="text"
               value="8.314"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsIdealGas()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب
        </button>

        <div id="physicsIdealResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsHeat()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للحرارة
        </button>
    `);

    const fields = [
        "physicsIdealP",
        "physicsIdealV",
        "physicsIdealN",
        "physicsIdealT",
        "physicsIdealR"
    ];

    window.activePhysicsField = fields[0];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب قانون الغاز المثالي
// ==========================================

window.calculatePhysicsIdealGas = function () {

    const unknown =
        document.getElementById("physicsIdealUnknown")?.value;

    const result =
        document.getElementById("physicsIdealResult");

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById("physicsIdeal" + id);

        return Number(element?.value);
    };

    const R = getValue("R");

    if (!Number.isFinite(R) || R <= 0) {
        result.innerHTML =
            "❌ ثابت الغاز R يجب أن يكون أكبر من صفر";
        return;
    }

    let answer;

    switch (unknown) {

        case "P": {

            const V = getValue("V");
            const n = getValue("N");
            const T = getValue("T");

            if (
                !Number.isFinite(V) ||
                !Number.isFinite(n) ||
                !Number.isFinite(T)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (V === 0) {
                result.innerHTML =
                    "❌ الحجم لا يمكن أن يساوي صفرًا";
                return;
            }

            answer = (n * R * T) / V;

            result.innerHTML =
                `✅ P = ${answer.toFixed(6)} Pa`;

            return;
        }

        case "V": {

            const P = getValue("P");
            const n = getValue("N");
            const T = getValue("T");

            if (
                !Number.isFinite(P) ||
                !Number.isFinite(n) ||
                !Number.isFinite(T)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (P === 0) {
                result.innerHTML =
                    "❌ الضغط لا يمكن أن يساوي صفرًا";
                return;
            }

            answer = (n * R * T) / P;

            result.innerHTML =
                `✅ V = ${answer.toFixed(6)} m³`;

            return;
        }

        case "n": {

            const P = getValue("P");
            const V = getValue("V");
            const T = getValue("T");

            if (
                !Number.isFinite(P) ||
                !Number.isFinite(V) ||
                !Number.isFinite(T)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (R === 0 || T === 0) {
                result.innerHTML =
                    "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer = (P * V) / (R * T);

            result.innerHTML =
                `✅ n = ${answer.toFixed(6)} mol`;

            return;
        }

        case "T": {

            const P = getValue("P");
            const V = getValue("V");
            const n = getValue("N");

            if (
                !Number.isFinite(P) ||
                !Number.isFinite(V) ||
                !Number.isFinite(n)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (n === 0 || R === 0) {
                result.innerHTML =
                    "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer = (P * V) / (n * R);

            result.innerHTML =
                `✅ T = ${answer.toFixed(6)} K`;

            return;
        }
    }
};
// ==========================================
// ⚙️ حاسبة الكفاءة الحرارية
// η = Wout ÷ Qin × 100
// ==========================================

window.physicsThermalEfficiency = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚙️ حاسبة الكفاءة الحرارية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            η = Wout ÷ Qin × 100
        </div>

        <div style="margin:6px 0;">
            الشغل الناتج المفيد Wout (J):
        </div>

        <input id="physicsEfficiencyWork"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الحرارة الداخلة Qin (J):
        </div>

        <input id="physicsEfficiencyHeatIn"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsThermalEfficiency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الكفاءة
        </button>

        <div id="physicsEfficiencyResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsHeat()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للحرارة
        </button>
    `);

    window.activePhysicsField = "physicsEfficiencyWork";

    [
        "physicsEfficiencyWork",
        "physicsEfficiencyHeatIn"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الكفاءة الحرارية
// ==========================================

window.calculatePhysicsThermalEfficiency = function () {

    const work = Number(
        document.getElementById("physicsEfficiencyWork")?.value
    );

    const heatIn = Number(
        document.getElementById("physicsEfficiencyHeatIn")?.value
    );

    const result =
        document.getElementById("physicsEfficiencyResult");

    if (!result) return;

    if (
        !Number.isFinite(work) ||
        !Number.isFinite(heatIn)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم";
        return;
    }

    if (heatIn === 0) {
        result.innerHTML =
            "❌ الحرارة الداخلة لا يمكن أن تساوي صفرًا";
        return;
    }

    if (work < 0 || heatIn < 0) {
        result.innerHTML =
            "❌ القيم لا يمكن أن تكون سالبة";
        return;
    }

    const efficiency =
        (work / heatIn) * 100;

    result.innerHTML =
        `✅ η = ${efficiency.toFixed(6)} %`;
};
// ==========================================
// ♨️ القانون الأول للديناميكا الحرارية
// ΔU = Q − W
// ==========================================

window.physicsFirstLaw = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ♨️ القانون الأول للديناميكا الحرارية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            ΔU = Q − W
        </div>

        <div style="margin:6px 0;">
            الحرارة المضافة Q (J):
        </div>

        <input id="physicsFirstLawQ"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الشغل الذي يبذله النظام W (J):
        </div>

        <input id="physicsFirstLawW"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsFirstLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب التغير في الطاقة الداخلية
        </button>

        <div id="physicsFirstLawResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsHeat()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للحرارة
        </button>
    `);

    window.activePhysicsField = "physicsFirstLawQ";

    [
        "physicsFirstLawQ",
        "physicsFirstLawW"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب القانون الأول
// ==========================================

window.calculatePhysicsFirstLaw = function () {

    const Q = Number(
        document.getElementById("physicsFirstLawQ")?.value
    );

    const W = Number(
        document.getElementById("physicsFirstLawW")?.value
    );

    const result =
        document.getElementById("physicsFirstLawResult");

    if (!result) return;

    if (
        !Number.isFinite(Q) ||
        !Number.isFinite(W)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم";
        return;
    }

    const deltaU = Q - W;

    result.innerHTML =
        `✅ ΔU = ${deltaU.toFixed(6)} J`;
};
// ==========================================
// 🔥 حاسبة معدل انتقال الحرارة
// P = Q ÷ t
// ==========================================

window.physicsHeatPower = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔥 حاسبة معدل انتقال الحرارة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            P = Q ÷ t
        </div>

        <div style="margin:6px 0;">
            كمية الحرارة Q (J):
        </div>

        <input id="physicsHeatPowerQ"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الزمن t (s):
        </div>

        <input id="physicsHeatPowerTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsHeatPower()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب معدل انتقال الحرارة
        </button>

        <div id="physicsHeatPowerResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsHeat()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للحرارة
        </button>
    `);

    window.activePhysicsField = "physicsHeatPowerQ";

    [
        "physicsHeatPowerQ",
        "physicsHeatPowerTime"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب معدل انتقال الحرارة
// ==========================================

window.calculatePhysicsHeatPower = function () {

    const Q = Number(
        document.getElementById("physicsHeatPowerQ")?.value
    );

    const t = Number(
        document.getElementById("physicsHeatPowerTime")?.value
    );

    const result =
        document.getElementById("physicsHeatPowerResult");

    if (!result) return;

    if (
        !Number.isFinite(Q) ||
        !Number.isFinite(t)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم";
        return;
    }

    if (t === 0) {
        result.innerHTML =
            "❌ الزمن لا يمكن أن يساوي صفرًا";
        return;
    }

    const power = Q / t;

    result.innerHTML =
        `✅ P = ${power.toFixed(6)} W`;
};
// ==========================================
// 💧 حاسبة الكثافة
// ρ = m ÷ V
// ==========================================

window.physicsDensity = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            💧 حاسبة الكثافة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            ρ = m ÷ V
        </div>

        <div style="margin:6px 0;">
            اختر القيمة المجهولة:
        </div>

        <select id="physicsDensityUnknown"
                style="
                    width:95%;
                    padding:9px;
                    margin-bottom:12px;
                    font-size:14px;
                    direction:ltr;
                ">
            <option value="rho">ρ الكثافة</option>
            <option value="m">m الكتلة</option>
            <option value="V">V الحجم</option>
        </select>

        <div style="margin:6px 0;">
            ρ الكثافة (kg/m³):
        </div>

        <input id="physicsDensityRho"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            m الكتلة (kg):
        </div>

        <input id="physicsDensityMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            V الحجم (m³):
        </div>

        <input id="physicsDensityVolume"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsDensity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب
        </button>

        <div id="physicsDensityResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsDensityRho",
        "physicsDensityMass",
        "physicsDensityVolume"
    ];

    window.activePhysicsField = fields[1];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الكثافة
// ==========================================

window.calculatePhysicsDensity = function () {

    const unknown =
        document.getElementById("physicsDensityUnknown")?.value;

    const result =
        document.getElementById("physicsDensityResult");

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById("physicsDensity" + id);

        return Number(element?.value);
    };

    let answer;

    switch (unknown) {

        case "rho": {

            const m = getValue("Mass");
            const V = getValue("Volume");

            if (
                !Number.isFinite(m) ||
                !Number.isFinite(V)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (V === 0) {
                result.innerHTML =
                    "❌ الحجم لا يمكن أن يساوي صفرًا";
                return;
            }

            answer = m / V;

            result.innerHTML =
                `✅ ρ = ${answer.toFixed(6)} kg/m³`;

            return;
        }

        case "m": {

            const rho = getValue("Rho");
            const V = getValue("Volume");

            if (
                !Number.isFinite(rho) ||
                !Number.isFinite(V)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            answer = rho * V;

            result.innerHTML =
                `✅ m = ${answer.toFixed(6)} kg`;

            return;
        }

        case "V": {

            const rho = getValue("Rho");
            const m = getValue("Mass");

            if (
                !Number.isFinite(rho) ||
                !Number.isFinite(m)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (rho === 0) {
                result.innerHTML =
                    "❌ الكثافة لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = m / rho;

            result.innerHTML =
                `✅ V = ${answer.toFixed(6)} m³`;

            return;
        }
    }
};
// ==========================================
// ⚖️ حاسبة الضغط
// P = F ÷ A
// ==========================================

window.physicsPressure = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚖️ حاسبة الضغط
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            P = F ÷ A
        </div>

        <div style="margin:6px 0;">
            اختر القيمة المجهولة:
        </div>

        <select id="physicsPressureUnknown"
                style="
                    width:95%;
                    padding:9px;
                    margin-bottom:12px;
                    font-size:14px;
                    direction:ltr;
                ">
            <option value="P">P الضغط</option>
            <option value="F">F القوة</option>
            <option value="A">A المساحة</option>
        </select>

        <div style="margin:6px 0;">
            P الضغط (Pa):
        </div>

        <input id="physicsPressureP"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            F القوة (N):
        </div>

        <input id="physicsPressureF"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            A المساحة (m²):
        </div>

        <input id="physicsPressureA"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsPressure()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب
        </button>

        <div id="physicsPressureResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsPressureP",
        "physicsPressureF",
        "physicsPressureA"
    ];

    window.activePhysicsField = fields[1];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الضغط
// ==========================================

window.calculatePhysicsPressure = function () {

    const unknown =
        document.getElementById("physicsPressureUnknown")?.value;

    const result =
        document.getElementById("physicsPressureResult");

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById("physicsPressure" + id);

        return Number(element?.value);
    };

    let answer;

    switch (unknown) {

        case "P": {

            const F = getValue("F");
            const A = getValue("A");

            if (
                !Number.isFinite(F) ||
                !Number.isFinite(A)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (A === 0) {
                result.innerHTML =
                    "❌ المساحة لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = F / A;

            result.innerHTML =
                `✅ P = ${answer.toFixed(6)} Pa`;

            return;
        }

        case "F": {

            const P = getValue("P");
            const A = getValue("A");

            if (
                !Number.isFinite(P) ||
                !Number.isFinite(A)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            answer = P * A;

            result.innerHTML =
                `✅ F = ${answer.toFixed(6)} N`;

            return;
        }

        case "A": {

            const P = getValue("P");
            const F = getValue("F");

            if (
                !Number.isFinite(P) ||
                !Number.isFinite(F)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (P === 0) {
                result.innerHTML =
                    "❌ الضغط لا يمكن أن يساوي صفرًا";
                return;
            }

            answer = F / P;

            result.innerHTML =
                `✅ A = ${answer.toFixed(6)} m²`;

            return;
        }
    }
};
// ==========================================
// 🌊 حاسبة ضغط السائل
// P = ρ × g × h
// ==========================================

window.physicsFluidPressure = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌊 حاسبة ضغط السائل
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            P = ρ × g × h
        </div>

        <div style="margin:6px 0;">
            اختر القيمة المجهولة:
        </div>

        <select id="physicsFluidPressureUnknown"
                style="
                    width:95%;
                    padding:9px;
                    margin-bottom:12px;
                    font-size:14px;
                    direction:ltr;
                ">
            <option value="P">P ضغط السائل</option>
            <option value="rho">ρ كثافة السائل</option>
            <option value="h">h العمق</option>
        </select>

        <div style="margin:6px 0;">
            P ضغط السائل (Pa):
        </div>

        <input id="physicsFluidPressureP"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            ρ كثافة السائل (kg/m³):
        </div>

        <input id="physicsFluidPressureRho"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            g عجلة الجاذبية (m/s²):
        </div>

        <input id="physicsFluidPressureG"
               type="text"
               value="9.80665"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            h العمق (m):
        </div>

        <input id="physicsFluidPressureH"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsFluidPressure()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب ضغط السائل
        </button>

        <div id="physicsFluidPressureResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsFluidPressureP",
        "physicsFluidPressureRho",
        "physicsFluidPressureH"
    ];

    window.activePhysicsField = fields[1];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب ضغط السائل
// ==========================================

window.calculatePhysicsFluidPressure = function () {

    const unknown =
        document.getElementById(
            "physicsFluidPressureUnknown"
        )?.value;

    const result =
        document.getElementById(
            "physicsFluidPressureResult"
        );

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById(
                "physicsFluidPressure" + id
            );

        return Number(element?.value);
    };

    const g = getValue("G");

    if (!Number.isFinite(g) || g <= 0) {

        result.innerHTML =
            "❌ عجلة الجاذبية يجب أن تكون أكبر من صفر";

        return;
    }

    let answer;

    switch (unknown) {

        case "P": {

            const rho = getValue("Rho");
            const h = getValue("H");

            if (
                !Number.isFinite(rho) ||
                !Number.isFinite(h)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";

                return;
            }

            if (rho < 0 || h < 0) {

                result.innerHTML =
                    "❌ الكثافة والعمق لا يمكن أن يكونا سالبين";

                return;
            }

            answer = rho * g * h;

            result.innerHTML =
                `✅ P = ${answer.toFixed(6)} Pa`;

            return;
        }

        case "rho": {

            const P = getValue("P");
            const h = getValue("H");

            if (
                !Number.isFinite(P) ||
                !Number.isFinite(h)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";

                return;
            }

            if (g === 0 || h === 0) {

                result.innerHTML =
                    "❌ لا يمكن القسمة على صفر";

                return;
            }

            answer = P / (g * h);

            result.innerHTML =
                `✅ ρ = ${answer.toFixed(6)} kg/m³`;

            return;
        }

        case "h": {

            const P = getValue("P");
            const rho = getValue("Rho");

            if (
                !Number.isFinite(P) ||
                !Number.isFinite(rho)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";

                return;
            }

            if (rho === 0 || g === 0) {

                result.innerHTML =
                    "❌ لا يمكن القسمة على صفر";

                return;
            }

            answer = P / (rho * g);

            result.innerHTML =
                `✅ h = ${answer.toFixed(6)} m`;

            return;
        }
    }
};
// ==========================================
// 🏗️ حاسبة مبدأ باسكال
// F₁ / A₁ = F₂ / A₂
// ==========================================

window.physicsPascalLaw = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🏗️ حاسبة مبدأ باسكال
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            F₁ / A₁ = F₂ / A₂
        </div>

        <div style="margin:6px 0;">
            اختر القيمة المجهولة:
        </div>

        <select id="physicsPascalUnknown"
                style="
                    width:95%;
                    padding:9px;
                    margin-bottom:12px;
                    font-size:14px;
                    direction:ltr;
                ">
            <option value="F1">F₁ القوة الأولى</option>
            <option value="A1">A₁ المساحة الأولى</option>
            <option value="F2">F₂ القوة الثانية</option>
            <option value="A2">A₂ المساحة الثانية</option>
        </select>

        <div style="margin:6px 0;">
            F₁ القوة الأولى (N):
        </div>

        <input id="physicsPascalF1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            A₁ المساحة الأولى (m²):
        </div>

        <input id="physicsPascalA1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            F₂ القوة الثانية (N):
        </div>

        <input id="physicsPascalF2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            A₂ المساحة الثانية (m²):
        </div>

        <input id="physicsPascalA2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsPascal()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب
        </button>

        <div id="physicsPascalResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsPascalF1",
        "physicsPascalA1",
        "physicsPascalF2",
        "physicsPascalA2"
    ];

    window.activePhysicsField = fields[0];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب مبدأ باسكال
// ==========================================

window.calculatePhysicsPascal = function () {

    const unknown =
        document.getElementById(
            "physicsPascalUnknown"
        )?.value;

    const result =
        document.getElementById(
            "physicsPascalResult"
        );

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById(
                "physicsPascal" + id
            );

        return Number(element?.value);
    };

    let answer;

    switch (unknown) {

        case "F1": {

            const A1 = getValue("A1");
            const F2 = getValue("F2");
            const A2 = getValue("A2");

            if (
                !Number.isFinite(A1) ||
                !Number.isFinite(F2) ||
                !Number.isFinite(A2)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (A2 === 0) {
                result.innerHTML =
                    "❌ A₂ لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = (F2 * A1) / A2;

            result.innerHTML =
                `✅ F₁ = ${answer.toFixed(6)} N`;

            return;
        }

        case "A1": {

            const F1 = getValue("F1");
            const F2 = getValue("F2");
            const A2 = getValue("A2");

            if (
                !Number.isFinite(F1) ||
                !Number.isFinite(F2) ||
                !Number.isFinite(A2)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (F2 === 0) {
                result.innerHTML =
                    "❌ F₂ لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = (F1 * A2) / F2;

            result.innerHTML =
                `✅ A₁ = ${answer.toFixed(6)} m²`;

            return;
        }

        case "F2": {

            const F1 = getValue("F1");
            const A1 = getValue("A1");
            const A2 = getValue("A2");

            if (
                !Number.isFinite(F1) ||
                !Number.isFinite(A1) ||
                !Number.isFinite(A2)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (A1 === 0) {
                result.innerHTML =
                    "❌ A₁ لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = (F1 * A2) / A1;

            result.innerHTML =
                `✅ F₂ = ${answer.toFixed(6)} N`;

            return;
        }

        case "A2": {

            const F1 = getValue("F1");
            const A1 = getValue("A1");
            const F2 = getValue("F2");

            if (
                !Number.isFinite(F1) ||
                !Number.isFinite(A1) ||
                !Number.isFinite(F2)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (F1 === 0) {
                result.innerHTML =
                    "❌ F₁ لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = (F2 * A1) / F1;

            result.innerHTML =
                `✅ A₂ = ${answer.toFixed(6)} m²`;

            return;
        }
    }
};
// ==========================================
// 🚢 حاسبة قوة الطفو
// Fb = ρ × g × V
// ==========================================

window.physicsBuoyantForce = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🚢 حاسبة قوة الطفو
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Fb = ρ × g × V
        </div>

        <div style="margin:6px 0;">
            اختر القيمة المجهولة:
        </div>

        <select id="physicsBuoyantUnknown"
                style="
                    width:95%;
                    padding:9px;
                    margin-bottom:12px;
                    font-size:14px;
                    direction:ltr;
                ">
            <option value="Fb">Fb قوة الطفو</option>
            <option value="rho">ρ كثافة السائل</option>
            <option value="V">V الحجم المزاح</option>
        </select>

        <div style="margin:6px 0;">
            Fb قوة الطفو (N):
        </div>

        <input id="physicsBuoyantFb"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            ρ كثافة السائل (kg/m³):
        </div>

        <input id="physicsBuoyantRho"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            g عجلة الجاذبية (m/s²):
        </div>

        <div style="
            width:90%;
            padding:8px;
            margin-bottom:7px;
            direction:ltr;
            text-align:left;
            font-size:14px;
            border:1px solid #ccc;
        ">
            9.80665
        </div>

        <div style="margin:6px 0;">
            V الحجم المزاح (m³):
        </div>

        <input id="physicsBuoyantV"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsBuoyantForce()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب قوة الطفو
        </button>

        <div id="physicsBuoyantResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsBuoyantFb",
        "physicsBuoyantRho",
        "physicsBuoyantV"
    ];

    window.activePhysicsField = fields[1];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب قوة الطفو
// ==========================================

window.calculatePhysicsBuoyantForce = function () {

    const unknown =
        document.getElementById(
            "physicsBuoyantUnknown"
        )?.value;

    const result =
        document.getElementById(
            "physicsBuoyantResult"
        );

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById(
                "physicsBuoyant" + id
            );

        return Number(element?.value);
    };

    // ثابت عجلة الجاذبية
    const g = 9.80665;

    let answer;

    switch (unknown) {

        case "Fb": {

            const rho = getValue("Rho");
            const V = getValue("V");

            if (
                !Number.isFinite(rho) ||
                !Number.isFinite(V)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (rho < 0 || V < 0) {
                result.innerHTML =
                    "❌ الكثافة والحجم لا يمكن أن يكونا سالبين";
                return;
            }

            answer = rho * g * V;

            result.innerHTML =
                `✅ Fb = ${answer.toFixed(6)} N`;

            return;
        }

        case "rho": {

            const Fb = getValue("Fb");
            const V = getValue("V");

            if (
                !Number.isFinite(Fb) ||
                !Number.isFinite(V)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (g === 0 || V === 0) {
                result.innerHTML =
                    "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer = Fb / (g * V);

            result.innerHTML =
                `✅ ρ = ${answer.toFixed(6)} kg/m³`;

            return;
        }

        case "V": {

            const Fb = getValue("Fb");
            const rho = getValue("Rho");

            if (
                !Number.isFinite(Fb) ||
                !Number.isFinite(rho)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (g === 0 || rho === 0) {
                result.innerHTML =
                    "❌ لا يمكن القسمة على صفر";
                return;
            }

            answer = Fb / (rho * g);

            result.innerHTML =
                `✅ V = ${answer.toFixed(6)} m³`;

            return;
        }
    }
};
// ==========================================
// ⚓ حاسبة مبدأ أرخميدس
// Fb = ρ × g × V
// W = m × g
// ==========================================

window.physicsArchimedes = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚓ حاسبة مبدأ أرخميدس
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Fb = ρ × g × V
        </div>

        <div style="margin:6px 0;">
            كثافة السائل ρ (kg/m³):
        </div>

        <input id="physicsArchimedesRho"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الحجم المزاح V (m³):
        </div>

        <input id="physicsArchimedesV"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            كتلة الجسم m (kg):
        </div>

        <input id="physicsArchimedesM"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="
            margin:8px 0;
            padding:8px;
            text-align:center;
            border:1px solid #ccc;
            direction:ltr;
        ">
            g = 9.80665 m/s²
        </div>

        <button onclick="calculatePhysicsArchimedes()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب
        </button>

        <div id="physicsArchimedesResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsArchimedesRho",
        "physicsArchimedesV",
        "physicsArchimedesM"
    ];

    window.activePhysicsField = fields[0];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب مبدأ أرخميدس
// ==========================================

window.calculatePhysicsArchimedes = function () {

    const result =
        document.getElementById(
            "physicsArchimedesResult"
        );

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById(
                "physicsArchimedes" + id
            );

        return Number(element?.value);
    };

    const rho = getValue("Rho");
    const V = getValue("V");
    const m = getValue("M");

    if (
        !Number.isFinite(rho) ||
        !Number.isFinite(V) ||
        !Number.isFinite(m)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (rho < 0 || V < 0 || m < 0) {
        result.innerHTML =
            "❌ القيم لا يمكن أن تكون سالبة";
        return;
    }

    // عجلة الجاذبية ثابتة
    const g = 9.80665;

    // قوة الطفو
    const Fb = rho * g * V;

    // وزن الجسم
    const W = m * g;

    let state;

    if (Fb > W) {

        state =
            "⬆️ الجسم يميل إلى الطفو";

    } else if (Fb < W) {

        state =
            "⬇️ الجسم يميل إلى الغوص";

    } else {

        state =
            "⚖️ الجسم في حالة اتزان";
    }

    result.innerHTML = `
        <div>✅ Fb = ${Fb.toFixed(6)} N</div>
        <div>⚖️ W = ${W.toFixed(6)} N</div>
        <div style="margin-top:8px;">
            ${state}
        </div>
    `;
};
// ==========================================
// 💨 حاسبة معادلة الاستمرارية
// A₁ × v₁ = A₂ × v₂
// ==========================================

window.physicsContinuity = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            💨 حاسبة معادلة الاستمرارية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            A₁ × v₁ = A₂ × v₂
        </div>

        <div style="margin:6px 0;">
            اختر القيمة المجهولة:
        </div>

        <select id="physicsContinuityUnknown"
                style="
                    width:95%;
                    padding:9px;
                    margin-bottom:12px;
                    font-size:14px;
                    direction:ltr;
                ">
            <option value="A1">A₁ المساحة الأولى</option>
            <option value="v1">v₁ السرعة الأولى</option>
            <option value="A2">A₂ المساحة الثانية</option>
            <option value="v2">v₂ السرعة الثانية</option>
        </select>

        <div style="margin:6px 0;">
            A₁ المساحة الأولى (m²):
        </div>

        <input id="physicsContinuityA1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            v₁ السرعة الأولى (m/s):
        </div>

        <input id="physicsContinuityV1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            A₂ المساحة الثانية (m²):
        </div>

        <input id="physicsContinuityA2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            v₂ السرعة الثانية (m/s):
        </div>

        <input id="physicsContinuityV2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsContinuity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب
        </button>

        <div id="physicsContinuityResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsContinuityA1",
        "physicsContinuityV1",
        "physicsContinuityA2",
        "physicsContinuityV2"
    ];

    window.activePhysicsField = fields[0];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب معادلة الاستمرارية
// ==========================================

window.calculatePhysicsContinuity = function () {

    const unknown =
        document.getElementById(
            "physicsContinuityUnknown"
        )?.value;

    const result =
        document.getElementById(
            "physicsContinuityResult"
        );

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById(
                "physicsContinuity" + id
            );

        return Number(element?.value);
    };

    let answer;

    switch (unknown) {

        case "A1": {

            const v1 = getValue("V1");
            const A2 = getValue("A2");
            const v2 = getValue("V2");

            if (
                !Number.isFinite(v1) ||
                !Number.isFinite(A2) ||
                !Number.isFinite(v2)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (v1 === 0) {
                result.innerHTML =
                    "❌ v₁ لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = (A2 * v2) / v1;

            result.innerHTML =
                `✅ A₁ = ${answer.toFixed(6)} m²`;

            return;
        }

        case "v1": {

            const A1 = getValue("A1");
            const A2 = getValue("A2");
            const v2 = getValue("V2");

            if (
                !Number.isFinite(A1) ||
                !Number.isFinite(A2) ||
                !Number.isFinite(v2)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (A1 === 0) {
                result.innerHTML =
                    "❌ A₁ لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = (A2 * v2) / A1;

            result.innerHTML =
                `✅ v₁ = ${answer.toFixed(6)} m/s`;

            return;
        }

        case "A2": {

            const A1 = getValue("A1");
            const v1 = getValue("V1");
            const v2 = getValue("V2");

            if (
                !Number.isFinite(A1) ||
                !Number.isFinite(v1) ||
                !Number.isFinite(v2)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (v2 === 0) {
                result.innerHTML =
                    "❌ v₂ لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = (A1 * v1) / v2;

            result.innerHTML =
                `✅ A₂ = ${answer.toFixed(6)} m²`;

            return;
        }

        case "v2": {

            const A1 = getValue("A1");
            const v1 = getValue("V1");
            const A2 = getValue("A2");

            if (
                !Number.isFinite(A1) ||
                !Number.isFinite(v1) ||
                !Number.isFinite(A2)
            ) {
                result.innerHTML =
                    "⚠️ أدخل جميع القيم المطلوبة";
                return;
            }

            if (A2 === 0) {
                result.innerHTML =
                    "❌ A₂ لا يمكن أن تساوي صفرًا";
                return;
            }

            answer = (A1 * v1) / A2;

            result.innerHTML =
                `✅ v₂ = ${answer.toFixed(6)} m/s`;

            return;
        }
    }
};// ==========================================
// 🌪️ حاسبة معادلة برنولي
// P₁ + ½ρv₁² + ρgh₁ =
// P₂ + ½ρv₂² + ρgh₂
// ==========================================

window.physicsBernoulli = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌪️ حاسبة معادلة برنولي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            P₁ + ½ρv₁² + ρgh₁ =
            P₂ + ½ρv₂² + ρgh₂
        </div>

        <div style="margin:6px 0;">
            الضغط الأول P₁ (Pa):
        </div>

        <input id="physicsBernoulliP1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الكثافة ρ (kg/m³):
        </div>

        <input id="physicsBernoulliRho"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            السرعة الأولى v₁ (m/s):
        </div>

        <input id="physicsBernoulliV1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            السرعة الثانية v₂ (m/s):
        </div>

        <input id="physicsBernoulliV2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الارتفاع الأول h₁ (m):
        </div>

        <input id="physicsBernoulliH1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الارتفاع الثاني h₂ (m):
        </div>

        <input id="physicsBernoulliH2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="
            width:90%;
            padding:8px;
            margin:5px 0 8px;
            direction:ltr;
            text-align:left;
            font-weight:bold;
            border:1px solid #ccc;
        ">
            g = 9.80665 m/s²
        </div>

        <button onclick="calculatePhysicsBernoulli()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب P₂
        </button>

        <div id="physicsBernoulliResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsBernoulliP1",
        "physicsBernoulliRho",
        "physicsBernoulliV1",
        "physicsBernoulliV2",
        "physicsBernoulliH1",
        "physicsBernoulliH2"
    ];

    window.activePhysicsField = fields[0];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب P₂ من معادلة برنولي
// ==========================================

window.calculatePhysicsBernoulli = function () {

    const result =
        document.getElementById(
            "physicsBernoulliResult"
        );

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById(
                "physicsBernoulli" + id
            );

        return Number(element?.value);
    };

    const P1 = getValue("P1");
    const rho = getValue("Rho");
    const v1 = getValue("V1");
    const v2 = getValue("V2");
    const h1 = getValue("H1");
    const h2 = getValue("H2");

    if (
        !Number.isFinite(P1) ||
        !Number.isFinite(rho) ||
        !Number.isFinite(v1) ||
        !Number.isFinite(v2) ||
        !Number.isFinite(h1) ||
        !Number.isFinite(h2)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (rho <= 0) {
        result.innerHTML =
            "❌ الكثافة يجب أن تكون أكبر من صفر";
        return;
    }

    if (P1 < 0) {
        result.innerHTML =
            "❌ الضغط لا يمكن أن يكون سالبًا";
        return;
    }

    const g = 9.80665;

    const P2 =
        P1
        + 0.5 * rho * (v1 ** 2 - v2 ** 2)
        + rho * g * (h1 - h2);

    result.innerHTML =
        `✅ P₂ = ${P2.toFixed(6)} Pa`;
};
// ==========================================
// 🧭 حاسبة الضغط الجوي
// P = P₀ × (1 - Lh/T₀)^(gM/RL)
// ==========================================

window.physicsAtmosphericPressure = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🧭 حاسبة الضغط الجوي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            الضغط الجوي حسب الارتفاع
        </div>

        <div style="margin:6px 0;">
            الارتفاع h (m):
        </div>

        <input id="physicsAtmosphericHeight"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="
            width:90%;
            padding:8px;
            margin:5px auto;
            direction:ltr;
            text-align:left;
            border:1px solid #ccc;
            font-size:13px;
        ">
            P₀ = 101325 Pa
        </div>

        <div style="
            width:90%;
            padding:8px;
            margin:5px auto;
            direction:ltr;
            text-align:left;
            border:1px solid #ccc;
            font-size:13px;
        ">
            T₀ = 288.15 K
        </div>

        <div style="
            width:90%;
            padding:8px;
            margin:5px auto 8px;
            direction:ltr;
            text-align:left;
            border:1px solid #ccc;
            font-size:13px;
        ">
            L = 0.0065 K/m
        </div>

        <button onclick="calculatePhysicsAtmosphericPressure()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الضغط الجوي
        </button>

        <div id="physicsAtmosphericResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    window.activePhysicsField =
        "physicsAtmosphericHeight";

    document.getElementById(
        "physicsAtmosphericHeight"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsAtmosphericHeight";

        window.physicsWeightNewInput = true;
    });
};


// ==========================================
// 🧮 حساب الضغط الجوي
// ==========================================

window.calculatePhysicsAtmosphericPressure = function () {

    const height =
        Number(
            document.getElementById(
                "physicsAtmosphericHeight"
            )?.value
        );

    const result =
        document.getElementById(
            "physicsAtmosphericResult"
        );

    if (!result) return;

    if (!Number.isFinite(height)) {

        result.innerHTML =
            "⚠️ أدخل الارتفاع";

        return;
    }

    if (height < 0) {

        result.innerHTML =
            "❌ الارتفاع لا يمكن أن يكون سالبًا";

        return;
    }

    // الثوابت
    const P0 = 101325;      // Pa
    const T0 = 288.15;      // K
    const L = 0.0065;       // K/m
    const g = 9.80665;      // m/s²
    const M = 0.0289644;    // kg/mol
    const R = 8.31447;      // J/(mol·K)

    const temperatureFactor =
        1 - (L * height / T0);

    if (temperatureFactor <= 0) {

        result.innerHTML =
            "❌ الارتفاع خارج نطاق هذه المعادلة";

        return;
    }

    const exponent =
        (g * M) / (R * L);

    const pressure =
        P0 *
        Math.pow(
            temperatureFactor,
            exponent
        );

    result.innerHTML =
        `✅ P = ${pressure.toFixed(6)} Pa`;
};
// ==========================================
// 🪣 حاسبة الضغط الكلي في السائل
// P = Pₐ + ρ × g × h
// ==========================================

window.physicsTotalFluidPressure = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🪣 حاسبة الضغط الكلي في السائل
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            P = Pₐ + ρgh
        </div>

        <div style="margin:6px 0;">
            الضغط الجوي Pₐ (Pa):
        </div>

        <input id="physicsTotalPressurePa"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            كثافة السائل ρ (kg/m³):
        </div>

        <input id="physicsTotalPressureRho"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            العمق h (m):
        </div>

        <input id="physicsTotalPressureH"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="
            width:90%;
            padding:8px;
            margin:5px auto 8px;
            direction:ltr;
            text-align:left;
            border:1px solid #ccc;
            font-size:13px;
        ">
            g = 9.80665 m/s²
        </div>

        <button onclick="calculatePhysicsTotalFluidPressure()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الضغط الكلي
        </button>

        <div id="physicsTotalPressureResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsTotalPressurePa",
        "physicsTotalPressureRho",
        "physicsTotalPressureH"
    ];

    window.activePhysicsField = fields[0];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الضغط الكلي
// ==========================================

window.calculatePhysicsTotalFluidPressure = function () {

    const result =
        document.getElementById(
            "physicsTotalPressureResult"
        );

    if (!result) return;

    const getValue = id => {

        const element =
            document.getElementById(
                "physicsTotalPressure" + id
            );

        return Number(element?.value);
    };

    const Pa = getValue("Pa");
    const rho = getValue("Rho");
    const h = getValue("H");

    if (
        !Number.isFinite(Pa) ||
        !Number.isFinite(rho) ||
        !Number.isFinite(h)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (Pa < 0 || rho < 0 || h < 0) {
        result.innerHTML =
            "❌ القيم لا يمكن أن تكون سالبة";
        return;
    }

    // ثابت عجلة الجاذبية
    const g = 9.80665;

    const P =
        Pa + (rho * g * h);

    result.innerHTML =
        `✅ P = ${P.toFixed(6)} Pa`;
};
window.physicsVolumetricFlow = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            💦 حاسبة معدل التدفق الحجمي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Q = V / t
        </div>

        <div style="margin:6px 0;">
            الحجم V (m³):
        </div>

        <input id="physicsFlowV"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الزمن t (s):
        </div>

        <input id="physicsFlowT"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsVolumetricFlow()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب معدل التدفق
        </button>

        <div id="physicsFlowResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    window.activePhysicsField = "physicsFlowV";

    [
        "physicsFlowV",
        "physicsFlowT"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب معدل التدفق الحجمي
// ==========================================

window.calculatePhysicsVolumetricFlow = function () {

    const V = Number(
        document.getElementById("physicsFlowV")?.value
    );

    const t = Number(
        document.getElementById("physicsFlowT")?.value
    );

    const result =
        document.getElementById("physicsFlowResult");

    if (!Number.isFinite(V) || !Number.isFinite(t)) {
        result.innerHTML = "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (V < 0 || t < 0) {
        result.innerHTML = "❌ القيم لا يمكن أن تكون سالبة";
        return;
    }

    if (t === 0) {
        result.innerHTML = "❌ الزمن لا يمكن أن يساوي صفرًا";
        return;
    }

    const Q = V / t;

    result.innerHTML =
        `✅ Q = ${Q.toFixed(6)} m³/s`;
};
// ==========================================
// 🧪 حاسبة اللزوجة
// η = F × L / (A × v)
// ==========================================

window.physicsViscosity = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🧪 حاسبة اللزوجة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            η = F × L / (A × v)
        </div>

        <div style="margin:6px 0;">
            القوة F (N):
        </div>

        <input id="physicsViscosityForce"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            طول طبقة السائل L (m):
        </div>

        <input id="physicsViscosityLength"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            مساحة السطح A (m²):
        </div>

        <input id="physicsViscosityArea"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:7px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            السرعة v (m/s):
        </div>

        <input id="physicsViscosityVelocity"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsViscosity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب اللزوجة
        </button>

        <div id="physicsViscosityResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsFluids()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموائع والضغط
        </button>
    `);

    const fields = [
        "physicsViscosityForce",
        "physicsViscosityLength",
        "physicsViscosityArea",
        "physicsViscosityVelocity"
    ];

    window.activePhysicsField = fields[0];

    fields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب اللزوجة
// ==========================================

window.calculatePhysicsViscosity = function () {

    const F = Number(
        document.getElementById(
            "physicsViscosityForce"
        )?.value
    );

    const L = Number(
        document.getElementById(
            "physicsViscosityLength"
        )?.value
    );

    const A = Number(
        document.getElementById(
            "physicsViscosityArea"
        )?.value
    );

    const v = Number(
        document.getElementById(
            "physicsViscosityVelocity"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsViscosityResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(F) ||
        !Number.isFinite(L) ||
        !Number.isFinite(A) ||
        !Number.isFinite(v)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (F < 0 || L < 0 || A < 0 || v < 0) {
        result.innerHTML =
            "❌ القيم لا يمكن أن تكون سالبة";
        return;
    }

    if (A === 0 || v === 0) {
        result.innerHTML =
            "❌ المساحة والسرعة يجب أن تكونا أكبر من صفر";
        return;
    }

    const eta =
        (F * L) / (A * v);

    result.innerHTML =
        `✅ η = ${eta.toFixed(6)} Pa·s`;
};
// ==========================================
// 🌊 حاسبة سرعة الموجة
// v = f × λ
// ==========================================

window.physicsWaveSpeed = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌊 حاسبة سرعة الموجة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            v = f × λ
        </div>

        <div style="margin:6px 0;">
            التردد f (Hz):
        </div>

        <input id="physicsWaveFrequency"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الطول الموجي λ (m):
        </div>

        <input id="physicsWaveLength"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsWaveSpeed()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب سرعة الموجة
        </button>

        <div id="physicsWaveSpeedResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField = "physicsWaveFrequency";

    [
        "physicsWaveFrequency",
        "physicsWaveLength"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب سرعة الموجة
// ==========================================

window.calculatePhysicsWaveSpeed = function () {

    const f = Number(
        document.getElementById(
            "physicsWaveFrequency"
        )?.value
    );

    const lambda = Number(
        document.getElementById(
            "physicsWaveLength"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsWaveSpeedResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(f) ||
        !Number.isFinite(lambda)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (f < 0 || lambda < 0) {
        result.innerHTML =
            "❌ التردد والطول الموجي لا يمكن أن يكونا سالبين";
        return;
    }

    const v = f * lambda;

    result.innerHTML =
        `✅ v = ${v.toFixed(6)} m/s`;
};
// ==========================================
// 📏 حاسبة الطول الموجي
// λ = v / f
// ==========================================

window.physicsWavelength = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📏 حاسبة الطول الموجي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            λ = v / f
        </div>

        <div style="margin:6px 0;">
            سرعة الموجة v (m/s):
        </div>

        <input id="physicsWavelengthSpeed"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            التردد f (Hz):
        </div>

        <input id="physicsWavelengthFrequency"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsWavelength()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الطول الموجي
        </button>

        <div id="physicsWavelengthResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField = "physicsWavelengthSpeed";

    [
        "physicsWavelengthSpeed",
        "physicsWavelengthFrequency"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الطول الموجي
// ==========================================

window.calculatePhysicsWavelength = function () {

    const v = Number(
        document.getElementById(
            "physicsWavelengthSpeed"
        )?.value
    );

    const f = Number(
        document.getElementById(
            "physicsWavelengthFrequency"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsWavelengthResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(v) ||
        !Number.isFinite(f)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (v < 0 || f < 0) {
        result.innerHTML =
            "❌ السرعة والتردد لا يمكن أن يكونا سالبين";
        return;
    }

    if (f === 0) {
        result.innerHTML =
            "❌ التردد لا يمكن أن يساوي صفرًا";
        return;
    }

    const lambda = v / f;

    result.innerHTML =
        `✅ λ = ${lambda.toFixed(6)} m`;
};
// ==========================================
// 🔄 حاسبة التردد
// f = v / λ
// ==========================================

window.physicsFrequency = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔄 حاسبة التردد
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            f = v / λ
        </div>

        <div style="margin:6px 0;">
            سرعة الموجة v (m/s):
        </div>

        <input id="physicsFrequencySpeed"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الطول الموجي λ (m):
        </div>

        <input id="physicsFrequencyWavelength"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsFrequency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب التردد
        </button>

        <div id="physicsFrequencyResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField = "physicsFrequencySpeed";

    [
        "physicsFrequencySpeed",
        "physicsFrequencyWavelength"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب التردد
// ==========================================

window.calculatePhysicsFrequency = function () {

    const v = Number(
        document.getElementById(
            "physicsFrequencySpeed"
        )?.value
    );

    const lambda = Number(
        document.getElementById(
            "physicsFrequencyWavelength"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsFrequencyResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(v) ||
        !Number.isFinite(lambda)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (v < 0 || lambda < 0) {
        result.innerHTML =
            "❌ السرعة والطول الموجي لا يمكن أن يكونا سالبين";
        return;
    }

    if (lambda === 0) {
        result.innerHTML =
            "❌ الطول الموجي لا يمكن أن يساوي صفرًا";
        return;
    }

    const f = v / lambda;

    result.innerHTML =
        `✅ f = ${f.toFixed(6)} Hz`;
};
// ==========================================
// ⏱️ حاسبة الزمن الدوري
// T = 1 / f
// ==========================================

window.physicsPeriod = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⏱️ حاسبة الزمن الدوري
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            T = 1 / f
        </div>

        <div style="margin:6px 0;">
            التردد f (Hz):
        </div>

        <input id="physicsPeriodFrequency"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsPeriod()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الزمن الدوري
        </button>

        <div id="physicsPeriodResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField = "physicsPeriodFrequency";

    document.getElementById("physicsPeriodFrequency")
        ?.addEventListener("click", () => {

            window.activePhysicsField =
                "physicsPeriodFrequency";

            window.physicsWeightNewInput = true;

        });
};


// ==========================================
// 🧮 حساب الزمن الدوري
// ==========================================

window.calculatePhysicsPeriod = function () {

    const f = Number(
        document.getElementById(
            "physicsPeriodFrequency"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsPeriodResult"
        );

    if (!result) return;

    if (!Number.isFinite(f)) {
        result.innerHTML =
            "⚠️ أدخل التردد";
        return;
    }

    if (f < 0) {
        result.innerHTML =
            "❌ التردد لا يمكن أن يكون سالبًا";
        return;
    }

    if (f === 0) {
        result.innerHTML =
            "❌ التردد لا يمكن أن يساوي صفرًا";
        return;
    }

    const T = 1 / f;

    result.innerHTML =
        `✅ T = ${T.toFixed(6)} s`;
};
// ==========================================
// 📢 حاسبة شدة الصوت
// I = P / A
// ==========================================

window.physicsSoundIntensity = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📢 حاسبة شدة الصوت
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            I = P / A
        </div>

        <div style="margin:6px 0;">
            القدرة P (W):
        </div>

        <input id="physicsSoundPower"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            المساحة A (m²):
        </div>

        <input id="physicsSoundArea"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsSoundIntensity()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب شدة الصوت
        </button>

        <div id="physicsSoundIntensityResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField = "physicsSoundPower";

    [
        "physicsSoundPower",
        "physicsSoundArea"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب شدة الصوت
// ==========================================

window.calculatePhysicsSoundIntensity = function () {

    const P = Number(
        document.getElementById(
            "physicsSoundPower"
        )?.value
    );

    const A = Number(
        document.getElementById(
            "physicsSoundArea"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsSoundIntensityResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(P) ||
        !Number.isFinite(A)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (P < 0 || A < 0) {
        result.innerHTML =
            "❌ القدرة والمساحة لا يمكن أن تكونا سالبتين";
        return;
    }

    if (A === 0) {
        result.innerHTML =
            "❌ المساحة لا يمكن أن تساوي صفرًا";
        return;
    }

    const I = P / A;

    result.innerHTML =
        `✅ I = ${I.toFixed(6)} W/m²`;
};
// ==========================================
// 🔊 حاسبة مستوى شدة الصوت
// β = 10 × log10(I / I₀)
// I₀ = 10⁻¹² W/m²
// ==========================================

window.physicsSoundLevel = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔊 حاسبة مستوى شدة الصوت
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            β = 10 × log₁₀(I / I₀)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            I₀ = 10⁻¹² W/m²
        </div>

        <div style="margin:6px 0;">
            شدة الصوت I (W/m²):
        </div>

        <input id="physicsSoundLevelIntensity"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsSoundLevel()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب مستوى شدة الصوت
        </button>

        <div id="physicsSoundLevelResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField =
        "physicsSoundLevelIntensity";

    document.getElementById(
        "physicsSoundLevelIntensity"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsSoundLevelIntensity";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب مستوى شدة الصوت
// ==========================================

window.calculatePhysicsSoundLevel = function () {

    const I = Number(
        document.getElementById(
            "physicsSoundLevelIntensity"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsSoundLevelResult"
        );

    if (!result) return;

    if (!Number.isFinite(I)) {
        result.innerHTML =
            "⚠️ أدخل شدة الصوت";
        return;
    }

    if (I <= 0) {
        result.innerHTML =
            "❌ شدة الصوت يجب أن تكون أكبر من صفر";
        return;
    }

    // شدة الصوت المرجعية
    const I0 = 1e-12;

    const beta =
        10 * Math.log10(I / I0);

    result.innerHTML =
        `✅ β = ${beta.toFixed(6)} dB`;
};
// ==========================================
// 🎵 حاسبة تردد الموجة
// f = N / t
// ==========================================

window.physicsWaveFrequency = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🎵 حاسبة تردد الموجة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            f = N / t
        </div>

        <div style="margin:6px 0;">
            عدد الذبذبات N:
        </div>

        <input id="physicsWaveCycles"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الزمن t (s):
        </div>

        <input id="physicsWaveCyclesTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsWaveFrequency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب التردد
        </button>

        <div id="physicsWaveFrequencyResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField = "physicsWaveCycles";

    [
        "physicsWaveCycles",
        "physicsWaveCyclesTime"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب تردد الموجة
// ==========================================

window.calculatePhysicsWaveFrequency = function () {

    const N = Number(
        document.getElementById(
            "physicsWaveCycles"
        )?.value
    );

    const t = Number(
        document.getElementById(
            "physicsWaveCyclesTime"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsWaveFrequencyResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(N) ||
        !Number.isFinite(t)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (N < 0 || t < 0) {
        result.innerHTML =
            "❌ القيم لا يمكن أن تكون سالبة";
        return;
    }

    if (t === 0) {
        result.innerHTML =
            "❌ الزمن لا يمكن أن يساوي صفرًا";
        return;
    }

    const f = N / t;

    result.innerHTML =
        `✅ f = ${f.toFixed(6)} Hz`;
};
// ==========================================
// 🪕 حاسبة تردد الوتر
// f = (1 / 2L) × √(T / μ)
// ==========================================

window.physicsStringFrequency = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🪕 حاسبة تردد الوتر
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            f = (1 / 2L) × √(T / μ)
        </div>

        <div style="margin:6px 0;">
            طول الوتر L (m):
        </div>

        <input id="physicsStringLength"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            قوة الشد T (N):
        </div>

        <input id="physicsStringTension"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            الكثافة الخطية μ (kg/m):
        </div>

        <input id="physicsStringLinearDensity"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsStringFrequency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب تردد الوتر
        </button>

        <div id="physicsStringFrequencyResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField = "physicsStringLength";

    [
        "physicsStringLength",
        "physicsStringTension",
        "physicsStringLinearDensity"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب تردد الوتر
// ==========================================

window.calculatePhysicsStringFrequency = function () {

    const L = Number(
        document.getElementById(
            "physicsStringLength"
        )?.value
    );

    const T = Number(
        document.getElementById(
            "physicsStringTension"
        )?.value
    );

    const mu = Number(
        document.getElementById(
            "physicsStringLinearDensity"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsStringFrequencyResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(L) ||
        !Number.isFinite(T) ||
        !Number.isFinite(mu)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (L <= 0 || T < 0 || mu <= 0) {
        result.innerHTML =
            "❌ يجب أن يكون طول الوتر والكثافة الخطية أكبر من صفر، والشد غير سالب";
        return;
    }

    const f =
        (1 / (2 * L)) *
        Math.sqrt(T / mu);

    result.innerHTML =
        `✅ f = ${f.toFixed(6)} Hz`;
};
// ==========================================
// 🌡️ حاسبة سرعة الصوت في الهواء
// v = 331 + 0.6T
// ==========================================

window.physicsSoundSpeed = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌡️ حاسبة سرعة الصوت في الهواء
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            v = 331 + 0.6T
        </div>

        <div style="margin:6px 0;">
            درجة الحرارة T (°C):
        </div>

        <input id="physicsSoundTemperature"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsSoundSpeed()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب سرعة الصوت
        </button>

        <div id="physicsSoundSpeedResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField =
        "physicsSoundTemperature";

    document.getElementById(
        "physicsSoundTemperature"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsSoundTemperature";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب سرعة الصوت
// ==========================================

window.calculatePhysicsSoundSpeed = function () {

    const T = Number(
        document.getElementById(
            "physicsSoundTemperature"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsSoundSpeedResult"
        );

    if (!result) return;

    if (!Number.isFinite(T)) {
        result.innerHTML =
            "⚠️ أدخل درجة الحرارة";
        return;
    }

    const v = 331 + (0.6 * T);

    if (v <= 0) {
        result.innerHTML =
            "❌ درجة الحرارة خارج نطاق هذا التقريب";
        return;
    }

    result.innerHTML =
        `✅ v = ${v.toFixed(6)} m/s`;
};
// ==========================================
// 📡 حاسبة تأثير دوبلر
// f′ = f × (v ± vo) / (v ∓ vs)
// ==========================================

window.physicsDopplerEffect = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📡 حاسبة تأثير دوبلر
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            f′ = f × (v ± vₒ) / (v ∓ vₛ)
        </div>

        <div style="margin:6px 0;">
            تردد المصدر f (Hz):
        </div>

        <input id="physicsDopplerFrequency"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            سرعة الصوت v (m/s):
        </div>

        <input id="physicsDopplerSoundSpeed"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            سرعة المراقب vₒ (m/s):
        </div>

        <input id="physicsDopplerObserverSpeed"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            سرعة المصدر vₛ (m/s):
        </div>

        <input id="physicsDopplerSourceSpeed"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="
            margin:8px 0 6px;
            font-weight:bold;
        ">
            الحالة:
        </div>

        <select id="physicsDopplerDirection"
                style="
                    width:100%;
                    padding:9px;
                    margin-bottom:8px;
                    font-size:14px;
                ">
            <option value="approaching">
                🚗 اقتراب
            </option>

            <option value="receding">
                🚶 ابتعاد
            </option>
        </select>

        <button onclick="calculatePhysicsDopplerEffect()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب التردد المسموع
        </button>

        <div id="physicsDopplerResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField =
        "physicsDopplerFrequency";

    [
        "physicsDopplerFrequency",
        "physicsDopplerSoundSpeed",
        "physicsDopplerObserverSpeed",
        "physicsDopplerSourceSpeed"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب تأثير دوبلر
// ==========================================

window.calculatePhysicsDopplerEffect = function () {

    const f = Number(
        document.getElementById(
            "physicsDopplerFrequency"
        )?.value
    );

    const v = Number(
        document.getElementById(
            "physicsDopplerSoundSpeed"
        )?.value
    );

    const vo = Number(
        document.getElementById(
            "physicsDopplerObserverSpeed"
        )?.value
    );

    const vs = Number(
        document.getElementById(
            "physicsDopplerSourceSpeed"
        )?.value
    );

    const direction =
        document.getElementById(
            "physicsDopplerDirection"
        )?.value;

    const result =
        document.getElementById(
            "physicsDopplerResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(f) ||
        !Number.isFinite(v) ||
        !Number.isFinite(vo) ||
        !Number.isFinite(vs)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (f <= 0 || v <= 0 || vo < 0 || vs < 0) {
        result.innerHTML =
            "❌ تأكد من أن القيم المدخلة صحيحة";
        return;
    }

    let observedFrequency;

    if (direction === "approaching") {

        // اقتراب:
        // البسط يزيد والمقام يقل

        if (vs >= v) {
            result.innerHTML =
                "❌ سرعة المصدر يجب أن تكون أقل من سرعة الصوت";
            return;
        }

        observedFrequency =
            f * (v + vo) / (v - vs);

    } else {

        // ابتعاد:
        // البسط يقل والمقام يزيد

        observedFrequency =
            f * (v - vo) / (v + vs);

        if (v - vo <= 0) {
            result.innerHTML =
                "❌ سرعة المراقب يجب أن تكون أقل من سرعة الصوت";
            return;
        }
    }

    result.innerHTML =
        `✅ f′ = ${observedFrequency.toFixed(6)} Hz`;
};
// ==========================================
// 🎶 حاسبة تردد الرنين
// للأنبوب المفتوح
// fₙ = n × v / (2L)
// ==========================================

window.physicsResonance = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🎶 حاسبة الرنين
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            fₙ = n × v / (2L)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            أنبوب مفتوح من الطرفين
        </div>

        <div style="margin:6px 0;">
            رقم التوافق n:
        </div>

        <input id="physicsResonanceHarmonic"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            سرعة الصوت v (m/s):
        </div>

        <input id="physicsResonanceSoundSpeed"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            طول الأنبوب L (m):
        </div>

        <input id="physicsResonanceLength"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsResonance()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب تردد الرنين
        </button>

        <div id="physicsResonanceResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField =
        "physicsResonanceHarmonic";

    [
        "physicsResonanceHarmonic",
        "physicsResonanceSoundSpeed",
        "physicsResonanceLength"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب تردد الرنين
// ==========================================

window.calculatePhysicsResonance = function () {

    const n = Number(
        document.getElementById(
            "physicsResonanceHarmonic"
        )?.value
    );

    const v = Number(
        document.getElementById(
            "physicsResonanceSoundSpeed"
        )?.value
    );

    const L = Number(
        document.getElementById(
            "physicsResonanceLength"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsResonanceResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(n) ||
        !Number.isFinite(v) ||
        !Number.isFinite(L)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (n <= 0 || v <= 0 || L <= 0) {
        result.innerHTML =
            "❌ يجب أن تكون جميع القيم أكبر من صفر";
        return;
    }

    const f =
        (n * v) / (2 * L);

    result.innerHTML =
        `✅ fₙ = ${f.toFixed(6)} Hz`;
};
// ==========================================
// 🔔 حاسبة التوافقيات
// fₙ = n × f₁
// ==========================================

window.physicsHarmonics = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔔 حاسبة التوافقيات
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            fₙ = n × f₁
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            التوافقية رقم n
        </div>

        <div style="margin:6px 0;">
            التردد الأساسي f₁ (Hz):
        </div>

        <input id="physicsHarmonicsFundamental"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            رقم التوافق n:
        </div>

        <input id="physicsHarmonicsNumber"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsHarmonics()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب التوافقية
        </button>

        <div id="physicsHarmonicsResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsWaves()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للموجات والصوت
        </button>
    `);

    window.activePhysicsField =
        "physicsHarmonicsFundamental";

    [
        "physicsHarmonicsFundamental",
        "physicsHarmonicsNumber"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب التوافقيات
// ==========================================

window.calculatePhysicsHarmonics = function () {

    const f1 = Number(
        document.getElementById(
            "physicsHarmonicsFundamental"
        )?.value
    );

    const n = Number(
        document.getElementById(
            "physicsHarmonicsNumber"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsHarmonicsResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(f1) ||
        !Number.isFinite(n)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (f1 <= 0 || n <= 0) {
        result.innerHTML =
            "❌ يجب أن يكون التردد الأساسي ورقم التوافق أكبر من صفر";
        return;
    }

    if (!Number.isInteger(n)) {
        result.innerHTML =
            "❌ رقم التوافق يجب أن يكون عددًا صحيحًا";
        return;
    }

    const fn = n * f1;

    result.innerHTML =
        `✅ f${n} = ${fn.toFixed(6)} Hz`;
};
// ==========================================
// 🔦 البصريات
// ==========================================

window.openPhysicsOptics = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🔦 البصريات
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:12px;
            font-weight:bold;
        ">
            اختر الحاسبة:
        </div>

        <button onclick="physicsReflectionLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            💡 قانون الانعكاس
        </button>

        <button onclick="physicsRefractiveIndex()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔍 معامل الانكسار
        </button>

        <button onclick="physicsSnellLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📐 قانون سنيل
        </button>

        <button onclick="physicsCriticalAngle()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🌊 الزاوية الحرجة
        </button>

        <button onclick="physicsConvexLens()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔭 العدسة المحدبة
        </button>

        <button onclick="physicsConcaveLens()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔎 العدسة المقعرة
        </button>

        <button onclick="physicsConcaveMirror()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🪞 المرآة المقعرة
        </button>

        <button onclick="physicsConvexMirror()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🪞 المرآة المحدبة
        </button>

        <button onclick="physicsMagnification()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📏 التكبير
        </button>

        <button onclick="physicsLensPower()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔬 قوة العدسة
        </button>

        <button onclick="physicsFocalLength()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            👓 البعد البؤري
        </button>

        <button onclick="physicsLightDispersion()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🌈 تشتت الضوء
        </button>

        <button onclick="openPhysics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:10px;
                ">
            ← رجوع للفيزياء
        </button>
    `);
};
// ==========================================
// 💡 حاسبة قانون الانعكاس
// θᵢ = θᵣ
// ==========================================

window.physicsReflectionLaw = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            💡 حاسبة قانون الانعكاس
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            θᵢ = θᵣ
        </div>

        <div style="margin:6px 0;">
            زاوية السقوط θᵢ (°):
        </div>

        <input id="physicsReflectionIncident"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsReflectionLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب زاوية الانعكاس
        </button>

        <div id="physicsReflectionResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField =
        "physicsReflectionIncident";

    document.getElementById(
        "physicsReflectionIncident"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsReflectionIncident";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب زاوية الانعكاس
// ==========================================

window.calculatePhysicsReflectionLaw = function () {

    const incidentAngle = Number(
        document.getElementById(
            "physicsReflectionIncident"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsReflectionResult"
        );

    if (!result) return;

    if (!Number.isFinite(incidentAngle)) {
        result.innerHTML =
            "⚠️ أدخل زاوية السقوط";
        return;
    }

    if (
        incidentAngle < 0 ||
        incidentAngle > 90
    ) {
        result.innerHTML =
            "❌ زاوية السقوط يجب أن تكون بين 0° و 90°";
        return;
    }

    const reflectedAngle = incidentAngle;

    result.innerHTML =
        `✅ θᵣ = ${reflectedAngle.toFixed(6)}°`;
};
// ==========================================
// 🔍 حاسبة معامل الانكسار
// n = c / v
// c = 299792458 m/s
// ==========================================

window.physicsRefractiveIndex = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔍 حاسبة معامل الانكسار
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            n = c / v
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            c = 299792458 m/s
        </div>

        <div style="margin:6px 0;">
            سرعة الضوء في الوسط v (m/s):
        </div>

        <input id="physicsRefractiveSpeed"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsRefractiveIndex()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب معامل الانكسار
        </button>

        <div id="physicsRefractiveResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField =
        "physicsRefractiveSpeed";

    document.getElementById(
        "physicsRefractiveSpeed"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsRefractiveSpeed";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب معامل الانكسار
// ==========================================

window.calculatePhysicsRefractiveIndex = function () {

    const v = Number(
        document.getElementById(
            "physicsRefractiveSpeed"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsRefractiveResult"
        );

    if (!result) return;

    if (!Number.isFinite(v)) {
        result.innerHTML =
            "⚠️ أدخل سرعة الضوء في الوسط";
        return;
    }

    if (v <= 0) {
        result.innerHTML =
            "❌ سرعة الضوء يجب أن تكون أكبر من صفر";
        return;
    }

    const c = 299792458;

    const n = c / v;

    result.innerHTML =
        `✅ n = ${n.toFixed(6)}`;
};
// ==========================================
// 📐 حاسبة قانون سنيل
// n₁ sin(θ₁) = n₂ sin(θ₂)
// ==========================================

window.physicsSnellLaw = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📐 حاسبة قانون سنيل
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            n₁ sin(θ₁) = n₂ sin(θ₂)
        </div>

        <div style="margin:6px 0;">
            معامل الانكسار n₁:
        </div>

        <input id="physicsSnellN1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            زاوية السقوط θ₁ (°):
        </div>

        <input id="physicsSnellAngle1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            معامل الانكسار n₂:
        </div>

        <input id="physicsSnellN2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsSnellLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب زاوية الانكسار
        </button>

        <div id="physicsSnellResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField = "physicsSnellN1";

    [
        "physicsSnellN1",
        "physicsSnellAngle1",
        "physicsSnellN2"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب قانون سنيل
// ==========================================

window.calculatePhysicsSnellLaw = function () {

    const n1 = Number(
        document.getElementById(
            "physicsSnellN1"
        )?.value
    );

    const angle1 = Number(
        document.getElementById(
            "physicsSnellAngle1"
        )?.value
    );

    const n2 = Number(
        document.getElementById(
            "physicsSnellN2"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsSnellResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(n1) ||
        !Number.isFinite(angle1) ||
        !Number.isFinite(n2)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (
        n1 <= 0 ||
        n2 <= 0
    ) {
        result.innerHTML =
            "❌ معاملا الانكسار يجب أن يكونا أكبر من صفر";
        return;
    }

    if (
        angle1 < 0 ||
        angle1 > 90
    ) {
        result.innerHTML =
            "❌ زاوية السقوط يجب أن تكون بين 0° و 90°";
        return;
    }

    // تحويل الدرجة إلى راديان
    const angle1Rad =
        angle1 * Math.PI / 180;

    const sinAngle2 =
        (n1 * Math.sin(angle1Rad)) / n2;

    // لا يوجد انكسار: يحدث انعكاس كلي داخلي
    if (sinAngle2 > 1) {
        result.innerHTML =
            "⚠️ لا توجد زاوية انكسار — يحدث انعكاس كلي داخلي";
        return;
    }

    const angle2Rad =
        Math.asin(sinAngle2);

    const angle2 =
        angle2Rad * 180 / Math.PI;

    result.innerHTML =
        `✅ θ₂ = ${angle2.toFixed(6)}°`;
};
// ==========================================
// 🌊 حاسبة الزاوية الحرجة
// θc = sin⁻¹(n₂ / n₁)
// ==========================================

window.physicsCriticalAngle = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌊 حاسبة الزاوية الحرجة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            θc = sin⁻¹(n₂ / n₁)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            يجب أن يكون n₁ أكبر من n₂
        </div>

        <div style="margin:6px 0;">
            معامل الانكسار n₁:
        </div>

        <input id="physicsCriticalN1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            معامل الانكسار n₂:
        </div>

        <input id="physicsCriticalN2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsCriticalAngle()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الزاوية الحرجة
        </button>

        <div id="physicsCriticalResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField = "physicsCriticalN1";

    [
        "physicsCriticalN1",
        "physicsCriticalN2"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الزاوية الحرجة
// ==========================================

window.calculatePhysicsCriticalAngle = function () {

    const n1 = Number(
        document.getElementById(
            "physicsCriticalN1"
        )?.value
    );

    const n2 = Number(
        document.getElementById(
            "physicsCriticalN2"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsCriticalResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(n1) ||
        !Number.isFinite(n2)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (n1 <= 0 || n2 <= 0) {
        result.innerHTML =
            "❌ معاملا الانكسار يجب أن يكونا أكبر من صفر";
        return;
    }

    if (n1 <= n2) {
        result.innerHTML =
            "❌ يجب أن يكون n₁ أكبر من n₂";
        return;
    }

    const ratio = n2 / n1;

    // للتأكد من صلاحية القيمة قبل asin
    if (ratio < 0 || ratio > 1) {
        result.innerHTML =
            "❌ لا توجد زاوية حرجة لهذه القيم";
        return;
    }

    const criticalAngleRad =
        Math.asin(ratio);

    const criticalAngle =
        criticalAngleRad * 180 / Math.PI;

    result.innerHTML =
        `✅ θc = ${criticalAngle.toFixed(6)}°`;
};
// ==========================================
// 🔭 حاسبة العدسة المحدبة
// 1/f = 1/do + 1/di
// ==========================================

window.physicsConvexLens = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔭 حاسبة العدسة المحدبة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            1/f = 1/do + 1/di
        </div>

        <div style="margin:6px 0;">
            البعد البؤري f (cm):
        </div>

        <input id="physicsConvexLensF"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            بعد الجسم do (cm):
        </div>

        <input id="physicsConvexLensDo"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsConvexLens()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب بعد الصورة
        </button>

        <div id="physicsConvexLensResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField = "physicsConvexLensF";

    [
        "physicsConvexLensF",
        "physicsConvexLensDo"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب بعد الصورة في العدسة المحدبة
// ==========================================

window.calculatePhysicsConvexLens = function () {

    const f = Number(
        document.getElementById(
            "physicsConvexLensF"
        )?.value
    );

    const doValue = Number(
        document.getElementById(
            "physicsConvexLensDo"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsConvexLensResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(f) ||
        !Number.isFinite(doValue)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (f <= 0 || doValue <= 0) {
        result.innerHTML =
            "❌ يجب أن تكون القيم أكبر من صفر";
        return;
    }

    // عند do = f لا تتكون صورة حقيقية على مسافة محددة
    if (doValue === f) {
        result.innerHTML =
            "⚠️ الجسم عند البؤرة — الصورة عند اللانهاية";
        return;
    }

    const di =
        (f * doValue) / (doValue - f);

    result.innerHTML =
        `✅ di = ${di.toFixed(6)} cm`;
};
// ==========================================
// 🔎 حاسبة العدسة المقعرة
// 1/f = 1/do + 1/di
// ==========================================

window.physicsConcaveLens = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔎 حاسبة العدسة المقعرة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            1/f = 1/do + 1/di
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            للعدسة المقعرة: f تكون سالبة
        </div>

        <div style="margin:6px 0;">
            البعد البؤري f (cm):
        </div>

        <input id="physicsConcaveLensF"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            بعد الجسم do (cm):
        </div>

        <input id="physicsConcaveLensDo"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsConcaveLens()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب بعد الصورة
        </button>

        <div id="physicsConcaveLensResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField = "physicsConcaveLensF";

    [
        "physicsConcaveLensF",
        "physicsConcaveLensDo"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب بعد الصورة في العدسة المقعرة
// ==========================================

window.calculatePhysicsConcaveLens = function () {

    const f = Number(
        document.getElementById(
            "physicsConcaveLensF"
        )?.value
    );

    const doValue = Number(
        document.getElementById(
            "physicsConcaveLensDo"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsConcaveLensResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(f) ||
        !Number.isFinite(doValue)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (f >= 0) {
        result.innerHTML =
            "❌ في العدسة المقعرة يجب أن يكون f سالبًا";
        return;
    }

    if (doValue <= 0) {
        result.innerHTML =
            "❌ يجب أن يكون بعد الجسم أكبر من صفر";
        return;
    }

    const denominator =
        doValue - f;

    if (denominator === 0) {
        result.innerHTML =
            "⚠️ لا يمكن حساب بعد الصورة لهذه القيم";
        return;
    }

    const di =
        (f * doValue) / denominator;

    result.innerHTML =
        `✅ di = ${di.toFixed(6)} cm`;
};
// ==========================================
// 🪞 حاسبة المرآة المقعرة
// 1/f = 1/do + 1/di
// ==========================================

window.physicsConcaveMirror = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🪞 حاسبة المرآة المقعرة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            1/f = 1/do + 1/di
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            المرآة المقعرة: f موجبة
        </div>

        <div style="margin:6px 0;">
            البعد البؤري f (cm):
        </div>

        <input id="physicsConcaveMirrorF"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            بعد الجسم do (cm):
        </div>

        <input id="physicsConcaveMirrorDo"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsConcaveMirror()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب بعد الصورة
        </button>

        <div id="physicsConcaveMirrorResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField =
        "physicsConcaveMirrorF";

    [
        "physicsConcaveMirrorF",
        "physicsConcaveMirrorDo"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب بعد الصورة في المرآة المقعرة
// ==========================================

window.calculatePhysicsConcaveMirror = function () {

    const f = Number(
        document.getElementById(
            "physicsConcaveMirrorF"
        )?.value
    );

    const doValue = Number(
        document.getElementById(
            "physicsConcaveMirrorDo"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsConcaveMirrorResult"
        );

    if (!result) return;

    if (!Number.isFinite(f) ||
        !Number.isFinite(doValue)) {

        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";

        return;
    }

    if (f <= 0 || doValue <= 0) {

        result.innerHTML =
            "❌ يجب أن تكون القيم أكبر من صفر";

        return;
    }

    if (doValue === f) {

        result.innerHTML =
            "⚠️ الجسم عند البؤرة — الصورة عند اللانهاية";

        return;
    }

    const di =
        (f * doValue) /
        (doValue - f);

    result.innerHTML =
        `✅ di = ${di.toFixed(6)} cm`;
};
// ==========================================
// 🪞 حاسبة المرآة المحدبة
// 1/f = 1/do + 1/di
// ==========================================

window.physicsConvexMirror = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🪞 حاسبة المرآة المحدبة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            1/f = 1/do + 1/di
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            المرآة المحدبة: f سالبة
        </div>

        <div style="margin:6px 0;">
            البعد البؤري f (cm):
        </div>

        <input id="physicsConvexMirrorF"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            بعد الجسم do (cm):
        </div>

        <input id="physicsConvexMirrorDo"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsConvexMirror()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب بعد الصورة
        </button>

        <div id="physicsConvexMirrorResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField =
        "physicsConvexMirrorF";

    [
        "physicsConvexMirrorF",
        "physicsConvexMirrorDo"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب بعد الصورة في المرآة المحدبة
// ==========================================

window.calculatePhysicsConvexMirror = function () {

    const f = Number(
        document.getElementById(
            "physicsConvexMirrorF"
        )?.value
    );

    const doValue = Number(
        document.getElementById(
            "physicsConvexMirrorDo"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsConvexMirrorResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(f) ||
        !Number.isFinite(doValue)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (f >= 0) {
        result.innerHTML =
            "❌ في المرآة المحدبة يجب أن يكون f سالبًا";
        return;
    }

    if (doValue <= 0) {
        result.innerHTML =
            "❌ يجب أن يكون بعد الجسم أكبر من صفر";
        return;
    }

    const denominator =
        doValue - f;

    if (denominator === 0) {
        result.innerHTML =
            "⚠️ لا يمكن حساب بعد الصورة لهذه القيم";
        return;
    }

    const di =
        (f * doValue) /
        denominator;

    result.innerHTML =
        `✅ di = ${di.toFixed(6)} cm`;
};
// ==========================================
// 📏 حاسبة التكبير
// m = hᵢ / hₒ
// ==========================================

window.physicsMagnification = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📏 حاسبة التكبير
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            m = hᵢ / hₒ
        </div>

        <div style="margin:6px 0;">
            طول الصورة hᵢ (cm):
        </div>

        <input id="physicsMagnificationHi"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            طول الجسم hₒ (cm):
        </div>

        <input id="physicsMagnificationHo"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsMagnification()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب التكبير
        </button>

        <div id="physicsMagnificationResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField =
        "physicsMagnificationHi";

    [
        "physicsMagnificationHi",
        "physicsMagnificationHo"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب التكبير
// ==========================================

window.calculatePhysicsMagnification = function () {

    const hi = Number(
        document.getElementById(
            "physicsMagnificationHi"
        )?.value
    );

    const ho = Number(
        document.getElementById(
            "physicsMagnificationHo"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsMagnificationResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(hi) ||
        !Number.isFinite(ho)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (ho === 0) {
        result.innerHTML =
            "❌ طول الجسم لا يمكن أن يساوي صفرًا";
        return;
    }

    const m = hi / ho;

    result.innerHTML =
        `✅ m = ${m.toFixed(6)}`;
};
// ==========================================
// 🔬 حاسبة قوة العدسة
// P = 1 / f
// f بالمتر
// ==========================================

window.physicsLensPower = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔬 حاسبة قوة العدسة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            P = 1 / f
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            f بالمتر (m) — P بالديوبتر (D)
        </div>

        <div style="margin:6px 0;">
            البعد البؤري f (m):
        </div>

        <input id="physicsLensPowerF"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsLensPower()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب قوة العدسة
        </button>

        <div id="physicsLensPowerResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField =
        "physicsLensPowerF";

    document.getElementById(
        "physicsLensPowerF"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsLensPowerF";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب قوة العدسة
// ==========================================

window.calculatePhysicsLensPower = function () {

    const f = Number(
        document.getElementById(
            "physicsLensPowerF"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsLensPowerResult"
        );

    if (!result) return;

    if (!Number.isFinite(f)) {
        result.innerHTML =
            "⚠️ أدخل البعد البؤري";
        return;
    }

    if (f === 0) {
        result.innerHTML =
            "❌ البعد البؤري لا يمكن أن يساوي صفرًا";
        return;
    }

    const P = 1 / f;

    result.innerHTML =
        `✅ P = ${P.toFixed(6)} D`;
};
// ==========================================
// 👓 حاسبة البعد البؤري
// f = 1 / P
// P بالديوبتر
// f بالمتر
// ==========================================

window.physicsFocalLength = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            👓 حاسبة البعد البؤري
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            f = 1 / P
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            P بالديوبتر (D) — f بالمتر (m)
        </div>

        <div style="margin:6px 0;">
            قوة العدسة P (D):
        </div>

        <input id="physicsFocalPower"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsFocalLength()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب البعد البؤري
        </button>

        <div id="physicsFocalResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField =
        "physicsFocalPower";

    document.getElementById(
        "physicsFocalPower"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsFocalPower";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب البعد البؤري
// ==========================================

window.calculatePhysicsFocalLength = function () {

    const P = Number(
        document.getElementById(
            "physicsFocalPower"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsFocalResult"
        );

    if (!result) return;

    if (!Number.isFinite(P)) {
        result.innerHTML =
            "⚠️ أدخل قوة العدسة";
        return;
    }

    if (P === 0) {
        result.innerHTML =
            "❌ قوة العدسة لا يمكن أن تساوي صفرًا";
        return;
    }

    const f = 1 / P;

    result.innerHTML =
        `✅ f = ${f.toFixed(6)} m`;
};
// ==========================================
// 🌈 حاسبة تشتت الضوء في المنشور
// زاوية الانحراف الأدنى
//
// δₘ = 2 sin⁻¹(n sin(A/2)) − A
// ==========================================

window.physicsLightDispersion = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌈 تشتت الضوء في المنشور
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            δₘ = 2 sin⁻¹(n sin(A/2)) − A
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            احسب زاوية الانحراف الأدنى
        </div>

        <div style="margin:6px 0;">
            معامل الانكسار n:
        </div>

        <input id="physicsDispersionN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <div style="margin:6px 0;">
            زاوية رأس المنشور A (°):
        </div>

        <input id="physicsDispersionA"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
                   font-size:14px;
               ">

        <button onclick="calculatePhysicsLightDispersion()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب زاوية الانحراف
        </button>

        <div id="physicsDispersionResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsOptics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للبصريات
        </button>
    `);

    window.activePhysicsField =
        "physicsDispersionN";

    [
        "physicsDispersionN",
        "physicsDispersionA"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب زاوية الانحراف الأدنى
// ==========================================

window.calculatePhysicsLightDispersion = function () {

    const n = Number(
        document.getElementById(
            "physicsDispersionN"
        )?.value
    );

    const A = Number(
        document.getElementById(
            "physicsDispersionA"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsDispersionResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(n) ||
        !Number.isFinite(A)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (n <= 0) {
        result.innerHTML =
            "❌ معامل الانكسار يجب أن يكون أكبر من صفر";
        return;
    }

    if (A <= 0 || A >= 180) {
        result.innerHTML =
            "❌ زاوية رأس المنشور يجب أن تكون بين 0° و 180°";
        return;
    }

    // تحويل A/2 من درجة إلى راديان
    const halfAngleRad =
        (A / 2) * Math.PI / 180;

    const value =
        n * Math.sin(halfAngleRad);

    // منع asin من استقبال قيمة غير صالحة
    if (value > 1 || value < -1) {
        result.innerHTML =
            "❌ القيم لا تسمح بحدوث الانحراف الأدنى بهذه المعادلة";
        return;
    }

    const deviationRad =
        2 * Math.asin(value) -
        halfAngleRad * 2;

    const deviation =
        deviationRad * 180 / Math.PI;

    result.innerHTML =
        `✅ δₘ = ${deviation.toFixed(6)}°`;
};
// ==========================================
// 🧲 الفيزياء - المغناطيسية
// ==========================================

window.openPhysicsMagnetism = function () {

    window.activePhysicsField = null;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🧲 المغناطيسية
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:12px;
            font-weight:bold;
        ">
            اختر الحاسبة:
        </div>

        <button onclick="physicsMagneticForce()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🧲 القوة المغناطيسية
        </button>

        <button onclick="physicsLorentzForce()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚡ قوة لورنتز
        </button>

        <button onclick="physicsWireMagneticField()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔌 المجال المغناطيسي حول سلك
        </button>

        <button onclick="physicsCircularLoopField()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔄 المجال داخل ملف دائري
        </button>

        <button onclick="physicsSolenoidField()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🌀 المجال داخل ملف لولبي
        </button>

        <button onclick="physicsParallelWiresForce()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📐 القوة بين سلكين متوازيين
        </button>

        <button onclick="physicsInducedEMF()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚡ القوة الدافعة المستحثة
        </button>

        <button onclick="physicsFaradayLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔁 قانون فاراداي
        </button>

        <button onclick="physicsLenzLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🧭 قانون لنز
        </button>

        <button onclick="physicsMagneticFlux()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔋 الفيض المغناطيسي
        </button>

        <button onclick="physicsMagneticDipoleTorque()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔄 عزم ثنائي القطب المغناطيسي
        </button>

        <button onclick="physicsChargedParticleRadius()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚙️ نصف قطر مسار جسيم مشحون
        </button>

        <button onclick="openPhysics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:10px;
                ">
            ← رجوع للفيزياء
        </button>
    `);
};
// ==========================================
// 🧲 حاسبة القوة المغناطيسية
// F = B × I × L × sin(θ)
// ==========================================

window.physicsMagneticForce = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🧲 حاسبة القوة المغناطيسية
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            F = B × I × L × sin(θ)
        </div>

        <div style="margin:6px 0;">
            المجال المغناطيسي B (T):
        </div>

        <input id="physicsMagneticB"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            شدة التيار I (A):
        </div>

        <input id="physicsMagneticI"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            طول السلك L (m):
        </div>

        <input id="physicsMagneticL"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الزاوية θ (°):
        </div>

        <input id="physicsMagneticTheta"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsMagneticForce()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب القوة
        </button>

        <div id="physicsMagneticForceResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsMagneticB";

    [
        "physicsMagneticB",
        "physicsMagneticI",
        "physicsMagneticL",
        "physicsMagneticTheta"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب القوة المغناطيسية
// ==========================================

window.calculatePhysicsMagneticForce = function () {

    const B = Number(
        document.getElementById(
            "physicsMagneticB"
        )?.value
    );

    const I = Number(
        document.getElementById(
            "physicsMagneticI"
        )?.value
    );

    const L = Number(
        document.getElementById(
            "physicsMagneticL"
        )?.value
    );

    const theta = Number(
        document.getElementById(
            "physicsMagneticTheta"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsMagneticForceResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(B) ||
        !Number.isFinite(I) ||
        !Number.isFinite(L) ||
        !Number.isFinite(theta)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (B < 0 || I < 0 || L < 0) {
        result.innerHTML =
            "❌ B و I و L لا يمكن أن تكون سالبة";
        return;
    }

    if (theta < 0 || theta > 180) {
        result.innerHTML =
            "❌ الزاوية يجب أن تكون بين 0° و 180°";
        return;
    }

    const thetaRad =
        theta * Math.PI / 180;

    const F =
        B * I * L * Math.sin(thetaRad);

    result.innerHTML =
        `✅ F = ${F.toFixed(6)} N`;
};
// ==========================================
// ⚡ حاسبة قوة لورنتز
// F = q × v × B × sin(θ)
// ==========================================

window.physicsLorentzForce = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚡ حاسبة قوة لورنتز
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            F = q × v × B × sin(θ)
        </div>

        <div style="margin:6px 0;">
            الشحنة q (C):
        </div>

        <input id="physicsLorentzQ"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            السرعة v (m/s):
        </div>

        <input id="physicsLorentzV"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            المجال المغناطيسي B (T):
        </div>

        <input id="physicsLorentzB"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الزاوية θ (°):
        </div>

        <input id="physicsLorentzTheta"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsLorentzForce()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب القوة
        </button>

        <div id="physicsLorentzResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsLorentzQ";

    [
        "physicsLorentzQ",
        "physicsLorentzV",
        "physicsLorentzB",
        "physicsLorentzTheta"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب قوة لورنتز
// ==========================================

window.calculatePhysicsLorentzForce = function () {

    const q = Number(
        document.getElementById(
            "physicsLorentzQ"
        )?.value
    );

    const v = Number(
        document.getElementById(
            "physicsLorentzV"
        )?.value
    );

    const B = Number(
        document.getElementById(
            "physicsLorentzB"
        )?.value
    );

    const theta = Number(
        document.getElementById(
            "physicsLorentzTheta"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsLorentzResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(q) ||
        !Number.isFinite(v) ||
        !Number.isFinite(B) ||
        !Number.isFinite(theta)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (v < 0 || B < 0) {
        result.innerHTML =
            "❌ السرعة والمجال المغناطيسي لا يمكن أن يكونا سالبين";
        return;
    }

    if (theta < 0 || theta > 180) {
        result.innerHTML =
            "❌ الزاوية يجب أن تكون بين 0° و 180°";
        return;
    }

    const thetaRad =
        theta * Math.PI / 180;

    const F =
        Math.abs(q) *
        v *
        B *
        Math.sin(thetaRad);

    result.innerHTML =
        `✅ F = ${F.toFixed(6)} N`;
};
// ==========================================
// 🔌 المجال المغناطيسي حول سلك مستقيم
// B = μ₀ I / (2πr)
// ==========================================

window.physicsWireMagneticField = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔌 المجال المغناطيسي حول سلك
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            B = μ₀ I / (2πr)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            μ₀ = 4π × 10⁻⁷ T·m/A
        </div>

        <div style="margin:6px 0;">
            شدة التيار I (A):
        </div>

        <input id="physicsWireBCurrent"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            المسافة r (m):
        </div>

        <input id="physicsWireBRadius"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsWireMagneticField()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب المجال المغناطيسي
        </button>

        <div id="physicsWireBResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsWireBCurrent";

    [
        "physicsWireBCurrent",
        "physicsWireBRadius"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب المجال المغناطيسي حول السلك
// ==========================================

window.calculatePhysicsWireMagneticField = function () {

    const I = Number(
        document.getElementById(
            "physicsWireBCurrent"
        )?.value
    );

    const r = Number(
        document.getElementById(
            "physicsWireBRadius"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsWireBResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(I) ||
        !Number.isFinite(r)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (I < 0) {
        result.innerHTML =
            "❌ شدة التيار لا يمكن أن تكون سالبة";
        return;
    }

    if (r <= 0) {
        result.innerHTML =
            "❌ المسافة يجب أن تكون أكبر من صفر";
        return;
    }

    const mu0 =
        4 * Math.PI * 1e-7;

    const B =
        (mu0 * I) /
        (2 * Math.PI * r);

    result.innerHTML =
        `✅ B = ${B.toFixed(6)} T`;
};
// ==========================================
// 🔄 المجال المغناطيسي عند مركز ملف دائري
// B = μ₀ N I / (2R)
// ==========================================

window.physicsCircularLoopField = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔄 المجال المغناطيسي لملف دائري
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            B = μ₀ N I / (2R)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            μ₀ = 4π × 10⁻⁷ T·m/A
        </div>

        <div style="margin:6px 0;">
            عدد اللفات N:
        </div>

        <input id="physicsLoopN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            شدة التيار I (A):
        </div>

        <input id="physicsLoopI"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            نصف القطر R (m):
        </div>

        <input id="physicsLoopR"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsCircularLoopField()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب المجال المغناطيسي
        </button>

        <div id="physicsLoopResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsLoopN";

    [
        "physicsLoopN",
        "physicsLoopI",
        "physicsLoopR"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب المجال المغناطيسي للملف الدائري
// ==========================================

window.calculatePhysicsCircularLoopField = function () {

    const N = Number(
        document.getElementById(
            "physicsLoopN"
        )?.value
    );

    const I = Number(
        document.getElementById(
            "physicsLoopI"
        )?.value
    );

    const R = Number(
        document.getElementById(
            "physicsLoopR"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsLoopResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(N) ||
        !Number.isFinite(I) ||
        !Number.isFinite(R)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (N <= 0) {
        result.innerHTML =
            "❌ عدد اللفات يجب أن يكون أكبر من صفر";
        return;
    }

    if (I < 0) {
        result.innerHTML =
            "❌ شدة التيار لا يمكن أن تكون سالبة";
        return;
    }

    if (R <= 0) {
        result.innerHTML =
            "❌ نصف القطر يجب أن يكون أكبر من صفر";
        return;
    }

    const mu0 =
        4 * Math.PI * 1e-7;

    const B =
        (mu0 * N * I) /
        (2 * R);

    result.innerHTML =
        `✅ B = ${B.toFixed(6)} T`;
};
// ==========================================
// 🌀 المجال المغناطيسي داخل ملف لولبي
// B = μ₀ N I / L
// ==========================================

window.physicsSolenoidField = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌀 المجال المغناطيسي داخل ملف لولبي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            B = μ₀ N I / L
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            μ₀ = 4π × 10⁻⁷ T·m/A
        </div>

        <div style="margin:6px 0;">
            عدد اللفات N:
        </div>

        <input id="physicsSolenoidN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            شدة التيار I (A):
        </div>

        <input id="physicsSolenoidI"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            طول الملف L (m):
        </div>

        <input id="physicsSolenoidL"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsSolenoidField()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب المجال المغناطيسي
        </button>

        <div id="physicsSolenoidResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsSolenoidN";

    [
        "physicsSolenoidN",
        "physicsSolenoidI",
        "physicsSolenoidL"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب المجال المغناطيسي للملف اللولبي
// ==========================================

window.calculatePhysicsSolenoidField = function () {

    const N = Number(
        document.getElementById(
            "physicsSolenoidN"
        )?.value
    );

    const I = Number(
        document.getElementById(
            "physicsSolenoidI"
        )?.value
    );

    const L = Number(
        document.getElementById(
            "physicsSolenoidL"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsSolenoidResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(N) ||
        !Number.isFinite(I) ||
        !Number.isFinite(L)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (N <= 0) {
        result.innerHTML =
            "❌ عدد اللفات يجب أن يكون أكبر من صفر";
        return;
    }

    if (I < 0) {
        result.innerHTML =
            "❌ شدة التيار لا يمكن أن تكون سالبة";
        return;
    }

    if (L <= 0) {
        result.innerHTML =
            "❌ طول الملف يجب أن يكون أكبر من صفر";
        return;
    }

    const mu0 =
        4 * Math.PI * 1e-7;

    const B =
        (mu0 * N * I) /
        L;

    result.innerHTML =
        `✅ B = ${B.toFixed(6)} T`;
};
// ==========================================
// 📐 القوة بين سلكين متوازيين
// F = μ₀ I₁ I₂ L / (2πd)
// ==========================================

window.physicsParallelWiresForce = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📐 القوة بين سلكين متوازيين
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            F = μ₀ I₁ I₂ L / (2πd)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            μ₀ = 4π × 10⁻⁷ T·m/A
        </div>

        <div style="margin:6px 0;">
            التيار الأول I₁ (A):
        </div>

        <input id="physicsParallelI1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            التيار الثاني I₂ (A):
        </div>

        <input id="physicsParallelI2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            طول السلك L (m):
        </div>

        <input id="physicsParallelL"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            المسافة بين السلكين d (m):
        </div>

        <input id="physicsParallelD"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsParallelWiresForce()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب القوة
        </button>

        <div id="physicsParallelResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsParallelI1";

    [
        "physicsParallelI1",
        "physicsParallelI2",
        "physicsParallelL",
        "physicsParallelD"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب القوة بين السلكين
// ==========================================

window.calculatePhysicsParallelWiresForce = function () {

    const I1 = Number(
        document.getElementById(
            "physicsParallelI1"
        )?.value
    );

    const I2 = Number(
        document.getElementById(
            "physicsParallelI2"
        )?.value
    );

    const L = Number(
        document.getElementById(
            "physicsParallelL"
        )?.value
    );

    const d = Number(
        document.getElementById(
            "physicsParallelD"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsParallelResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(I1) ||
        !Number.isFinite(I2) ||
        !Number.isFinite(L) ||
        !Number.isFinite(d)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (I1 < 0 || I2 < 0) {
        result.innerHTML =
            "❌ شدة التيار لا يمكن أن تكون سالبة";
        return;
    }

    if (L <= 0) {
        result.innerHTML =
            "❌ طول السلك يجب أن يكون أكبر من صفر";
        return;
    }

    if (d <= 0) {
        result.innerHTML =
            "❌ المسافة بين السلكين يجب أن تكون أكبر من صفر";
        return;
    }

    const mu0 =
        4 * Math.PI * 1e-7;

    const F =
        (mu0 * I1 * I2 * L) /
        (2 * Math.PI * d);

    result.innerHTML =
        `✅ F = ${F.toFixed(6)} N`;
};
// ==========================================
// ⚡ القوة الدافعة الكهربية المستحثة
// ε = N × ΔΦ / Δt
// ==========================================

window.physicsInducedEMF = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚡ القوة الدافعة الكهربية المستحثة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            ε = N × ΔΦ / Δt
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            ε بالفولت (V) — ΔΦ بالويبر (Wb)
        </div>

        <div style="margin:6px 0;">
            عدد اللفات N:
        </div>

        <input id="physicsEMFN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            التغير في الفيض ΔΦ (Wb):
        </div>

        <input id="physicsEMFFlux"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            التغير في الزمن Δt (s):
        </div>

        <input id="physicsEMFTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsInducedEMF()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب القوة الدافعة
        </button>

        <div id="physicsEMFResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsEMFN";

    [
        "physicsEMFN",
        "physicsEMFFlux",
        "physicsEMFTime"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب القوة الدافعة المستحثة
// ==========================================

window.calculatePhysicsInducedEMF = function () {

    const N = Number(
        document.getElementById(
            "physicsEMFN"
        )?.value
    );

    const deltaFlux = Number(
        document.getElementById(
            "physicsEMFFlux"
        )?.value
    );

    const deltaTime = Number(
        document.getElementById(
            "physicsEMFTime"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsEMFResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(N) ||
        !Number.isFinite(deltaFlux) ||
        !Number.isFinite(deltaTime)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (N <= 0) {
        result.innerHTML =
            "❌ عدد اللفات يجب أن يكون أكبر من صفر";
        return;
    }

    if (deltaTime <= 0) {
        result.innerHTML =
            "❌ التغير في الزمن يجب أن يكون أكبر من صفر";
        return;
    }

    const emf =
        Math.abs(N * deltaFlux / deltaTime);

    result.innerHTML =
        `✅ ε = ${emf.toFixed(6)} V`;
};
// ==========================================
// 🔁 حاسبة قانون فاراداي
// ΔΦ/Δt = ε / N
// ==========================================

window.physicsFaradayLaw = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔁 حاسبة قانون فاراداي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            ε = N × ΔΦ / Δt
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            احسب معدل تغير الفيض المغناطيسي
        </div>

        <div style="margin:6px 0;">
            القوة الدافعة المستحثة ε (V):
        </div>

        <input id="physicsFaradayEMF"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            عدد اللفات N:
        </div>

        <input id="physicsFaradayN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsFaradayLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب معدل تغير الفيض
        </button>

        <div id="physicsFaradayResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField =
        "physicsFaradayEMF";

    [
        "physicsFaradayEMF",
        "physicsFaradayN"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب معدل تغير الفيض
// ==========================================

window.calculatePhysicsFaradayLaw = function () {

    const emf = Number(
        document.getElementById(
            "physicsFaradayEMF"
        )?.value
    );

    const N = Number(
        document.getElementById(
            "physicsFaradayN"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsFaradayResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(emf) ||
        !Number.isFinite(N)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (emf < 0) {
        result.innerHTML =
            "❌ القوة الدافعة لا يمكن أن تكون سالبة";
        return;
    }

    if (N <= 0) {
        result.innerHTML =
            "❌ عدد اللفات يجب أن يكون أكبر من صفر";
        return;
    }

    const rate =
        emf / N;

    result.innerHTML =
        `✅ ΔΦ/Δt = ${rate.toFixed(6)} Wb/s`;
};
// ==========================================
// 🧭 حاسبة قانون لنز
// ε = -N × ΔΦ / Δt
// ==========================================

window.physicsLenzLaw = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🧭 حاسبة قانون لنز
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            ε = −N × ΔΦ / Δt
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            الإشارة السالبة تمثل اتجاه المقاومة للتغير
        </div>

        <div style="margin:6px 0;">
            عدد اللفات N:
        </div>

        <input id="physicsLenzN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            التغير في الفيض ΔΦ (Wb):
        </div>

        <input id="physicsLenzFlux"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            التغير في الزمن Δt (s):
        </div>

        <input id="physicsLenzTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsLenzLaw()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب القوة الدافعة
        </button>

        <div id="physicsLenzResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsLenzN";

    [
        "physicsLenzN",
        "physicsLenzFlux",
        "physicsLenzTime"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب قانون لنز
// ==========================================

window.calculatePhysicsLenzLaw = function () {

    const N = Number(
        document.getElementById(
            "physicsLenzN"
        )?.value
    );

    const deltaFlux = Number(
        document.getElementById(
            "physicsLenzFlux"
        )?.value
    );

    const deltaTime = Number(
        document.getElementById(
            "physicsLenzTime"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsLenzResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(N) ||
        !Number.isFinite(deltaFlux) ||
        !Number.isFinite(deltaTime)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (N <= 0) {
        result.innerHTML =
            "❌ عدد اللفات يجب أن يكون أكبر من صفر";
        return;
    }

    if (deltaTime <= 0) {
        result.innerHTML =
            "❌ التغير في الزمن يجب أن يكون أكبر من صفر";
        return;
    }

    const emf =
        -(N * deltaFlux / deltaTime);

    result.innerHTML =
        `✅ ε = ${emf.toFixed(6)} V`;
};
// ==========================================
// 🔋 حاسبة الفيض المغناطيسي
// Φ = B × A × cos(θ)
// ==========================================

window.physicsMagneticFlux = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔋 حاسبة الفيض المغناطيسي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Φ = B × A × cos(θ)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            Φ بالويبر (Wb)
        </div>

        <div style="margin:6px 0;">
            المجال المغناطيسي B (T):
        </div>

        <input id="physicsFluxB"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            المساحة A (m²):
        </div>

        <input id="physicsFluxArea"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الزاوية θ (°):
        </div>

        <input id="physicsFluxTheta"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsMagneticFlux()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الفيض
        </button>

        <div id="physicsFluxResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsFluxB";

    [
        "physicsFluxB",
        "physicsFluxArea",
        "physicsFluxTheta"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الفيض المغناطيسي
// ==========================================

window.calculatePhysicsMagneticFlux = function () {

    const B = Number(
        document.getElementById(
            "physicsFluxB"
        )?.value
    );

    const A = Number(
        document.getElementById(
            "physicsFluxArea"
        )?.value
    );

    const theta = Number(
        document.getElementById(
            "physicsFluxTheta"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsFluxResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(B) ||
        !Number.isFinite(A) ||
        !Number.isFinite(theta)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (B < 0) {
        result.innerHTML =
            "❌ المجال المغناطيسي لا يمكن أن يكون سالبًا";
        return;
    }

    if (A < 0) {
        result.innerHTML =
            "❌ المساحة لا يمكن أن تكون سالبة";
        return;
    }

    if (theta < 0 || theta > 180) {
        result.innerHTML =
            "❌ الزاوية يجب أن تكون بين 0° و 180°";
        return;
    }

    const thetaRad =
        theta * Math.PI / 180;

    const flux =
        B * A * Math.cos(thetaRad);

    result.innerHTML =
        `✅ Φ = ${flux.toFixed(6)} Wb`;
};
// ==========================================
// 🔄 عزم ثنائي القطب المغناطيسي
// τ = N × I × A × B × sin(θ)
// ==========================================

window.physicsMagneticDipoleTorque = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔄 عزم ثنائي القطب المغناطيسي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            τ = N × I × A × B × sin(θ)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            τ بوحدة N·m
        </div>

        <div style="margin:6px 0;">
            عدد اللفات N:
        </div>

        <input id="physicsTorqueN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            شدة التيار I (A):
        </div>

        <input id="physicsTorqueI"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            مساحة الملف A (m²):
        </div>

        <input id="physicsTorqueArea"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            المجال المغناطيسي B (T):
        </div>

        <input id="physicsTorqueB"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الزاوية θ (°):
        </div>

        <input id="physicsTorqueTheta"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsMagneticDipoleTorque()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب العزم
        </button>

        <div id="physicsTorqueResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsTorqueN";

    [
        "physicsTorqueN",
        "physicsTorqueI",
        "physicsTorqueArea",
        "physicsTorqueB",
        "physicsTorqueTheta"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب العزم
// ==========================================

window.calculatePhysicsMagneticDipoleTorque = function () {

    const N = Number(
        document.getElementById(
            "physicsTorqueN"
        )?.value
    );

    const I = Number(
        document.getElementById(
            "physicsTorqueI"
        )?.value
    );

    const A = Number(
        document.getElementById(
            "physicsTorqueArea"
        )?.value
    );

    const B = Number(
        document.getElementById(
            "physicsTorqueB"
        )?.value
    );

    const theta = Number(
        document.getElementById(
            "physicsTorqueTheta"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsTorqueResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(N) ||
        !Number.isFinite(I) ||
        !Number.isFinite(A) ||
        !Number.isFinite(B) ||
        !Number.isFinite(theta)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (N <= 0) {
        result.innerHTML =
            "❌ عدد اللفات يجب أن يكون أكبر من صفر";
        return;
    }

    if (I < 0 || A < 0 || B < 0) {
        result.innerHTML =
            "❌ I و A و B لا يمكن أن تكون سالبة";
        return;
    }

    if (theta < 0 || theta > 180) {
        result.innerHTML =
            "❌ الزاوية يجب أن تكون بين 0° و 180°";
        return;
    }

    const thetaRad =
        theta * Math.PI / 180;

    const torque =
        N * I * A * B *
        Math.sin(thetaRad);

    result.innerHTML =
        `✅ τ = ${torque.toFixed(6)} N·m`;
};
// ==========================================
// ⚙️ نصف قطر مسار جسيم مشحون
// r = m × v / (|q| × B)
// ==========================================

window.physicsChargedParticleRadius = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚙️ نصف قطر مسار جسيم مشحون
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            r = m × v / (|q| × B)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            r بالمتر (m)
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsParticleMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            السرعة v (m/s):
        </div>

        <input id="physicsParticleVelocity"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الشحنة q (C):
        </div>

        <input id="physicsParticleCharge"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            المجال المغناطيسي B (T):
        </div>

        <input id="physicsParticleB"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsChargedParticleRadius()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب نصف القطر
        </button>

        <div id="physicsParticleRadiusResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsMagnetism()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للمغناطيسية
        </button>
    `);

    window.activePhysicsField = "physicsParticleMass";

    [
        "physicsParticleMass",
        "physicsParticleVelocity",
        "physicsParticleCharge",
        "physicsParticleB"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب نصف قطر المسار
// ==========================================

window.calculatePhysicsChargedParticleRadius = function () {

    const m = Number(
        document.getElementById(
            "physicsParticleMass"
        )?.value
    );

    const v = Number(
        document.getElementById(
            "physicsParticleVelocity"
        )?.value
    );

    const q = Number(
        document.getElementById(
            "physicsParticleCharge"
        )?.value
    );

    const B = Number(
        document.getElementById(
            "physicsParticleB"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsParticleRadiusResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(m) ||
        !Number.isFinite(v) ||
        !Number.isFinite(q) ||
        !Number.isFinite(B)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (m <= 0) {
        result.innerHTML =
            "❌ الكتلة يجب أن تكون أكبر من صفر";
        return;
    }

    if (v < 0) {
        result.innerHTML =
            "❌ السرعة لا يمكن أن تكون سالبة";
        return;
    }

    if (q === 0) {
        result.innerHTML =
            "❌ الشحنة لا يمكن أن تساوي صفرًا";
        return;
    }

    if (B <= 0) {
        result.innerHTML =
            "❌ المجال المغناطيسي يجب أن يكون أكبر من صفر";
        return;
    }

    const radius =
        (m * v) /
        (Math.abs(q) * B);

    result.innerHTML =
        `✅ r = ${radius.toFixed(6)} m`;
};
// ==========================================
// ⚛️ الفيزياء الحديثة
// ==========================================

window.openPhysicsModern = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ⚛️ الفيزياء الحديثة
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:12px;
            font-weight:bold;
        ">
            اختر الحاسبة:
        </div>

        <button onclick="physicsPhotonEnergy()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚛️ طاقة الفوتون
        </button>

        <button onclick="physicsDeBroglieWavelength()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🌊 طول موجة دي برولي
        </button>

        <button onclick="physicsPhotonFrequency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            💡 تردد الفوتون
        </button>

        <button onclick="physicsWorkFunction()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🔋 دالة الشغل
        </button>

        <button onclick="physicsMaxKineticEnergy()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚡ طاقة الحركة القصوى للإلكترون
        </button>

        <button onclick="physicsStoppingPotential()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            🛑 جهد الإيقاف
        </button>

        <button onclick="physicsComptonEffect()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            📡 تأثير كومبتون
        </button>

        <button onclick="physicsRadioactiveDecay()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ☢️ قانون الاضمحلال الإشعاعي
        </button>

        <button onclick="physicsHalfLife()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⏳ العمر النصفي
        </button>

        <button onclick="physicsNuclearBindingEnergy()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ⚛️ طاقة الربط النووي
        </button>

        <button onclick="physicsMassDefect()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            💥 نقص الكتلة
        </button>

        <button onclick="physicsMassEnergyEquivalence()"
                style="
                    width:100%;
                    padding:10px;
                    margin:3px 0;
                ">
            ☀️ تكافؤ الكتلة والطاقة
        </button>

        <button onclick="openPhysics()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:10px;
                ">
            ← رجوع للفيزياء
        </button>
    `);
};
// ==========================================
// ⚛️ طاقة الفوتون
// E = h × f
// ==========================================

window.physicsPhotonEnergy = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚛️ طاقة الفوتون
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            E = h × f
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            h = 6.62607015 × 10⁻³⁴ J·s
        </div>

        <div style="margin:6px 0;">
            التردد f (Hz):
        </div>

        <input id="physicsPhotonFrequency"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsPhotonEnergy()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الطاقة
        </button>

        <div id="physicsPhotonEnergyResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsPhotonFrequency";

    document.getElementById(
        "physicsPhotonFrequency"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsPhotonFrequency";

        window.physicsWeightNewInput = true;
    });
};


// ==========================================
// 🧮 حساب طاقة الفوتون
// ==========================================

window.calculatePhysicsPhotonEnergy = function () {

    const f = Number(
        document.getElementById(
            "physicsPhotonFrequency"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsPhotonEnergyResult"
        );

    if (!result) return;

    if (!Number.isFinite(f)) {
        result.innerHTML =
            "⚠️ أدخل التردد";
        return;
    }

    if (f < 0) {
        result.innerHTML =
            "❌ التردد لا يمكن أن يكون سالبًا";
        return;
    }

    const h =
        6.62607015e-34;

    const E =
        h * f;

    result.innerHTML =
        `✅ E = ${E.toExponential(6)} J`;
};
// ==========================================
// 🌊 طول موجة دي برولي
// λ = h / (m × v)
// ==========================================

window.physicsDeBroglieWavelength = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌊 طول موجة دي برولي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            λ = h / (m × v)
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            h = 6.62607015 × 10⁻³⁴ J·s
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsDeBroglieMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            السرعة v (m/s):
        </div>

        <input id="physicsDeBroglieVelocity"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsDeBroglieWavelength()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب طول الموجة
        </button>

        <div id="physicsDeBroglieResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsDeBroglieMass";

    [
        "physicsDeBroglieMass",
        "physicsDeBroglieVelocity"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب طول موجة دي برولي
// ==========================================

window.calculatePhysicsDeBroglieWavelength = function () {

    const m = Number(
        document.getElementById(
            "physicsDeBroglieMass"
        )?.value
    );

    const v = Number(
        document.getElementById(
            "physicsDeBroglieVelocity"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsDeBroglieResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(m) ||
        !Number.isFinite(v)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (m <= 0) {
        result.innerHTML =
            "❌ الكتلة يجب أن تكون أكبر من صفر";
        return;
    }

    if (v <= 0) {
        result.innerHTML =
            "❌ السرعة يجب أن تكون أكبر من صفر";
        return;
    }

    const h =
        6.62607015e-34;

    const wavelength =
        h / (m * v);

    result.innerHTML =
        `✅ λ = ${wavelength.toExponential(6)} m`;
};
// ==========================================
// 💡 تردد الفوتون
// f = E / h
// ==========================================

window.physicsPhotonFrequency = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            💡 تردد الفوتون
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            f = E / h
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            h = 6.62607015 × 10⁻³⁴ J·s
        </div>

        <div style="margin:6px 0;">
            طاقة الفوتون E (J):
        </div>

        <input id="physicsPhotonFreqEnergy"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsPhotonFrequency()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب التردد
        </button>

        <div id="physicsPhotonFreqResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsPhotonFreqEnergy";

    document.getElementById(
        "physicsPhotonFreqEnergy"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsPhotonFreqEnergy";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب تردد الفوتون
// ==========================================

window.calculatePhysicsPhotonFrequency = function () {

    const E = Number(
        document.getElementById(
            "physicsPhotonFreqEnergy"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsPhotonFreqResult"
        );

    if (!result) return;

    if (!Number.isFinite(E)) {
        result.innerHTML =
            "⚠️ أدخل طاقة الفوتون";
        return;
    }

    if (E < 0) {
        result.innerHTML =
            "❌ طاقة الفوتون لا يمكن أن تكون سالبة";
        return;
    }

    const h =
        6.62607015e-34;

    const frequency =
        E / h;

    result.innerHTML =
        `✅ f = ${frequency.toExponential(6)} Hz`;
};
// ==========================================
// 🔋 دالة الشغل
// φ = h × f₀
// ==========================================

window.physicsWorkFunction = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🔋 دالة الشغل
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            φ = h × f₀
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            h = 6.62607015 × 10⁻³⁴ J·s
        </div>

        <div style="margin:6px 0;">
            تردد العتبة f₀ (Hz):
        </div>

        <input id="physicsWorkFunctionThreshold"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsWorkFunction()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب دالة الشغل
        </button>

        <div id="physicsWorkFunctionResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsWorkFunctionThreshold";

    document.getElementById(
        "physicsWorkFunctionThreshold"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsWorkFunctionThreshold";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب دالة الشغل
// ==========================================

window.calculatePhysicsWorkFunction = function () {

    const f0 = Number(
        document.getElementById(
            "physicsWorkFunctionThreshold"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsWorkFunctionResult"
        );

    if (!result) return;

    if (!Number.isFinite(f0)) {
        result.innerHTML =
            "⚠️ أدخل تردد العتبة";
        return;
    }

    if (f0 < 0) {
        result.innerHTML =
            "❌ تردد العتبة لا يمكن أن يكون سالبًا";
        return;
    }

    const h =
        6.62607015e-34;

    const workFunction =
        h * f0;

    result.innerHTML =
        `✅ φ = ${workFunction.toExponential(6)} J`;
};
// ==========================================
// ⚡ طاقة الحركة القصوى للإلكترون
// Kmax = h × f - φ
// ==========================================

window.physicsMaxKineticEnergy = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚡ طاقة الحركة القصوى للإلكترون
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Kₘₐₓ = h × f − φ
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            h = 6.62607015 × 10⁻³⁴ J·s
        </div>

        <div style="margin:6px 0;">
            التردد f (Hz):
        </div>

        <input id="physicsKmaxFrequency"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            دالة الشغل φ (J):
        </div>

        <input id="physicsKmaxWorkFunction"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsMaxKineticEnergy()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب طاقة الحركة القصوى
        </button>

        <div id="physicsKmaxResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsKmaxFrequency";

    [
        "physicsKmaxFrequency",
        "physicsKmaxWorkFunction"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب طاقة الحركة القصوى
// ==========================================

window.calculatePhysicsMaxKineticEnergy = function () {

    const f = Number(
        document.getElementById(
            "physicsKmaxFrequency"
        )?.value
    );

    const phi = Number(
        document.getElementById(
            "physicsKmaxWorkFunction"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsKmaxResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(f) ||
        !Number.isFinite(phi)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (f < 0) {
        result.innerHTML =
            "❌ التردد لا يمكن أن يكون سالبًا";
        return;
    }

    if (phi < 0) {
        result.innerHTML =
            "❌ دالة الشغل لا يمكن أن تكون سالبة";
        return;
    }

    const h =
        6.62607015e-34;

    const energy =
        (h * f) - phi;

    if (energy < 0) {
        result.innerHTML =
            "⚠️ لا توجد طاقة حركة قصوى: طاقة الفوتون أقل من دالة الشغل";
        return;
    }

    result.innerHTML =
        `✅ Kₘₐₓ = ${energy.toExponential(6)} J`;
};
// ==========================================
// 🛑 جهد الإيقاف
// Vs = Kmax / e
// ==========================================

window.physicsStoppingPotential = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🛑 جهد الإيقاف
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Vₛ = Kₘₐₓ / e
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            e = 1.602176634 × 10⁻¹⁹ C
        </div>

        <div style="margin:6px 0;">
            طاقة الحركة القصوى Kₘₐₓ (J):
        </div>

        <input id="physicsStoppingKmax"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsStoppingPotential()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب جهد الإيقاف
        </button>

        <div id="physicsStoppingResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsStoppingKmax";

    document.getElementById(
        "physicsStoppingKmax"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsStoppingKmax";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب جهد الإيقاف
// ==========================================

window.calculatePhysicsStoppingPotential = function () {

    const Kmax = Number(
        document.getElementById(
            "physicsStoppingKmax"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsStoppingResult"
        );

    if (!result) return;

    if (!Number.isFinite(Kmax)) {
        result.innerHTML =
            "⚠️ أدخل طاقة الحركة القصوى";
        return;
    }

    if (Kmax < 0) {
        result.innerHTML =
            "❌ طاقة الحركة لا يمكن أن تكون سالبة";
        return;
    }

    const e =
        1.602176634e-19;

    const stoppingPotential =
        Kmax / e;

    result.innerHTML =
        `✅ Vₛ = ${stoppingPotential.toFixed(6)} V`;
};
// ==========================================
// 📡 تأثير كومبتون
// λ′ = λ + (h / (mₑ × c)) × (1 − cos θ)
// ==========================================

window.physicsComptonEffect = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📡 تأثير كومبتون
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            λ′ = λ + (h / (mₑ × c)) × (1 − cos θ)
        </div>

        <div style="
            text-align:center;
            font-size:12px;
            margin-bottom:10px;
        ">
            h = 6.62607015 × 10⁻³⁴ J·s
            <br>
            mₑ = 9.1093837139 × 10⁻³¹ kg
            <br>
            c = 299792458 m/s
        </div>

        <div style="margin:6px 0;">
            الطول الموجي الابتدائي λ (m):
        </div>

        <input id="physicsComptonLambda"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            زاوية التشتت θ (°):
        </div>

        <input id="physicsComptonTheta"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsComptonEffect()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الطول الموجي بعد التصادم
        </button>

        <div id="physicsComptonResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsComptonLambda";

    [
        "physicsComptonLambda",
        "physicsComptonTheta"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب تأثير كومبتون
// ==========================================

window.calculatePhysicsComptonEffect = function () {

    const lambda = Number(
        document.getElementById(
            "physicsComptonLambda"
        )?.value
    );

    const theta = Number(
        document.getElementById(
            "physicsComptonTheta"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsComptonResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(lambda) ||
        !Number.isFinite(theta)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (lambda < 0) {
        result.innerHTML =
            "❌ الطول الموجي لا يمكن أن يكون سالبًا";
        return;
    }

    if (theta < 0 || theta > 180) {
        result.innerHTML =
            "❌ الزاوية يجب أن تكون بين 0° و 180°";
        return;
    }

    const h =
        6.62607015e-34;

    const me =
        9.1093837139e-31;

    const c =
        299792458;

    const thetaRad =
        theta * Math.PI / 180;

    const comptonWavelength =
        h / (me * c);

    const deltaLambda =
        comptonWavelength *
        (1 - Math.cos(thetaRad));

    const lambdaPrime =
        lambda + deltaLambda;

    result.innerHTML =
        `✅ λ′ = ${lambdaPrime.toExponential(6)} m`;
};
// ==========================================
// ☢️ قانون الاضمحلال الإشعاعي
// N = N₀ × (1/2)^(t / T½)
// ==========================================

window.physicsRadioactiveDecay = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ☢️ قانون الاضمحلال الإشعاعي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            N = N₀ × (1/2)^(t / T½)
        </div>

        <div style="margin:6px 0;">
            العدد الابتدائي N₀:
        </div>

        <input id="physicsDecayInitial"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الزمن t:
        </div>

        <input id="physicsDecayTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            العمر النصفي T½:
        </div>

        <input id="physicsDecayHalfLife"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsRadioactiveDecay()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب العدد المتبقي
        </button>

        <div id="physicsDecayResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsDecayInitial";

    [
        "physicsDecayInitial",
        "physicsDecayTime",
        "physicsDecayHalfLife"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب الاضمحلال
// ==========================================

window.calculatePhysicsRadioactiveDecay = function () {

    const N0 = Number(
        document.getElementById(
            "physicsDecayInitial"
        )?.value
    );

    const t = Number(
        document.getElementById(
            "physicsDecayTime"
        )?.value
    );

    const halfLife = Number(
        document.getElementById(
            "physicsDecayHalfLife"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsDecayResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(N0) ||
        !Number.isFinite(t) ||
        !Number.isFinite(halfLife)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (N0 < 0) {
        result.innerHTML =
            "❌ العدد الابتدائي لا يمكن أن يكون سالبًا";
        return;
    }

    if (t < 0) {
        result.innerHTML =
            "❌ الزمن لا يمكن أن يكون سالبًا";
        return;
    }

    if (halfLife <= 0) {
        result.innerHTML =
            "❌ العمر النصفي يجب أن يكون أكبر من صفر";
        return;
    }

    const remaining =
        N0 * Math.pow(
            0.5,
            t / halfLife
        );

    result.innerHTML =
        `✅ N = ${remaining.toFixed(6)}`;
};
// ==========================================
// ⏳ العمر النصفي
// T½ = t × ln(2) / ln(N₀ / N)
// ==========================================

window.physicsHalfLife = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⏳ العمر النصفي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            T½ = t × ln(2) / ln(N₀ / N)
        </div>

        <div style="margin:6px 0;">
            العدد الابتدائي N₀:
        </div>

        <input id="physicsHalfLifeInitial"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            العدد المتبقي N:
        </div>

        <input id="physicsHalfLifeRemaining"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <div style="margin:6px 0;">
            الزمن t:
        </div>

        <input id="physicsHalfLifeTime"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsHalfLife()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب العمر النصفي
        </button>

        <div id="physicsHalfLifeResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsHalfLifeInitial";

    [
        "physicsHalfLifeInitial",
        "physicsHalfLifeRemaining",
        "physicsHalfLifeTime"
    ].forEach(id => {

        document.getElementById(id)
            ?.addEventListener("click", () => {

                window.activePhysicsField = id;
                window.physicsWeightNewInput = true;

            });

    });
};


// ==========================================
// 🧮 حساب العمر النصفي
// ==========================================

window.calculatePhysicsHalfLife = function () {

    const N0 = Number(
        document.getElementById(
            "physicsHalfLifeInitial"
        )?.value
    );

    const N = Number(
        document.getElementById(
            "physicsHalfLifeRemaining"
        )?.value
    );

    const t = Number(
        document.getElementById(
            "physicsHalfLifeTime"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsHalfLifeResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(N0) ||
        !Number.isFinite(N) ||
        !Number.isFinite(t)
    ) {
        result.innerHTML =
            "⚠️ أدخل جميع القيم المطلوبة";
        return;
    }

    if (N0 <= 0) {
        result.innerHTML =
            "❌ N₀ يجب أن يكون أكبر من صفر";
        return;
    }

    if (N <= 0 || N >= N0) {
        result.innerHTML =
            "❌ يجب أن يكون 0 < N < N₀";
        return;
    }

    if (t < 0) {
        result.innerHTML =
            "❌ الزمن لا يمكن أن يكون سالبًا";
        return;
    }

    const halfLife =
        (t * Math.log(2)) /
        Math.log(N0 / N);

    result.innerHTML =
        `✅ T½ = ${halfLife.toFixed(6)} s`;
};
// ==========================================
// ⚛️ طاقة الربط النووي
// Eb = Δm × c²
// Δm بوحدة u
// ==========================================

window.physicsNuclearBindingEnergy = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ⚛️ طاقة الربط النووي
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Eᵦ = Δm × c²
        </div>

        <div style="
            text-align:center;
            font-size:12px;
            margin-bottom:10px;
        ">
            1 u = 1.66053906660 × 10⁻²⁷ kg
            <br>
            c = 299792458 m/s
        </div>

        <div style="margin:6px 0;">
            نقص الكتلة Δm (u):
        </div>

        <input id="physicsBindingMassDefect"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsNuclearBindingEnergy()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب طاقة الربط
        </button>

        <div id="physicsBindingEnergyResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsBindingMassDefect";

    document.getElementById(
        "physicsBindingMassDefect"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsBindingMassDefect";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب طاقة الربط النووي
// ==========================================

window.calculatePhysicsNuclearBindingEnergy = function () {

    const massDefectU = Number(
        document.getElementById(
            "physicsBindingMassDefect"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsBindingEnergyResult"
        );

    if (!result) return;

    if (!Number.isFinite(massDefectU)) {
        result.innerHTML =
            "⚠️ أدخل نقص الكتلة";
        return;
    }

    if (massDefectU < 0) {
        result.innerHTML =
            "❌ نقص الكتلة لا يمكن أن يكون سالبًا";
        return;
    }

    const u =
        1.66053906660e-27;

    const c =
        299792458;

    const massDefectKg =
        massDefectU * u;

    const bindingEnergy =
        massDefectKg * c * c;

    result.innerHTML =
        `✅ Eᵦ = ${bindingEnergy.toExponential(6)} J`;
};
// ==========================================
// 💥 نقص الكتلة
// Δm = E / c²
// الناتج بوحدة u
// ==========================================

window.physicsMassDefect = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            💥 نقص الكتلة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            Δm = E / c²
        </div>

        <div style="
            text-align:center;
            font-size:12px;
            margin-bottom:10px;
        ">
            c = 299792458 m/s
            <br>
            1 u = 1.66053906660 × 10⁻²⁷ kg
        </div>

        <div style="margin:6px 0;">
            الطاقة E (J):
        </div>

        <input id="physicsMassDefectEnergy"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsMassDefect()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب نقص الكتلة
        </button>

        <div id="physicsMassDefectResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsMassDefectEnergy";

    document.getElementById(
        "physicsMassDefectEnergy"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsMassDefectEnergy";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب نقص الكتلة
// ==========================================

window.calculatePhysicsMassDefect = function () {

    const energy = Number(
        document.getElementById(
            "physicsMassDefectEnergy"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsMassDefectResult"
        );

    if (!result) return;

    if (!Number.isFinite(energy)) {
        result.innerHTML =
            "⚠️ أدخل الطاقة";
        return;
    }

    if (energy < 0) {
        result.innerHTML =
            "❌ الطاقة لا يمكن أن تكون سالبة";
        return;
    }

    const c =
        299792458;

    const u =
        1.66053906660e-27;

    const massKg =
        energy / (c * c);

    const massU =
        massKg / u;

    result.innerHTML =
        `✅ Δm = ${massU.toFixed(6)} u`;
};
// ==========================================
// ☀️ تكافؤ الكتلة والطاقة
// E = m × c²
// m بالكيلوجرام
// E بالجول
// ==========================================

window.physicsMassEnergyEquivalence = function () {

    window.activePhysicsField = null;
    window.physicsWeightNewInput = true;

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            ☀️ تكافؤ الكتلة والطاقة
        </div>

        <div style="
            text-align:center;
            margin-bottom:12px;
            font-weight:bold;
        ">
            E = m × c²
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            c = 299792458 m/s
        </div>

        <div style="margin:6px 0;">
            الكتلة m (kg):
        </div>

        <input id="physicsMassEnergyMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   margin-bottom:8px;
                   direction:ltr;
                   text-align:left;
               ">

        <button onclick="calculatePhysicsMassEnergyEquivalence()"
                style="
                    width:100%;
                    padding:10px;
                    margin:4px 0;
                ">
            🧮 احسب الطاقة
        </button>

        <div id="physicsMassEnergyResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openPhysicsModern()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            ← رجوع للفيزياء الحديثة
        </button>
    `);

    window.activePhysicsField =
        "physicsMassEnergyMass";

    document.getElementById(
        "physicsMassEnergyMass"
    )?.addEventListener("click", () => {

        window.activePhysicsField =
            "physicsMassEnergyMass";

        window.physicsWeightNewInput = true;

    });
};


// ==========================================
// 🧮 حساب تكافؤ الكتلة والطاقة
// ==========================================

window.calculatePhysicsMassEnergyEquivalence = function () {

    const mass = Number(
        document.getElementById(
            "physicsMassEnergyMass"
        )?.value
    );

    const result =
        document.getElementById(
            "physicsMassEnergyResult"
        );

    if (!result) return;

    if (!Number.isFinite(mass)) {
        result.innerHTML =
            "⚠️ أدخل الكتلة";
        return;
    }

    if (mass < 0) {
        result.innerHTML =
            "❌ الكتلة لا يمكن أن تكون سالبة";
        return;
    }

    const c =
        299792458;

    const energy =
        mass * c * c;

    result.innerHTML =
        `✅ E = ${energy.toExponential(6)} J`;
};
// ==========================================
// 🧮 تنفيذ تحويل درجة الحرارة
// ==========================================

window.convertTemperature = function (type) {

    let title = "";
    let unit = "";

    if (type === "CtoF") {
        title = "°C → °F";
        unit = "°C";
    }

    if (type === "FtoC") {
        title = "°F → °C";
        unit = "°F";
    }

    if (type === "CtoK") {
        title = "°C → K";
        unit = "°C";
    }

    if (type === "KtoC") {
        title = "K → °C";
        unit = "K";
    }

    if (type === "FtoK") {
        title = "°F → K";
        unit = "°F";
    }

    if (type === "KtoF") {
        title = "K → °F";
        unit = "K";
    }

    createScreenPanel(`
        <div style="
            font-size:17px;
            font-weight:bold;
            text-align:center;
            margin-bottom:15px;
        ">
            🔄 ${title}
        </div>

        <input
            id="temperatureConversionInput"
            type="number"
            placeholder="أدخل درجة الحرارة"
            style="
                width:100%;
                box-sizing:border-box;
                padding:12px;
                margin-bottom:10px;
                font-size:16px;
                text-align:center;
            "
        >

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
        ">
            الوحدة: ${unit}
        </div>

        <button onclick="calculateTemperatureConversion('${type}')"
            style="
                width:100%;
                padding:11px;
                margin:3px 0;
                font-weight:bold;
            ">
            =
        </button>

        <div id="temperatureConversionResult"
            style="
                margin-top:12px;
                padding:10px;
                text-align:center;
                font-weight:bold;
            ">
        </div>

        <button onclick="physicsTemperatureConversion()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            ">
            ← أنواع التحويل
        </button>
    `);

    setTimeout(() => {
        document.getElementById("temperatureConversionInput")?.focus();
    }, 50);
};


// ==========================================
// 🧮 حساب التحويل
// ==========================================

window.calculateTemperatureConversion = function (type) {

    const input = document.getElementById("temperatureConversionInput");
    const result = document.getElementById("temperatureConversionResult");

    if (!input || !result) return;

    const value = Number(input.value);

    if (input.value === "" || !Number.isFinite(value)) {
        result.innerHTML = "⚠️ أدخل قيمة صحيحة";
        return;
    }

    let answer;
    let unit;

    switch (type) {

        case "CtoF":
            answer = (value * 9 / 5) + 32;
            unit = "°F";
            break;

        case "FtoC":
            answer = (value - 32) * 5 / 9;
            unit = "°C";
            break;

        case "CtoK":
            answer = value + 273.15;
            unit = "K";
            break;

        case "KtoC":
            answer = value - 273.15;
            unit = "°C";
            break;

        case "FtoK":
            answer = (value - 32) * 5 / 9 + 273.15;
            unit = "K";
            break;

        case "KtoF":
            answer = (value - 273.15) * 9 / 5 + 32;
            unit = "°F";
            break;

        default:
            result.innerHTML = "⚠️ نوع تحويل غير معروف";
            return;
    }

    result.innerHTML = `✅ ${answer.toFixed(6)} ${unit}`;
};

// ==========================================
// 🧮 حساب كمية الحرارة
// ==========================================

window.calculatePhysicsHeatQuantity = function () {

    const mass =
        parseFloat(
            document.getElementById(
                "physicsHeatMass"
            )?.value
        );

    const specificHeat =
        parseFloat(
            document.getElementById(
                "physicsHeatSpecific"
            )?.value
        );

    const deltaT =
        parseFloat(
            document.getElementById(
                "physicsHeatDeltaT"
            )?.value
        );

    const result =
        document.getElementById(
            "physicsHeatResult"
        );

    if (!Number.isFinite(mass) ||
        !Number.isFinite(specificHeat) ||
        !Number.isFinite(deltaT)) {

        result.innerHTML =
            "⚠️ أدخل الكتلة والسعة الحرارية والتغير في درجة الحرارة";

        return;
    }

    if (mass < 0) {

        result.innerHTML =
            "❌ الكتلة لا يمكن أن تكون سالبة";

        return;
    }

    if (specificHeat < 0) {

        result.innerHTML =
            "❌ السعة الحرارية النوعية لا يمكن أن تكون سالبة";

        return;
    }

    const heat =
        mass * specificHeat * deltaT;

    result.innerHTML =
        `✅ Q = ${heat.toFixed(6)} J`;
};
// ==========================================
// 🧮 حساب السرعة
// ==========================================

window.calculatePhysicsSpeed = function () {

    const distance =
        Number(document.getElementById(
            "physicsSpeedDistance"
        ).value);

    const time =
        Number(document.getElementById(
            "physicsSpeedTime"
        ).value);

    const result =
        document.getElementById(
            "physicsSpeedResult"
        );

    if (!Number.isFinite(distance) ||
        !Number.isFinite(time)) {

        result.innerHTML =
            "⚠️ أدخل المسافة والزمن";

        return;
    }

    if (time === 0) {

        result.innerHTML =
            "⚠️ الزمن لا يمكن أن يساوي صفرًا";

        return;
    }

    const speed = distance / time;

    result.innerHTML =
        `✅ v = ${speed} m/s`;
};
// ==========================================
// 🧪 قائمة الكيمياء
// ==========================================


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

    document.querySelectorAll('#customModePanel, [id^=customModePanel]').forEach(panel => panel.remove());

}

function createScreenPanel(htmlContent) {
    console.log("🚨 CREATE SCREEN PANEL:", htmlContent);

    removeCustomModePanel();

    fractionMode = false;
    fractionStage = 0;
    fractionNumerator = "";
    fractionDenominator = "";
    fractionExpression = "";

    const fractionEditor =
        document.getElementById("fractionEditor");

    if (fractionEditor) {
        fractionEditor.remove();
    }

    // حذف أي قسم قديم
    removeCustomModePanel();

    const panel = document.createElement("div");

    panel.id = "customModePanel";

    panel.style.cssText = `
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:#dfe8c5;
        color:#000;
        padding:6px;
        box-sizing:border-box;
        z-index:90;
        font-size:11px;
        overflow-y:auto;
        font-family:monospace;
    `;

    panel.innerHTML = htmlContent;

    if (screen) {
        screen.appendChild(panel);
    }

    // ==========================================
    // 📱 منع لوحة مفاتيح الهاتف والتابلت
    // في خانات الفيزياء
    // ==========================================

    if (document.body.classList.contains("physics-mode")) {

        panel.querySelectorAll("input").forEach(input => {

            // منع الكتابة من لوحة المفاتيح الافتراضية
            input.setAttribute("readonly", "readonly");

            // منع ظهور لوحة المفاتيح عند التركيز
            input.addEventListener("focus", () => {
                input.setAttribute("readonly", "readonly");
            });

        });

    }
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
// ==========================================
// 🧹 AC — مسح شامل لكل أوضاع الرياضيات
// ==========================================


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

// ==========================================
// 🧮 COMP - الأرقام والنقطة
// ==========================================

if (currentMode === "COMP" && !fractionMode) {

    // 🔢 الرقم
    if (/^[0-9]$/.test(value)) {

        writeToDisplay(value);

        console.log(
            "🧮 COMP NUMBER:",
            value,
            "=>",
            display.value
        );

        return;
    }

    // 🔵 النقطة
    if (value === ".") {

        const current = display.value;

        // الشاشة فاضية
        if (current === "") {
            display.value = "0.";
            return;
        }

        // آخر حاجة نقطة
        if (current.endsWith(".")) {
            return;
        }

        // لو آخر جزء من العملية فيه نقطة بالفعل
        const lastPart = current.split(/[+−×÷\-]/).pop();

        if (lastPart.includes(".")) {
            return;
        }

        // لو بعد عملية حسابية
        if (/[+−×÷\-]$/.test(current)) {
            display.value += "0.";
            return;
        }

        display.value += ".";

        console.log(
            "🧮 COMP DOT:",
            display.value
        );

        return;
    }
}


// ==========================================
// 🧮 COMP - إدخال الأرقام والنقطة
// ==========================================

if (currentMode === "COMP" && !fractionMode) {
    // 🔵 النقطة العشرية
    if (value === ".") {

        // الشاشة فاضية
        if (display.value === "") {
            display.value = "0.";
            return;
        }

        // آخر حرف نقطة
        if (display.value.endsWith(".")) {
            return;
        }

        // نحدد آخر رقم في العملية
        const match = display.value.match(
            /(?:^|[+\-×÷])(-?\d*\.?\d*)$/
        );

        const lastNumber = match ? match[1] : "";

        // الرقم الحالي فيه نقطة بالفعل
        if (lastNumber.includes(".")) {
            return;
        }

        // لو آخر حاجة عملية حسابية
        if (/[+\-×÷]$/.test(display.value)) {
            display.value += "0.";
            return;
        }

        display.value += ".";

        console.log(
            "🔵 COMP DOT:",
            display.value
        );

        return;
    }
}
        
        // ==========================================
        // 🟣 إدخال الأرقام داخل الكسر
        // ==========================================

        if (fractionMode) {

            // نسمح بالأرقام والنقطة فقط
            if (!/^[0-9.]$/.test(value)) {
                return;
            }

            // البسط
            if (fractionStage === 1) {

                if (fractionNumerator === "| |") {
                    fractionNumerator = "|" + value + "|";
                } else {
                    fractionNumerator += value;
                }

            }

            // المقام
            else if (fractionStage === 2) {

                if (fractionDenominator === "| |") {
                    fractionDenominator = "|" + value + "|";
                } else {
                    fractionDenominator += value;
                }
            }

            updateFractionDisplay();

            console.log(
                "🟣 FRACTION NUMBER:",
                value,
                "STAGE:",
                fractionStage,
                "NUM:",
                fractionNumerator,
                "DEN:",
                fractionDenominator
            );

            return;
        }

       
        // ==========================================
// 🧮 إدخال أرقام CMPLX
// ==========================================

if (currentMode === "CMPLX") {

    // الأرقام
    if (/^[0-9]$/.test(value)) {

        writeToDisplay(value);

        console.log(
            "🔵 CMPLX NUMBER:",
            value,
            "DISPLAY:",
            display.value
        );

        return;
    }

    // النقطة العشرية
    if (value === ".") {

        if (display.value === "") {
            display.value = "0.";
        }
        else if (display.value === "0") {
            display.value = "0.";
        }
        else if (!display.value.includes(".")) {
            display.value += ".";
        }

        console.log(
            "🔵 CMPLX DOT:",
            display.value
        );

        return;
    }
}

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
// ==========================================
// ⚛️ إدخال أرقام حاسبة الفيزياء
// ==========================================

// ==========================================
// ⚛️ إدخال أرقام الفيزياء
// ==========================================

if (window.activePhysicsField) {

    const field = document.getElementById(
        window.activePhysicsField
    );

    if (field) {

        // تحويل الأرقام العربية إلى إنجليزية
        const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
        const englishNumbers = "0123456789";

        let englishValue = "";

        for (const char of value) {

            const index =
                arabicNumbers.indexOf(char);

            if (index !== -1) {
                englishValue += englishNumbers[index];
            } else {
                englishValue += char;
            }
        }

        // الأرقام
        if (/^[0-9]$/.test(englishValue)) {

            field.value += englishValue;

            console.log(
                "⚛️ PHYSICS NUMBER:",
                englishValue,
                field.value
            );

            return;
        }

       // النقطة
if (englishValue === ".") {

    // لو الخانة فاضية
    if (field.value === "") {
        field.value = "0.";
    }

    // لو القيمة صفر فقط
    else if (field.value === "0") {
        field.value = "0.";
    }

    // لو القيمة سالبة صفر
    else if (field.value === "-0") {
        field.value = "-0.";
    }

    // لو فيه نقطة بالفعل
    else if (field.value.includes(".")) {
        return;
    }

    // أي رقم آخر
    else {
        field.value += ".";
    }

    console.log(
        "⚛️ PHYSICS DOT:",
        field.value
    );

    return;
}

        // الفاصلة
        if (
            englishValue === "," ||
            value === "،"
        ) {

            field.value += ",";

            console.log(
                "⚛️ PHYSICS COMMA:",
                field.value
            );

            return;
        }

        // السالب
        if (
            englishValue === "-" ||
            value === "−" ||
            value === "-"
        ) {

            field.value += "-";

            console.log(
                "⚛️ PHYSICS MINUS:",
                field.value
            );

            return;
        }
    }
}

// ==========================================
// 🧪 إدخال أرقام حاسبات الكيمياء
// ==========================================

if (window.activeChemistryField) {

    const field = document.getElementById(
        window.activeChemistryField
    );

    if (field) {

        // الأرقام
        if (/^[0-9]$/.test(value)) {

            field.value += value;

            console.log(
                "🧪 CHEM NUMBER:",
                value,
                field.value
            );

            return;
        }

        // النقطة
        if (value === ".") {

            if (field.value === "") {
                field.value = "0.";
            }
            else if (field.value === "0") {
                field.value = "0.";
            }
            else if (!field.value.includes(".")) {
                field.value += ".";
            }

            return;
        }

        // السالب
        if (value === "-" || value === "−") {

            if (field.value === "") {
                field.value = "-";
            }

            return;
        }
    }
}

}  
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

        // ==========================================
        // 🧹 AC - تنظيف الشاشة بالكامل
        // ==========================================

        if (display) {
            display.value = "";
            display.style.visibility = "visible";
        }

        if (expression) {
            expression.textContent = "";
        }

        // ==========================================
        // 🧹 إزالة محرر الكسر
        // ==========================================

        const fractionEditor =
            document.getElementById("fractionEditor");

        if (fractionEditor) {
            fractionEditor.remove();
        }

        // ==========================================
        // 🧹 إخفاء عرض الكسر
        // ==========================================

        const fractionDisplay =
            document.getElementById("fractionDisplay");

        if (fractionDisplay) {
            fractionDisplay.classList.add("hidden");
        }

        // ==========================================
        // 🧹 تصفير كل حالات الكسر
        // ==========================================

        if (typeof resetFractionState === "function") {
            resetFractionState();
        }

        // ==========================================
        // 🧹 إغلاق أي Panel مفتوح
        // ==========================================

        if (typeof closeCustomPanel === "function") {
            closeCustomPanel();
        }

        console.log("🧹 AC: EVERYTHING CLEARED");
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
   function updateFractionButtonVisibility() {

    const fractionRow =
        document.querySelector(".fraction-row");

    if (!fractionRow) return;

    if (currentMode === "COMP") {
        fractionRow.style.display = "flex";
    } else {
        fractionRow.style.display = "none";
    }
}
updateFractionButtonVisibility();
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
        // ⚛️ ×10ˣ داخل حقول الفيزياء
        // ==========================================

        if (window.activePhysicsField) {

            const field = document.getElementById(
                window.activePhysicsField
            );

            if (field) {

                // لازم يكون فيه رقم قبل ×10ˣ
                if (field.value === "") {
                    field.value = "1e";
                }

                // لو الرقم بالفعل مكتوب بصيغة علمية
                else if (
                    /[eE]/.test(field.value)
                ) {
                    return;
                }

                // تحويل ×10ˣ إلى e
                else {
                    field.value += "e";
                }

                console.log(
                    "⚛️ PHYSICS ×10ˣ:",
                    window.activePhysicsField,
                    "→",
                    field.value
                );

                return;
            }
        }


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


        // ==========================================
        // الاستخدام العادي
        // ==========================================

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
// ⚛️ PHYSICS + SHIFT + . = فاصلة
// ==========================================

if (
    shift &&
    window.activePhysicsField
) {

    const field = document.getElementById(
        window.activePhysicsField
    );

    if (field) {

        field.value += ",";

        console.log(
            "⚛️ PHYSICS COMMA:",
            window.activePhysicsField,
            "→",
            field.value
        );

        shift = false;

        if (status) {
            status.textContent = currentMode;
        }

        return;
    }
}


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
// ⚛️ النقطة العادية في الفيزياء
// ==========================================

if (window.activePhysicsField) {

    const field = document.getElementById(
        window.activePhysicsField
    );

    if (field) {

        // لو الخانة لسه جديدة
        if (window.physicsWeightNewInput) {

            // لو الخانة فاضية فقط نبدأ بـ 0.
            if (field.value === "") {
                field.value = "0.";
            } else {
                // لو فيها رقم بالفعل، نضيف النقطة
                if (!field.value.includes(".")) {
                    field.value += ".";
                }
            }

            window.physicsWeightNewInput = false;

            return;
        }

        // الخانة فاضية
        if (field.value === "") {
            field.value = "0.";
            return;
        }

        // ممنوع أكثر من نقطة
        if (field.value.includes(".")) {
            return;
        }

        // إضافة النقطة بعد الرقم
        field.value += ".";

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

        // ==========================================
// 🧮 COMP - النقطة العشرية
// ==========================================

if (currentMode === "COMP" && !fractionMode) {

    // الشاشة فاضية
    if (display.value === "") {
        display.value = "0.";
        return;
    }

    // لو آخر حاجة نقطة
    if (display.value.endsWith(".")) {
        return;
    }

    // نأخذ آخر جزء من العملية
    const parts = display.value.split(/[+\-×÷]/);
    const lastNumber = parts[parts.length - 1];

    // الرقم الحالي فيه نقطة بالفعل
    if (lastNumber.includes(".")) {
        return;
    }

    // لو آخر حاجة عملية
    if (/[+\-×÷]$/.test(display.value)) {
        display.value += "0.";
        return;
    }

    // إضافة النقطة في نهاية الرقم
    display.value += ".";

    console.log(
        "🟢 COMP DOT:",
        display.value
    );

    return;
}
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
        document.body.classList.toggle('comp-mode', currentMode === 'COMP');
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
// ==========================================
    // ⚡ السالب داخل حاسبة الفيزياء
    // ==========================================

    if (window.activePhysicsField) {

        const field = document.getElementById(
            window.activePhysicsField
        );

        if (field) {

            field.value += "-";

            console.log(
                "⚛️ PHYSICS MINUS:",
                window.activePhysicsField,
                field.value
            );

            return;
        }
    }

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
// ==========================================
// ◀ زر الرجوع للقائمة الرئيسية
// ==========================================

const navLeftButton = document.getElementById("navLeft");

if (navLeftButton) {

    navLeftButton.onclick = function () {

        console.log("◀ NAV LEFT CLICK");
        console.log("currentMode =", currentMode);
        console.log("currentCalculationType =", currentCalculationType);

        // 🧮 الرياضيات
        if (
            currentMode === "COMP" ||
            currentCalculationType === "math"
        ) {

            console.log("🏠 الرجوع لقائمة طريقة الحساب");

            // إلغاء أي وضع خاص
            fractionMode = false;
            nestedFractionMode = false;

            // إظهار الشاشة الرئيسية
            openCalculatorHome();

            return;
        }

        // 🧪 الكيمياء
        if (chemistryMode) {
            exitChemistryMode();
            return;
        }

        // ⚛️ الفيزياء
        if (currentMode === "PHYSICS") {
            console.log("⚛️ الرجوع من الفيزياء");
            openCalculatorHome();
            return;
        }

        // الوضع العادي
        moveSelection("left");
    };
}


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
            if(document.body.classList.contains('physics-mode')){const f=window.activePhysicsField?document.getElementById(window.activePhysicsField):null;if(f){f.value='';f.dispatchEvent(new Event('input',{bubbles:true}));}window.activePhysicsField=null;event.stopImmediatePropagation();return;}if(document.body.classList.contains('programming-mode')){if(typeof window.programmingClear==='function'){window.programmingClear();}event.stopImmediatePropagation();return;}event.stopImmediatePropagation();
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
            if(document.body.classList.contains('physics-mode')){const f=window.activePhysicsField?document.getElementById(window.activePhysicsField):null;if(f){f.value='';f.dispatchEvent(new Event('input',{bubbles:true}));}window.activePhysicsField=null;event.stopImmediatePropagation();return;}if(document.body.classList.contains('programming-mode')){if(typeof window.programmingClear==='function'){window.programmingClear();}event.stopImmediatePropagation();return;}event.stopImmediatePropagation();

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
// ==========================================
// شاشة اختيار طريقة الحساب
// ==========================================

(() => {

    const homeScreen = document.getElementById("calculatorHome");
    const calcScreen = document.querySelector(".calculator");

    if (!homeScreen || !calcScreen) {
        console.error("❌ لم يتم العثور على شاشة البداية أو الآلة");
        return;
    }

  document.querySelectorAll(".home-choice").forEach(button => {

    button.addEventListener("click", () => {

        const choice = button.dataset.calculation;

        console.log("طريقة الحساب:", choice);


        // ==========================================
        // 🧮 الرياضيات
        // ==========================================

        if (choice === "math") {

            window.activePhysicsField = null;
            window.activeChemistryField = null;

            if (typeof activeStatField !== "undefined") {
                activeStatField = null;
            }

            if (typeof activeVectorField !== "undefined") {
                activeVectorField = null;
            }

            currentMode = "COMP";

            homeScreen.classList.add("hidden");
            calcScreen.classList.remove("hidden");

            return;
        }


        // ==========================================
        // ⚛️ الفيزياء
        // ==========================================

        if (choice === "physics") {

            homeScreen.classList.add("hidden");
            calcScreen.classList.remove("hidden");

            if (typeof openPhysicsModern === "function") {
                openPhysicsModern();
            }

            return;
        }


        // ==========================================
        // 🧪 الكيمياء
        // ==========================================

        if (choice === "chemistry") {

            homeScreen.classList.add("hidden");
            calcScreen.classList.remove("hidden");

            if (typeof openChemistryMode === "function") {
                openChemistryMode();
            }

            return;
        }


        // ==========================================
        // 💻 البرمجة
        // ==========================================

        if (choice === "programming") {

            console.log("Programming mode selected");

            homeScreen.classList.add("hidden");
            calcScreen.classList.remove("hidden");

            // لو عندنا وضع برمجة موجود بالفعل
            if (typeof openProgrammingMenu === "function") {
                openProgrammingMenu();
            }

            return;
        }

    });

});

})();

// ==========================================
// 🧪 CHEMISTRY MODE
// تبديل أزرار الآلة إلى أزرار الكيمياء
// ==========================================

let chemistryMode = false;

let normalCalculatorButtons = null;


// ==========================================
// 🧪 فتح وضع الكيمياء
// ==========================================

window.openChemistryMode = function () {

    chemistryMode = true;

    // حفظ الأزرار الأصلية مرة واحدة فقط
    if (!normalCalculatorButtons) {

        normalCalculatorButtons = {
            top: document.querySelector(".top-row").innerHTML,
            memory: document.querySelector(".memory-row").innerHTML,
            navigation: document.querySelector(".navigation").innerHTML,
            scientific: document.querySelector(".scientific-grid").innerHTML,
            fraction: document.querySelector(".fraction-row").innerHTML,
            numbers: document.querySelector(".number-grid").innerHTML
        };
    }


    // ==========================================
    // 🧪 الأزرار العلوية
    // ==========================================

    document.querySelector(".top-row").innerHTML = `

        <button onclick="exitChemistryMode()">
            🔙 رجوع
        </button>

        <button onclick="chemistryClear()">
            AC
        </button>

        <button onclick="chemistryBackspace()">
            DEL
        </button>

        <button onclick="chemistryWrite('(')">
            (
        </button>

        <button onclick="chemistryWrite(')')">
            )
        </button>

    `;


    // ==========================================
    // 🧪 العناصر المهمة
    // ==========================================

    document.querySelector(".memory-row").innerHTML = `

        <button onclick="chemistryWrite('H')">
            H
        </button>

        <button onclick="chemistryWrite('C')">
            C
        </button>

        <button onclick="chemistryWrite('N')">
            N
        </button>

        <button onclick="chemistryWrite('O')">
            O
        </button>

        <button onclick="chemistryWrite('Cl')">
            Cl
        </button>

    `;


    // ==========================================
    // 🧪 عناصر إضافية
    // ==========================================

    document.querySelector(".navigation").innerHTML = `

        <button onclick="chemistryWrite('Na')">
            Na
        </button>

        <button onclick="chemistryWrite('Mg')">
            Mg
        </button>

        <button onclick="chemistryWrite('Al')">
            Al
        </button>

        <button onclick="chemistryWrite('Ca')">
            Ca
        </button>

    `;


    // ==========================================
    // 🧪 لوحة العناصر
    // ==========================================

    document.querySelector(".scientific-grid").innerHTML = `

        <button onclick="chemistryWrite('H')">H</button>
        <button onclick="chemistryWrite('He')">He</button>
        <button onclick="chemistryWrite('Li')">Li</button>
        <button onclick="chemistryWrite('Be')">Be</button>
        <button onclick="chemistryWrite('B')">B</button>

        <button onclick="chemistryWrite('C')">C</button>
        <button onclick="chemistryWrite('N')">N</button>
        <button onclick="chemistryWrite('O')">O</button>
        <button onclick="chemistryWrite('F')">F</button>
        <button onclick="chemistryWrite('Ne')">Ne</button>

        <button onclick="chemistryWrite('Na')">Na</button>
        <button onclick="chemistryWrite('Mg')">Mg</button>
        <button onclick="chemistryWrite('Al')">Al</button>
        <button onclick="chemistryWrite('Si')">Si</button>
        <button onclick="chemistryWrite('P')">P</button>

        <button onclick="chemistryWrite('S')">S</button>
        <button onclick="chemistryWrite('Cl')">Cl</button>
        <button onclick="chemistryWrite('Ar')">Ar</button>
        <button onclick="chemistryWrite('K')">K</button>
        <button onclick="chemistryWrite('Ca')">Ca</button>

        <button onclick="chemistryWrite('Fe')">Fe</button>
        <button onclick="chemistryWrite('Cu')">Cu</button>
        <button onclick="chemistryWrite('Zn')">Zn</button>
        <button onclick="chemistryWrite('Ag')">Ag</button>
        <button onclick="chemistryWrite('I')">I</button>

    `;


    // ==========================================
    // 🔢 أرقام الصيغ
    // ==========================================

    document.querySelector(".fraction-row").innerHTML = `

        <button onclick="chemistryWrite('1')">1</button>
        <button onclick="chemistryWrite('2')">2</button>
        <button onclick="chemistryWrite('3')">3</button>
        <button onclick="chemistryWrite('4')">4</button>
        <button onclick="chemistryWrite('5')">5</button>

    `;


    // ==========================================
    // 🔢 باقي الأرقام
    // ==========================================

    document.querySelector(".number-grid").innerHTML = `

        <button onclick="chemistryWrite('6')">6</button>
        <button onclick="chemistryWrite('7')">7</button>
        <button onclick="chemistryWrite('8')">8</button>
        <button onclick="chemistryWrite('9')">9</button>
        <button onclick="chemistryWrite('0')">0</button>

        <button onclick="chemistryWrite('(')">(</button>
        <button onclick="chemistryWrite(')')">)</button>

        <button onclick="chemistryBackspace()">
            DEL
        </button>

        <button onclick="chemistryClear()">
            AC
        </button>

        <button onclick="chemistryEquals()">
            =
        </button>

    `;

};


// ==========================================
// ✏️ كتابة الصيغة
// ==========================================

window.chemistryWrite = function (value) {

    const display =
        document.getElementById("display");

    if (!display) return;

    display.value += value;
};


// ==========================================
// 🧹 AC
// ==========================================

window.chemistryClear = function () {

    const display =
        document.getElementById("display");

    if (!display) return;

    display.value = "";
};


// ==========================================
// ⌫ DEL
// ==========================================

window.chemistryBackspace = function () {

    const display =
        document.getElementById("display");

    if (!display) return;

    display.value =
        display.value.slice(0, -1);
};


// ==========================================
// 🔙 الرجوع للوضع العادي
// ==========================================

window.exitChemistryMode = function () {

    if (!normalCalculatorButtons) return;

    document.querySelector(".top-row").innerHTML =
        normalCalculatorButtons.top;

    document.querySelector(".memory-row").innerHTML =
        normalCalculatorButtons.memory;

    document.querySelector(".navigation").innerHTML =
        normalCalculatorButtons.navigation;

    document.querySelector(".scientific-grid").innerHTML =
        normalCalculatorButtons.scientific;

    document.querySelector(".fraction-row").innerHTML =
        normalCalculatorButtons.fraction;

    document.querySelector(".number-grid").innerHTML =
        normalCalculatorButtons.numbers;

    chemistryMode = false;

    // إعادة ربط أحداث أزرار الآلة الأصلية
    location.reload();
};


// ==========================================
// 🧪 =
// ==========================================

window.chemistryEquals = function () {

    const formula =
        document.getElementById("display")?.value;

    if (!formula) return;

    console.log(
        "🧪 CHEMISTRY FORMULA:",
        formula
    );
};



// ==========================================
// 🧪 فتح وضع الكيمياء
// الشاشة + الأزرار
// ==========================================

window.openChemistryMenu = function () {

    // أولًا: تبديل أزرار الآلة
    setupChemistryKeys();


    // ثانيًا: عرض قائمة الكيمياء على الشاشة
    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🧪 الكيمياء
        </div>

        <button onclick="chemistryMolarMass()">
            1️⃣ ⚖️ الكتلة المولية
        </button>

        <button onclick="chemistryMoles()">
            2️⃣ 🧮 عدد المولات
        </button>

        <button onclick="chemistryParticles()">
            3️⃣ 🔬 عدد الجسيمات
        </button>

        <button onclick="chemistryMolarity()">
            4️⃣ 💧 التركيز المولاري
        </button>

        <button onclick="chemistryDilution()">
            5️⃣ 🧪 التخفيف
        </button>

        <button onclick="chemistryMassPercent()">
            6️⃣ ⚗️ النسبة المئوية الكتلية
        </button>

       <button onclick="chemistryHeatEnergy()">
    7️⃣ 🔥 الحرارة والطاقة الكيميائية
</button>

        <button onclick="chemistryIdealGas()">
            8️⃣ 🎈 قانون الغاز المثالي
        </button>

        <button onclick="chemistryBoyle()">
            9️⃣ 📉 قانون بويل
        </button>

        <button onclick="chemistryCharles()">
            🔟 🌡️ قانون شارل
        </button>

        <button onclick="chemistryGayLussac()">
            1️⃣1️⃣ 📈 قانون جاي-لوساك
        </button>

       <button onclick="chemistryCombinedGas()">
    1️⃣2️⃣ 🧊 قانون الغاز العام
</button>

        <button onclick="chemistryKc()">
            1️⃣3️⃣ ⚖️ ثابت الاتزان Kc
        </button>

        <button onclick="chemistryPH()">
            1️⃣4️⃣ 🧪 pH
        </button>

        <button onclick="chemistryPOH()">
            1️⃣5️⃣ 💧 pOH
        </button>

        <button onclick="chemistryKa()">
            1️⃣6️⃣ 🔴 Ka
        </button>

        <button onclick="chemistryKb()">
            1️⃣7️⃣ 🔵 Kb
        </button>

        <button onclick="chemistryHalfLife()">
            1️⃣8️⃣ ⏳ نصف عمر التفاعل
        </button>

        <button onclick="openCalculatorHome()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            ">
            ← رجوع للقائمة الرئيسية
        </button>

    `);
};



// ==========================================
// 🧪 لوحة أزرار الكيمياء
// ==========================================
window.lastChemistryResult = 0;
window.chemistryShift = false;

window.setupChemistryKeys = function () {
document.body.classList.add("chemistry-mode");
    // ------------------------------------------
    // SHIFT
    // ------------------------------------------

    window.chemistryShift = false;

    const topRow = document.querySelector(".top-row");

    if (topRow) {

        topRow.innerHTML = `
            <button id="chemShiftBtn">SHIFT</button>
            <button id="chemACBtn">AC</button>
            <button id="chemDELBtn">DEL</button>
            <button onclick="chemistryWrite('(')">(</button>
            <button onclick="chemistryWrite(')')">)</button>
        `;

        document
            .getElementById("chemShiftBtn")
            .onclick = function () {

                window.chemistryShift =
                    !window.chemistryShift;

                this.textContent =
                    window.chemistryShift
                        ? "SHIFT ✓"
                        : "SHIFT";

                console.log(
                    "🧪 SHIFT:",
                    window.chemistryShift
                );
            };

        document
            .getElementById("chemACBtn")
            .onclick = function () {

                chemistryClear();
            };

        document
            .getElementById("chemDELBtn")
            .onclick = function () {

                chemistryBackspace();
            };
    }


    // ------------------------------------------
    // إخفاء الأجزاء القديمة
    // ------------------------------------------

    const memoryRow =
        document.querySelector(".memory-row");

    if (memoryRow) {
        memoryRow.style.display = "none";
    }

    const navigation =
        document.querySelector(".navigation");

    if (navigation) {
        navigation.style.display = "none";
    }


    // ------------------------------------------
    // لوحة الحروف A-Z
    // ------------------------------------------

    const scientificGrid =
        document.querySelector(".scientific-grid");

    if (scientificGrid) {

        scientificGrid.innerHTML = "";

        const letters = [
    "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l",
    "m", "n", "o", "p", "q", "r",
    "s", "t", "u", "v", "w", "x",
    "y", "z", "↑", "↓", "←", "→"
];

        letters.forEach(letter => {

            const button =
                document.createElement("button");

            button.textContent = letter;

            button.style.width = "100%";
            button.style.padding = "9px";
            button.style.fontSize = "14px";

            button.onclick = function () {

    if (["↑", "↓", "←", "→"].includes(letter)) {
        return;
    }

    chemistryWrite(letter);
};

            scientificGrid.appendChild(button);
        });
    }


    // ==========================================
// 🧪 إزالة زر الكسر من لوحة الكيمياء
// ==========================================

const fractionRow =
    document.querySelector(".fraction-row");

if (fractionRow) {
    fractionRow.remove();
}


    // ------------------------------------------
    // لوحة الأرقام والكيمياء
    // ------------------------------------------

    const numberGrid =
        document.querySelector(".number-grid");

    if (numberGrid) {

        numberGrid.innerHTML = "";

        const keys = [

    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    "0",

    ".",
    ",",

    "+",
    "-",

    "×",
    "÷",

    "(",
    ")",

    "=",

    "Ans"
];

        keys.forEach(value => {

    const button = document.createElement("button");

    button.textContent = value;

    button.style.width = "100%";
    button.style.padding = "10px";
    button.style.fontSize = "14px";

    button.onclick = function () {

        // زر =
        if (value === "=") {
            return;
        }

        // زر Ans
        if (value === "Ans") {

            const field =
                document.getElementById(
                    window.activeChemistryField
                );

            if (!field) return;

            if (
                window.lastChemistryResult !== undefined &&
                Number.isFinite(
                    Number(window.lastChemistryResult)
                )
            ) {
                field.value +=
                    window.lastChemistryResult;
            }

            return;
        }

        chemistryWrite(value);
    };

    numberGrid.appendChild(button);
});
    }


    console.log(
        "🧪 Chemistry keyboard loaded"
    );
};

// ==========================================
// 🧪 CHEMISTRY - الكتلة المولية
// ==========================================

// الكتل الذرية
const atomicMasses = {

    H: 1.008,
    He: 4.003,

    Li: 6.94,
    Be: 9.012,
    B: 10.81,
    C: 12.011,
    N: 14.007,
    O: 15.999,
    F: 18.998,
    Ne: 20.180,

    Na: 22.990,
    Mg: 24.305,
    Al: 26.982,
    Si: 28.085,
    P: 30.974,
    S: 32.06,
    Cl: 35.45,
    Ar: 39.948,

    K: 39.098,
    Ca: 40.078,
    Fe: 55.845,
    Cu: 63.546,
    Zn: 65.38,
    Ag: 107.868,
    I: 126.904
};


// ==========================================
// فتح حاسبة الكتلة المولية
// ==========================================

window.chemistryMolarMass = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ⚖️ الكتلة المولية
        </div>

        <div style="
            font-size:13px;
            margin-bottom:6px;
        ">
            أدخل الصيغة الكيميائية:
        </div>

        <input
            id="chemFormulaInput"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button onclick="calculateMolarMass()"
            style="width:100%; padding:10px;">
            🧮 احسب
        </button>

        <div id="chemMolarResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
            ">
        </div>

        <button onclick="openChemistryMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField = "chemFormulaInput";
};



// ==========================================
// 🧪 كتابة داخل حقل الكيمياء
// ==========================================

window.chemistryWrite = function (value) {

    const activeId =
        window.activeChemistryField;

    if (!activeId) {

        console.log(
            "🧪 لا توجد خانة كيمياء نشطة"
        );

        return;
    }

    const field =
        document.getElementById(activeId);

    if (!field) return;


    // ------------------------------------------
    // الحروف
    // ------------------------------------------

    if (/^[a-zA-Z]$/.test(value)) {

        let letter = value.toLowerCase();

        if (window.chemistryShift) {

            letter =
                letter.toUpperCase();

            window.chemistryShift = false;

            const shiftBtn =
                document.getElementById(
                    "chemShiftBtn"
                );

            if (shiftBtn) {
                shiftBtn.textContent = "SHIFT";
            }
        }

        field.value += letter;

        console.log(
            "🧪 LETTER:",
            letter
        );

        return;
    }


    // ------------------------------------------
    // الأرقام
    // ------------------------------------------

    if (/^[0-9]$/.test(value)) {

        field.value += value;

        return;
    }


    // ------------------------------------------
    // النقطة
    // ------------------------------------------

    if (value === ".") {

    field.value += ".";

    return;
}


    // ------------------------------------------
    // باقي الرموز
    // ------------------------------------------

    if (
        [
            "(",
            ")",
            "+",
            "-",
            "×",
            "÷",
            ","
        ].includes(value)
    ) {

        field.value += value;

        return;
    }
};



// ==========================================
// حذف حرف
// ==========================================

window.chemistryBackspace = function () {

    const field =
        document.getElementById(
            window.activeChemistryField
        );

    if (!field) return;

    field.value =
        field.value.slice(0, -1);
};

window.chemistryClear = function () {

    const field =
        document.getElementById(
            window.activeChemistryField
        );

    if (!field) return;

    field.value = "";

    const result =
        document.getElementById(
            "chemMolarResult"
        );

    if (result) {
        result.innerHTML = "";
    }
};


// ==========================================
// حساب الكتلة المولية
// يدعم:
// H2O
// CO2
// Ca(OH)2
// Al2(SO4)3
// ==========================================

window.calculateMolarMass = function () {

    const input =
        document.getElementById("chemFormulaInput");

    const result =
        document.getElementById("chemMolarResult");

    if (!input || !result) return;

    const formula = input.value.trim();

    if (!formula) {
        result.innerHTML = "❌ أدخل الصيغة الكيميائية";
        return;
    }

    try {

        let position = 0;


        function parseNumber() {

            let number = "";

            while (
                position < formula.length &&
                /[0-9]/.test(formula[position])
            ) {
                number += formula[position];
                position++;
            }

            return number
                ? Number(number)
                : 1;
        }


        function parseGroup(endChar = null) {

            let total = 0;

            while (position < formula.length) {

                // نهاية القوس
                if (
                    endChar &&
                    formula[position] === endChar
                ) {
                    position++;
                    break;
                }


                // فتح قوس
                if (formula[position] === "(") {

                    position++;

                    const groupMass =
                        parseGroup(")");

                    const multiplier =
                        parseNumber();

                    total +=
                        groupMass * multiplier;

                    continue;
                }


                // العنصر
                if (/[A-Z]/.test(formula[position])) {

                    let symbol =
                        formula[position];

                    position++;

                    // الحرف الثاني
                    if (
                        position < formula.length &&
                        /[a-z]/.test(formula[position])
                    ) {
                        symbol +=
                            formula[position];

                        position++;
                    }

                    if (
                        !Object.prototype.hasOwnProperty.call(
                            atomicMasses,
                            symbol
                        )
                    ) {
                        throw new Error(
                            `العنصر ${symbol} غير معروف`
                        );
                    }

                    const count =
                        parseNumber();

                    total +=
                        atomicMasses[symbol] * count;

                    continue;
                }


                throw new Error(
                    `رمز غير صحيح: ${formula[position]}`
                );
            }

            if (endChar && formula[position - 1] !== endChar) {
                throw new Error("قوس غير مغلق");
            }

            return total;
        }


        const mass = parseGroup();
window.lastChemistryResult = mass;

        if (position !== formula.length) {
            throw new Error("صيغة غير صحيحة");
        }


        result.innerHTML =
            `✅ M = ${mass.toFixed(3)} g/mol`;

        console.log(
            "🧪 MOLAR MASS:",
            formula,
            mass
        );

    } catch (error) {

        result.innerHTML =
            `❌ ${error.message}`;
    }
};

// ==========================================
// 🧪 CHEMISTRY - عدد المولات
// n = m / M
// ==========================================

window.chemistryMoles = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🧮 عدد المولات
        </div>

        <div style="margin:6px 0;">
            الكتلة m (g):
        </div>

        <input id="chemMolesMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:8px;
               ">

        <div style="margin:6px 0;">
            الكتلة المولية M (g/mol):
        </div>

        <input id="chemMolesMolarMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:10px;
               ">

        <button onclick="calculateChemistryMoles()"
                style="width:100%; padding:10px;">
            🧮 احسب عدد المولات
        </button>

        <div id="chemMolesResult"
             style="
                 margin-top:12px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:10px;
                ">
            ← رجوع للكيمياء
        </button>
    `);

    window.activeChemistryField = "chemMolesMass";

    document.getElementById("chemMolesMass")
        ?.addEventListener("focus", () => {
            window.activeChemistryField =
                "chemMolesMass";
        });

    document.getElementById("chemMolesMolarMass")
        ?.addEventListener("focus", () => {
            window.activeChemistryField =
                "chemMolesMolarMass";
        });
};

document.getElementById("chemMolesMass")
    ?.addEventListener("click", () => {
        window.activeChemistryField = "chemMolesMass";
    });

document.getElementById("chemMolesMolarMass")
    ?.addEventListener("click", () => {
        window.activeChemistryField = "chemMolesMolarMass";
    });



// ==========================================
// 🧮 حساب عدد المولات
// ==========================================

window.calculateChemistryMoles = function () {

    const mass =
        Number(
            document.getElementById("chemMolesMass")?.value
        );

    const molarMass =
        Number(
            document.getElementById("chemMolesMolarMass")?.value
        );

    const result =
        document.getElementById("chemMolesResult");

    if (!result) return;

    if (
        !Number.isFinite(mass) ||
        !Number.isFinite(molarMass)
    ) {
        result.innerHTML =
            "❌ أدخل جميع القيم";

        return;
    }

    if (molarMass === 0) {
        result.innerHTML =
            "❌ الكتلة المولية لا يمكن أن تساوي صفر";

        return;
    }

    const moles =
        mass / molarMass;
window.lastChemistryResult = moles;
    result.innerHTML =
        `✅ n = ${moles.toFixed(6)} mol`;

    console.log(
        "🧪 MOLES:",
        moles,
        "mol"
    );
};


// ==========================================
// 🧪 CHEMISTRY - عدد الجسيمات
// N = n × NA
// ==========================================

window.chemistryParticles = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🔬 عدد الجسيمات
        </div>

        <div style="margin:6px 0;">
            عدد المولات n (mol):
        </div>

        <input
            id="chemParticlesMoles"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:16px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateChemistryParticles()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🔬 احسب عدد الجسيمات
        </button>

        <div
            id="chemParticlesResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
            "
        >
        </div>

        <button
            onclick="openChemistryMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField =
        "chemParticlesMoles";
};


// ==========================================
// 🧮 حساب عدد الجسيمات
// ==========================================

window.calculateChemistryParticles = function () {

    const moles =
        Number(
            document.getElementById(
                "chemParticlesMoles"
            )?.value
        );

    const result =
        document.getElementById(
            "chemParticlesResult"
        );

    if (!result) return;

    if (!Number.isFinite(moles)) {

        result.innerHTML =
            "❌ أدخل عدد المولات";

        return;
    }

    // ثابت أفوجادرو
    const AVOGADRO =
        6.02214076e23;

    const particles =
        moles * AVOGADRO;

    result.innerHTML =
        `✅ N = ${particles.toExponential(6)} جسيم`;

    console.log(
        "🧪 PARTICLES:",
        particles
    );
};
// ==========================================
// 🧪 CHEMISTRY - التركيز المولاري
// C = n / V
// ==========================================

window.chemistryMolarity = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            💧 التركيز المولاري
        </div>

        <div style="margin:6px 0;">
            عدد المولات n (mol):
        </div>

        <input
            id="chemMolarityMoles"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:16px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <div style="margin:6px 0;">
            حجم المحلول V (L):
        </div>

        <input
            id="chemMolarityVolume"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:16px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateChemistryMolarity()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب التركيز
        </button>

        <div
            id="chemMolarityResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
            "
        >
        </div>

        <button
            onclick="openChemistryMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField =
        "chemMolarityMoles";

    document
        .getElementById("chemMolarityMoles")
        ?.addEventListener("click", () => {

            window.activeChemistryField =
                "chemMolarityMoles";
        });

    document
        .getElementById("chemMolarityVolume")
        ?.addEventListener("click", () => {

            window.activeChemistryField =
                "chemMolarityVolume";
        });
};


// ==========================================
// 🧮 حساب التركيز المولاري
// ==========================================

window.calculateChemistryMolarity = function () {

    const moles =
        Number(
            document.getElementById(
                "chemMolarityMoles"
            )?.value
        );

    const volume =
        Number(
            document.getElementById(
                "chemMolarityVolume"
            )?.value
        );

    const result =
        document.getElementById(
            "chemMolarityResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(moles) ||
        !Number.isFinite(volume)
    ) {

        result.innerHTML =
            "❌ أدخل جميع القيم";

        return;
    }

    if (volume === 0) {

        result.innerHTML =
            "❌ حجم المحلول لا يمكن أن يساوي صفر";

        return;
    }

    const concentration =
        moles / volume;

    result.innerHTML =
        `✅ C = ${concentration.toFixed(6)} mol/L`;

    console.log(
        "🧪 MOLARITY:",
        concentration,
        "mol/L"
    );
};
// ==========================================
// 🧪 CHEMISTRY - التخفيف
// C1 V1 = C2 V2
// ==========================================

window.chemistryDilution = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🧪 التخفيف
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:12px;
        ">
            C₁V₁ = C₂V₂
        </div>

        <div style="margin:6px 0;">
            التركيز الابتدائي C₁ (mol/L):
        </div>

        <input id="chemDilutionC1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;">
            الحجم الابتدائي V₁ (L):
        </div>

        <input id="chemDilutionV1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;">
            التركيز النهائي C₂ (mol/L):
        </div>

        <input id="chemDilutionC2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;">
            الحجم النهائي V₂ (L):
        </div>

        <input id="chemDilutionV2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:10px;
               ">

        <div style="
            margin-bottom:8px;
            font-weight:bold;
        ">
            اختر القيمة المجهولة:
        </div>

        <select id="chemDilutionUnknown"
                style="
                    width:90%;
                    padding:9px;
                    font-size:15px;
                    margin-bottom:10px;
                ">

            <option value="C1">C₁</option>
            <option value="V1">V₁</option>
            <option value="C2" selected>C₂</option>
            <option value="V2">V₂</option>

        </select>

        <button onclick="calculateChemistryDilution()"
                style="
                    width:100%;
                    padding:10px;
                ">
            🧮 احسب
        </button>

        <div id="chemDilutionResult"
             style="
                 margin-top:12px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:10px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField =
        "chemDilutionC1";

    [
        "chemDilutionC1",
        "chemDilutionV1",
        "chemDilutionC2",
        "chemDilutionV2"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب التخفيف
// ==========================================

window.calculateChemistryDilution = function () {

    const C1 =
        Number(
            document.getElementById(
                "chemDilutionC1"
            )?.value
        );

    const V1 =
        Number(
            document.getElementById(
                "chemDilutionV1"
            )?.value
        );

    const C2 =
        Number(
            document.getElementById(
                "chemDilutionC2"
            )?.value
        );

    const V2 =
        Number(
            document.getElementById(
                "chemDilutionV2"
            )?.value
        );

    const unknown =
        document.getElementById(
            "chemDilutionUnknown"
        )?.value;

    const result =
        document.getElementById(
            "chemDilutionResult"
        );

    if (!result) return;


    // ======================================
    // حساب C1
    // C1 = C2 × V2 / V1
    // ======================================

    if (unknown === "C1") {

        if (
            !Number.isFinite(C2) ||
            !Number.isFinite(V2) ||
            !Number.isFinite(V1)
        ) {
            result.innerHTML =
                "❌ أدخل C₂ و V₁ و V₂";
            return;
        }

        if (V1 === 0) {
            result.innerHTML =
                "❌ V₁ لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (C2 * V2) / V1;

        result.innerHTML =
            `✅ C₁ = ${answer.toFixed(6)} mol/L`;

        return;
    }


    // ======================================
    // حساب V1
    // V1 = C2 × V2 / C1
    // ======================================

    if (unknown === "V1") {

        if (
            !Number.isFinite(C2) ||
            !Number.isFinite(V2) ||
            !Number.isFinite(C1)
        ) {
            result.innerHTML =
                "❌ أدخل C₁ و C₂ و V₂";
            return;
        }

        if (C1 === 0) {
            result.innerHTML =
                "❌ C₁ لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (C2 * V2) / C1;

        result.innerHTML =
            `✅ V₁ = ${answer.toFixed(6)} L`;

        return;
    }


    // ======================================
    // حساب C2
    // C2 = C1 × V1 / V2
    // ======================================

    if (unknown === "C2") {

        if (
            !Number.isFinite(C1) ||
            !Number.isFinite(V1) ||
            !Number.isFinite(V2)
        ) {
            result.innerHTML =
                "❌ أدخل C₁ و V₁ و V₂";
            return;
        }

        if (V2 === 0) {
            result.innerHTML =
                "❌ V₂ لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (C1 * V1) / V2;

        result.innerHTML =
            `✅ C₂ = ${answer.toFixed(6)} mol/L`;

        return;
    }


    // ======================================
    // حساب V2
    // V2 = C1 × V1 / C2
    // ======================================

    if (unknown === "V2") {

        if (
            !Number.isFinite(C1) ||
            !Number.isFinite(V1) ||
            !Number.isFinite(C2)
        ) {
            result.innerHTML =
                "❌ أدخل C₁ و V₁ و C₂";
            return;
        }

        if (C2 === 0) {
            result.innerHTML =
                "❌ C₂ لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (C1 * V1) / C2;

        result.innerHTML =
            `✅ V₂ = ${answer.toFixed(6)} L`;

        return;
    }
};
// ==========================================
// 🧪 CHEMISTRY - النسبة المئوية الكتلية
// % = (mass solute / mass solution) × 100
// ==========================================

window.chemistryMassPercent = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ⚗️ النسبة المئوية الكتلية
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:12px;
        ">
            % = (كتلة المذاب ÷ كتلة المحلول) × 100
        </div>

        <div style="margin:6px 0;">
            كتلة المذاب (g):
        </div>

        <input
            id="chemMassPercentSolute"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:16px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <div style="margin:6px 0;">
            كتلة المحلول (g):
        </div>

        <input
            id="chemMassPercentSolution"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:16px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateChemistryMassPercent()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب النسبة
        </button>

        <div
            id="chemMassPercentResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
            "
        >
        </div>

        <button
            onclick="openChemistryMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField =
        "chemMassPercentSolute";

    document
        .getElementById("chemMassPercentSolute")
        ?.addEventListener("click", () => {

            window.activeChemistryField =
                "chemMassPercentSolute";
        });

    document
        .getElementById("chemMassPercentSolution")
        ?.addEventListener("click", () => {

            window.activeChemistryField =
                "chemMassPercentSolution";
        });
};


// ==========================================
// 🧮 حساب النسبة المئوية الكتلية
// ==========================================

window.calculateChemistryMassPercent = function () {

    const soluteMass =
        Number(
            document.getElementById(
                "chemMassPercentSolute"
            )?.value
        );

    const solutionMass =
        Number(
            document.getElementById(
                "chemMassPercentSolution"
            )?.value
        );

    const result =
        document.getElementById(
            "chemMassPercentResult"
        );

    if (!result) return;

    if (
        !Number.isFinite(soluteMass) ||
        !Number.isFinite(solutionMass)
    ) {

        result.innerHTML =
            "❌ أدخل جميع القيم";

        return;
    }

    if (solutionMass === 0) {

        result.innerHTML =
            "❌ كتلة المحلول لا يمكن أن تساوي صفر";

        return;
    }

    if (soluteMass < 0 || solutionMass < 0) {

        result.innerHTML =
            "❌ الكتل لا يمكن أن تكون سالبة";

        return;
    }

    if (soluteMass > solutionMass) {

        result.innerHTML =
            "❌ كتلة المذاب لا يمكن أن تكون أكبر من كتلة المحلول";

        return;
    }

    const percent =
        (soluteMass / solutionMass) * 100;

    result.innerHTML =
        `✅ ${percent.toFixed(6)} %`;

    console.log(
        "🧪 MASS PERCENT:",
        percent,
        "%"
    );
};
// ==========================================
// 🔥 CHEMISTRY - الحرارة والطاقة الكيميائية
// q = m × c × ΔT
// ==========================================

window.chemistryHeatEnergy = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🔥 الحرارة والطاقة الكيميائية
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:12px;
        ">
            q = m × c × ΔT
        </div>

        <div style="margin:6px 0;">
            الكتلة m (g):
        </div>

        <input id="chemHeatMass"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;">
            الحرارة النوعية c (J/g°C):
        </div>

        <input id="chemHeatSpecific"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;">
            التغير في درجة الحرارة ΔT (°C):
        </div>

        <input id="chemHeatDeltaT"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;">
            الحرارة q (J):
        </div>

        <input id="chemHeatQ"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:9px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:10px;
               ">

        <div style="
            margin-bottom:7px;
            font-weight:bold;
        ">
            اختر القيمة المجهولة:
        </div>

        <select id="chemHeatUnknown"
                style="
                    width:90%;
                    padding:9px;
                    font-size:15px;
                    margin-bottom:10px;
                ">

            <option value="q" selected>q</option>
            <option value="m">m</option>
            <option value="c">c</option>
            <option value="deltaT">ΔT</option>

        </select>

        <button onclick="calculateChemistryHeatEnergy()"
                style="
                    width:100%;
                    padding:10px;
                ">
            🧮 احسب
        </button>

        <div id="chemHeatResult"
             style="
                 margin-top:12px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:10px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField = "chemHeatMass";

    [
        "chemHeatMass",
        "chemHeatSpecific",
        "chemHeatDeltaT",
        "chemHeatQ"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب q = m × c × ΔT
// ==========================================

window.calculateChemistryHeatEnergy = function () {

    const m =
        Number(
            document.getElementById(
                "chemHeatMass"
            )?.value
        );

    const c =
        Number(
            document.getElementById(
                "chemHeatSpecific"
            )?.value
        );

    const deltaT =
        Number(
            document.getElementById(
                "chemHeatDeltaT"
            )?.value
        );

    const q =
        Number(
            document.getElementById(
                "chemHeatQ"
            )?.value
        );

    const unknown =
        document.getElementById(
            "chemHeatUnknown"
        )?.value;

    const result =
        document.getElementById(
            "chemHeatResult"
        );

    if (!result) return;


    // ======================================
    // حساب q
    // q = m × c × ΔT
    // ======================================

    if (unknown === "q") {

        if (
            !Number.isFinite(m) ||
            !Number.isFinite(c) ||
            !Number.isFinite(deltaT)
        ) {

            result.innerHTML =
                "❌ أدخل m و c و ΔT";

            return;
        }

        const answer =
            m * c * deltaT;

        result.innerHTML =
            `✅ q = ${answer.toFixed(6)} J`;

        return;
    }


    // ======================================
    // حساب m
    // m = q / (c × ΔT)
    // ======================================

    if (unknown === "m") {

        if (
            !Number.isFinite(q) ||
            !Number.isFinite(c) ||
            !Number.isFinite(deltaT)
        ) {

            result.innerHTML =
                "❌ أدخل q و c و ΔT";

            return;
        }

        const denominator =
            c * deltaT;

        if (denominator === 0) {

            result.innerHTML =
                "❌ لا يمكن القسمة على صفر";

            return;
        }

        const answer =
            q / denominator;

        result.innerHTML =
            `✅ m = ${answer.toFixed(6)} g`;

        return;
    }


    // ======================================
    // حساب c
    // c = q / (m × ΔT)
    // ======================================

    if (unknown === "c") {

        if (
            !Number.isFinite(q) ||
            !Number.isFinite(m) ||
            !Number.isFinite(deltaT)
        ) {

            result.innerHTML =
                "❌ أدخل q و m و ΔT";

            return;
        }

        const denominator =
            m * deltaT;

        if (denominator === 0) {

            result.innerHTML =
                "❌ لا يمكن القسمة على صفر";

            return;
        }

        const answer =
            q / denominator;

        result.innerHTML =
            `✅ c = ${answer.toFixed(6)} J/g°C`;

        return;
    }


    // ======================================
    // حساب ΔT
    // ΔT = q / (m × c)
    // ======================================

    if (unknown === "deltaT") {

        if (
            !Number.isFinite(q) ||
            !Number.isFinite(m) ||
            !Number.isFinite(c)
        ) {

            result.innerHTML =
                "❌ أدخل q و m و c";

            return;
        }

        const denominator =
            m * c;

        if (denominator === 0) {

            result.innerHTML =
                "❌ لا يمكن القسمة على صفر";

            return;
        }

        const answer =
            q / denominator;

        result.innerHTML =
            `✅ ΔT = ${answer.toFixed(6)} °C`;

        return;
    }
};
// ==========================================
// 🎈 CHEMISTRY - قانون الغاز المثالي
// PV = nRT
// ==========================================

window.chemistryIdealGas = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🎈 قانون الغاز المثالي
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:10px;
        ">
            PV = nRT
        </div>

        <div style="margin:5px 0;">
            الضغط P (atm):
        </div>

        <input id="chemGasP"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            الحجم V (L):
        </div>

        <input id="chemGasV"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            عدد المولات n (mol):
        </div>

        <input id="chemGasN"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            درجة الحرارة T (K):
        </div>

        <input id="chemGasT"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            ثابت الغاز R:
        </div>

        <input id="chemGasR"
               type="text"
               value="0.082057"
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:8px;
               ">

        <div style="
            margin-bottom:6px;
            font-weight:bold;
        ">
            اختر المجهول:
        </div>

        <select id="chemGasUnknown"
                style="
                    width:90%;
                    padding:8px;
                    font-size:15px;
                    margin-bottom:8px;
                ">

            <option value="P" selected>P — الضغط</option>
            <option value="V">V — الحجم</option>
            <option value="n">n — عدد المولات</option>
            <option value="T">T — درجة الحرارة</option>

        </select>

        <button onclick="calculateChemistryIdealGas()"
                style="
                    width:100%;
                    padding:9px;
                ">
            🧮 احسب
        </button>

        <div id="chemGasResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:8px;
                    margin-top:8px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField = "chemGasP";

    [
        "chemGasP",
        "chemGasV",
        "chemGasN",
        "chemGasT"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب PV = nRT
// ==========================================

window.calculateChemistryIdealGas = function () {

    const P =
        Number(document.getElementById("chemGasP")?.value);

    const V =
        Number(document.getElementById("chemGasV")?.value);

    const n =
        Number(document.getElementById("chemGasN")?.value);

    const T =
        Number(document.getElementById("chemGasT")?.value);

    const R =
        Number(document.getElementById("chemGasR")?.value);

    const unknown =
        document.getElementById("chemGasUnknown")?.value;

    const result =
        document.getElementById("chemGasResult");

    if (!result) return;

    if (!Number.isFinite(R) || R === 0) {

        result.innerHTML =
            "❌ ثابت الغاز R غير صحيح";

        return;
    }


    // ======================================
    // حساب P
    // P = nRT / V
    // ======================================

    if (unknown === "P") {

        if (
            !Number.isFinite(n) ||
            !Number.isFinite(T) ||
            !Number.isFinite(V)
        ) {

            result.innerHTML =
                "❌ أدخل n و T و V";

            return;
        }

        if (V === 0) {

            result.innerHTML =
                "❌ الحجم V لا يمكن أن يساوي صفر";

            return;
        }

        const answer =
            (n * R * T) / V;

        result.innerHTML =
            `✅ P = ${answer.toFixed(6)} atm`;

        return;
    }


    // ======================================
    // حساب V
    // V = nRT / P
    // ======================================

    if (unknown === "V") {

        if (
            !Number.isFinite(n) ||
            !Number.isFinite(T) ||
            !Number.isFinite(P)
        ) {

            result.innerHTML =
                "❌ أدخل P و n و T";

            return;
        }

        if (P === 0) {

            result.innerHTML =
                "❌ الضغط P لا يمكن أن يساوي صفر";

            return;
        }

        const answer =
            (n * R * T) / P;

        result.innerHTML =
            `✅ V = ${answer.toFixed(6)} L`;

        return;
    }


    // ======================================
    // حساب n
    // n = PV / RT
    // ======================================

    if (unknown === "n") {

        if (
            !Number.isFinite(P) ||
            !Number.isFinite(V) ||
            !Number.isFinite(T)
        ) {

            result.innerHTML =
                "❌ أدخل P و V و T";

            return;
        }

        if (T === 0) {

            result.innerHTML =
                "❌ درجة الحرارة T لا يمكن أن تساوي صفر";

            return;
        }

        const answer =
            (P * V) / (R * T);

        result.innerHTML =
            `✅ n = ${answer.toFixed(6)} mol`;

        return;
    }


    // ======================================
    // حساب T
    // T = PV / nR
    // ======================================

    if (unknown === "T") {

        if (
            !Number.isFinite(P) ||
            !Number.isFinite(V) ||
            !Number.isFinite(n)
        ) {

            result.innerHTML =
                "❌ أدخل P و V و n";

            return;
        }

        if (n === 0) {

            result.innerHTML =
                "❌ عدد المولات n لا يمكن أن يساوي صفر";

            return;
        }

        const answer =
            (P * V) / (n * R);

        result.innerHTML =
            `✅ T = ${answer.toFixed(6)} K`;

        return;
    }
};
// ==========================================
// 📉 CHEMISTRY - قانون بويل
// P₁V₁ = P₂V₂
// ==========================================

window.chemistryBoyle = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📉 قانون بويل
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:10px;
        ">
            P₁V₁ = P₂V₂
        </div>

        <div style="margin:5px 0;">
            الضغط الأول P₁ (atm):
        </div>

        <input id="chemBoyleP1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            الحجم الأول V₁ (L):
        </div>

        <input id="chemBoyleV1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            الضغط الثاني P₂ (atm):
        </div>

        <input id="chemBoyleP2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            الحجم الثاني V₂ (L):
        </div>

        <input id="chemBoyleV2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:8px;
               ">

        <div style="
            margin-bottom:6px;
            font-weight:bold;
        ">
            اختر المجهول:
        </div>

        <select id="chemBoyleUnknown"
                style="
                    width:90%;
                    padding:8px;
                    font-size:15px;
                    margin-bottom:8px;
                ">

            <option value="P1">P₁ — الضغط الأول</option>
            <option value="V1">V₁ — الحجم الأول</option>
            <option value="P2">P₂ — الضغط الثاني</option>
            <option value="V2" selected>V₂ — الحجم الثاني</option>

        </select>

        <button onclick="calculateChemistryBoyle()"
                style="
                    width:100%;
                    padding:9px;
                ">
            🧮 احسب
        </button>

        <div id="chemBoyleResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:8px;
                    margin-top:8px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField = "chemBoyleP1";

    [
        "chemBoyleP1",
        "chemBoyleV1",
        "chemBoyleP2",
        "chemBoyleV2"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب قانون بويل
// ==========================================

window.calculateChemistryBoyle = function () {

    const P1 =
        Number(document.getElementById("chemBoyleP1")?.value);

    const V1 =
        Number(document.getElementById("chemBoyleV1")?.value);

    const P2 =
        Number(document.getElementById("chemBoyleP2")?.value);

    const V2 =
        Number(document.getElementById("chemBoyleV2")?.value);

    const unknown =
        document.getElementById("chemBoyleUnknown")?.value;

    const result =
        document.getElementById("chemBoyleResult");

    if (!result) return;


    // ======================================
    // P₁ = P₂V₂ / V₁
    // ======================================

    if (unknown === "P1") {

        if (
            !Number.isFinite(P2) ||
            !Number.isFinite(V2) ||
            !Number.isFinite(V1)
        ) {

            result.innerHTML =
                "❌ أدخل P₂ و V₁ و V₂";

            return;
        }

        if (V1 === 0) {

            result.innerHTML =
                "❌ V₁ لا يمكن أن يساوي صفر";

            return;
        }

        const answer =
            (P2 * V2) / V1;

        result.innerHTML =
            `✅ P₁ = ${answer.toFixed(6)} atm`;

        return;
    }


    // ======================================
    // V₁ = P₂V₂ / P₁
    // ======================================

    if (unknown === "V1") {

        if (
            !Number.isFinite(P2) ||
            !Number.isFinite(V2) ||
            !Number.isFinite(P1)
        ) {

            result.innerHTML =
                "❌ أدخل P₁ و P₂ و V₂";

            return;
        }

        if (P1 === 0) {

            result.innerHTML =
                "❌ P₁ لا يمكن أن يساوي صفر";

            return;
        }

        const answer =
            (P2 * V2) / P1;

        result.innerHTML =
            `✅ V₁ = ${answer.toFixed(6)} L`;

        return;
    }


    // ======================================
    // P₂ = P₁V₁ / V₂
    // ======================================

    if (unknown === "P2") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(V1) ||
            !Number.isFinite(V2)
        ) {

            result.innerHTML =
                "❌ أدخل P₁ و V₁ و V₂";

            return;
        }

        if (V2 === 0) {

            result.innerHTML =
                "❌ V₂ لا يمكن أن يساوي صفر";

            return;
        }

        const answer =
            (P1 * V1) / V2;

        result.innerHTML =
            `✅ P₂ = ${answer.toFixed(6)} atm`;

        return;
    }


    // ======================================
    // V₂ = P₁V₁ / P₂
    // ======================================

    if (unknown === "V2") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(V1) ||
            !Number.isFinite(P2)
        ) {

            result.innerHTML =
                "❌ أدخل P₁ و V₁ و P₂";

            return;
        }

        if (P2 === 0) {

            result.innerHTML =
                "❌ P₂ لا يمكن أن يساوي صفر";

            return;
        }

        const answer =
            (P1 * V1) / P2;

        result.innerHTML =
            `✅ V₂ = ${answer.toFixed(6)} L`;

        return;
    }
};
// ==========================================
// 🌡️ CHEMISTRY - قانون شارل
// V₁ / T₁ = V₂ / T₂
// ==========================================

window.chemistryCharles = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            🌡️ قانون شارل
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:10px;
        ">
            V₁ / T₁ = V₂ / T₂
        </div>

        <div style="margin:5px 0;">
            الحجم الأول V₁ (L):
        </div>

        <input id="chemCharlesV1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            درجة الحرارة الأولى T₁ (K):
        </div>

        <input id="chemCharlesT1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            الحجم الثاني V₂ (L):
        </div>

        <input id="chemCharlesV2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            درجة الحرارة الثانية T₂ (K):
        </div>

        <input id="chemCharlesT2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:8px;
               ">

        <div style="
            margin-bottom:6px;
            font-weight:bold;
        ">
            اختر المجهول:
        </div>

        <select id="chemCharlesUnknown"
                style="
                    width:90%;
                    padding:8px;
                    font-size:15px;
                    margin-bottom:8px;
                ">

            <option value="V1">V₁ — الحجم الأول</option>
            <option value="T1">T₁ — درجة الحرارة الأولى</option>
            <option value="V2" selected>V₂ — الحجم الثاني</option>
            <option value="T2">T₂ — درجة الحرارة الثانية</option>

        </select>

        <button onclick="calculateChemistryCharles()"
                style="
                    width:100%;
                    padding:9px;
                ">
            🧮 احسب
        </button>

        <div id="chemCharlesResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:8px;
                    margin-top:8px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField = "chemCharlesV1";

    [
        "chemCharlesV1",
        "chemCharlesT1",
        "chemCharlesV2",
        "chemCharlesT2"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب قانون شارل
// V₁ / T₁ = V₂ / T₂
// ==========================================

window.calculateChemistryCharles = function () {

    const V1 =
        Number(document.getElementById("chemCharlesV1")?.value);

    const T1 =
        Number(document.getElementById("chemCharlesT1")?.value);

    const V2 =
        Number(document.getElementById("chemCharlesV2")?.value);

    const T2 =
        Number(document.getElementById("chemCharlesT2")?.value);

    const unknown =
        document.getElementById("chemCharlesUnknown")?.value;

    const result =
        document.getElementById("chemCharlesResult");

    if (!result) return;


    // ======================================
    // V₁ = V₂ × T₁ / T₂
    // ======================================

    if (unknown === "V1") {

        if (
            !Number.isFinite(V2) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(T2)
        ) {

            result.innerHTML =
                "❌ أدخل V₂ و T₁ و T₂";

            return;
        }

        if (T2 === 0) {

            result.innerHTML =
                "❌ T₂ لا يمكن أن تساوي صفر";

            return;
        }

        const answer =
            (V2 * T1) / T2;

        result.innerHTML =
            `✅ V₁ = ${answer.toFixed(6)} L`;

        return;
    }


    // ======================================
    // T₁ = V₁ × T₂ / V₂
    // ======================================

    if (unknown === "T1") {

        if (
            !Number.isFinite(V1) ||
            !Number.isFinite(V2) ||
            !Number.isFinite(T2)
        ) {

            result.innerHTML =
                "❌ أدخل V₁ و V₂ و T₂";

            return;
        }

        if (V2 === 0) {

            result.innerHTML =
                "❌ V₂ لا يمكن أن يساوي صفر";

            return;
        }

        const answer =
            (V1 * T2) / V2;

        result.innerHTML =
            `✅ T₁ = ${answer.toFixed(6)} K`;

        return;
    }


    // ======================================
    // V₂ = V₁ × T₂ / T₁
    // ======================================

    if (unknown === "V2") {

        if (
            !Number.isFinite(V1) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(T2)
        ) {

            result.innerHTML =
                "❌ أدخل V₁ و T₁ و T₂";

            return;
        }

        if (T1 === 0) {

            result.innerHTML =
                "❌ T₁ لا يمكن أن تساوي صفر";

            return;
        }

        const answer =
            (V1 * T2) / T1;

        result.innerHTML =
            `✅ V₂ = ${answer.toFixed(6)} L`;

        return;
    }


    // ======================================
    // T₂ = V₂ × T₁ / V₁
    // ======================================

    if (unknown === "T2") {

        if (
            !Number.isFinite(V1) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(V2)
        ) {

            result.innerHTML =
                "❌ أدخل V₁ و T₁ و V₂";

            return;
        }

        if (V1 === 0) {

            result.innerHTML =
                "❌ V₁ لا يمكن أن يساوي صفر";

            return;
        }

        const answer =
            (V2 * T1) / V1;

        result.innerHTML =
            `✅ T₂ = ${answer.toFixed(6)} K`;

        return;
    }
};
// ==========================================
// 📈 CHEMISTRY - قانون جاي-لوساك
// P₁ / T₁ = P₂ / T₂
// ==========================================

window.chemistryGayLussac = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:10px;
        ">
            📈 قانون جاي-لوساك
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:10px;
        ">
            P₁ / T₁ = P₂ / T₂
        </div>

        <div style="margin:5px 0;">
            الضغط الأول P₁:
        </div>

        <input id="chemGayP1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            درجة الحرارة الأولى T₁ (K):
        </div>

        <input id="chemGayT1"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            الضغط الثاني P₂:
        </div>

        <input id="chemGayP2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:6px;
               ">

        <div style="margin:5px 0;">
            درجة الحرارة الثانية T₂ (K):
        </div>

        <input id="chemGayT2"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:8px;
               ">

        <div style="
            margin-bottom:6px;
            font-weight:bold;
        ">
            اختر المجهول:
        </div>

        <select id="chemGayUnknown"
                style="
                    width:90%;
                    padding:8px;
                    font-size:15px;
                    margin-bottom:8px;
                ">

            <option value="P1">
                P₁ — الضغط الأول
            </option>

            <option value="T1">
                T₁ — درجة الحرارة الأولى
            </option>

            <option value="P2" selected>
                P₂ — الضغط الثاني
            </option>

            <option value="T2">
                T₂ — درجة الحرارة الثانية
            </option>

        </select>

        <button onclick="calculateChemistryGayLussac()"
                style="
                    width:100%;
                    padding:9px;
                ">
            🧮 احسب
        </button>

        <div id="chemGayResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:8px;
                    margin-top:8px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField = "chemGayP1";

    [
        "chemGayP1",
        "chemGayT1",
        "chemGayP2",
        "chemGayT2"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب قانون جاي-لوساك
// P₁ / T₁ = P₂ / T₂
// ==========================================

window.calculateChemistryGayLussac = function () {

    const P1 =
        Number(document.getElementById("chemGayP1")?.value);

    const T1 =
        Number(document.getElementById("chemGayT1")?.value);

    const P2 =
        Number(document.getElementById("chemGayP2")?.value);

    const T2 =
        Number(document.getElementById("chemGayT2")?.value);

    const unknown =
        document.getElementById("chemGayUnknown")?.value;

    const result =
        document.getElementById("chemGayResult");

    if (!result) return;


    // ======================================
    // P₁ = P₂ × T₁ / T₂
    // ======================================

    if (unknown === "P1") {

        if (
            !Number.isFinite(P2) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(T2)
        ) {
            result.innerHTML =
                "❌ أدخل P₂ و T₁ و T₂";
            return;
        }

        if (T2 === 0) {
            result.innerHTML =
                "❌ T₂ لا يمكن أن تساوي صفر";
            return;
        }

        const answer =
            (P2 * T1) / T2;

        result.innerHTML =
            `✅ P₁ = ${answer.toFixed(6)}`;

        return;
    }


    // ======================================
    // T₁ = P₁ × T₂ / P₂
    // ======================================

    if (unknown === "T1") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(P2) ||
            !Number.isFinite(T2)
        ) {
            result.innerHTML =
                "❌ أدخل P₁ و P₂ و T₂";
            return;
        }

        if (P2 === 0) {
            result.innerHTML =
                "❌ P₂ لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (P1 * T2) / P2;

        result.innerHTML =
            `✅ T₁ = ${answer.toFixed(6)} K`;

        return;
    }


    // ======================================
    // P₂ = P₁ × T₂ / T₁
    // ======================================

    if (unknown === "P2") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(T2)
        ) {
            result.innerHTML =
                "❌ أدخل P₁ و T₁ و T₂";
            return;
        }

        if (T1 === 0) {
            result.innerHTML =
                "❌ T₁ لا يمكن أن تساوي صفر";
            return;
        }

        const answer =
            (P1 * T2) / T1;

        result.innerHTML =
            `✅ P₂ = ${answer.toFixed(6)}`;

        return;
    }


    // ======================================
    // T₂ = P₂ × T₁ / P₁
    // ======================================

    if (unknown === "T2") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(P2)
        ) {
            result.innerHTML =
                "❌ أدخل P₁ و T₁ و P₂";
            return;
        }

        if (P1 === 0) {
            result.innerHTML =
                "❌ P₁ لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (P2 * T1) / P1;

        result.innerHTML =
            `✅ T₂ = ${answer.toFixed(6)} K`;

        return;
    }
};
// ==========================================
// 🧊 CHEMISTRY - قانون الغاز العام
// P₁V₁ / T₁ = P₂V₂ / T₂
// ==========================================

window.chemistryCombinedGas = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:8px;
        ">
            🧊 قانون الغاز العام
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:8px;
        ">
            P₁V₁ / T₁ = P₂V₂ / T₂
        </div>

        <div style="margin:4px 0;">الضغط الأول P₁:</div>
        <input id="chemGasP1" type="text" readonly dir="ltr"
            style="width:90%;padding:7px;font-size:15px;text-align:center;margin-bottom:5px;">

        <div style="margin:4px 0;">الحجم الأول V₁ (L):</div>
        <input id="chemGasV1" type="text" readonly dir="ltr"
            style="width:90%;padding:7px;font-size:15px;text-align:center;margin-bottom:5px;">

        <div style="margin:4px 0;">درجة الحرارة الأولى T₁ (K):</div>
        <input id="chemGasT1" type="text" readonly dir="ltr"
            style="width:90%;padding:7px;font-size:15px;text-align:center;margin-bottom:5px;">

        <div style="margin:4px 0;">الضغط الثاني P₂:</div>
        <input id="chemGasP2" type="text" readonly dir="ltr"
            style="width:90%;padding:7px;font-size:15px;text-align:center;margin-bottom:5px;">

        <div style="margin:4px 0;">الحجم الثاني V₂ (L):</div>
        <input id="chemGasV2" type="text" readonly dir="ltr"
            style="width:90%;padding:7px;font-size:15px;text-align:center;margin-bottom:5px;">

        <div style="margin:4px 0;">درجة الحرارة الثانية T₂ (K):</div>
        <input id="chemGasT2" type="text" readonly dir="ltr"
            style="width:90%;padding:7px;font-size:15px;text-align:center;margin-bottom:7px;">

        <div style="
            margin-bottom:5px;
            font-weight:bold;
        ">
            اختر المجهول:
        </div>

        <select id="chemGasUnknown"
                style="
                    width:90%;
                    padding:7px;
                    font-size:14px;
                    margin-bottom:7px;
                ">

            <option value="P1">P₁ — الضغط الأول</option>
            <option value="V1">V₁ — الحجم الأول</option>
            <option value="T1">T₁ — درجة الحرارة الأولى</option>

            <option value="P2" selected>P₂ — الضغط الثاني</option>
            <option value="V2">V₂ — الحجم الثاني</option>
            <option value="T2">T₂ — درجة الحرارة الثانية</option>

        </select>

        <button onclick="calculateChemistryCombinedGas()"
                style="width:100%;padding:8px;">
            🧮 احسب
        </button>

        <div id="chemGasResult"
             style="
                 margin-top:8px;
                 text-align:center;
                 font-weight:bold;
                 font-size:14px;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:7px;
                    margin-top:7px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField = "chemGasP1";

    [
        "chemGasP1",
        "chemGasV1",
        "chemGasT1",
        "chemGasP2",
        "chemGasV2",
        "chemGasT2"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب قانون الغاز العام
// P₁V₁ / T₁ = P₂V₂ / T₂
// ==========================================

window.calculateChemistryCombinedGas = function () {

    const P1 = Number(
        document.getElementById("chemGasP1")?.value
    );

    const V1 = Number(
        document.getElementById("chemGasV1")?.value
    );

    const T1 = Number(
        document.getElementById("chemGasT1")?.value
    );

    const P2 = Number(
        document.getElementById("chemGasP2")?.value
    );

    const V2 = Number(
        document.getElementById("chemGasV2")?.value
    );

    const T2 = Number(
        document.getElementById("chemGasT2")?.value
    );

    const unknown =
        document.getElementById("chemGasUnknown")?.value;

    const result =
        document.getElementById("chemGasResult");

    if (!result) return;


    // ======================================
    // P₁ = P₂ × V₂ × T₁ / (T₂ × V₁)
    // ======================================

    if (unknown === "P1") {

        if (
            !Number.isFinite(P2) ||
            !Number.isFinite(V1) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(V2) ||
            !Number.isFinite(T2)
        ) {
            result.innerHTML =
                "❌ أدخل P₂ و V₁ و T₁ و V₂ و T₂";
            return;
        }

        if (V1 === 0 || T2 === 0) {
            result.innerHTML =
                "❌ المقام لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (P2 * V2 * T1) / (T2 * V1);

        result.innerHTML =
            `✅ P₁ = ${answer.toFixed(6)}`;

        return;
    }


    // ======================================
    // V₁ = P₂ × V₂ × T₁ / (T₂ × P₁)
    // ======================================

    if (unknown === "V1") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(P2) ||
            !Number.isFinite(V2) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(T2)
        ) {
            result.innerHTML =
                "❌ أدخل P₁ و P₂ و V₂ و T₁ و T₂";
            return;
        }

        if (P1 === 0 || T2 === 0) {
            result.innerHTML =
                "❌ المقام لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (P2 * V2 * T1) / (T2 * P1);

        result.innerHTML =
            `✅ V₁ = ${answer.toFixed(6)} L`;

        return;
    }


    // ======================================
    // T₁ = P₁ × V₁ × T₂ / (P₂ × V₂)
    // ======================================

    if (unknown === "T1") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(V1) ||
            !Number.isFinite(P2) ||
            !Number.isFinite(V2) ||
            !Number.isFinite(T2)
        ) {
            result.innerHTML =
                "❌ أدخل P₁ و V₁ و P₂ و V₂ و T₂";
            return;
        }

        if (P2 === 0 || V2 === 0) {
            result.innerHTML =
                "❌ المقام لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (P1 * V1 * T2) / (P2 * V2);

        result.innerHTML =
            `✅ T₁ = ${answer.toFixed(6)} K`;

        return;
    }


    // ======================================
    // P₂ = P₁ × V₁ × T₂ / (T₁ × V₂)
    // ======================================

    if (unknown === "P2") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(V1) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(V2) ||
            !Number.isFinite(T2)
        ) {
            result.innerHTML =
                "❌ أدخل P₁ و V₁ و T₁ و V₂ و T₂";
            return;
        }

        if (T1 === 0 || V2 === 0) {
            result.innerHTML =
                "❌ المقام لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (P1 * V1 * T2) / (T1 * V2);

        result.innerHTML =
            `✅ P₂ = ${answer.toFixed(6)}`;

        return;
    }


    // ======================================
    // V₂ = P₁ × V₁ × T₂ / (T₁ × P₂)
    // ======================================

    if (unknown === "V2") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(V1) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(P2) ||
            !Number.isFinite(T2)
        ) {
            result.innerHTML =
                "❌ أدخل P₁ و V₁ و T₁ و P₂ و T₂";
            return;
        }

        if (T1 === 0 || P2 === 0) {
            result.innerHTML =
                "❌ المقام لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (P1 * V1 * T2) / (T1 * P2);

        result.innerHTML =
            `✅ V₂ = ${answer.toFixed(6)} L`;

        return;
    }


    // ======================================
    // T₂ = P₂ × V₂ × T₁ / (P₁ × V₁)
    // ======================================

    if (unknown === "T2") {

        if (
            !Number.isFinite(P1) ||
            !Number.isFinite(V1) ||
            !Number.isFinite(T1) ||
            !Number.isFinite(P2) ||
            !Number.isFinite(V2)
        ) {
            result.innerHTML =
                "❌ أدخل P₁ و V₁ و T₁ و P₂ و V₂";
            return;
        }

        if (P1 === 0 || V1 === 0) {
            result.innerHTML =
                "❌ المقام لا يمكن أن يساوي صفر";
            return;
        }

        const answer =
            (P2 * V2 * T1) / (P1 * V1);

        result.innerHTML =
            `✅ T₂ = ${answer.toFixed(6)} K`;

        return;
    }
};
// ==========================================
// ⚖️ CHEMISTRY - ثابت الاتزان Kc
// aA + bB ⇌ cC + dD
// Kc = [C]^c [D]^d / [A]^a [B]^b
// ==========================================

window.chemistryKc = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:8px;
        ">
            ⚖️ ثابت الاتزان Kc
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
            direction:ltr;
        ">
            aA + bB ⇌ cC + dD
        </div>

        <!-- A -->

        <div style="margin:4px 0;font-weight:bold;">
            المتفاعل A
        </div>

        <div style="display:flex;gap:5px;margin-bottom:6px;">

            <input id="chemKcAcoef"
                   type="text"
                   readonly
                   placeholder="المعامل"
                   dir="ltr"
                   style="
                       width:35%;
                       padding:7px;
                       font-size:14px;
                       text-align:center;
                   ">

            <input id="chemKcAconc"
                   type="text"
                   readonly
                   placeholder="[A]"
                   dir="ltr"
                   style="
                       width:65%;
                       padding:7px;
                       font-size:14px;
                       text-align:center;
                   ">

        </div>

        <!-- B -->

        <div style="margin:4px 0;font-weight:bold;">
            المتفاعل B
        </div>

        <div style="display:flex;gap:5px;margin-bottom:6px;">

            <input id="chemKcBcoef"
                   type="text"
                   readonly
                   placeholder="المعامل"
                   dir="ltr"
                   style="
                       width:35%;
                       padding:7px;
                       font-size:14px;
                       text-align:center;
                   ">

            <input id="chemKcBconc"
                   type="text"
                   readonly
                   placeholder="[B]"
                   dir="ltr"
                   style="
                       width:65%;
                       padding:7px;
                       font-size:14px;
                       text-align:center;
                   ">

        </div>

        <!-- C -->

        <div style="margin:4px 0;font-weight:bold;">
            الناتج C
        </div>

        <div style="display:flex;gap:5px;margin-bottom:6px;">

            <input id="chemKcCcoef"
                   type="text"
                   readonly
                   placeholder="المعامل"
                   dir="ltr"
                   style="
                       width:35%;
                       padding:7px;
                       font-size:14px;
                       text-align:center;
                   ">

            <input id="chemKcCconc"
                   type="text"
                   readonly
                   placeholder="[C]"
                   dir="ltr"
                   style="
                       width:65%;
                       padding:7px;
                       font-size:14px;
                       text-align:center;
                   ">

        </div>

        <!-- D -->

        <div style="margin:4px 0;font-weight:bold;">
            الناتج D
        </div>

        <div style="display:flex;gap:5px;margin-bottom:8px;">

            <input id="chemKcDcoef"
                   type="text"
                   readonly
                   placeholder="المعامل"
                   dir="ltr"
                   style="
                       width:35%;
                       padding:7px;
                       font-size:14px;
                       text-align:center;
                   ">

            <input id="chemKcDconc"
                   type="text"
                   readonly
                   placeholder="[D]"
                   dir="ltr"
                   style="
                       width:65%;
                       padding:7px;
                       font-size:14px;
                       text-align:center;
                   ">

        </div>

        <button onclick="calculateChemistryKc()"
                style="
                    width:100%;
                    padding:8px;
                ">
            🧮 احسب Kc
        </button>

        <div id="chemKcResult"
             style="
                 margin-top:9px;
                 text-align:center;
                 font-weight:bold;
                 font-size:14px;
                 direction:ltr;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:7px;
                    margin-top:7px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    // أول خانة نشطة
    window.activeChemistryField = "chemKcAcoef";

    [
        "chemKcAcoef",
        "chemKcAconc",
        "chemKcBcoef",
        "chemKcBconc",
        "chemKcCcoef",
        "chemKcCconc",
        "chemKcDcoef",
        "chemKcDconc"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب Kc
// ==========================================

window.calculateChemistryKc = function () {

    const Acoef = Number(
        document.getElementById("chemKcAcoef")?.value
    );

    const Aconc = Number(
        document.getElementById("chemKcAconc")?.value
    );

    const Bcoef = Number(
        document.getElementById("chemKcBcoef")?.value
    );

    const Bconc = Number(
        document.getElementById("chemKcBconc")?.value
    );

    const Ccoef = Number(
        document.getElementById("chemKcCcoef")?.value
    );

    const Cconc = Number(
        document.getElementById("chemKcCconc")?.value
    );

    const Dcoef = Number(
        document.getElementById("chemKcDcoef")?.value
    );

    const Dconc = Number(
        document.getElementById("chemKcDconc")?.value
    );

    const result =
        document.getElementById("chemKcResult");

    if (!result) return;


    // ======================================
    // التحقق
    // ======================================

    if (
        !Number.isFinite(Acoef) ||
        !Number.isFinite(Aconc) ||
        !Number.isFinite(Bcoef) ||
        !Number.isFinite(Bconc) ||
        !Number.isFinite(Ccoef) ||
        !Number.isFinite(Cconc) ||
        !Number.isFinite(Dcoef) ||
        !Number.isFinite(Dconc)
    ) {

        result.innerHTML =
            "❌ أدخل جميع القيم";

        return;
    }


    if (
        Acoef <= 0 ||
        Bcoef <= 0 ||
        Ccoef <= 0 ||
        Dcoef <= 0
    ) {

        result.innerHTML =
            "❌ المعاملات يجب أن تكون أكبر من صفر";

        return;
    }


    if (
        Aconc < 0 ||
        Bconc < 0 ||
        Cconc < 0 ||
        Dconc < 0
    ) {

        result.innerHTML =
            "❌ التركيز لا يمكن أن يكون سالبًا";

        return;
    }


    // ======================================
    // المقام
    // ======================================

    const denominator =
        Math.pow(Aconc, Acoef) *
        Math.pow(Bconc, Bcoef);


    if (denominator === 0) {

        result.innerHTML =
            "❌ لا يمكن أن يكون المقام صفرًا";

        return;
    }


    // ======================================
    // البسط
    // ======================================

    const numerator =
        Math.pow(Cconc, Ccoef) *
        Math.pow(Dconc, Dcoef);


    // ======================================
    // Kc
    // ======================================

    const Kc =
        numerator / denominator;


    if (!Number.isFinite(Kc)) {

        result.innerHTML =
            "❌ النتيجة كبيرة جدًا أو غير صالحة";

        return;
    }


    result.innerHTML =
        `✅ Kc = ${Kc.toFixed(6)}`;

    console.log(
        "⚖️ Kc:",
        Kc
    );
};
// ==========================================
// 🧪 CHEMISTRY - pH
// pH = -log10[H+]
// ==========================================

window.chemistryPH = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:8px;
        ">
            🧪 pH
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:10px;
            direction:ltr;
        ">
            pH = −log₁₀[H⁺]
        </div>

        <div style="
            margin:5px 0;
            font-weight:bold;
        ">
            اختر العملية:
        </div>

        <select id="chemPHMode"
                onchange="updateChemPHFields()"
                style="
                    width:90%;
                    padding:8px;
                    font-size:14px;
                    margin-bottom:8px;
                ">

            <option value="fromH">
                حساب pH من [H⁺]
            </option>

            <option value="fromPH">
                حساب [H⁺] من pH
            </option>

        </select>

        <div id="chemPHFields"></div>

        <button onclick="calculateChemistryPH()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            🧮 احسب
        </button>

        <div id="chemPHResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
                 direction:ltr;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:8px;
                    margin-top:8px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    updateChemPHFields();
};


// ==========================================
// 🔄 تغيير حقل pH
// ==========================================

window.updateChemPHFields = function () {

    const mode =
        document.getElementById("chemPHMode")?.value;

    const fields =
        document.getElementById("chemPHFields");

    if (!fields) return;

    if (mode === "fromH") {

        fields.innerHTML = `

            <div style="margin:5px 0;">
                تركيز أيونات الهيدروجين [H⁺] (mol/L):
            </div>

            <input id="chemPHH"
                   type="text"
                   readonly
                   dir="ltr"
                   style="
                       width:90%;
                       padding:8px;
                       font-size:16px;
                       text-align:center;
                   ">

        `;

        window.activeChemistryField = "chemPHH";

    } else {

        fields.innerHTML = `

            <div style="margin:5px 0;">
                قيمة pH:
            </div>

            <input id="chemPHValue"
                   type="text"
                   readonly
                   dir="ltr"
                   style="
                       width:90%;
                       padding:8px;
                       font-size:16px;
                       text-align:center;
                   ">

        `;

        window.activeChemistryField = "chemPHValue";
    }

    const field =
        document.getElementById(
            window.activeChemistryField
        );

    field?.addEventListener("click", () => {

        window.activeChemistryField =
            field.id;

    });
};


// ==========================================
// 🧮 حساب pH
// ==========================================

window.calculateChemistryPH = function () {

    const mode =
        document.getElementById("chemPHMode")?.value;

    const result =
        document.getElementById("chemPHResult");

    if (!result) return;


    // ======================================
    // pH من H+
    // ======================================

    if (mode === "fromH") {

        const H =
            Number(
                document.getElementById("chemPHH")?.value
            );

        if (
            !Number.isFinite(H) ||
            H <= 0
        ) {

            result.innerHTML =
                "❌ تركيز H⁺ يجب أن يكون أكبر من صفر";

            return;
        }

        const pH =
            -Math.log10(H);

        result.innerHTML =
            `✅ pH = ${pH.toFixed(6)}`;

        console.log(
            "🧪 pH:",
            pH
        );

        return;
    }


    // ======================================
    // H+ من pH
    // ======================================

    if (mode === "fromPH") {

        const pH =
            Number(
                document.getElementById("chemPHValue")?.value
            );

        if (!Number.isFinite(pH)) {

            result.innerHTML =
                "❌ أدخل قيمة pH";

            return;
        }

        const H =
            Math.pow(10, -pH);

        result.innerHTML =
            `✅ [H⁺] = ${H.toExponential(6)} mol/L`;

        console.log(
            "🧪 H+:",
            H
        );
    }
};
// ==========================================
// 💧 CHEMISTRY - pOH
// pOH = -log10[OH-]
// ==========================================

window.chemistryPOH = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:8px;
        ">
            💧 pOH
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:10px;
            direction:ltr;
        ">
            pOH = −log₁₀[OH⁻]
        </div>

        <div style="
            margin:5px 0;
            font-weight:bold;
        ">
            اختر العملية:
        </div>

        <select id="chemPOHMode"
                onchange="updateChemPOHFields()"
                style="
                    width:90%;
                    padding:8px;
                    font-size:14px;
                    margin-bottom:8px;
                ">

            <option value="fromOH">
                حساب pOH من [OH⁻]
            </option>

            <option value="fromPOH">
                حساب [OH⁻] من pOH
            </option>

        </select>

        <div id="chemPOHFields"></div>

        <button onclick="calculateChemistryPOH()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            🧮 احسب
        </button>

        <div id="chemPOHResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
                 direction:ltr;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:8px;
                    margin-top:8px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    updateChemPOHFields();
};


// ==========================================
// 🔄 تغيير حقل pOH
// ==========================================

window.updateChemPOHFields = function () {

    const mode =
        document.getElementById("chemPOHMode")?.value;

    const fields =
        document.getElementById("chemPOHFields");

    if (!fields) return;

    if (mode === "fromOH") {

        fields.innerHTML = `

            <div style="margin:5px 0;">
                تركيز أيونات الهيدروكسيد [OH⁻] (mol/L):
            </div>

            <input id="chemPOHOH"
                   type="text"
                   readonly
                   dir="ltr"
                   style="
                       width:90%;
                       padding:8px;
                       font-size:16px;
                       text-align:center;
                   ">

        `;

        window.activeChemistryField = "chemPOHOH";

    } else {

        fields.innerHTML = `

            <div style="margin:5px 0;">
                قيمة pOH:
            </div>

            <input id="chemPOHValue"
                   type="text"
                   readonly
                   dir="ltr"
                   style="
                       width:90%;
                       padding:8px;
                       font-size:16px;
                       text-align:center;
                   ">

        `;

        window.activeChemistryField = "chemPOHValue";
    }

    const field =
        document.getElementById(
            window.activeChemistryField
        );

    field?.addEventListener("click", () => {

        window.activeChemistryField =
            field.id;

    });
};


// ==========================================
// 🧮 حساب pOH
// ==========================================

window.calculateChemistryPOH = function () {

    const mode =
        document.getElementById("chemPOHMode")?.value;

    const result =
        document.getElementById("chemPOHResult");

    if (!result) return;


    // ======================================
    // pOH من OH-
    // ======================================

    if (mode === "fromOH") {

        const OH =
            Number(
                document.getElementById("chemPOHOH")?.value
            );

        if (
            !Number.isFinite(OH) ||
            OH <= 0
        ) {

            result.innerHTML =
                "❌ تركيز OH⁻ يجب أن يكون أكبر من صفر";

            return;
        }

        const pOH =
            -Math.log10(OH);

        result.innerHTML =
            `✅ pOH = ${pOH.toFixed(6)}`;

        console.log(
            "💧 pOH:",
            pOH
        );

        return;
    }


    // ======================================
    // OH- من pOH
    // ======================================

    if (mode === "fromPOH") {

        const pOH =
            Number(
                document.getElementById("chemPOHValue")?.value
            );

        if (!Number.isFinite(pOH)) {

            result.innerHTML =
                "❌ أدخل قيمة pOH";

            return;
        }

        const OH =
            Math.pow(10, -pOH);

        result.innerHTML =
            `✅ [OH⁻] = ${OH.toExponential(6)} mol/L`;

        console.log(
            "💧 OH-:",
            OH
        );
    }
};
// ==========================================
// 🔴 CHEMISTRY - ثابت تأين الحمض Ka
// HA ⇌ H⁺ + A⁻
// Ka = [H⁺][A⁻] / [HA]
// ==========================================

window.chemistryKa = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:8px;
        ">
            🔴 ثابت تأين الحمض Ka
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:12px;
            direction:ltr;
        ">
            Ka = [H⁺][A⁻] / [HA]
        </div>

        <div style="margin:6px 0;font-weight:bold;">
            تركيز H⁺ (mol/L):
        </div>

        <input id="chemKaH"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;font-weight:bold;">
            تركيز A⁻ (mol/L):
        </div>

        <input id="chemKaA"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;font-weight:bold;">
            تركيز HA (mol/L):
        </div>

        <input id="chemKaHA"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:8px;
               ">

        <button onclick="calculateChemistryKa()"
                style="
                    width:100%;
                    padding:9px;
                ">
            🧮 احسب Ka
        </button>

        <div id="chemKaResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
                 direction:ltr;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:8px;
                    margin-top:8px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField = "chemKaH";

    [
        "chemKaH",
        "chemKaA",
        "chemKaHA"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب Ka
// ==========================================

window.calculateChemistryKa = function () {

    const H =
        Number(
            document.getElementById("chemKaH")?.value
        );

    const A =
        Number(
            document.getElementById("chemKaA")?.value
        );

    const HA =
        Number(
            document.getElementById("chemKaHA")?.value
        );

    const result =
        document.getElementById("chemKaResult");

    if (!result) return;


    // ======================================
    // التحقق من القيم
    // ======================================

    if (
        !Number.isFinite(H) ||
        !Number.isFinite(A) ||
        !Number.isFinite(HA)
    ) {

        result.innerHTML =
            "❌ أدخل جميع القيم";

        return;
    }


    if (H < 0 || A < 0) {

        result.innerHTML =
            "❌ التركيز لا يمكن أن يكون سالبًا";

        return;
    }


    if (HA <= 0) {

        result.innerHTML =
            "❌ تركيز HA يجب أن يكون أكبر من صفر";

        return;
    }


    // ======================================
    // Ka
    // ======================================

    const Ka =
        (H * A) / HA;


    if (!Number.isFinite(Ka)) {

        result.innerHTML =
            "❌ النتيجة غير صالحة";

        return;
    }


    result.innerHTML =
        `✅ Ka = ${Ka.toExponential(6)}`;

    console.log(
        "🔴 Ka:",
        Ka
    );
};
// ==========================================
// 🔵 CHEMISTRY - ثابت تأين القاعدة Kb
// BOH ⇌ B⁺ + OH⁻
// Kb = [B⁺][OH⁻] / [BOH]
// ==========================================

window.chemistryKb = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:8px;
        ">
            🔵 ثابت تأين القاعدة Kb
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:12px;
            direction:ltr;
        ">
            Kb = [B⁺][OH⁻] / [BOH]
        </div>

        <div style="margin:6px 0;font-weight:bold;">
            تركيز B⁺ (mol/L):
        </div>

        <input id="chemKbB"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;font-weight:bold;">
            تركيز OH⁻ (mol/L):
        </div>

        <input id="chemKbOH"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:7px;
               ">

        <div style="margin:6px 0;font-weight:bold;">
            تركيز BOH (mol/L):
        </div>

        <input id="chemKbBOH"
               type="text"
               readonly
               dir="ltr"
               style="
                   width:90%;
                   padding:8px;
                   font-size:16px;
                   text-align:center;
                   margin-bottom:8px;
               ">

        <button onclick="calculateChemistryKb()"
                style="
                    width:100%;
                    padding:9px;
                ">
            🧮 احسب Kb
        </button>

        <div id="chemKbResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
                 direction:ltr;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:8px;
                    margin-top:8px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    window.activeChemistryField = "chemKbB";

    [
        "chemKbB",
        "chemKbOH",
        "chemKbBOH"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب Kb
// ==========================================

window.calculateChemistryKb = function () {

    const B =
        Number(
            document.getElementById("chemKbB")?.value
        );

    const OH =
        Number(
            document.getElementById("chemKbOH")?.value
        );

    const BOH =
        Number(
            document.getElementById("chemKbBOH")?.value
        );

    const result =
        document.getElementById("chemKbResult");

    if (!result) return;


    // ======================================
    // التحقق
    // ======================================

    if (
        !Number.isFinite(B) ||
        !Number.isFinite(OH) ||
        !Number.isFinite(BOH)
    ) {

        result.innerHTML =
            "❌ أدخل جميع القيم";

        return;
    }


    if (B < 0 || OH < 0) {

        result.innerHTML =
            "❌ التركيز لا يمكن أن يكون سالبًا";

        return;
    }


    if (BOH <= 0) {

        result.innerHTML =
            "❌ تركيز BOH يجب أن يكون أكبر من صفر";

        return;
    }


    // ======================================
    // Kb
    // ======================================

    const Kb =
        (B * OH) / BOH;


    if (!Number.isFinite(Kb)) {

        result.innerHTML =
            "❌ النتيجة غير صالحة";

        return;
    }


    result.innerHTML =
        `✅ Kb = ${Kb.toExponential(6)}`;

    console.log(
        "🔵 Kb:",
        Kb
    );
};
// ==========================================
// ⏳ CHEMISTRY - نصف عمر التفاعل
// Zero / First / Second Order
// ==========================================

window.chemistryHalfLife = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:8px;
        ">
            ⏳ نصف عمر التفاعل
        </div>

        <div style="
            text-align:center;
            font-size:13px;
            margin-bottom:10px;
            direction:ltr;
        ">
            اختر رتبة التفاعل
        </div>

        <select id="chemHalfLifeOrder"
                onchange="updateChemHalfLifeFields()"
                style="
                    width:90%;
                    padding:8px;
                    font-size:14px;
                    margin-bottom:8px;
                ">

            <option value="zero">
                الرتبة صفر
            </option>

            <option value="first">
                الرتبة الأولى
            </option>

            <option value="second">
                الرتبة الثانية
            </option>

        </select>

        <div id="chemHalfLifeFields"></div>

        <button onclick="calculateChemistryHalfLife()"
                style="
                    width:100%;
                    padding:9px;
                    margin-top:8px;
                ">
            🧮 احسب نصف العمر
        </button>

        <div id="chemHalfLifeResult"
             style="
                 margin-top:10px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
                 direction:ltr;
             ">
        </div>

        <button onclick="openChemistryMenu()"
                style="
                    width:100%;
                    padding:8px;
                    margin-top:8px;
                ">
            ← رجوع للكيمياء
        </button>

    `);

    updateChemHalfLifeFields();
};


// ==========================================
// 🔄 تغيير حقول نصف العمر
// ==========================================

window.updateChemHalfLifeFields = function () {

    const order =
        document.getElementById(
            "chemHalfLifeOrder"
        )?.value;

    const fields =
        document.getElementById(
            "chemHalfLifeFields"
        );

    if (!fields) return;


    // ======================================
    // الرتبة صفر
    // t1/2 = [A]0 / 2k
    // ======================================

    if (order === "zero") {

        fields.innerHTML = `

            <div style="margin:5px 0;font-weight:bold;">
                التركيز الابتدائي [A]₀ (mol/L):
            </div>

            <input id="chemHalfA0"
                   type="text"
                   readonly
                   dir="ltr"
                   style="
                       width:90%;
                       padding:8px;
                       font-size:16px;
                       text-align:center;
                       margin-bottom:7px;
                   ">

            <div style="margin:5px 0;font-weight:bold;">
                ثابت السرعة k (mol/L·s):
            </div>

            <input id="chemHalfK"
                   type="text"
                   readonly
                   dir="ltr"
                   style="
                       width:90%;
                       padding:8px;
                       font-size:16px;
                       text-align:center;
                   ">

        `;

        window.activeChemistryField =
            "chemHalfA0";
    }


    // ======================================
    // الرتبة الأولى
    // t1/2 = ln(2) / k
    // ======================================

    else if (order === "first") {

        fields.innerHTML = `

            <div style="margin:5px 0;font-weight:bold;">
                ثابت السرعة k (s⁻¹):
            </div>

            <input id="chemHalfK"
                   type="text"
                   readonly
                   dir="ltr"
                   style="
                       width:90%;
                       padding:8px;
                       font-size:16px;
                       text-align:center;
                   ">

        `;

        window.activeChemistryField =
            "chemHalfK";
    }


    // ======================================
    // الرتبة الثانية
    // t1/2 = 1 / (k[A]0)
    // ======================================

    else if (order === "second") {

        fields.innerHTML = `

            <div style="margin:5px 0;font-weight:bold;">
                التركيز الابتدائي [A]₀ (mol/L):
            </div>

            <input id="chemHalfA0"
                   type="text"
                   readonly
                   dir="ltr"
                   style="
                       width:90%;
                       padding:8px;
                       font-size:16px;
                       text-align:center;
                       margin-bottom:7px;
                   ">

            <div style="margin:5px 0;font-weight:bold;">
                ثابت السرعة k (L/mol·s):
            </div>

            <input id="chemHalfK"
                   type="text"
                   readonly
                   dir="ltr"
                   style="
                       width:90%;
                       padding:8px;
                       font-size:16px;
                       text-align:center;
                   ">

        `;

        window.activeChemistryField =
            "chemHalfA0";
    }


    // ======================================
    // تفعيل اختيار الحقل
    // ======================================

    [
        "chemHalfA0",
        "chemHalfK"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener("click", () => {

                window.activeChemistryField = id;

            });

    });
};


// ==========================================
// 🧮 حساب نصف العمر
// ==========================================

window.calculateChemistryHalfLife = function () {

    const order =
        document.getElementById(
            "chemHalfLifeOrder"
        )?.value;

    const result =
        document.getElementById(
            "chemHalfLifeResult"
        );

    if (!result) return;


    const k =
        Number(
            document.getElementById(
                "chemHalfK"
            )?.value
        );

    const A0 =
        Number(
            document.getElementById(
                "chemHalfA0"
            )?.value
        );


    // ======================================
    // التحقق من k
    // ======================================

    if (!Number.isFinite(k) || k <= 0) {

        result.innerHTML =
            "❌ ثابت السرعة k يجب أن يكون أكبر من صفر";

        return;
    }


    // ======================================
    // الرتبة صفر
    // ======================================

    if (order === "zero") {

        if (!Number.isFinite(A0) || A0 <= 0) {

            result.innerHTML =
                "❌ التركيز الابتدائي يجب أن يكون أكبر من صفر";

            return;
        }

        const halfLife =
            A0 / (2 * k);

        result.innerHTML =
            `✅ t₁/₂ = ${halfLife.toFixed(6)} s`;

        console.log(
            "⏳ Zero Order Half-Life:",
            halfLife
        );

        return;
    }


    // ======================================
    // الرتبة الأولى
    // ======================================

    if (order === "first") {

        const halfLife =
            Math.log(2) / k;

        result.innerHTML =
            `✅ t₁/₂ = ${halfLife.toFixed(6)} s`;

        console.log(
            "⏳ First Order Half-Life:",
            halfLife
        );

        return;
    }


    // ======================================
    // الرتبة الثانية
    // ======================================

    if (order === "second") {

        if (!Number.isFinite(A0) || A0 <= 0) {

            result.innerHTML =
                "❌ التركيز الابتدائي يجب أن يكون أكبر من صفر";

            return;
        }

        const halfLife =
            1 / (k * A0);

        result.innerHTML =
            `✅ t₁/₂ = ${halfLife.toFixed(6)} s`;

        console.log(
            "⏳ Second Order Half-Life:",
            halfLife
        );
    }
};
// ==========================================
// 💻 Programming - Number Systems
// ==========================================

window.programmingNumberSystems = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🔢 أنظمة الأعداد
        </div>

        <div style="margin:6px 0;">
            اختر النظام:
        </div>

        <select id="programmingBase"
                style="
                    width:90%;
                    padding:8px;
                    font-size:14px;
                    margin-bottom:10px;
                ">

            <option value="10">DEC — عشري</option>
            <option value="2">BIN — ثنائي</option>
            <option value="8">OCT — ثماني</option>
            <option value="16">HEX — سداسي عشري</option>

        </select>

        <input
            id="programmingNumberInput"
            type="text"
            readonly
            dir="ltr"
            placeholder="أدخل الرقم"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateProgrammingBases()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 تحويل
        </button>

        <div id="programmingBasesResult"
             style="
                 margin-top:12px;
                 text-align:center;
                 font-weight:bold;
                 font-size:15px;
                 line-height:2;
                 direction:ltr;
             ">
        </div>

        <button
    onclick="openProgrammingMenu()"
    style="
        width:100%;
        padding:9px;
        margin-top:10px;
    "
>
    ← رجوع للبرمجة
</button>

    `);

    window.activeProgrammingField =
        "programmingNumberInput";
};

// ==========================================
// 💻 Programming - Main Menu
// ==========================================

window.openProgrammingMenu = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:15px;
        ">
            💻 البرمجة
        </div>

        <button
            onclick="programmingNumberSystems()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            1️⃣ 🔢 التحويل بين الأنظمة
        </button>

        <button
            onclick="programmingAND()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            2️⃣ ⚙️ AND
        </button>

        <button
            onclick="programmingOR()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            3️⃣ ⚙️ OR
        </button>

        <button
            onclick="programmingXOR()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            4️⃣ ⚙️ XOR
        </button>

        <button
            onclick="programmingNOT()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            5️⃣ 🚫 NOT
        </button>

        <button
            onclick="programmingShiftLeft()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            6️⃣ ⬅️ إزاحة لليسار
        </button>

        <button
            onclick="programmingShiftRight()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            7️⃣ ➡️ إزاحة لليمين
        </button>

        <button
            onclick="programmingBitwise()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            8️⃣ 🧮 العمليات الثنائية
        </button>

        <button
            onclick="programmingComplements()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            9️⃣ 🔄 المكملات والمتممات
        </button>

        <button
            onclick="programmingArithmetic()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            🔟 🧮 العمليات الحسابية
        </button>

        <button
    onclick="programmingComplementArithmetic()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    1️⃣1️⃣ 🔄 العمليات باستخدام المكملات
</button>
<button
    onclick="programmingHexArithmetic()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    1️⃣2️⃣ 🧮 حسابات Hexadecimal
</button>
<button
    onclick="programmingOctalArithmetic()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    1️⃣3️⃣ 🧮 حسابات Octal
</button>
<button
    onclick="programmingAdvancedComplements()"
    style="
        width:100%;
        padding:10px;
        margin:4px 0;
        font-size:14px;
    "
>
    1️⃣4️⃣ 🔄 مكملات Hex وOctal
</button>
        <button
            onclick="openCalculatorHome()"
            style="
                width:100%;
                padding:10px;
                margin-top:12px;
                font-size:14px;
            "
        >
            ← الرجوع للقائمة الرئيسية
        </button>

    `);

    setupProgrammingKeys();
};
// ==========================================
// ✏️ كتابة أرقام البرمجة
// ==========================================

window.programmingWrite = function (value) {

    const field =
        document.getElementById(
            window.activeProgrammingField
        );

    if (!field) return;

    field.value += value.toUpperCase();
};


// ==========================================
// 🧮 التحويل
// ==========================================

window.calculateProgrammingBases = function () {

    const input =
        document.getElementById(
            "programmingNumberInput"
        );

    const base =
        Number(
            document.getElementById(
                "programmingBase"
            )?.value
        );

    const result =
        document.getElementById(
            "programmingBasesResult"
        );

    if (!input || !result) return;

    const value =
        input.value.trim();

    if (!value) {
        result.innerHTML =
            "❌ أدخل رقمًا";
        return;
    }

    try {

        const decimal =
            parseInt(value, base);

        if (
            !Number.isFinite(decimal) ||
            decimal < 0
        ) {
            throw new Error(
                "رقم غير صحيح"
            );
        }

        result.innerHTML = `
            DEC = ${decimal}<br>
            BIN = ${decimal.toString(2)}<br>
            OCT = ${decimal.toString(8)}<br>
            HEX = ${decimal.toString(16).toUpperCase()}
        `;

        window.lastProgrammingResult =
            decimal;

    } catch (error) {

        result.innerHTML =
            `❌ ${error.message}`;
    }
};
// ==========================================
// 💻 كتابة في حقل البرمجة
// ==========================================

window.programmingWrite = function (value) {

    let field =
        document.getElementById(
            window.activeProgrammingField
        );

    // لو مفيش خانة نشطة، استخدم خانة AND الأولى
    if (!field) {
        field =
            document.getElementById("programmingAND_A");
    }

    if (!field) return;

    field.value += String(value).toUpperCase();
};
window.setupProgrammingKeys = function () {

    document.body.classList.add(
        "programming-mode"
    );

    


    const scientificGrid =
        document.querySelector(".scientific-grid");

    if (scientificGrid) {

        scientificGrid.innerHTML = "";

        const keys = [
    "AC", "DEL", "A", "B", "C",
    "D", "E", "F", "(", ")",
    "AND", "OR", "XOR", "NOT", "<<",
    ">>", "BIN", "OCT", "DEC", "HEX"
];

        keys.forEach(value => {

    const button =
        document.createElement("button");

    button.textContent = value;

    button.onclick = function () {

        if (value === "AC") {

            programmingClear();
            return;
        }

        if (value === "DEL") {

            programmingBackspace();
            return;
        }

        programmingWrite(value);
    };

    scientificGrid.appendChild(button);
});
    }


    const numberGrid =
        document.querySelector(".number-grid");

    if (numberGrid) {

        numberGrid.innerHTML = "";

        const keys = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    "0", "=", "Ans",
    "CLR", "NEG", "MOD"
];

        keys.forEach(value => {

    const button =
        document.createElement("button");

    button.textContent = value;

    button.onclick = function () {

        // ==============================
        // =
        // ==============================
        if (value === "=") {

            calculateProgrammingBases();
            return;
        }


        // ==============================
        // Ans
        // ==============================
        if (value === "Ans") {

            programmingWrite(
                String(
                    window.lastProgrammingResult ?? ""
                )
            );

            return;
        }


        // ==============================
        // CLR
        // ==============================
        if (value === "CLR") {

            programmingClear();
            return;
        }


        // ==============================
        // NEG
        // ==============================
        if (value === "NEG") {

            programmingToggleSign();
            return;
        }


        // ==============================
        // MOD
        // ==============================
        if (value === "MOD") {

            programmingWrite("%");
            return;
        }


        // ==============================
        // باقي الأزرار
        // ==============================

        programmingWrite(value);
    };

    numberGrid.appendChild(button);
});

    }
};
// ==========================================
// 💻 Programming - NEG
// ==========================================

window.programmingToggleSign = function () {

    const field =
        document.getElementById(
            window.activeProgrammingField
        );

    if (!field) return;

    if (!field.value) return;

    if (field.value.startsWith("-")) {

        field.value =
            field.value.slice(1);

    } else {

        field.value =
            "-" + field.value;
    }
};
// ==========================================
// 💻 Programming - Clear
// ==========================================

window.programmingClear = function () {

    const field =
        document.getElementById(
            window.activeProgrammingField
        );

    if (field) {
        field.value = "";
    }

    // مسح نتيجة AND إن وجدت
    const andResult =
        document.getElementById(
            "programmingANDResult"
        );

    if (andResult) {
        andResult.innerHTML = "";
    }

    // مسح نتيجة التحويل إن وجدت
    const basesResult =
        document.getElementById(
            "programmingBasesResult"
        );

    if (basesResult) {
        basesResult.innerHTML = "";
    }
};


// ==========================================
// 💻 Programming - Backspace
// ==========================================

window.programmingBackspace = function () {

    const field =
        document.getElementById(
            window.activeProgrammingField
        );

    if (!field) return;

    field.value =
        field.value.slice(0, -1);
};
// ==========================================
// 💻 Programming - AND
// ==========================================

window.programmingAND = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ⚙️ AND
        </div>

        <div style="margin:6px 0;">
            الرقم الأول:
        </div>

        <input
            id="programmingAND_A"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <div style="margin:6px 0;">
            الرقم الثاني:
        </div>

        <input
            id="programmingAND_B"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateProgrammingAND()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب AND
        </button>

        <div
            id="programmingANDResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
    "programmingAND_A";

const fieldA =
    document.getElementById("programmingAND_A");

const fieldB =
    document.getElementById("programmingAND_B");

if (fieldA) {
    fieldA.addEventListener("click", function () {
        window.activeProgrammingField =
            "programmingAND_A";
    });
}

if (fieldB) {
    fieldB.addEventListener("click", function () {
        window.activeProgrammingField =
            "programmingAND_B";
    });
}

setupProgrammingKeys();
};
// ==========================================
// 🧮 حساب AND
// ==========================================

window.calculateProgrammingAND = function () {

    const fieldA =
        document.getElementById(
            "programmingAND_A"
        );

    const fieldB =
        document.getElementById(
            "programmingAND_B"
        );

    const result =
        document.getElementById(
            "programmingANDResult"
        );

    if (!fieldA || !fieldB || !result) {
        console.error(
            "❌ عناصر AND غير موجودة"
        );
        return;
    }

    const aText =
        fieldA.value.trim();

    const bText =
        fieldB.value.trim();

    if (!aText || !bText) {

        result.innerHTML =
            "❌ أدخل الرقمين أولًا";

        return;
    }

    const a =
        Number(aText);

    const b =
        Number(bText);

    if (
        !Number.isInteger(a) ||
        !Number.isInteger(b)
    ) {

        result.innerHTML =
            "❌ أدخل أرقامًا صحيحة";

        return;
    }

    const answer =
        a & b;

    result.innerHTML =
        `✅ ${a} AND ${b} = ${answer}`;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Programming - OR
// ==========================================

window.programmingOR = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ⚙️ OR
        </div>

        <div style="margin:6px 0;">
            الرقم الأول:
        </div>

        <input
            id="programmingOR_A"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <div style="margin:6px 0;">
            الرقم الثاني:
        </div>

        <input
            id="programmingOR_B"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateProgrammingOR()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب OR
        </button>

        <div
            id="programmingORResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "programmingOR_A";

    document
        .getElementById("programmingOR_A")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingOR_A";
        });

    document
        .getElementById("programmingOR_B")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingOR_B";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب OR
// ==========================================

window.calculateProgrammingOR = function () {

    const fieldA =
        document.getElementById(
            "programmingOR_A"
        );

    const fieldB =
        document.getElementById(
            "programmingOR_B"
        );

    const result =
        document.getElementById(
            "programmingORResult"
        );

    if (!fieldA || !fieldB || !result) {
        console.error(
            "❌ عناصر OR غير موجودة"
        );
        return;
    }

    const aText =
        fieldA.value.trim();

    const bText =
        fieldB.value.trim();

    if (!aText || !bText) {

        result.innerHTML =
            "❌ أدخل الرقمين أولًا";

        return;
    }

    const a =
        Number(aText);

    const b =
        Number(bText);

    if (
        !Number.isInteger(a) ||
        !Number.isInteger(b)
    ) {

        result.innerHTML =
            "❌ أدخل أرقامًا صحيحة";

        return;
    }

    const answer =
        a | b;

    result.innerHTML =
        `✅ ${a} OR ${b} = ${answer}`;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Programming - XOR
// ==========================================

window.programmingXOR = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ⚙️ XOR
        </div>

        <div style="margin:6px 0;">
            الرقم الأول:
        </div>

        <input
            id="programmingXOR_A"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <div style="margin:6px 0;">
            الرقم الثاني:
        </div>

        <input
            id="programmingXOR_B"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateProgrammingXOR()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب XOR
        </button>

        <div
            id="programmingXORResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "programmingXOR_A";

    document
        .getElementById("programmingXOR_A")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingXOR_A";
        });

    document
        .getElementById("programmingXOR_B")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingXOR_B";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب XOR
// ==========================================

window.calculateProgrammingXOR = function () {

    const fieldA =
        document.getElementById(
            "programmingXOR_A"
        );

    const fieldB =
        document.getElementById(
            "programmingXOR_B"
        );

    const result =
        document.getElementById(
            "programmingXORResult"
        );

    if (!fieldA || !fieldB || !result) {
        console.error(
            "❌ عناصر XOR غير موجودة"
        );
        return;
    }

    const aText =
        fieldA.value.trim();

    const bText =
        fieldB.value.trim();

    if (!aText || !bText) {

        result.innerHTML =
            "❌ أدخل الرقمين أولًا";

        return;
    }

    const a =
        Number(aText);

    const b =
        Number(bText);

    if (
        !Number.isInteger(a) ||
        !Number.isInteger(b)
    ) {

        result.innerHTML =
            "❌ أدخل أرقامًا صحيحة";

        return;
    }

    const answer =
        a ^ b;

    result.innerHTML =
        `✅ ${a} XOR ${b} = ${answer}`;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Programming - NOT
// ==========================================

window.programmingNOT = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🚫 NOT
        </div>

        <div style="margin:6px 0;">
            الرقم:
        </div>

        <input
            id="programmingNOT_A"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateProgrammingNOT()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب NOT
        </button>

        <div
            id="programmingNOTResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "programmingNOT_A";

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب NOT
// ==========================================

window.calculateProgrammingNOT = function () {

    const field =
        document.getElementById(
            "programmingNOT_A"
        );

    const result =
        document.getElementById(
            "programmingNOTResult"
        );

    if (!field || !result) {
        console.error(
            "❌ عناصر NOT غير موجودة"
        );
        return;
    }

    const value =
        field.value.trim();

    if (!value) {

        result.innerHTML =
            "❌ أدخل الرقم أولًا";

        return;
    }

    const number =
        Number(value);

    if (!Number.isInteger(number)) {

        result.innerHTML =
            "❌ أدخل رقمًا صحيحًا";

        return;
    }

    const answer =
        ~number;

    result.innerHTML =
        `✅ NOT ${number} = ${answer}`;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Programming - Shift Left
// ==========================================

window.programmingShiftLeft = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ⬅️ إزاحة لليسار
        </div>

        <div style="margin:6px 0;">
            الرقم:
        </div>

        <input
            id="programmingShiftLeft_A"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <div style="margin:6px 0;">
            عدد مرات الإزاحة:
        </div>

        <input
            id="programmingShiftLeft_B"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateProgrammingShiftLeft()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب
        </button>

        <div
            id="programmingShiftLeftResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "programmingShiftLeft_A";

    document
        .getElementById("programmingShiftLeft_A")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingShiftLeft_A";
        });

    document
        .getElementById("programmingShiftLeft_B")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingShiftLeft_B";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب Shift Left
// ==========================================

window.calculateProgrammingShiftLeft = function () {

    const fieldA =
        document.getElementById(
            "programmingShiftLeft_A"
        );

    const fieldB =
        document.getElementById(
            "programmingShiftLeft_B"
        );

    const result =
        document.getElementById(
            "programmingShiftLeftResult"
        );

    if (!fieldA || !fieldB || !result) {
        console.error(
            "❌ عناصر Shift Left غير موجودة"
        );
        return;
    }

    const a =
        Number(fieldA.value.trim());

    const b =
        Number(fieldB.value.trim());

    if (
        !Number.isInteger(a) ||
        !Number.isInteger(b) ||
        b < 0
    ) {

        result.innerHTML =
            "❌ أدخل رقمًا صحيحًا وعدد إزاحات صحيحًا";

        return;
    }

    const answer =
        a << b;

    result.innerHTML =
        `✅ ${a} << ${b} = ${answer}`;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Programming - Shift Right
// ==========================================

window.programmingShiftRight = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            ➡️ إزاحة لليمين
        </div>

        <div style="margin:6px 0;">
            الرقم:
        </div>

        <input
            id="programmingShiftRight_A"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <div style="margin:6px 0;">
            عدد مرات الإزاحة:
        </div>

        <input
            id="programmingShiftRight_B"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateProgrammingShiftRight()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب
        </button>

        <div
            id="programmingShiftRightResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "programmingShiftRight_A";

    document
        .getElementById("programmingShiftRight_A")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingShiftRight_A";
        });

    document
        .getElementById("programmingShiftRight_B")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingShiftRight_B";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب Shift Right
// ==========================================

window.calculateProgrammingShiftRight = function () {

    const fieldA =
        document.getElementById(
            "programmingShiftRight_A"
        );

    const fieldB =
        document.getElementById(
            "programmingShiftRight_B"
        );

    const result =
        document.getElementById(
            "programmingShiftRightResult"
        );

    if (!fieldA || !fieldB || !result) {
        console.error(
            "❌ عناصر Shift Right غير موجودة"
        );
        return;
    }

    const a =
        Number(fieldA.value.trim());

    const b =
        Number(fieldB.value.trim());

    if (
        !Number.isInteger(a) ||
        !Number.isInteger(b) ||
        b < 0
    ) {

        result.innerHTML =
            "❌ أدخل رقمًا صحيحًا وعدد إزاحات صحيحًا";

        return;
    }

    const answer =
        a >> b;

    result.innerHTML =
        `✅ ${a} >> ${b} = ${answer}`;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Programming - Bitwise Operations
// ==========================================

window.programmingBitwise = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🧮 العمليات الثنائية
        </div>

        <select
            id="programmingBitwiseOperation"
            style="
                width:90%;
                padding:9px;
                font-size:15px;
                margin-bottom:10px;
            "
        >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
            <option value="XOR">XOR</option>
        </select>

        <div style="margin:6px 0;">
            الرقم الأول:
        </div>

        <input
            id="programmingBitwise_A"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <div style="margin:6px 0;">
            الرقم الثاني:
        </div>

        <input
            id="programmingBitwise_B"
            type="text"
            readonly
            dir="ltr"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateProgrammingBitwise()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب
        </button>

        <div
            id="programmingBitwiseResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "programmingBitwise_A";

    document
        .getElementById("programmingBitwise_A")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingBitwise_A";
        });

    document
        .getElementById("programmingBitwise_B")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "programmingBitwise_B";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب العمليات الثنائية
// ==========================================

window.calculateProgrammingBitwise = function () {

    const fieldA =
        document.getElementById(
            "programmingBitwise_A"
        );

    const fieldB =
        document.getElementById(
            "programmingBitwise_B"
        );

    const operation =
        document.getElementById(
            "programmingBitwiseOperation"
        )?.value;

    const result =
        document.getElementById(
            "programmingBitwiseResult"
        );

    if (
        !fieldA ||
        !fieldB ||
        !result ||
        !operation
    ) {
        return;
    }

    const a =
        Number(fieldA.value.trim());

    const b =
        Number(fieldB.value.trim());

    if (
        !Number.isInteger(a) ||
        !Number.isInteger(b)
    ) {

        result.innerHTML =
            "❌ أدخل رقمين صحيحين";

        return;
    }

    let answer;

    if (operation === "AND") {

        answer = a & b;

    } else if (operation === "OR") {

        answer = a | b;

    } else if (operation === "XOR") {

        answer = a ^ b;

    }

    result.innerHTML =
        `✅ ${a} ${operation} ${b} = ${answer}`;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Programming - Complements
// ==========================================

window.programmingComplements = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🔄 المكملات والمتممات
        </div>

        <select
            id="programmingComplementType"
            style="
                width:90%;
                padding:9px;
                font-size:15px;
                margin-bottom:10px;
            "
        >
            <option value="ones">
                1's Complement — المتمم الأول
            </option>

            <option value="twos">
                2's Complement — المتمم الثاني
            </option>

            <option value="nines">
                9's Complement — مكمل 9
            </option>

            <option value="tens">
                10's Complement — مكمل 10
            </option>
        </select>

        <div style="margin:6px 0;">
            الرقم:
        </div>

        <input
            id="programmingComplementInput"
            type="text"
            readonly
            dir="ltr"
            placeholder="أدخل الرقم"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateProgrammingComplement()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب
        </button>

        <div
            id="programmingComplementResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
                line-height:2;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "programmingComplementInput";

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب المكملات والمتممات
// ==========================================

window.calculateProgrammingComplement = function () {

    const input =
        document.getElementById(
            "programmingComplementInput"
        );

    const type =
        document.getElementById(
            "programmingComplementType"
        )?.value;

    const result =
        document.getElementById(
            "programmingComplementResult"
        );

    if (!input || !result || !type) return;

    const value =
        input.value.trim();

    if (!value) {

        result.innerHTML =
            "❌ أدخل رقمًا";

        return;
    }


    // ======================================
    // 1's و 2's Complement
    // ======================================

    if (
        type === "ones" ||
        type === "twos"
    ) {

        if (!/^[01]+$/.test(value)) {

            result.innerHTML =
                "❌ يجب أن يحتوي الرقم على 0 و1 فقط";

            return;
        }

        const ones =
            value
                .split("")
                .map(bit =>
                    bit === "0" ? "1" : "0"
                )
                .join("");

        let answer;

        if (type === "ones") {

            answer = ones;

        } else {

            answer =
                (
                    BigInt("0b" + ones) + 1n
                )
                .toString(2)
                .padStart(value.length, "0")
                .slice(-value.length);
        }

        result.innerHTML =
            `✅ النتيجة = ${answer}`;

        window.lastProgrammingResult =
            answer;

        return;
    }


    // ======================================
    // 9's Complement
    // ======================================

    if (type === "nines") {

        if (!/^[0-9]+$/.test(value)) {

            result.innerHTML =
                "❌ مكمل 9 يحتاج رقمًا عشريًا";

            return;
        }

        const answer =
            value
                .split("")
                .map(digit =>
                    String(9 - Number(digit))
                )
                .join("");

        result.innerHTML =
            `✅ النتيجة = ${answer}`;

        window.lastProgrammingResult =
            answer;

        return;
    }


    // ======================================
    // 10's Complement
    // ======================================

    if (type === "tens") {

        if (!/^[0-9]+$/.test(value)) {

            result.innerHTML =
                "❌ مكمل 10 يحتاج رقمًا عشريًا";

            return;
        }

        const nines =
            value
                .split("")
                .map(digit =>
                    String(9 - Number(digit))
                )
                .join("");

        const answer =
            (
                BigInt(nines) + 1n
            )
            .toString()
            .padStart(value.length, "0");

        result.innerHTML =
            `✅ النتيجة = ${answer}`;

        window.lastProgrammingResult =
            answer;
    }
};
// ==========================================
// 💻 Programming - Arithmetic
// ==========================================

window.programmingArithmetic = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:15px;
        ">
            🧮 العمليات الحسابية
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:15px;
        ">
            اختر النظام:
        </div>

        <button
            onclick="programmingBinaryArithmetic()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            🔵 Binary — ثنائي
        </button>

        <button
            onclick="programmingDecimalArithmetic()"
            style="
                width:100%;
                padding:10px;
                margin:4px 0;
                font-size:14px;
            "
        >
            🔢 Decimal — عشري
        </button>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:10px;
                margin-top:12px;
                font-size:14px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);
};
// ==========================================
// 🔵 Binary Arithmetic
// ==========================================

window.programmingBinaryArithmetic = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🔵 العمليات الثنائية
        </div>

        <div style="margin:6px 0;">
            الرقم الأول:
        </div>

        <input
            id="binaryArithmeticA"
            type="text"
            readonly
            dir="ltr"
            placeholder="1010"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <select
            id="binaryArithmeticOperation"
            style="
                width:90%;
                padding:9px;
                font-size:16px;
                margin-bottom:8px;
            "
        >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
            <option value="%">MOD</option>
        </select>

        <div style="margin:6px 0;">
            الرقم الثاني:
        </div>

        <input
            id="binaryArithmeticB"
            type="text"
            readonly
            dir="ltr"
            placeholder="0011"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateBinaryArithmetic()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب
        </button>

        <div
            id="binaryArithmeticResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
                line-height:2;
            "
        ></div>

        <button
            onclick="programmingArithmetic()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للعمليات الحسابية
        </button>

    `);

    window.activeProgrammingField =
        "binaryArithmeticA";

    document
        .getElementById("binaryArithmeticA")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "binaryArithmeticA";
        });

    document
        .getElementById("binaryArithmeticB")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "binaryArithmeticB";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب العمليات الثنائية
// ==========================================

window.calculateBinaryArithmetic = function () {

    const fieldA =
        document.getElementById(
            "binaryArithmeticA"
        );

    const fieldB =
        document.getElementById(
            "binaryArithmeticB"
        );

    const operation =
        document.getElementById(
            "binaryArithmeticOperation"
        )?.value;

    const result =
        document.getElementById(
            "binaryArithmeticResult"
        );

    if (
        !fieldA ||
        !fieldB ||
        !result ||
        !operation
    ) {
        return;
    }

    const aText =
        fieldA.value.trim();

    const bText =
        fieldB.value.trim();

    if (
        !/^[01]+$/.test(aText) ||
        !/^[01]+$/.test(bText)
    ) {

        result.innerHTML =
            "❌ أدخل أرقامًا ثنائية صحيحة";

        return;
    }

    const a =
        BigInt("0b" + aText);

    const b =
        BigInt("0b" + bText);

    let answer;

    if (operation === "+") {

        answer = a + b;

    } else if (operation === "-") {

        answer = a - b;

    } else if (operation === "*") {

        answer = a * b;

    } else if (operation === "/") {

        if (b === 0n) {

            result.innerHTML =
                "❌ لا يمكن القسمة على صفر";

            return;
        }

        answer = a / b;

    } else if (operation === "%") {

        if (b === 0n) {

            result.innerHTML =
                "❌ لا يمكن MOD على صفر";

            return;
        }

        answer = a % b;
    }

    const decimalResult =
        answer.toString();

    const binaryResult =
        answer < 0n
            ? "-" + (-answer).toString(2)
            : answer.toString(2);

    result.innerHTML = `
        BIN = ${binaryResult}<br>
        DEC = ${decimalResult}
    `;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 🔢 Decimal Arithmetic
// ==========================================

window.programmingDecimalArithmetic = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🔢 العمليات العشرية
        </div>

        <div style="margin:6px 0;">
            الرقم الأول:
        </div>

        <input
            id="decimalArithmeticA"
            type="text"
            readonly
            dir="ltr"
            placeholder="25"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <select
            id="decimalArithmeticOperation"
            style="
                width:90%;
                padding:9px;
                font-size:16px;
                margin-bottom:8px;
            "
        >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
            <option value="%">MOD</option>
        </select>

        <div style="margin:6px 0;">
            الرقم الثاني:
        </div>

        <input
            id="decimalArithmeticB"
            type="text"
            readonly
            dir="ltr"
            placeholder="17"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateDecimalArithmetic()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب
        </button>

        <div
            id="decimalArithmeticResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
                line-height:2;
            "
        ></div>

        <button
            onclick="programmingArithmetic()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للعمليات الحسابية
        </button>

    `);

    window.activeProgrammingField =
        "decimalArithmeticA";

    document
        .getElementById("decimalArithmeticA")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "decimalArithmeticA";
        });

    document
        .getElementById("decimalArithmeticB")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "decimalArithmeticB";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب العمليات العشرية
// ==========================================

window.calculateDecimalArithmetic = function () {

    const fieldA =
        document.getElementById(
            "decimalArithmeticA"
        );

    const fieldB =
        document.getElementById(
            "decimalArithmeticB"
        );

    const operation =
        document.getElementById(
            "decimalArithmeticOperation"
        )?.value;

    const result =
        document.getElementById(
            "decimalArithmeticResult"
        );

    if (
        !fieldA ||
        !fieldB ||
        !result ||
        !operation
    ) {
        return;
    }

    const a =
        Number(fieldA.value.trim());

    const b =
        Number(fieldB.value.trim());

    if (
        !Number.isFinite(a) ||
        !Number.isFinite(b)
    ) {

        result.innerHTML =
            "❌ أدخل رقمين صحيحين";

        return;
    }

    let answer;

    if (operation === "+") {

        answer = a + b;

    } else if (operation === "-") {

        answer = a - b;

    } else if (operation === "*") {

        answer = a * b;

    } else if (operation === "/") {

        if (b === 0) {

            result.innerHTML =
                "❌ لا يمكن القسمة على صفر";

            return;
        }

        answer = a / b;

    } else if (operation === "%") {

        if (b === 0) {

            result.innerHTML =
                "❌ لا يمكن MOD على صفر";

            return;
        }

        answer = a % b;
    }

    result.innerHTML =
        `DEC = ${answer}`;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Programming - Complement Arithmetic
// ==========================================

window.programmingComplementArithmetic = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🔄 العمليات باستخدام المكملات
        </div>

        <select
            id="complementArithmeticSystem"
            style="
                width:90%;
                padding:9px;
                font-size:15px;
                margin-bottom:10px;
            "
        >
            <option value="binary">
                🔵 Binary — باستخدام 1's / 2's
            </option>

            <option value="decimal">
                🔢 Decimal — باستخدام 9's / 10's
            </option>
        </select>

        <select
    id="complementArithmeticType"
    style="
        width:90%;
        padding:9px;
        font-size:15px;
        margin-bottom:10px;
    "
>
    <option value="ones">
        1's Complement
    </option>

    <option value="twos">
        2's Complement
    </option>
</select>

        <div style="margin:6px 0;">
            الرقم الأول:
        </div>

        <input
            id="complementArithmeticA"
            type="text"
            readonly
            dir="ltr"
            placeholder="1010"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <div style="
            text-align:center;
            font-size:20px;
            margin:4px;
        ">
            −
        </div>

        <div style="margin:6px 0;">
            الرقم الثاني:
        </div>

        <input
            id="complementArithmeticB"
            type="text"
            readonly
            dir="ltr"
            placeholder="0011"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateComplementArithmetic()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب بالـ Complement
        </button>

        <div
            id="complementArithmeticResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
                line-height:2;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "complementArithmeticA";
const systemSelect =
    document.getElementById(
        "complementArithmeticSystem"
    );

const typeSelect =
    document.getElementById(
        "complementArithmeticType"
    );

if (systemSelect && typeSelect) {

    systemSelect.addEventListener(
        "change",
        function () {

            if (this.value === "decimal") {

                typeSelect.innerHTML = `
                    <option value="nines">
                        9's Complement
                    </option>

                    <option value="tens">
                        10's Complement
                    </option>
                `;

            } else {

                typeSelect.innerHTML = `
                    <option value="ones">
                        1's Complement
                    </option>

                    <option value="twos">
                        2's Complement
                    </option>
                `;
            }
        }
    );
}
    document
        .getElementById("complementArithmeticA")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "complementArithmeticA";
        });

    document
        .getElementById("complementArithmeticB")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "complementArithmeticB";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب الطرح باستخدام المكمل
// ==========================================

window.calculateComplementArithmetic = function () {

    const system =
        document.getElementById(
            "complementArithmeticSystem"
        )?.value;

    const type =
        document.getElementById(
            "complementArithmeticType"
        )?.value;

    const fieldA =
        document.getElementById(
            "complementArithmeticA"
        );

    const fieldB =
        document.getElementById(
            "complementArithmeticB"
        );

    const result =
        document.getElementById(
            "complementArithmeticResult"
        );

    if (
        !system ||
        !type ||
        !fieldA ||
        !fieldB ||
        !result
    ) {
        return;
    }

    const aText =
        fieldA.value.trim();

    const bText =
        fieldB.value.trim();

    if (!aText || !bText) {

        result.innerHTML =
            "❌ أدخل الرقمين أولًا";

        return;
    }

    // ======================================
    // 🔵 Binary
    // ======================================

    if (system === "binary") {

        if (
            !/^[01]+$/.test(aText) ||
            !/^[01]+$/.test(bText)
        ) {

            result.innerHTML =
                "❌ أدخل أرقامًا ثنائية فقط";

            return;
        }

        const width =
            Math.max(
                aText.length,
                bText.length
            );

        const a =
            BigInt("0b" + aText);

        const b =
            BigInt("0b" + bText);

        const mask =
            (1n << BigInt(width)) - 1n;

        let complement;

        if (type === "ones") {

            complement =
                mask ^ b;

        } else {

            complement =
                ((mask ^ b) + 1n) & mask;
        }

        const sum =
    a + complement;

const carry =
    sum > mask;

let answer;

if (type === "ones" && carry) {

    // End-Around Carry
    answer =
        (sum & mask) + 1n;

    answer =
        answer & mask;

} else if (carry) {

    // 2's Complement
    answer =
        sum & mask;

} else {
            const negativeMagnitude =
                ((~sum) & mask) + 1n;

            answer =
                -negativeMagnitude;
        }

        const binaryAnswer =
            answer < 0n
                ? "-" + (-answer).toString(2)
                : answer.toString(2);

        result.innerHTML = `
            BIN = ${binaryAnswer}<br>
            DEC = ${answer.toString()}
        `;

        window.lastProgrammingResult =
            answer;

        return;
    }


    // ======================================
    // 🔢 Decimal
    // ======================================

    if (system === "decimal") {

        if (
            !/^[0-9]+$/.test(aText) ||
            !/^[0-9]+$/.test(bText)
        ) {

            result.innerHTML =
                "❌ أدخل أرقامًا عشرية فقط";

            return;
        }

        const a =
            BigInt(aText);

        const b =
            BigInt(bText);

        const width =
            Math.max(
                aText.length,
                bText.length
            );

        const base =
            10n ** BigInt(width);

        let complement;

        if (type === "nines") {

            complement =
                base - 1n - b;

        } else {

            complement =
                (base - b) % base;
        }

        let sum =
            a + complement;

        let answer;

        if (sum >= base) {

    if (type === "nines") {

        // End-Around Carry في 9's Complement
        answer =
            (sum - base) + 1n;

    } else {

        // 10's Complement:
        // نحذف الـ Carry فقط
        answer =
            sum - base;
    }

} else {

    answer =
        -(base - sum);
}

        result.innerHTML =
            `DEC = ${answer.toString()}`;

        window.lastProgrammingResult =
            answer;
    }
};
// ==========================================
// 💻 Programming - Hexadecimal Arithmetic
// ==========================================

window.programmingHexArithmetic = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🧮 حسابات Hexadecimal
        </div>

        <div style="margin:6px 0;">
            الرقم الأول:
        </div>

        <input
            id="hexArithmeticA"
            type="text"
            readonly
            dir="ltr"
            placeholder="FF"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <select
            id="hexArithmeticOperation"
            style="
                width:90%;
                padding:9px;
                font-size:16px;
                margin-bottom:8px;
            "
        >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
            <option value="%">MOD</option>
        </select>

        <div style="margin:6px 0;">
            الرقم الثاني:
        </div>

        <input
            id="hexArithmeticB"
            type="text"
            readonly
            dir="ltr"
            placeholder="A"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateHexArithmetic()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب
        </button>

        <div
            id="hexArithmeticResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
                line-height:2;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "hexArithmeticA";

    document
        .getElementById("hexArithmeticA")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "hexArithmeticA";
        });

    document
        .getElementById("hexArithmeticB")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "hexArithmeticB";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب Hexadecimal
// ==========================================

window.calculateHexArithmetic = function () {

    const fieldA =
        document.getElementById(
            "hexArithmeticA"
        );

    const fieldB =
        document.getElementById(
            "hexArithmeticB"
        );

    const operation =
        document.getElementById(
            "hexArithmeticOperation"
        )?.value;

    const result =
        document.getElementById(
            "hexArithmeticResult"
        );

    if (
        !fieldA ||
        !fieldB ||
        !operation ||
        !result
    ) {
        return;
    }

    const aText =
        fieldA.value.trim();

    const bText =
        fieldB.value.trim();

    if (
        !/^[0-9A-Fa-f]+$/.test(aText) ||
        !/^[0-9A-Fa-f]+$/.test(bText)
    ) {

        result.innerHTML =
            "❌ أدخل أرقام Hex صحيحة";

        return;
    }

    const a =
        BigInt("0x" + aText);

    const b =
        BigInt("0x" + bText);

    let answer;

    if (operation === "+") {

        answer = a + b;

    } else if (operation === "-") {

        answer = a - b;

    } else if (operation === "*") {

        answer = a * b;

    } else if (operation === "/") {

        if (b === 0n) {

            result.innerHTML =
                "❌ لا يمكن القسمة على صفر";

            return;
        }

        answer = a / b;

    } else if (operation === "%") {

        if (b === 0n) {

            result.innerHTML =
                "❌ لا يمكن MOD على صفر";

            return;
        }

        answer = a % b;
    }

    const hexAnswer =
        answer < 0n
            ? "-" + (-answer).toString(16).toUpperCase()
            : answer.toString(16).toUpperCase();

    result.innerHTML = `
        HEX = ${hexAnswer}<br>
        DEC = ${answer.toString()}
    `;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Programming - Octal Arithmetic
// ==========================================

window.programmingOctalArithmetic = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:12px;
        ">
            🧮 حسابات Octal
        </div>

        <div style="margin:6px 0;">
            الرقم الأول:
        </div>

        <input
            id="octalArithmeticA"
            type="text"
            readonly
            dir="ltr"
            placeholder="17"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:8px;
            "
        >

        <select
            id="octalArithmeticOperation"
            style="
                width:90%;
                padding:9px;
                font-size:16px;
                margin-bottom:8px;
            "
        >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
            <option value="%">MOD</option>
        </select>

        <div style="margin:6px 0;">
            الرقم الثاني:
        </div>

        <input
            id="octalArithmeticB"
            type="text"
            readonly
            dir="ltr"
            placeholder="5"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateOctalArithmetic()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب
        </button>

        <div
            id="octalArithmeticResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
                line-height:2;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "octalArithmeticA";

    document
        .getElementById("octalArithmeticA")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "octalArithmeticA";
        });

    document
        .getElementById("octalArithmeticB")
        ?.addEventListener("click", () => {

            window.activeProgrammingField =
                "octalArithmeticB";
        });

    setupProgrammingKeys();
};


// ==========================================
// 🧮 حساب Octal
// ==========================================

window.calculateOctalArithmetic = function () {

    const fieldA =
        document.getElementById(
            "octalArithmeticA"
        );

    const fieldB =
        document.getElementById(
            "octalArithmeticB"
        );

    const operation =
        document.getElementById(
            "octalArithmeticOperation"
        )?.value;

    const result =
        document.getElementById(
            "octalArithmeticResult"
        );

    if (
        !fieldA ||
        !fieldB ||
        !operation ||
        !result
    ) {
        return;
    }

    const aText =
        fieldA.value.trim();

    const bText =
        fieldB.value.trim();

    if (
        !/^[0-7]+$/.test(aText) ||
        !/^[0-7]+$/.test(bText)
    ) {

        result.innerHTML =
            "❌ أدخل أرقام Octal صحيحة";

        return;
    }

    const a =
        BigInt("0o" + aText);

    const b =
        BigInt("0o" + bText);

    let answer;

    if (operation === "+") {

        answer = a + b;

    } else if (operation === "-") {

        answer = a - b;

    } else if (operation === "*") {

        answer = a * b;

    } else if (operation === "/") {

        if (b === 0n) {

            result.innerHTML =
                "❌ لا يمكن القسمة على صفر";

            return;
        }

        answer = a / b;

    } else if (operation === "%") {

        if (b === 0n) {

            result.innerHTML =
                "❌ لا يمكن MOD على صفر";

            return;
        }

        answer = a % b;
    }

    const octalAnswer =
        answer < 0n
            ? "-" + (-answer).toString(8)
            : answer.toString(8);

    result.innerHTML = `
        OCT = ${octalAnswer}<br>
        DEC = ${answer.toString()}
    `;

    window.lastProgrammingResult =
        answer;
};
// ==========================================
// 💻 Advanced Complements - Hex & Octal
// ==========================================

window.programmingAdvancedComplements = function () {

    createScreenPanel(`

        <div style="
            font-size:18px;
            font-weight:bold;
            text-align:center;
            margin-bottom:15px;
        ">
            🔄 مكملات Hex وOctal
        </div>

        <div style="
            text-align:center;
            font-size:14px;
            margin-bottom:10px;
        ">
            اختر النظام:
        </div>

        <select
            id="advancedComplementSystem"
            style="
                width:90%;
                padding:9px;
                font-size:15px;
                margin-bottom:10px;
            "
        >
            <option value="octal">
                🟠 Octal — 7's / 8's
            </option>

            <option value="hex">
                🟣 Hexadecimal — 15's / 16's
            </option>
        </select>

        <select
            id="advancedComplementType"
            style="
                width:90%;
                padding:9px;
                font-size:15px;
                margin-bottom:10px;
            "
        >
            <option value="sevens">
                7's Complement
            </option>

            <option value="eights">
                8's Complement
            </option>
        </select>

        <input
            id="advancedComplementInput"
            type="text"
            readonly
            dir="ltr"
            placeholder="17"
            style="
                width:90%;
                padding:9px;
                font-size:17px;
                text-align:center;
                margin-bottom:10px;
            "
        >

        <button
            onclick="calculateAdvancedComplement()"
            style="
                width:100%;
                padding:10px;
            "
        >
            🧮 احسب المكمل
        </button>

        <div
            id="advancedComplementResult"
            style="
                margin-top:12px;
                text-align:center;
                font-weight:bold;
                font-size:15px;
                direction:ltr;
                line-height:2;
            "
        ></div>

        <button
            onclick="openProgrammingMenu()"
            style="
                width:100%;
                padding:9px;
                margin-top:10px;
            "
        >
            ← رجوع للبرمجة
        </button>

    `);

    window.activeProgrammingField =
        "advancedComplementInput";

    const systemSelect =
        document.getElementById(
            "advancedComplementSystem"
        );

    const typeSelect =
        document.getElementById(
            "advancedComplementType"
        );

    systemSelect?.addEventListener(
        "change",
        function () {

            if (this.value === "hex") {

                typeSelect.innerHTML = `
                    <option value="fifteens">
                        15's Complement
                    </option>

                    <option value="sixteens">
                        16's Complement
                    </option>
                `;

            } else {

                typeSelect.innerHTML = `
                    <option value="sevens">
                        7's Complement
                    </option>

                    <option value="eights">
                        8's Complement
                    </option>
                `;
            }
        }
    );

    setupProgrammingKeys();
};
window.calculateAdvancedComplement = function () {

    const system =
        document.getElementById(
            "advancedComplementSystem"
        )?.value;

    const type =
        document.getElementById(
            "advancedComplementType"
        )?.value;

    const input =
        document.getElementById(
            "advancedComplementInput"
        );

    const result =
        document.getElementById(
            "advancedComplementResult"
        );

    if (!system || !type || !input || !result) {
        return;
    }

    const value =
        input.value.trim();

    if (!value) {

        result.innerHTML =
            "❌ أدخل رقمًا";

        return;
    }

    // ======================================
    // 🟠 Octal
    // ======================================

    if (system === "octal") {

        if (!/^[0-7]+$/.test(value)) {

            result.innerHTML =
                "❌ أدخل رقم Octal صحيح";

            return;
        }

        const n =
            BigInt("0o" + value);

        const base =
            8n ** BigInt(value.length);

        let answer;

        if (type === "sevens") {

            answer =
                (base - 1n) - n;

        } else {

            answer =
                (base - n) % base;
        }

        result.innerHTML = `
            OCT = ${answer.toString(8)}
            <br>
            DEC = ${answer.toString()}
        `;

        return;
    }


    // ======================================
    // 🟣 Hexadecimal
    // ======================================

    if (system === "hex") {

        if (!/^[0-9A-Fa-f]+$/.test(value)) {

            result.innerHTML =
                "❌ أدخل رقم Hex صحيح";

            return;
        }

        const n =
            BigInt("0x" + value);

        const base =
            16n ** BigInt(value.length);

        let answer;

        if (type === "fifteens") {

            answer =
                (base - 1n) - n;

        } else {

            answer =
                (base - n) % base;
        }

        result.innerHTML = `
            HEX = ${answer.toString(16).toUpperCase()}
            <br>
            DEC = ${answer.toString()}
        `;
    }
};

// ==========================================
// ⚛️ إعداد أزرار الفيزياء
// ==========================================

let originalScientificHTML = null;

let originalTopRowNodes = null;
let originalMemoryRowNodes = null;
let originalNavigationNodes = null;
let originalFractionRowNode = null;

function restoreOriginalCalculatorUI() {
    const topRow = document.querySelector('.top-row');
    const memoryRow = document.querySelector('.memory-row');
    const navigation = document.querySelector('.navigation');
    const fractionRow = document.querySelector('.fraction-row');
    const scientificGrid = document.querySelector('.scientific-grid');
    const numberGrid = document.querySelector('.number-grid');
    if (topRow && originalTopRowNodes !== null) topRow.replaceChildren(...originalTopRowNodes);
    if (memoryRow && originalMemoryRowNodes !== null) memoryRow.replaceChildren(...originalMemoryRowNodes);
    if (navigation && originalNavigationNodes !== null) navigation.replaceChildren(...originalNavigationNodes);
    if (!fractionRow && originalFractionRowNode && numberGrid && numberGrid.parentElement) numberGrid.parentElement.insertBefore(originalFractionRowNode, numberGrid);
    if (scientificGrid && originalScientificNodes !== null) scientificGrid.replaceChildren(...originalScientificNodes);
    if (numberGrid && originalNumberNodes !== null) numberGrid.replaceChildren(...originalNumberNodes);
    if (memoryRow) memoryRow.style.removeProperty('display');
    if (navigation) navigation.style.removeProperty('display');
    document.body.classList.remove('chemistry-mode');
    document.body.classList.remove('programming-mode');
}

function saveOriginalCalculatorUI() {
    if (originalTopRowNodes !== null) return;
    const topRow = document.querySelector('.top-row');
    const memoryRow = document.querySelector('.memory-row');
    const navigation = document.querySelector('.navigation');
    const fractionRow = document.querySelector('.fraction-row');
    const scientificGrid = document.querySelector('.scientific-grid');
    const numberGrid = document.querySelector('.number-grid');
    originalTopRowNodes = topRow ? Array.from(topRow.children) : [];
    originalMemoryRowNodes = memoryRow ? Array.from(memoryRow.children) : [];
    originalNavigationNodes = navigation ? Array.from(navigation.children) : [];
    originalFractionRowNode = fractionRow || null;
    if (scientificGrid && originalScientificHTML === null) originalScientificHTML = scientificGrid.innerHTML;
    if (numberGrid && originalNumberHTML === null) originalNumberHTML = numberGrid.innerHTML;
    if (scientificGrid && originalScientificNodes === null) originalScientificNodes = Array.from(scientificGrid.children);
    if (numberGrid && originalNumberNodes === null) originalNumberNodes = Array.from(numberGrid.children);
}
let originalNumberHTML = null;
let originalScientificNodes = null;
let originalNumberNodes = null;

function setupPhysicsKeys() {
document.body.classList.add("physics-mode");
    // ➗ إخفاء زر الكسر في الفيزياء
    const fractionRow = document.querySelector(".fraction-row");

if (fractionRow) {
    fractionRow.style.setProperty("display", "none", "important");
}
    const scientificGrid =
        document.querySelector(".scientific-grid");

    const numberGrid =
        document.querySelector(".number-grid");

    if (!scientificGrid || !numberGrid) {
        console.error("❌ لم يتم العثور على لوحة الأزرار");
        return;
    }

    // حفظ أزرار الرياضيات أول مرة فقط
    if (originalScientificHTML === null) {
        originalScientificHTML = scientificGrid.innerHTML;
    }

    if (originalNumberHTML === null) {
        originalNumberHTML = numberGrid.innerHTML;
    }

    // ==========================================
    // ⚛️ أزرار الفيزياء العلمية
    // ==========================================

    scientificGrid.innerHTML = `

        <button data-physics-key="v">v</button>
        <button data-physics-key="u">u</button>
        <button data-physics-key="a">a</button>
        <button data-physics-key="t">t</button>
        <button data-physics-key="s">s</button>

        <button data-physics-key="d">d</button>
        <button data-physics-key="F">F</button>
        <button data-physics-key="m">m</button>
        <button data-physics-key="g">g</button>
        <button data-physics-key="W">W</button>

        <button data-physics-key="P">P</button>
        <button data-physics-key="KE">KE</button>
        <button data-physics-key="PE">PE</button>
        <button data-physics-key="p">p</button>
        <button data-physics-key="rho">ρ</button>

        <button data-physics-key="V">V</button>
        <button data-physics-key="I">I</button>
        <button data-physics-key="R">R</button>
        <button data-physics-key="Q">Q</button>
        <button data-physics-key="T">T</button>

        <button data-physics-key="lambda">λ</button>
        <button data-physics-key="f">f</button>
        <button data-physics-key="sqrt">√</button>
        <button data-physics-key="square">x²</button>

        <button id="sciExpBtn">×10ˣ</button>
    `;

    // ==========================================
    // 🔢 لوحة الأرقام
    // ==========================================

    numberGrid.innerHTML = `

        <button>7</button>
        <button>8</button>
        <button>9</button>

        <button id="delete" class="btn-del">
            DEL
        </button>

        <button id="ac" class="btn-ac">
            AC
        </button>


        <button>4</button>
        <button>5</button>
        <button>6</button>

        <button class="operator">×</button>
        <button class="operator">÷</button>


        <button>1</button>
        <button>2</button>
        <button>3</button>

        <button class="operator">+</button>
        <button class="operator">−</button>


        <button>0</button>
        <button>.</button>
        <button>(</button>
        <button>)</button>

        <button id="equals" class="btn-equals">
            =
        </button>
    `;

    console.log("⚛️ تم تشغيل لوحة أزرار الفيزياء");
        // ==========================================
    // ⚛️ تشغيل أزرار الفيزياء الجديدة
    // ==========================================

    document.querySelectorAll("[data-physics-key]").forEach(button => {

        button.addEventListener("click", () => {

            const key = button.dataset.physicsKey;

            if (!window.activePhysicsField) {
                console.warn("⚠️ لا توجد خانة فيزياء نشطة");
                return;
            }

            const input =
                document.getElementById(window.activePhysicsField);

            if (!input) {
                console.warn("⚠️ لم يتم العثور على خانة الإدخال");
                return;
            }

            let value = key;

            // الرموز الخاصة
            if (key === "sqrt") {
                value = "√";
            }

            if (key === "square") {
                value = "²";
            }

            input.value += value;

            // تشغيل حدث input لو أي جزء من الكود محتاجه
            input.dispatchEvent(new Event("input", {
                bubbles: true
            }));

            playKeySound?.(620);
        });

    });
        // ==========================================
    // 🔢 تشغيل أزرار الأرقام والعمليات
    // ==========================================

    numberGrid.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", () => {

            if (!window.activePhysicsField) return;

            const input =
                document.getElementById(window.activePhysicsField);

            if (!input) return;

            const value = button.textContent.trim();

            if (value === "DEL") {
                input.value = input.value.slice(0, -1);
                return;
            }

            if (value === "AC") {
                input.value = "";
                return;
            }

            if (value === "=") {
                return;
            }

            input.value += value;

            input.dispatchEvent(new Event("input", {
                bubbles: true
            }));

            playKeySound?.(620);
        });

    });
        // ==========================================
    // ✖️ زر ×10ˣ في الفيزياء
    // ==========================================

    const sciExpBtn = document.getElementById("sciExpBtn");

    if (sciExpBtn) {
        sciExpBtn.addEventListener("click", () => {

            if (!window.activePhysicsField) return;

            const input =
                document.getElementById(window.activePhysicsField);

            if (!input) return;

            input.value += "×10^";

            input.dispatchEvent(new Event("input", {
                bubbles: true
            }));

            playKeySound?.(620);
        });
    }
    // ==========================================
// 📱 منع لوحة مفاتيح الهاتف والتابلت في الفيزياء
// ==========================================

document.querySelectorAll(".physics-mode input").forEach(input => {

    // منع لوحة المفاتيح الافتراضية
    input.setAttribute("readonly", "readonly");

    // منع ظهور لوحة المفاتيح عند الضغط
    input.addEventListener("focus", () => {
        input.setAttribute("readonly", "readonly");
    });

    input.addEventListener("click", () => {
        input.setAttribute("readonly", "readonly");
    });

});
}
function restoreMathKeys() {

    const scientificGrid =
        document.querySelector(".scientific-grid");

    const numberGrid =
        document.querySelector(".number-grid");

    if (!scientificGrid || !numberGrid) {
        console.error("❌ لم يتم العثور على لوحات الأزرار");
        return;
    }

    // استرجاع أزرار الرياضيات
    if (originalScientificNodes !== null) {
        scientificGrid.replaceChildren(...originalScientificNodes);
    }

    if (originalNumberNodes !== null) {
        numberGrid.replaceChildren(...originalNumberNodes);
    }

    // إزالة وضع الفيزياء
    document.body.classList.remove("physics-mode");

    console.log("🧮 تم استرجاع أزرار الرياضيات");
}
function showFractionButton() {
    const fractionRow = document.querySelector(".fraction-row");

    if (fractionRow) {
        fractionRow.style.removeProperty("display");
    }
}

function hideFractionButton() {
    const fractionRow = document.querySelector(".fraction-row");

    if (fractionRow) {
        fractionRow.style.setProperty("display", "none", "important");
    }
}
// ==========================================
// 🧹 UNIVERSAL AC
// يعمل في كل أوضاع الرياضيات
// COMP / CMPLX / STAT / EQN / MATRIX / TABLE / VECTOR
// ==========================================


document.addEventListener("click", function (event) {

    const btn = event.target.closest("button");
    if (!btn) return;

    const text = btn.textContent.trim();

    // زر AC فقط
    if (text !== "AC") return;

    console.log("🧹 UNIVERSAL AC:", currentMode);

    // منع أي AC قديم من الاشتغال
    if(document.body.classList.contains('physics-mode')){const f=window.activePhysicsField?document.getElementById(window.activePhysicsField):null;if(f){f.value='';f.dispatchEvent(new Event('input',{bubbles:true}));}window.activePhysicsField=null;event.stopImmediatePropagation();return;}if(document.body.classList.contains('programming-mode')){if(typeof window.programmingClear==='function'){window.programmingClear();}event.stopImmediatePropagation();return;}event.stopImmediatePropagation();

    // ==========================================
    // 🧹 مسح حالة الكسر بالكامل
    // ==========================================

    if (typeof resetFractionState === "function") {
        resetFractionState();
    }

    // ==========================================
    // 🧹 إزالة واجهة إدخال الكسر
    // ==========================================

    const fractionEditor =
        document.getElementById("fractionEditor");

    if (fractionEditor) {
        fractionEditor.remove();
    }

    const fractionDisplay =
        document.getElementById("fractionDisplay");

    if (fractionDisplay) {
        fractionDisplay.classList.add("hidden");
    }

    // ==========================================
    // 🧹 إعادة الشاشة الرئيسية
    // ==========================================

    if (typeof display !== "undefined" && display) {
        display.style.visibility = "visible";
        display.value = "";
    }

    if (typeof expression !== "undefined" && expression) {
        expression.textContent = "";
    }

    if (typeof answer !== "undefined") {
        answer = 0;
    }

    if (typeof cursorPosition !== "undefined") {
        cursorPosition = 0;
    }

    // ==========================================
    // 🧮 COMP
    // ==========================================

    if (currentMode === "COMP") {

        console.log("🧮 COMP CLEARED");
    }

    // ==========================================
    // 🔢 CMPLX
    // ==========================================

    if (currentMode === "CMPLX") {

        if (typeof complexInput !== "undefined") {
            complexInput = "";
        }

        if (typeof complexExpression !== "undefined") {
            complexExpression = "";
        }

        if (typeof complexResult !== "undefined") {
            complexResult = "";
        }

        console.log("🔢 CMPLX CLEARED");
    }

    // ==========================================
    // 📊 STAT
    // ==========================================

    if (currentMode === "STAT") {

        if (
            typeof statData !== "undefined" &&
            Array.isArray(statData)
        ) {
            statData.length = 0;
        }

        if (typeof activeStatField !== "undefined") {
            activeStatField = null;
        }

        document.querySelectorAll(
            '#customModePanel input, input[id^="stat"]'
        ).forEach(input => {
            input.value = "";
        });

        console.log("📊 STAT CLEARED");
    }

    // ==========================================
    // 📐 EQN
    // ==========================================

    if (currentMode === "EQN") {

        document.querySelectorAll(
            '#customModePanel input, ' +
            'input[id*="eqn"], ' +
            'input[id*="cubic"], ' +
            'input[id*="quartic"]'
        ).forEach(el => {
            el.value = "";
            el.textContent = "";
        });

        document.querySelectorAll(
            '#customModePanel [id*="eqn"], ' +
            '#customModePanel [id*="cubic"], ' +
            '#customModePanel [id*="quartic"]'
        ).forEach(el => {

            if (
                el.tagName !== "INPUT" &&
                el.tagName !== "BUTTON"
            ) {
                el.textContent = "";
            }
        });

        if (
            typeof eqnData !== "undefined" &&
            eqnData
        ) {
            if (
                typeof eqnData.current !== "undefined"
            ) {
                eqnData.current = "";
            }
        }

        if (
            typeof cubicData !== "undefined" &&
            cubicData
        ) {
            if (
                typeof cubicData.current !== "undefined"
            ) {
                cubicData.current = "";
            }
        }

        if (
            typeof quarticData !== "undefined" &&
            quarticData
        ) {
            if (
                typeof quarticData.current !== "undefined"
            ) {
                quarticData.current = "";
            }
        }

        console.log("📐 EQN CLEARED COMPLETELY");
    }

    // ==========================================
    // 🔲 MATRIX
    // ==========================================

    if (currentMode === "MATRIX") {

        if (
            typeof matrixData !== "undefined" &&
            matrixData
        ) {
            if (Array.isArray(matrixData.values)) {
                matrixData.values.length = 0;
            }

            matrixData.current = "";
        }

        window.matrixPowerData = null;
        window.matrixScalarData = null;

        document.querySelectorAll(
            '#customModePanel input, input[id*="matrix"]'
        ).forEach(el => {
            el.value = "";
            el.textContent = "";
        });

        document.querySelectorAll(
            '#customModePanel [id*="matrix"]'
        ).forEach(el => {

            if (
                el.tagName !== "INPUT" &&
                el.tagName !== "BUTTON"
            ) {
                el.textContent = "";
            }
        });

        console.log("🔲 MATRIX CLEARED COMPLETELY");
    }

    // ==========================================
    // 📋 TABLE
    // ==========================================

    if (currentMode === "TABLE") {

        if (typeof activeTableField !== "undefined") {
            activeTableField = null;
        }

        document.querySelectorAll(
            '#customModePanel input, input[id*="table"]'
        ).forEach(input => {
            input.value = "";
        });

        console.log("📋 TABLE CLEARED");
    }

    // ==========================================
    // ➡️ VECTOR
    // ==========================================

    if (currentMode === "VECTOR") {

        if (typeof activeVectorField !== "undefined") {
            activeVectorField = null;
        }

        document.querySelectorAll(
            '#customModePanel input, input[id^="vector"]'
        ).forEach(input => {
            input.value = "";
        });

        const vectorRes =
            document.getElementById("vectorRes");

        if (vectorRes) {
            vectorRes.innerHTML = "";
        }

        console.log("➡️ VECTOR CLEARED");
    }

    // ==========================================
    // 🌡️ PHYSICS
    // 🧪 CHEMISTRY
    // ==========================================

    if (typeof window.activePhysicsField !== "undefined") {
        window.activePhysicsField = null;
    }

    if (typeof window.activeChemistryField !== "undefined") {
        window.activeChemistryField = null;
    }

    // ==========================================
    // 🧹 أوضاع الإدخال الخاصة
    // ==========================================

    if (typeof absMode !== "undefined") {
        absMode = false;
    }

    // ==========================================
    // ✅ النهاية
    // ==========================================

    if (typeof display !== "undefined" && display) {
        display.style.visibility = "visible";
        display.value = "";
    }

    console.log("✅ AC FINISHED:", currentMode);

}, true);


/* ==========================================
🎨 نظام أشكال الآلة
========================================== */

const themePage = document.getElementById("themePage");
const themeBtn = document.getElementById("themeBtn");
const applyThemeBtn = document.getElementById("applyThemeBtn");
const backThemeBtn = document.getElementById("backThemeBtn");

const themeOptions = document.querySelectorAll(".theme-option");

let selectedTheme =
localStorage.getItem("calculatorTheme") || "blue";

let temporaryTheme = selectedTheme;

/* فتح صفحة الخلفيات */

if (themeBtn) {


themeBtn.addEventListener("click", () => {

    temporaryTheme = selectedTheme;

    themePage.classList.remove("hidden");

    themeOptions.forEach(option => {

        option.classList.toggle(
            "selected",
            option.dataset.theme === temporaryTheme
        );

    });

});


}

/* اختيار شكل */

themeOptions.forEach(option => {


option.addEventListener("click", () => {

    temporaryTheme = option.dataset.theme;

    themeOptions.forEach(item => {
        item.classList.remove("selected");
    });

    option.classList.add("selected");

});


});

/* تطبيق */

if (applyThemeBtn) {


applyThemeBtn.addEventListener("click", () => {

    selectedTheme = temporaryTheme;

    localStorage.setItem(
        "calculatorTheme",
        selectedTheme
    );

    applyCalculatorTheme(selectedTheme);

    themePage.classList.add("hidden");

});


}

/* رجوع بدون تطبيق */

if (backThemeBtn) {


backThemeBtn.addEventListener("click", () => {

    temporaryTheme = selectedTheme;

    themePage.classList.add("hidden");

});


}

/* تطبيق الشكل على الآلة */

function applyCalculatorTheme(theme) {


document.body.classList.remove(
    "theme-blue",
    "theme-green",
    "theme-orange",
    "theme-purple",
    "theme-red",
    "theme-dark",
    "theme-silver",
    "theme-cyan"
);

document.body.classList.add(
    "theme-" + theme
);


}

/* تشغيل الشكل المحفوظ عند فتح الآلة */

document.addEventListener("DOMContentLoaded", () => {
    applyCalculatorTheme(selectedTheme);
    document.body.classList.toggle('comp-mode', currentMode === 'COMP');
});

function inputFractionDigit(digit) {

    // ==========================================
    // 🔢 إدخال الرقم داخل الكسر
    // ==========================================

    if (!fractionMode) return false;

    if (fractionStage === 1) {

        // البسط
        fractionNumerator += digit;

    }
    else if (fractionStage === 2) {

        // المقام
        fractionDenominator += digit;

    }

    updateFractionDisplay();

    console.log(
        "🔢 FRACTION INPUT:",
        fractionStage === 1 ? "NUMERATOR" : "DENOMINATOR",
        digit
    );

    return true;
}



