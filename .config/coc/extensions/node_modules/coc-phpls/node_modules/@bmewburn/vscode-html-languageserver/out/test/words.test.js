"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const words = require("../utils/strings");
suite('HTML Words', () => {
    let wordRegex = /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g;
    function assertWord(value, expected) {
        let offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        let actualRange = words.getWordAtText(value, offset, wordRegex);
        assert(actualRange.start <= offset);
        assert(actualRange.start + actualRange.length >= offset);
        assert.equal(value.substr(actualRange.start, actualRange.length), expected);
    }
    test('Basic', function () {
        assertWord('|var x1 = new F<A>(a, b);', 'var');
        assertWord('v|ar x1 = new F<A>(a, b);', 'var');
        assertWord('var| x1 = new F<A>(a, b);', 'var');
        assertWord('var |x1 = new F<A>(a, b);', 'x1');
        assertWord('var x1| = new F<A>(a, b);', 'x1');
        assertWord('var x1 = new |F<A>(a, b);', 'F');
        assertWord('var x1 = new F<|A>(a, b);', 'A');
        assertWord('var x1 = new F<A>(|a, b);', 'a');
        assertWord('var x1 = new F<A>(a, b|);', 'b');
        assertWord('var x1 = new F<A>(a, b)|;', '');
        assertWord('var x1 = new F<A>(a, b)|;|', '');
        assertWord('var x1 = |  new F<A>(a, b)|;|', '');
    });
    test('Multiline', function () {
        assertWord('console.log("hello");\n|var x1 = new F<A>(a, b);', 'var');
        assertWord('console.log("hello");\n|\nvar x1 = new F<A>(a, b);', '');
        assertWord('console.log("hello");\n\r |var x1 = new F<A>(a, b);', 'var');
    });
});
