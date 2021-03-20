"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert = require("assert");
const languageModes_1 = require("../modes/languageModes");
const selectionRanges_1 = require("../modes/selectionRanges");
const nodeFs_1 = require("../node/nodeFs");
function assertRanges(content, expected) {
    return __awaiter(this, void 0, void 0, function* () {
        let message = `${content} gives selection range:\n`;
        const offset = content.indexOf('|');
        content = content.substr(0, offset) + content.substr(offset + 1);
        let workspace = {
            settings: {},
            folders: [{ name: 'foo', uri: 'test://foo' }]
        };
        const languageModes = languageModes_1.getLanguageModes({ css: true, javascript: true }, workspace, languageModes_1.ClientCapabilities.LATEST, nodeFs_1.getNodeFSRequestService());
        const document = languageModes_1.TextDocument.create('test://foo.html', 'html', 1, content);
        const actualRanges = yield selectionRanges_1.getSelectionRanges(languageModes, document, [document.positionAt(offset)]);
        assert.equal(actualRanges.length, 1);
        const offsetPairs = [];
        let curr = actualRanges[0];
        while (curr) {
            offsetPairs.push([document.offsetAt(curr.range.start), document.getText(curr.range)]);
            curr = curr.parent;
        }
        message += `${JSON.stringify(offsetPairs)}\n but should give:\n${JSON.stringify(expected)}\n`;
        assert.deepEqual(offsetPairs, expected, message);
    });
}
suite('HTML SelectionRange', () => {
    test('Embedded JavaScript', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertRanges('<html><head><script>  function foo() { return ((1|+2)*6) }</script></head></html>', [
            [48, '1'],
            [48, '1+2'],
            [47, '(1+2)'],
            [47, '(1+2)*6'],
            [46, '((1+2)*6)'],
            [39, 'return ((1+2)*6)'],
            [22, 'function foo() { return ((1+2)*6) }'],
            [20, '  function foo() { return ((1+2)*6) }'],
            [12, '<script>  function foo() { return ((1+2)*6) }</script>'],
            [6, '<head><script>  function foo() { return ((1+2)*6) }</script></head>'],
            [0, '<html><head><script>  function foo() { return ((1+2)*6) }</script></head></html>'],
        ]);
    }));
    test('Embedded CSS', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertRanges('<html><head><style>foo { display: |none; } </style></head></html>', [
            [34, 'none'],
            [25, 'display: none'],
            [24, ' display: none; '],
            [23, '{ display: none; }'],
            [19, 'foo { display: none; }'],
            [19, 'foo { display: none; } '],
            [12, '<style>foo { display: none; } </style>'],
            [6, '<head><style>foo { display: none; } </style></head>'],
            [0, '<html><head><style>foo { display: none; } </style></head></html>'],
        ]);
    }));
    test('Embedded style', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertRanges('<div style="color: |red"></div>', [
            [19, 'red'],
            [12, 'color: red'],
            [11, '"color: red"'],
            [5, 'style="color: red"'],
            [1, 'div style="color: red"'],
            [0, '<div style="color: red"></div>']
        ]);
    }));
});
