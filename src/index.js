function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    var brackets = /\([\d+*=/]+\)/;
    expr = expr.replace(/\s*/g, "");
    var leftBrs = expr.match(/\(/g);
    var rightBrs = expr.match(/\)/g);
    if ((leftBrs != null && rightBrs != null && leftBrs.length != rightBrs.length) ||
        (leftBrs != null && rightBrs == null) || (leftBrs == null && rightBrs != null)) {
        throw new Error("ExpressionError: Brackets must be paired");
    } else {
        while (expr.match(brackets) != null) {
            var exprBr = expr.match(brackets)[0];
            expr = expr.replace(brackets, expressionCalculator(exprBr));
        }
        var multDiv = /(\d+(\*|\/))+\d+/g;
        var multDivExprs = expr.match(multDiv);
        if (multDivExprs != null) {
            for (let i = 0; i < multDivExprs.length; i++) {
                const el = multDivExprs[i];
                expr = expr.replace(el, multDivide(el));
            }
        }
        expr = addSub(expr);
    }
    return new Number(expr).valueOf();
}

function addSub(expr) {
    var args = [];
    var number = "";
    for (let i = 0; i < expr.length; i++) {
        const el = expr[i];
        switch (el) {
            case "+":
            case "-":
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