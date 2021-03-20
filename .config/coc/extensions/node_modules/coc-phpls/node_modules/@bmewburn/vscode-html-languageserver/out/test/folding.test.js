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
const htmlFolding_1 = require("../modes/htmlFolding");
const languageModes_1 = require("../modes/languageModes");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const nodeFs_1 = require("../node/nodeFs");
function assertRanges(lines, expected, message, nRanges) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = languageModes_1.TextDocument.create('test://foo/bar.html', 'html', 1, lines.join('\n'));
        const workspace = {
            settings: {},
            folders: [{ name: 'foo', uri: 'test://foo' }]
        };
        const languageModes = languageModes_1.getLanguageModes({ css: true, javascript: true }, workspace, vscode_css_languageservice_1.ClientCapabilities.LATEST, nodeFs_1.getNodeFSRequestService());
        const actual = yield htmlFolding_1.getFoldingRanges(languageModes, document, nRanges, null);
        let actualRanges = [];
        for (let i = 0; i < actual.length; i++) {
            actualRanges[i] = r(actual[i].startLine, actual[i].endLine, actual[i].kind);
        }
        actualRanges = actualRanges.sort((r1, r2) => r1.startLine - r2.startLine);
        assert.deepEqual(actualRanges, expected, message);
    });
}
function r(startLine, endLine, kind) {
    return { startLine, endLine, kind };
}
suite('HTML Folding', () => __awaiter(void 0, void 0, void 0, function* () {
    test('Embedded JavaScript', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            'function f() {',
            '}',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield yield assertRanges(input, [r(0, 6), r(1, 5), r(2, 4), r(3, 4)]);
    }));
    test('Embedded JavaScript - multiple areas', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            '  var x = {',
            '    foo: true,',
            '    bar: {}',
            '  };',
            '</script>',
            '<script>',
            '  test(() => { // hello',
            '    f();',
            '  });',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertRanges(input, [r(0, 13), r(1, 12), r(2, 6), r(3, 6), r(8, 11), r(9, 11), r(9, 11)]);
    }));
    test('Embedded JavaScript - incomplete', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            '  var x = {',
            '</script>',
            '<script>',
            '  });',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertRanges(input, [r(0, 8), r(1, 7), r(2, 3), r(5, 6)]);
    }));
    test('Embedded JavaScript - regions', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            '  // #region Lalala',
            '   //  #region',
            '   x = 9;',
            '  //  #endregion',
            '  // #endregion Lalala',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertRanges(input, [r(0, 9), r(1, 8), r(2, 7), r(3, 7, 'region'), r(4, 6, 'region')]);
    }));
    test('Embedded CSS', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<style>',
            '  foo {',
            '   display: block;',
            '   color: black;',
            '  }',
            '</style>',
            '</head>',
            '</html>',
        ];
        yield assertRanges(input, [r(0, 8), r(1, 7), r(2, 6), r(3, 5)]);
    }));
    test('Embedded CSS - multiple areas', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head style="color:red">',
            '<style>',
            '  /*',
            '    foo: true,',
            '    bar: {}',
            '  */',
            '</style>',
            '<style>',
            '  @keyframes mymove {',
            '    from {top: 0px;}',
            '  }',
            '</style>',
            '</head>',
            '</html>',
        ];
        yield assertRanges(input, [r(0, 13), r(1, 12), r(2, 6), r(3, 6, 'comment'), r(8, 11), r(9, 10)]);
    }));
    test('Embedded CSS - regions', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<style>',
            '  /* #region Lalala */',
            '   /*  #region*/',
            '   x = 9;',
            '  /*  #endregion*/',
            '  /* #endregion Lalala*/',
            '</style>',
            '</head>',
            '</html>',
        ];
        yield assertRanges(input, [r(0, 9), r(1, 8), r(2, 7), r(3, 7, 'region'), r(4, 6, 'region')]);
    }));
    test('Test limit', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<div>',
            ' <span>',
            '  <b>',
            '  ',
            '  </b>,',
            '  <b>',
            '   <pre>',
            '  ',
            '   </pre>,',
            '   <pre>',
            '  ',
            '   </pre>,',
            '  </b>,',
            '  <b>',
            '  ',
            '  </b>,',
            '  <b>',
            '  ',
            '  </b>',
            ' </span>',
            '</div>',
        ];
        yield assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(6, 7), r(9, 10), r(13, 14), r(16, 17)], 'no limit', undefined);
        yield assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(6, 7), r(9, 10), r(13, 14), r(16, 17)], 'limit 8', 8);
        yield assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(6, 7), r(13, 14), r(16, 17)], 'limit 7', 7);
        yield assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(13, 14), r(16, 17)], 'limit 6', 6);
        yield assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(13, 14)], 'limit 5', 5);
        yield assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11)], 'limit 4', 4);
        yield assertRanges(input, [r(0, 19), r(1, 18), r(2, 3)], 'limit 3', 3);
        yield assertRanges(input, [r(0, 19), r(1, 18)], 'limit 2', 2);
        yield assertRanges(input, [r(0, 19)], 'limit 1', 1);
    }));
}));
