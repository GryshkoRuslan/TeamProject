/**
 * Задание 6
 * Вам дан набор из функции вызова middleware и осн. функции,
 * а также вспомогательные констаны и переменные
 * Ваша задача: Внимательно проанализировав предоставленный код,
 * дописать код для benchmarkTest middleware, задача которой - добавлять ко
 * всякому объекту response поле processingTime, значение которого - время
 * обработки запроса, т.е. выполнения внутреннего вызова в мили(микро)секундах, например:
 * {
 *     ...
 *     processingTime: "0.2ms"
 * }
 * Менять предоставленный код - нельзя (для дебага можно).
 * Только реализовать benchmarkTest()
 * Проверить работоспособность кода.
 */


// Application or "core" logic
const app = function (request) {
    return { status: 200, message: "Ok"};
}

// BenchmarkTest middleware
const benchmarkTest = function(request, next) {
    // @TODO: Implement this
    let now = Date.now();
    let res = next(request);
    res.processingTime = (Date.now() - now) + ' ms';
    return res;
}

// Middleware stack
const middlewares = [
    benchmarkTest,
    app
];

// Execute middleware func
function executeMiddlewareChain(request) {
    const next = middlewares.shift();
    return next(request, executeMiddlewareChain)
}

const request = {
    user: {
        name: "john@doe.com"
    }
}

const response = executeMiddlewareChain(request);

console.log(response);
