function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    expr = expr.replace(/\s*/g, "");
    var leftBrs = expr.match(/\(/g);
    var rightBrs = expr.match(/\)/g);
    if ((leftBrs != null && rightBrs != null && leftBrs.length != rightBrs.length) ||
        (leftBrs != null && rightBrs == null) || (leftBrs == null && rightBrs != null)) {
        throw new Error("ExpressionError: Brackets must be paired");
    } else {
        var multDivInBrackets = /\(\-?(\d+(\.\d+)?(\*(\+|\-)?|\/(\+|\-)?))+\d+(\.\d+)?\)/g;
        var addSubInBrackets = /\(\-?(\d+(\.\d+)?(\+|\-))+\d+(\.\d+)?\)/g;
        var numbersInBrackets = expr.match(/\(\-?\d+(\.\d+)?\)/);
        var exprInBrackets = /\(\-?(\d+(\.\d+)?(\*(\+|\-)?|\/(\+|\-)?|\+|\-))+\d+(\.\d+)?\)/g;
        while (expr.match(/^\-?\d+(\.\d+)?$/) == null) {
            if (numbersInBrackets != null) {
                for (let i = 0; i < numbersInBrackets.length; i++) {
                    if (expr.match(/\(\-?\d+(\.\d+)?\)/) == null) {
                        break
                    }
                    const el = numbersInBrackets[i];
                    expr = expr.replace(el, el.replace(/\(|\)/g, ""));
                }
            }
            if (expr.includes("(")) {
                if (expr.match(multDivInBrackets) != null) {
                    var multDivExprs = expr.match(multDivInBrackets)
                        .map(it => it.replace(/\(|\)/g, ""));
                    for (let i = 0; i < multDivExprs.length; i++) {
                        const el = multDivExprs[i];
                        expr = expr.replace("(" + el + ")", multDivide(el));
                    }
                }
                if (expr.match(addSubInBrackets) != null) {
                    var addSubExprs = expr.match(addSubInBrackets)
                        .map(it => it.replace(/\(|\)/g, ""));
                    for (let i = 0; i < addSubExprs.length; i++) {
                        const el = addSubExprs[i];
                        expr = expr.replace("(" + el + ")", addSubstract(el));
                    }
                }
                if (expr.match(exprInBrackets) != null) {
                    var exprs = expr.match(exprInBrackets)
                        .map(it => it.replace(/\(|\)/g, ""));
                    for (let i = 0; i < exprs.length; i++) {
                        const el = exprs[i];
                        expr = expr.replace("(" + el + ")", calcMixed(el));
                    }
                }
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

function calcMixed(expr) {
    // var addSub = /(\d+(\.\d+)?(\+|\-))+\d+(\.\d+)?$/g;
    var multDiv = /(\d+(\.\d+)?(\*(\+|\-)?|\/(\+|\-)?))+\d+(\.\d+)?/g;
    var multDivExprs = expr.match(multDiv);
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