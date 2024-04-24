const crypto = require("crypto");

exports.handleRoll = function (payload, senderObject){
    const [rollCommand, metaCommand] = splitRollPayload(payload, '%');
    if (!rollCommand) return;
    const [rawOrder, comment] = splitRollPayload(rollCommand, '#');
    if (!rawOrder) return;

    const [result, text] = processRollOrder(rawOrder);
    const rollResult = {
        id: crypto.randomBytes(8).toString("hex"),
        messageTypeName: 'roll',
        text: text,
        result: result,
        rawOrder: rawOrder.trim(),
        sender: senderObject.name,
        color: senderObject.color 
    };
    if (comment) rollResult.comment = comment;
    return rollResult;
}

function splitRollPayload(payload, divider) {
    const base = payload.charAt(0) === divider ? payload.substr(1) : payload;
    const splited = base.split(divider);
    if (splited.length > 2) return;
    if (splited.length > 1) return [...splited];
    return [...splited, null]; 
}

function processRollOrder(order){
    const raw = order.replaceAll(' ', '');
    let misspeled = false;
    let resultValue = 0;
    let resultString = '';
    let currentString = '';
    let isCurrentRoll = false;
    let rollsCount = 1;
    let operation = 'add';

    for (let char of raw){
        if (!isNaN(char)){
            currentString += char;
            continue;
        }
        if (char === 'd'){
            isCurrentRoll = true;
            rollsCount = Number(currentString) || 1;
            currentString = '';
            continue;
        }
        if (['+', '-'].includes(char)){
            if (!isCurrentRoll) rollsCount = Number(currentString);
            appendRollValue(misspeled, isCurrentRoll, rollsCount, currentString);

            char === '+'? operation = 'add': operation = 'sub';
            isCurrentRoll = false;
            currentString = '';
            misspeled = false;
            rollsCount = 1;
            continue;
        }

        misspeled = true;

    }
    if (!isCurrentRoll) rollsCount = Number(currentString);
    appendRollValue(misspeled, isCurrentRoll, rollsCount, currentString);
    return [resultValue, resultString];


    function appendRollValue(error, isRoll, count, currentDiceString = ''){
        if (error) return;

        if (!isRoll && operation === 'add') addValue(Number(count), String(count));
        if (!isRoll && operation === 'sub') subtractValue(Number(count), String(count));
        if (!isRoll) return;

        const [currentValue, currentText] = rollDices(count, Number(currentDiceString));
        if (operation === 'add') addValue(currentValue, currentText);
        if (operation === 'sub') subtractValue(currentValue, currentText);
    }

    function addValue(numericValue, stringValue) {
        resultString === ''? resultString = `${stringValue}`: resultString += ` + ${stringValue}`;
        resultValue += numericValue;
    }

    function subtractValue(numericValue, stringValue){
        resultString += ` - ${stringValue}`;
        resultValue -= numericValue;
    }
}

function rollDices(count, dice){
    let resultValue = 0;
    let stringValue = '';
    let currentValue = 0;
    for (let i = 0; i < count; i++) {
        currentValue = randomNumber(1, dice);
        resultValue += currentValue;
        stringValue === ''? stringValue = String(currentValue): stringValue += ` + ${currentValue}`;
    }
    return [resultValue, stringValue];

}

function randomNumber(min, max) {
    min = Number(min);
    max = Number(max);
    result = Math.floor(Math.random() * max) + min;
	return result; 
}
