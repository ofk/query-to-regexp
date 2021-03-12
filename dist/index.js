"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRegExp = exports.build = exports.parse = void 0;
function unescapeStringLiteral(str) {
    return str.replace(/\\(.)/g, '$1');
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
var REG_TOKEN = /(-)?(?:"((?:\\.|[^\\"])*)"|'((?:\\.|[^\\'])*)'|(\S+))/g;
function parse(query) {
    var ast = { and: [] };
    var m;
    // eslint-disable-next-line no-cond-assign
    while ((m = REG_TOKEN.exec(query))) {
        var value = 
        // eslint-disable-next-line no-nested-ternary
        m[2] != null
            ? unescapeStringLiteral(m[2])
            : m[3] != null
                ? unescapeStringLiteral(m[3])
                : m[4] || '';
        ast.and.push({
            op: m[1] ? 'not' : null,
            value: value,
        });
    }
    return ast;
}
exports.parse = parse;
function build(ast, flags) {
    if (flags === void 0) { flags = 'i'; }
    var conditions = [];
    ast.and.forEach(function (_a) {
        var op = _a.op, value = _a.value;
        if (value) {
            conditions.push("(?" + (op === 'not' ? '!' : '=') + "[\\s\\S]*?" + escapeRegExp(value) + ")");
        }
    });
    return conditions.length ? new RegExp("^" + conditions.join(''), flags) : null;
}
exports.build = build;
var toRegExp = function (query, flags) {
    if (flags === void 0) { flags = 'i'; }
    return build(parse(query), flags);
};
exports.toRegExp = toRegExp;
