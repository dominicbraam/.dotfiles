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
exports.testCompletionFor = exports.assertCompletion = void 0;
require("mocha");
const assert = require("assert");
const path = require("path");
const vscode_uri_1 = require("vscode-uri");
const languageModes_1 = require("../modes/languageModes");
const nodeFs_1 = require("../node/nodeFs");
const documentContext_1 = require("../utils/documentContext");
function assertCompletion(completions, expected, document) {
    let matches = completions.items.filter(completion => {
        return completion.label === expected.label;
    });
    if (expected.notAvailable) {
        assert.equal(matches.length, 0, `${expected.label} should not existing is results`);
        return;
    }
    assert.equal(matches.length, 1, `${expected.label} should only existing once: Actual: ${completions.items.map(c => c.label).join(', ')}`);
    let match = matches[0];
    if (expected.documentation) {
        assert.equal(match.documentation, expected.documentation);
    }
    if (expected.kind) {
        assert.equal(match.kind, expected.kind);
    }
    if (expected.resultText && match.textEdit) {
        const edit = languageModes_1.TextEdit.is(match.textEdit) ? match.textEdit : languageModes_1.TextEdit.replace(match.textEdit.replace, match.textEdit.newText);
        assert.equal(languageModes_1.TextDocument.applyEdits(document, [edit]), expected.resultText);
    }
    if (expected.command) {
        assert.deepEqual(match.command, expected.command);
    }
}
exports.assertCompletion = assertCompletion;
const testUri = 'test://test/test.html';
function testCompletionFor(value, expected, uri = testUri, workspaceFolders) {
    return __awaiter(this, void 0, void 0, function* () {
        let offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        let workspace = {
            settings: {},
            folders: workspaceFolders || [{ name: 'x', uri: uri.substr(0, uri.lastIndexOf('/')) }]
        };
        let document = languageModes_1.TextDocument.create(uri, 'html', 0, value);
        let position = document.positionAt(offset);
        const context = documentContext_1.getDocumentContext(uri, workspace.folders);
        const languageModes = languageModes_1.getLanguageModes({ css: true, javascript: true }, workspace, languageModes_1.ClientCapabilities.LATEST, nodeFs_1.getNodeFSRequestService());
        const mode = languageModes.getModeAtPosition(document, position);
        let list = yield mode.doComplete(document, position, context);
        if (expected.count) {
            assert.equal(list.items.length, expected.count);
        }
        if (expected.items) {
            for (let item of expected.items) {
                assertCompletion(list, item, document);
            }
        }
    });
}
exports.testCompletionFor = testCompletionFor;
suite('HTML Completion', () => {
    test('HTML JavaScript Completions', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<html><script>window.|</script></html>', {
            items: [
                { label: 'location', resultText: '<html><script>window.location</script></html>' },
            ]
        });
        yield testCompletionFor('<html><script>$.|</script></html>', {
            items: [
                { label: 'getJSON', resultText: '<html><script>$.getJSON</script></html>' },
            ]
        });
        yield testCompletionFor('<html><script>const x = { a: 1 };</script><script>x.|</script></html>', {
            items: [
                { label: 'a', resultText: '<html><script>const x = { a: 1 };</script><script>x.a</script></html>' },
            ]
        }, 'test://test/test2.html');
    }));
});
suite('HTML Path Completion', () => {
    const triggerSuggestCommand = {
        title: 'Suggest',
        command: 'editor.action.triggerSuggest'
    };
    const fixtureRoot = path.resolve(__dirname, '../../src/test/pathCompletionFixtures');
    const fixtureWorkspace = { name: 'fixture', uri: vscode_uri_1.URI.file(fixtureRoot).toString() };
    const indexHtmlUri = vscode_uri_1.URI.file(path.resolve(fixtureRoot, 'index.html')).toString();
    const aboutHtmlUri = vscode_uri_1.URI.file(path.resolve(fixtureRoot, 'about/about.html')).toString();
    test('Basics - Correct label/kind/result/command', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="./|">', {
            items: [
                { label: 'about/', kind: languageModes_1.CompletionItemKind.Folder, resultText: '<script src="./about/">', command: triggerSuggestCommand },
                { label: 'index.html', kind: languageModes_1.CompletionItemKind.File, resultText: '<script src="./index.html">' },
                { label: 'src/', kind: languageModes_1.CompletionItemKind.Folder, resultText: '<script src="./src/">', command: triggerSuggestCommand }
            ]
        }, indexHtmlUri);
    }));
    test('Basics - Single Quote', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor(`<script src='./|'>`, {
            items: [
                { label: 'about/', kind: languageModes_1.CompletionItemKind.Folder, resultText: `<script src='./about/'>`, command: triggerSuggestCommand },
                { label: 'index.html', kind: languageModes_1.CompletionItemKind.File, resultText: `<script src='./index.html'>` },
                { label: 'src/', kind: languageModes_1.CompletionItemKind.Folder, resultText: `<script src='./src/'>`, command: triggerSuggestCommand }
            ]
        }, indexHtmlUri);
    }));
    test('No completion for remote paths', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="http:">', { items: [] });
        yield testCompletionFor('<script src="http:/|">', { items: [] });
        yield testCompletionFor('<script src="http://|">', { items: [] });
        yield testCompletionFor('<script src="https:|">', { items: [] });
        yield testCompletionFor('<script src="https:/|">', { items: [] });
        yield testCompletionFor('<script src="https://|">', { items: [] });
        yield testCompletionFor('<script src="//|">', { items: [] });
    }));
    test('Relative Path', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="../|">', {
            items: [
                { label: 'about/', resultText: '<script src="../about/">' },
                { label: 'index.html', resultText: '<script src="../index.html">' },
                { label: 'src/', resultText: '<script src="../src/">' }
            ]
        }, aboutHtmlUri);
        yield testCompletionFor('<script src="../src/|">', {
            items: [
                { label: 'feature.js', resultText: '<script src="../src/feature.js">' },
                { label: 'test.js', resultText: '<script src="../src/test.js">' },
            ]
        }, aboutHtmlUri);
    }));
    test('Absolute Path', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="/|">', {
            items: [
                { label: 'about/', resultText: '<script src="/about/">' },
                { label: 'index.html', resultText: '<script src="/index.html">' },
                { label: 'src/', resultText: '<script src="/src/">' },
            ]
        }, indexHtmlUri);
        yield testCompletionFor('<script src="/src/|">', {
            items: [
                { label: 'feature.js', resultText: '<script src="/src/feature.js">' },
                { label: 'test.js', resultText: '<script src="/src/test.js">' },
            ]
        }, aboutHtmlUri, [fixtureWorkspace]);
    }));
    test('Empty Path Value', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="|">', {
            items: [
                { label: 'about/', resultText: '<script src="about/">' },
                { label: 'index.html', resultText: '<script src="index.html">' },
                { label: 'src/', resultText: '<script src="src/">' },
            ]
        }, indexHtmlUri);
        yield testCompletionFor('<script src="|">', {
            items: [
                { label: 'about.css', resultText: '<script src="about.css">' },
                { label: 'about.html', resultText: '<script src="about.html">' },
                { label: 'media/', resultText: '<script src="media/">' },
            ]
        }, aboutHtmlUri);
    }));
    test('Incomplete Path', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="/src/f|">', {
            items: [
                { label: 'feature.js', resultText: '<script src="/src/feature.js">' },
                { label: 'test.js', resultText: '<script src="/src/test.js">' },
            ]
        }, aboutHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="../src/f|">', {
            items: [
                { label: 'feature.js', resultText: '<script src="../src/feature.js">' },
                { label: 'test.js', resultText: '<script src="../src/test.js">' },
            ]
        }, aboutHtmlUri, [fixtureWorkspace]);
    }));
    test('No leading dot or slash', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="s|">', {
            items: [
                { label: 'about/', resultText: '<script src="about/">' },
                { label: 'index.html', resultText: '<script src="index.html">' },
                { label: 'src/', resultText: '<script src="src/">' },
            ]
        }, indexHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="src/|">', {
            items: [
                { label: 'feature.js', resultText: '<script src="src/feature.js">' },
                { label: 'test.js', resultText: '<script src="src/test.js">' },
            ]
        }, indexHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="src/f|">', {
            items: [
                { label: 'feature.js', resultText: '<script src="src/feature.js">' },
                { label: 'test.js', resultText: '<script src="src/test.js">' },
            ]
        }, indexHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="s|">', {
            items: [
                { label: 'about.css', resultText: '<script src="about.css">' },
                { label: 'about.html', resultText: '<script src="about.html">' },
                { label: 'media/', resultText: '<script src="media/">' },
            ]
        }, aboutHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="media/|">', {
            items: [
                { label: 'icon.pic', resultText: '<script src="media/icon.pic">' }
            ]
        }, aboutHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="media/f|">', {
            items: [
                { label: 'icon.pic', resultText: '<script src="media/icon.pic">' }
            ]
        }, aboutHtmlUri, [fixtureWorkspace]);
    }));
    test('Trigger completion in middle of path', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="src/f|eature.js">', {
            items: [
                { label: 'feature.js', resultText: '<script src="src/feature.js">' },
                { label: 'test.js', resultText: '<script src="src/test.js">' },
            ]
        }, indexHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="s|rc/feature.js">', {
            items: [
                { label: 'about/', resultText: '<script src="about/">' },
                { label: 'index.html', resultText: '<script src="index.html">' },
                { label: 'src/', resultText: '<script src="src/">' },
            ]
        }, indexHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="media/f|eature.js">', {
            items: [
                { label: 'icon.pic', resultText: '<script src="media/icon.pic">' }
            ]
        }, aboutHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="m|edia/feature.js">', {
            items: [
                { label: 'about.css', resultText: '<script src="about.css">' },
                { label: 'about.html', resultText: '<script src="about.html">' },
                { label: 'media/', resultText: '<script src="media/">' },
            ]
        }, aboutHtmlUri, [fixtureWorkspace]);
    }));
    test('Trigger completion in middle of path and with whitespaces', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="./| about/about.html>', {
            items: [
                { label: 'about/', resultText: '<script src="./about/ about/about.html>' },
                { label: 'index.html', resultText: '<script src="./index.html about/about.html>' },
                { label: 'src/', resultText: '<script src="./src/ about/about.html>' },
            ]
        }, indexHtmlUri, [fixtureWorkspace]);
        yield testCompletionFor('<script src="./a|bout /about.html>', {
            items: [
                { label: 'about/', resultText: '<script src="./about/ /about.html>' },
                { label: 'index.html', resultText: '<script src="./index.html /about.html>' },
                { label: 'src/', resultText: '<script src="./src/ /about.html>' },
            ]
        }, indexHtmlUri, [fixtureWorkspace]);
    }));
    test('Completion should ignore files/folders starting with dot', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletionFor('<script src="./|"', {
            count: 3
        }, indexHtmlUri, [fixtureWorkspace]);
    }));
    test('Unquoted Path', () => __awaiter(void 0, void 0, void 0, function* () {
    }));
});
