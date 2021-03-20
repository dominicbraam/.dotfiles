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
const path = require("path");
const fs = require("fs");
const assert = require("assert");
const languageModes_1 = require("../modes/languageModes");
const formatting_1 = require("../modes/formatting");
const nodeFs_1 = require("../node/nodeFs");
suite('HTML Embedded Formatting', () => {
    function assertFormat(value, expected, options, formatOptions, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let workspace = {
                settings: options,
                folders: [{ name: 'foo', uri: 'test://foo' }]
            };
            const languageModes = languageModes_1.getLanguageModes({ css: true, javascript: true }, workspace, languageModes_1.ClientCapabilities.LATEST, nodeFs_1.getNodeFSRequestService());
            let rangeStartOffset = value.indexOf('|');
            let rangeEndOffset;
            if (rangeStartOffset !== -1) {
                value = value.substr(0, rangeStartOffset) + value.substr(rangeStartOffset + 1);
                rangeEndOffset = value.indexOf('|');
                value = value.substr(0, rangeEndOffset) + value.substr(rangeEndOffset + 1);
            }
            else {
                rangeStartOffset = 0;
                rangeEndOffset = value.length;
            }
            let document = languageModes_1.TextDocument.create('test://test/test.html', 'html', 0, value);
            let range = languageModes_1.Range.create(document.positionAt(rangeStartOffset), document.positionAt(rangeEndOffset));
            if (!formatOptions) {
                formatOptions = languageModes_1.FormattingOptions.create(2, true);
            }
            let result = yield formatting_1.format(languageModes, document, range, formatOptions, undefined, { css: true, javascript: true });
            let actual = languageModes_1.TextDocument.applyEdits(document, result);
            assert.equal(actual, expected, message);
        });
    }
    function assertFormatWithFixture(fixtureName, expectedPath, options, formatOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let input = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'test', 'fixtures', 'inputs', fixtureName)).toString().replace(/\r\n/mg, '\n');
            let expected = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'test', 'fixtures', 'expected', expectedPath)).toString().replace(/\r\n/mg, '\n');
            yield assertFormat(input, expected, options, formatOptions, expectedPath);
        });
    }
    test('HTML only', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertFormat('<html><body><p>Hello</p></body></html>', '<html>\n\n<body>\n  <p>Hello</p>\n</body>\n\n</html>');
        yield assertFormat('|<html><body><p>Hello</p></body></html>|', '<html>\n\n<body>\n  <p>Hello</p>\n</body>\n\n</html>');
        yield assertFormat('<html>|<body><p>Hello</p></body>|</html>', '<html><body>\n  <p>Hello</p>\n</body></html>');
    }));
    test('HTML & Scripts', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertFormat('<html><head><script></script></head></html>', '<html>\n\n<head>\n  <script></script>\n</head>\n\n</html>');
        yield assertFormat('<html><head><script>var x=1;</script></head></html>', '<html>\n\n<head>\n  <script>var x = 1;</script>\n</head>\n\n</html>');
        yield assertFormat('<html><head><script>\nvar x=2;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 2;\n  </script>\n</head>\n\n</html>');
        yield assertFormat('<html><head>\n  <script>\nvar x=3;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 3;\n  </script>\n</head>\n\n</html>');
        yield assertFormat('<html><head>\n  <script>\nvar x=4;\nconsole.log("Hi");\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 4;\n    console.log("Hi");\n  </script>\n</head>\n\n</html>');
        yield assertFormat('<html><head>\n  |<script>\nvar x=5;\n</script>|</head></html>', '<html><head>\n  <script>\n    var x = 5;\n  </script></head></html>');
    }));
    test('HTLM & Scripts - Fixtures', () => __awaiter(void 0, void 0, void 0, function* () {
        assertFormatWithFixture('19813.html', '19813.html');
        assertFormatWithFixture('19813.html', '19813-4spaces.html', undefined, languageModes_1.FormattingOptions.create(4, true));
        assertFormatWithFixture('19813.html', '19813-tab.html', undefined, languageModes_1.FormattingOptions.create(1, false));
        assertFormatWithFixture('21634.html', '21634.html');
    }));
    test('Script end tag', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertFormat('<html>\n<head>\n  <script>\nvar x  =  0;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 0;\n  </script>\n</head>\n\n</html>');
    }));
    test('HTML & Multiple Scripts', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertFormat('<html><head>\n<script>\nif(x){\nbar(); }\n</script><script>\nfunction(x){    }\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    if (x) {\n      bar();\n    }\n  </script>\n  <script>\n    function(x) {}\n  </script>\n</head>\n\n</html>');
    }));
    test('HTML & Styles', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertFormat('<html><head>\n<style>\n.foo{display:none;}\n</style></head></html>', '<html>\n\n<head>\n  <style>\n    .foo {\n      display: none;\n    }\n  </style>\n</head>\n\n</html>');
    }));
    test('EndWithNewline', () => __awaiter(void 0, void 0, void 0, function* () {
        let options = {
            html: {
                format: {
                    endWithNewline: true
                }
            }
        };
        yield assertFormat('<html><body><p>Hello</p></body></html>', '<html>\n\n<body>\n  <p>Hello</p>\n</body>\n\n</html>\n', options);
        yield assertFormat('<html>|<body><p>Hello</p></body>|</html>', '<html><body>\n  <p>Hello</p>\n</body></html>', options);
        yield assertFormat('<html><head><script>\nvar x=1;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 1;\n  </script>\n</head>\n\n</html>\n', options);
    }));
    test('Inside script', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertFormat('<html><head>\n  <script>\n|var x=6;|\n</script></head></html>', '<html><head>\n  <script>\n  var x = 6;\n</script></head></html>');
        yield assertFormat('<html><head>\n  <script>\n|var x=6;\nvar y=  9;|\n</script></head></html>', '<html><head>\n  <script>\n  var x = 6;\n  var y = 9;\n</script></head></html>');
    }));
    test('Range after new line', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertFormat('<html><head>\n  |<script>\nvar x=6;\n</script>\n|</head></html>', '<html><head>\n  <script>\n    var x = 6;\n  </script>\n</head></html>');
    }));
    test('bug 36574', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertFormat('<script src="/js/main.js"> </script>', '<script src="/js/main.js"> </script>');
    }));
    test('bug 48049', () => __awaiter(void 0, void 0, void 0, function* () {
        yield assertFormat([
            '<html>',
            '<head>',
            '</head>',
            '',
            '<body>',
            '',
            '    <script>',
            '        function f(x) {}',
            '        f(function () {',
            '        // ',
            '',
            '        console.log(" vsc crashes on formatting")',
            '        });',
            '    </script>',
            '',
            '',
            '',
            '        </body>',
            '',
            '</html>'
        ].join('\n'), [
            '<html>',
            '',
            '<head>',
            '</head>',
            '',
            '<body>',
            '',
            '  <script>',
            '    function f(x) {}',
            '    f(function () {',
            '      // ',
            '',
            '      console.log(" vsc crashes on formatting")',
            '    });',
            '  </script>',
            '',
            '',
            '',
            '</body>',
            '',
            '</html>'
        ].join('\n'));
    }));
    test('#58435', () => __awaiter(void 0, void 0, void 0, function* () {
        let options = {
            html: {
                format: {
                    contentUnformatted: 'textarea'
                }
            }
        };
        const content = [
            '<html>',
            '',
            '<body>',
            '  <textarea name= "" id ="" cols="30" rows="10">',
            '  </textarea>',
            '</body>',
            '',
            '</html>',
        ].join('\n');
        const expected = [
            '<html>',
            '',
            '<body>',
            '  <textarea name="" id="" cols="30" rows="10">',
            '  </textarea>',
            '</body>',
            '',
            '</html>',
        ].join('\n');
        yield assertFormat(content, expected, options);
    }));
});
