"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const documentContext_1 = require("../utils/documentContext");
suite('HTML Document Context', () => {
    test('Context', function () {
        const docURI = 'file:///users/test/folder/test.html';
        const rootFolders = [{ name: '', uri: 'file:///users/test/' }];
        let context = documentContext_1.getDocumentContext(docURI, rootFolders);
        assert.equal(context.resolveReference('/', docURI), 'file:///users/test/');
        assert.equal(context.resolveReference('/message.html', docURI), 'file:///users/test/message.html');
        assert.equal(context.resolveReference('message.html', docURI), 'file:///users/test/folder/message.html');
        assert.equal(context.resolveReference('message.html', 'file:///users/test/'), 'file:///users/test/message.html');
    });
});
