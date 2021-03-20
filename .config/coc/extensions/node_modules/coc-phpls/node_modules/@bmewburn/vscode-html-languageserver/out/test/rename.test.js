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
const assert = require("assert");
const languageModes_1 = require("../modes/languageModes");
const nodeFs_1 = require("../node/nodeFs");
function testRename(value, newName, expectedDocContent) {
    return __awaiter(this, void 0, void 0, function* () {
        const offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        const document = languageModes_1.TextDocument.create('test://test/test.html', 'html', 0, value);
        const workspace = {
            settings: {},
            folders: [{ name: 'foo', uri: 'test://foo' }]
        };
        const languageModes = languageModes_1.getLanguageModes({ css: true, javascript: true }, workspace, languageModes_1.ClientCapabilities.LATEST, nodeFs_1.getNodeFSRequestService());
        const javascriptMode = languageModes.getMode('javascript');
        const position = document.positionAt(offset);
        if (javascriptMode) {
            const workspaceEdit = yield javascriptMode.doRename(document, position, newName);
            if (!workspaceEdit || !workspaceEdit.changes) {
                assert.fail('No workspace edits');
            }
            const edits = workspaceEdit.changes[document.uri.toString()];
            if (!edits) {
                assert.fail(`No edits for file at ${document.uri.toString()}`);
            }
            const newDocContent = languageModes_1.TextDocument.applyEdits(document, edits);
            assert.equal(newDocContent, expectedDocContent, `Expected: ${expectedDocContent}\nActual: ${newDocContent}`);
        }
        else {
            assert.fail('should have javascriptMode but no');
        }
    });
}
function testNoRename(value, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        const offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        const document = languageModes_1.TextDocument.create('test://test/test.html', 'html', 0, value);
        const workspace = {
            settings: {},
            folders: [{ name: 'foo', uri: 'test://foo' }]
        };
        const languageModes = languageModes_1.getLanguageModes({ css: true, javascript: true }, workspace, languageModes_1.ClientCapabilities.LATEST, nodeFs_1.getNodeFSRequestService());
        const javascriptMode = languageModes.getMode('javascript');
        const position = document.positionAt(offset);
        if (javascriptMode) {
            const workspaceEdit = yield javascriptMode.doRename(document, position, newName);
            assert.ok((workspaceEdit === null || workspaceEdit === void 0 ? void 0 : workspaceEdit.changes) === undefined, 'Should not rename but rename happened');
        }
        else {
            assert.fail('should have javascriptMode but no');
        }
    });
}
suite('HTML Javascript Rename', () => {
    test('Rename Variable', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            'const |a = 2;',
            'const b = a + 2',
            '</script>',
            '</head>',
            '</html>'
        ];
        const output = [
            '<html>',
            '<head>',
            '<script>',
            'const h = 2;',
            'const b = h + 2',
            '</script>',
            '</head>',
            '</html>'
        ];
        yield testRename(input.join('\n'), 'h', output.join('\n'));
    }));
    test('Rename Function', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            `const name = 'cjg';`,
            'function |sayHello(name) {',
            `console.log('hello', name)`,
            '}',
            'sayHello(name)',
            '</script>',
            '</head>',
            '</html>'
        ];
        const output = [
            '<html>',
            '<head>',
            '<script>',
            `const name = 'cjg';`,
            'function sayName(name) {',
            `console.log('hello', name)`,
            '}',
            'sayName(name)',
            '</script>',
            '</head>',
            '</html>'
        ];
        yield testRename(input.join('\n'), 'sayName', output.join('\n'));
    }));
    test('Rename Function Params', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            `const name = 'cjg';`,
            'function sayHello(|name) {',
            `console.log('hello', name)`,
            '}',
            'sayHello(name)',
            '</script>',
            '</head>',
            '</html>'
        ];
        const output = [
            '<html>',
            '<head>',
            '<script>',
            `const name = 'cjg';`,
            'function sayHello(newName) {',
            `console.log('hello', newName)`,
            '}',
            'sayHello(name)',
            '</script>',
            '</head>',
            '</html>'
        ];
        yield testRename(input.join('\n'), 'newName', output.join('\n'));
    }));
    test('Rename Class', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [
            '<html>',
            '<head>',
            '<script>',
            `class |Foo {}`,
            `const foo = new Foo()`,
            '</script>',
            '</head>',
            '</html>'
        ];
        const output = [
            '<html>',
            '<head>',
            '<script>',
            `class Bar {}`,
            `const foo = new Bar()`,
            '</script>',
            '</head>',
            '</html>'
        ];
        yield testRename(input.join('\n'), 'Bar', output.join('\n'));
    }));
    test('Cannot Rename literal', () => __awaiter(void 0, void 0, void 0, function* () {
        const stringLiteralInput = [
            '<html>',
            '<head>',
            '<script>',
            `const name = |'cjg';`,
            '</script>',
            '</head>',
            '</html>'
        ];
        const numberLiteralInput = [
            '<html>',
            '<head>',
            '<script>',
            `const num = |2;`,
            '</script>',
            '</head>',
            '</html>'
        ];
        yield testNoRename(stringLiteralInput.join('\n'), 'something');
        yield testNoRename(numberLiteralInput.join('\n'), 'hhhh');
    }));
});
