function eval() {
    // Do not use eval!!!
    return;
}

var multiplyDivideInBracketsRegExp = /\(\-?(\d+(\.\d+)?(\*(\+|\-)?|\/(\+|\-)?))+\d+(\.\d+)?\)/g;
var multiplyDivideRegExp = /(\d+(\.\d+)?(\*(\+|\-)?|\/(\+|\-)?))+\d+(\.\d+)?/g;
var addSubstractInBracketsRegExp = /\(\-?(\d+(\.\d+)?(\+|\-))+\d+(\.\d+)?\)/g;
var numbersInBracketsRegExp = /\(\-?\d+(\.\d+)?\)/;
var numberFullStrRegExp = /^\-?\d+(\.\d+)?$/;
var anyBracketRegExp = /\(|\)/g;
var mixedInBracketsRegExp = /\(\-?(\d+(\.\d+)?(\*(\+|\-)?|\/(\+|\-)?|\+|\-))+\d+(\.\d+)?\)/g;

function expressionCalculator(expr) {
    expr = expr.replace(/\s*/g, "");
    var leftBrackets = expr.match(/\(/g);
    var rightBrackets = expr.match(/\)/g);
    if ((leftBrackets != null && rightBrackets != null && leftBrackets.length != rightBrackets.length) ||
        (leftBrackets != null && rightBrackets == null) || (leftBrackets == null && rightBrackets != null)) {
        throw new Error("ExpressionError: Brackets must be paired");
    } else {
        while (expr.match(numberFullStrRegExp) == null) {
            if (expr.match(numbersInBracketsRegExp) != null) {
                simplifyBrackets(expr);
            }
            if (expr.includes("(")) {
                expr = calculateInBrackets(expr, multiplyDivideInBracketsRegExp, multDivide);
                expr = calculateInBrackets(expr, addSubstractInBracketsRegExp, addSubstract);
                expr = calculateInBrackets(expr, mixedInBracketsRegExp, calcMixed);
            } else {
                expr = calcMixed(expr);
            }
            if (expr.includes("+-")) {
                expr = expr.replace(/\+\-/g, "-");
            }
            if (expr.includes("--")) {
                expr = expr.replace(/\-\-/g, "+");
            }
        }
    }
    return new Number(expr).valueOf();
}

function simplifyBrackets(expr) {
    var numbersInBracketsExpr = expr.match(numbersInBracketsRegExp);
    for (let i = 0; i < numbersInBracketsExpr.length; i++) {
        if (expr.match(numbersInBracketsRegExp) == null) {
            break
        }
        const el = numbersInBracketsExpr[i];
        expr = expr.replace(el, el.replace(anyBracketRegExp, ""));
    }
}

function calculateInBrackets(expr, regExp, actionCallback) {
    if (expr.match(regExp) != null) {
        var matchedExprs = expr.match(regExp)
            .map(it => it.replace(anyBracketRegExp, ""));
        for (let i = 0; i < matchedExprs.length; i++) {
            const el = matchedExprs[i];
            expr = expr.replace("(" + el + ")", actionCallback(el));
        }
    }
    return expr;
}

function calcMixed(expr) {
    var multDivExprs = expr.match(multiplyDivideRegExp);
    if (multDivExprs != null) {
        for (let i = 0; i < multDivExprs.length; i++) {
            const el = multDivExprs[i];
            expr = expr.replace(el, multDivide(el));
        }
    }
    expr = addSubstract(expr);
    return expr;
}

function addSubstract(expr) {
    var args = [];
    var number = "";
    for (let i = 0; i < expr.length; i++) {
        const el = expr[i];
        switch (el) {
            case "+":
            case "-":
                if (number.length != 0) {
                    if (expr[i - 1] == "e") {
                        number += el;
                        continue;
                    }
                    var n = new Number(number).valueOf();
                    number = "";
                    args.push(n);
                    args.push(el);
                } else {
                    number += el;
                }
                break;
            default:
                number += el;
        }
    }
    var n = new Number(number).valueOf();
    args.push(n);
    var res = args[0];
    for (let i = 1; i < args.length; i += 2) {
        const el = args[i];
        switch (el) {
            case "+":
                res += args[i + 1];
                break;
            case "-":
                res -= args[i + 1];
                break;
        }
    }
    return res.toString();
}

function multDivide(expr) {
    var args = [];
    var number = "";
    for (let i = 0; i < expr.length; i++) {
        const el = expr[i];
        switch (el) {
            case "/":
            case "*":
                if (number.length != 0) {
                    var n = new Number(number).valueOf();
                    number = "";
                    args.push(n);
                }
                args.push(el);
                break;
            default:
                number += el;
        }
    }
    var n = new Number(number).valueOf();
    args.push(n);
    var res = args[0];
    for (let i = 1; i < args.length; i += 2) {
        const el = args[i];
        switch (el) {
            case "*":
                res *= args[i + 1];
                break;
            case "/":
                if (args[i + 1] == 0) {
                    throw new Error("TypeError: Division by zero.");
                }
                res /= args[i + 1];
                break;
        }
    }
    return res.toString();
}

module.exports = {
    expressionCalculator
}