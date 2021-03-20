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
const semanticTokens_1 = require("../modes/semanticTokens");
const nodeFs_1 = require("../node/nodeFs");
function assertTokens(lines, expected, ranges, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = languageModes_1.TextDocument.create('test://foo/bar.html', 'html', 1, lines.join('\n'));
        const workspace = {
            settings: {},
            folders: [{ name: 'foo', uri: 'test://foo' }]
        };
        const languageModes = languageModes_1.getLanguageModes({ css: true, javascript: true }, workspace, languageModes_1.ClientCapabilities.LATEST, nodeFs_1.getNodeFSRequestService());
        const semanticTokensProvider = semanticTokens_1.newSemanticTokenProvider(languageModes);
        const legend = semanticTokensProvider.legend;
        const actual = yield semanticTokensProvider.getSemanticTokens(document, ranges);
        let actualRanges = [];
        let lastLine = 0;
        let lastCharacter = 0;
        for (let i = 0; i < actual.length; i += 5) {
            const lineDelta = actual[i], charDelta = actual[i + 1], len = actual[i + 2], typeIdx = actual[i + 3], modSet = actual[i + 4];
            const line = lastLine + lineDelta;
            const character = lineDelta === 0 ? lastCharacter + charDelta : charDelta;
            const tokenClassifiction = [legend.types[typeIdx], ...legend.modifiers.filter((_, i) => modSet & 1 << i)].join('.');
            actualRanges.push(t(line, character, len, tokenClassifiction));
            lastLine = line;
            lastCharacter = character;
        }
        assert.deepEqual(actualRanges, expected, message);
    });
}
function t(startLine, character, length, tokenClassifiction) {
    return { startLine, character, length, tokenClassifiction };
}
suite('HTML Semantic Tokens', () => {
    test('Variables', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            '  var x = 9, y1 = [x];',
            '  try {',
            '    for (const s of y1) { x = s }',
            '  } catch (e) {',
            '    throw y1;',
            '  }',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertTokens(input, [
            t(3, 6, 1, 'variable.declaration'), t(3, 13, 2, 'variable.declaration'), t(3, 19, 1, 'variable'),
            t(5, 15, 1, 'variable.declaration.readonly'), t(5, 20, 2, 'variable'), t(5, 26, 1, 'variable'), t(5, 30, 1, 'variable.readonly'),
            t(6, 11, 1, 'variable.declaration'),
            t(7, 10, 2, 'variable')
        ]);
    }));
    test('Functions', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            '  function foo(p1) {',
            '    return foo(Math.abs(p1))',
            '  }',
            '  `/${window.location}`.split("/").forEach(s => foo(s));',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertTokens(input, [
            t(3, 11, 3, 'function.declaration'), t(3, 15, 2, 'parameter.declaration'),
            t(4, 11, 3, 'function'), t(4, 15, 4, 'interface'), t(4, 20, 3, 'method'), t(4, 24, 2, 'parameter'),
            t(6, 6, 6, 'variable'), t(6, 13, 8, 'property'), t(6, 24, 5, 'method'), t(6, 35, 7, 'method'), t(6, 43, 1, 'parameter.declaration'), t(6, 48, 3, 'function'), t(6, 52, 1, 'parameter')
        ]);
    }));
    test('Members', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            '  class A {',
            '    static x = 9;',
            '    f = 9;',
            '    async m() { return A.x + await this.m(); };',
            '    get s() { return this.f; ',
            '    static t() { return new A().f; };',
            '    constructor() {}',
            '  }',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertTokens(input, [
            t(3, 8, 1, 'class.declaration'),
            t(4, 11, 1, 'property.declaration.static'),
            t(5, 4, 1, 'property.declaration'),
            t(6, 10, 1, 'method.declaration.async'), t(6, 23, 1, 'class'), t(6, 25, 1, 'property.static'), t(6, 40, 1, 'method.async'),
            t(7, 8, 1, 'property.declaration'), t(7, 26, 1, 'property'),
            t(8, 11, 1, 'method.declaration.static'), t(8, 28, 1, 'class'), t(8, 32, 1, 'property'),
        ]);
    }));
    test('Interfaces', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script type="text/typescript">',
            '  interface Position { x: number, y: number };',
            '  const p = { x: 1, y: 2 } as Position;',
            '  const foo = (o: Position) => o.x + o.y;',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertTokens(input, [
            t(3, 12, 8, 'interface.declaration'), t(3, 23, 1, 'property.declaration'), t(3, 34, 1, 'property.declaration'),
            t(4, 8, 1, 'variable.declaration.readonly'), t(4, 30, 8, 'interface'),
            t(5, 8, 3, 'variable.declaration.readonly'), t(5, 15, 1, 'parameter.declaration'), t(5, 18, 8, 'interface'), t(5, 31, 1, 'parameter'), t(5, 33, 1, 'property'), t(5, 37, 1, 'parameter'), t(5, 39, 1, 'property')
        ]);
    }));
    test('Readonly', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script type="text/typescript">',
            '  const f = 9;',
            '  class A { static readonly t = 9; static url: URL; }',
            '  const enum E { A = 9, B = A + 1 }',
            '  console.log(f + A.t + A.url.origin);',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertTokens(input, [
            t(3, 8, 1, 'variable.declaration.readonly'),
            t(4, 8, 1, 'class.declaration'), t(4, 28, 1, 'property.declaration.static.readonly'), t(4, 42, 3, 'property.declaration.static'), t(4, 47, 3, 'interface'),
            t(5, 13, 1, 'enum.declaration'), t(5, 17, 1, 'property.declaration.readonly'), t(5, 24, 1, 'property.declaration.readonly'), t(5, 28, 1, 'property.readonly'),
            t(6, 2, 7, 'variable'), t(6, 10, 3, 'method'), t(6, 14, 1, 'variable.readonly'), t(6, 18, 1, 'class'), t(6, 20, 1, 'property.static.readonly'), t(6, 24, 1, 'class'), t(6, 26, 3, 'property.static'), t(6, 30, 6, 'property.readonly'),
        ]);
    }));
    test('Type aliases and type parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script type="text/typescript">',
            '  type MyMap = Map<string, number>;',
            '  function f<T extends MyMap>(t: T | number) : T { ',
            '    return <T> <unknown> new Map<string, MyMap>();',
            '  }',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertTokens(input, [
            t(3, 7, 5, 'type.declaration'), t(3, 15, 3, 'interface'),
            t(4, 11, 1, 'function.declaration'), t(4, 13, 1, 'typeParameter.declaration'), t(4, 23, 5, 'type'), t(4, 30, 1, 'parameter.declaration'), t(4, 33, 1, 'typeParameter'), t(4, 47, 1, 'typeParameter'),
            t(5, 12, 1, 'typeParameter'), t(5, 29, 3, 'interface'), t(5, 41, 5, 'type'),
        ]);
    }));
    test('TS and JS', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script type="text/typescript">',
            '  function f<T>(p1: T): T[] { return [ p1 ]; }',
            '</script>',
            '<script>',
            '  window.alert("Hello");',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertTokens(input, [
            t(3, 11, 1, 'function.declaration'), t(3, 13, 1, 'typeParameter.declaration'), t(3, 16, 2, 'parameter.declaration'), t(3, 20, 1, 'typeParameter'), t(3, 24, 1, 'typeParameter'), t(3, 39, 2, 'parameter'),
            t(6, 2, 6, 'variable'), t(6, 9, 5, 'method')
        ]);
    }));
    test('Ranges', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            '  window.alert("Hello");',
            '</script>',
            '<script>',
            '  window.alert("World");',
            '</script>',
            '</head>',
            '</html>',
        ];
        yield assertTokens(input, [
            t(3, 2, 6, 'variable'), t(3, 9, 5, 'method')
        ], [languageModes_1.Range.create(languageModes_1.Position.create(2, 0), languageModes_1.Position.create(4, 0))]);
        yield assertTokens(input, [
            t(6, 2, 6, 'variable'),
        ], [languageModes_1.Range.create(languageModes_1.Position.create(6, 2), languageModes_1.Position.create(6, 8))]);
    }));
});
