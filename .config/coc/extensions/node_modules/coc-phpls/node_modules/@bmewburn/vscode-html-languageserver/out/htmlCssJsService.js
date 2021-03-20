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
exports.HtmlCssJsService = exports.FileType = void 0;
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const languageModes_1 = require("./modes/languageModes");
const formatting_1 = require("./modes/formatting");
const arrays_1 = require("./utils/arrays");
const documentContext_1 = require("./utils/documentContext");
const vscode_uri_1 = require("vscode-uri");
const runner_1 = require("./utils/runner");
const htmlFolding_1 = require("./modes/htmlFolding");
const selectionRanges_1 = require("./modes/selectionRanges");
var requests_1 = require("./requests");
Object.defineProperty(exports, "FileType", { enumerable: true, get: function () { return requests_1.FileType; } });
var UpdateableDocument;
(function (UpdateableDocument) {
    function isUpdateableDocument(value) {
        return typeof value.update === 'function';
    }
    UpdateableDocument.isUpdateableDocument = isUpdateableDocument;
})(UpdateableDocument || (UpdateableDocument = {}));
class TextDocuments {
    constructor() {
        this._documents = Object.create(null);
        this._onDidChangeContent = new node_1.Emitter();
        this._onDidOpen = new node_1.Emitter();
        this._onDidClose = new node_1.Emitter();
        this._onDidSave = new node_1.Emitter();
    }
    get syncKind() {
        return node_1.TextDocumentSyncKind.Full;
    }
    get onDidChangeContent() {
        return this._onDidChangeContent.event;
    }
    get onDidOpen() {
        return this._onDidOpen.event;
    }
    get onDidSave() {
        return this._onDidSave.event;
    }
    get onDidClose() {
        return this._onDidClose.event;
    }
    get(uri) {
        return this._documents[uri];
    }
    all() {
        return Object.keys(this._documents).map(key => this._documents[key]);
    }
    keys() {
        return Object.keys(this._documents);
    }
    open(textDocumentItem) {
        let document = languageModes_1.TextDocument.create(textDocumentItem.uri, textDocumentItem.languageId, textDocumentItem.version, textDocumentItem.text);
        this._documents[textDocumentItem.uri] = document;
        let toFire = Object.freeze({ document });
        this._onDidOpen.fire(toFire);
        this._onDidChangeContent.fire(toFire);
    }
    close(textDocumentIdentifier) {
        let document = this._documents[textDocumentIdentifier.uri];
        if (document) {
            delete this._documents[textDocumentIdentifier.uri];
            this._onDidClose.fire(Object.freeze({ document }));
        }
    }
    change(textDocumentIdentifier, changes) {
        let last = changes.length > 0 ? changes[changes.length - 1] : undefined;
        if (last) {
            let document = this._documents[textDocumentIdentifier.uri];
            if (document && UpdateableDocument.isUpdateableDocument(document)) {
                if (textDocumentIdentifier.version === null || textDocumentIdentifier.version === void 0) {
                    throw new Error(`Received document change event for ${textDocumentIdentifier.uri} without valid version identifier`);
                }
                document.update(last, textDocumentIdentifier.version);
                this._onDidChangeContent.fire(Object.freeze({ document }));
            }
        }
    }
}
var HtmlCssJsService;
(function (HtmlCssJsService) {
    let workspaceFolders = [];
    let languageModes;
    const documents = new TextDocuments();
    let clientSnippetSupport = false;
    let scopedSettingsSupport = false;
    let foldingRangeLimit = Number.MAX_VALUE;
    let globalSettings = {};
    let documentSettings = {};
    documents.onDidClose(e => {
        delete documentSettings[e.document.uri];
    });
    const notReady = () => Promise.reject('Not Ready');
    let dummyRequestService = { getContent: notReady, stat: notReady, readDirectory: notReady };
    function initialise(params, requestService = dummyRequestService) {
        workspaceFolders = params.workspaceFolders;
        if (!Array.isArray(workspaceFolders)) {
            workspaceFolders = [];
            if (params.rootPath) {
                workspaceFolders.push({ name: '', uri: vscode_uri_1.URI.file(params.rootPath).toString() });
            }
        }
        const workspace = {
            get settings() { return globalSettings; },
            get folders() { return workspaceFolders; }
        };
        languageModes = languageModes_1.getLanguageModes({ css: true, javascript: true }, workspace, params.capabilities, requestService);
        documents.onDidClose(e => {
            languageModes.onDocumentRemoved(e.document);
        });
        function getClientCapability(name, def) {
            const keys = name.split('.');
            let c = params.capabilities;
            for (let i = 0; c && i < keys.length; i++) {
                if (!c.hasOwnProperty(keys[i])) {
                    return def;
                }
                c = c[keys[i]];
            }
            return c;
        }
        clientSnippetSupport = getClientCapability('textDocument.completion.completionItem.snippetSupport', false);
        scopedSettingsSupport = getClientCapability('workspace.configuration', false);
        foldingRangeLimit = getClientCapability('textDocument.foldingRange.rangeLimit', Number.MAX_VALUE);
        const capabilities = {
            textDocumentSync: documents.syncKind,
            completionProvider: clientSnippetSupport ? { resolveProvider: true, triggerCharacters: ['.', ':', '<', '"', '=', '/'] } : undefined,
            hoverProvider: true,
            documentHighlightProvider: true,
            documentRangeFormattingProvider: false,
            documentLinkProvider: { resolveProvider: false },
            documentSymbolProvider: true,
            definitionProvider: true,
            signatureHelpProvider: { triggerCharacters: ['('] },
            referencesProvider: true,
            colorProvider: {},
            foldingRangeProvider: true,
            selectionRangeProvider: true
        };
        return { capabilities };
    }
    HtmlCssJsService.initialise = initialise;
    function setWorkspaceFolders(folders) {
        workspaceFolders = folders.map(f => {
            return { name: '', uri: f };
        });
    }
    HtmlCssJsService.setWorkspaceFolders = setWorkspaceFolders;
    function shutdown() {
        languageModes.dispose();
    }
    HtmlCssJsService.shutdown = shutdown;
    function openDocument(textDocumentItem) {
        documents.open(textDocumentItem);
    }
    HtmlCssJsService.openDocument = openDocument;
    function closeDocument(textDocumentIdentifier) {
        documents.close(textDocumentIdentifier);
    }
    HtmlCssJsService.closeDocument = closeDocument;
    function changeDocument(textDocumentIdentifier, changes) {
        documents.change(textDocumentIdentifier, changes);
    }
    HtmlCssJsService.changeDocument = changeDocument;
    function setConfig(config) {
        globalSettings = config;
        documentSettings = {};
    }
    HtmlCssJsService.setConfig = setConfig;
    function diagnose(textDocumentIdentifier) {
        let doc = documents.get(textDocumentIdentifier.uri);
        if (!doc) {
            return Promise.resolve({ uri: textDocumentIdentifier.uri, diagnostics: [] });
        }
        return validateTextDocument(doc);
    }
    HtmlCssJsService.diagnose = diagnose;
    function provideCompletions(textDocumentIdentifier, position, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (!document) {
                return null;
            }
            const mode = languageModes.getModeAtPosition(document, position);
            if (!mode || !mode.doComplete) {
                return { isIncomplete: true, items: [] };
            }
            const doComplete = mode.doComplete;
            const settings = yield getDocumentSettings(document, () => doComplete.length > 2);
            const documentContext = documentContext_1.getDocumentContext(document.uri, workspaceFolders);
            const result = doComplete(document, position, documentContext, settings);
            return result;
        }), null, `Error while computing completions for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideCompletions = provideCompletions;
    function completionItemResolve(item, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const data = item.data;
            if (data && data.languageId && data.uri) {
                const mode = languageModes.getMode(data.languageId);
                const document = documents.get(data.uri);
                if (mode && mode.doResolve && document) {
                    return mode.doResolve(document, item);
                }
            }
            return item;
        }), item, `Error while resolving completion proposal`, token);
    }
    HtmlCssJsService.completionItemResolve = completionItemResolve;
    function provideHover(textDocumentIdentifier, position, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                const mode = languageModes.getModeAtPosition(document, position);
                if (mode && mode.doHover) {
                    return mode.doHover(document, position);
                }
            }
            return null;
        }), null, `Error while computing hover for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideHover = provideHover;
    function provideDocumentHighlight(textDocumentIdentifier, position, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                const mode = languageModes.getModeAtPosition(document, position);
                if (mode && mode.findDocumentHighlight) {
                    return mode.findDocumentHighlight(document, position);
                }
            }
            return [];
        }), [], `Error while computing document highlights for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideDocumentHighlight = provideDocumentHighlight;
    function onDefinition(textDocumentIdentifier, position, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                const mode = languageModes.getModeAtPosition(document, position);
                if (mode && mode.findDefinition) {
                    return mode.findDefinition(document, position);
                }
            }
            return [];
        }), null, `Error while computing definitions for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.onDefinition = onDefinition;
    function provideReferences(textDocumentIdentifier, position, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                const mode = languageModes.getModeAtPosition(document, position);
                if (mode && mode.findReferences) {
                    return mode.findReferences(document, position);
                }
            }
            return [];
        }), [], `Error while computing references for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideReferences = provideReferences;
    function provideSignatureHelp(textDocumentIdentifier, position, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                const mode = languageModes.getModeAtPosition(document, position);
                if (mode && mode.doSignatureHelp) {
                    return mode.doSignatureHelp(document, position);
                }
            }
            return null;
        }), null, `Error while computing signature help for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideSignatureHelp = provideSignatureHelp;
    function provideDocumentRangeFormattingEdits(textDocumentIdentifier, range, options, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                let settings = yield getDocumentSettings(document, () => true);
                if (!settings) {
                    settings = globalSettings;
                }
                const unformattedTags = settings && settings.html && settings.html.format && settings.html.format.unformatted || '';
                const enabledModes = { css: !unformattedTags.match(/\bstyle\b/), javascript: !unformattedTags.match(/\bscript\b/) };
                return formatting_1.format(languageModes, document, range, options, settings, enabledModes);
            }
            return [];
        }), [], `Error while formatting range for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideDocumentRangeFormattingEdits = provideDocumentRangeFormattingEdits;
    function provideDocumentLinks(textDocumentIdentifier, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            const links = [];
            if (document) {
                const documentContext = documentContext_1.getDocumentContext(document.uri, workspaceFolders);
                for (let m of languageModes.getAllModesInDocument(document)) {
                    if (m.findDocumentLinks) {
                        arrays_1.pushAll(links, yield m.findDocumentLinks(document, documentContext));
                    }
                }
                ;
            }
            return links;
        }), [], `Error while document links for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideDocumentLinks = provideDocumentLinks;
    function provideDocumentSymbols(textDocumentIdentifier, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            const symbols = [];
            if (document) {
                for (let m of languageModes.getAllModesInDocument(document)) {
                    if (m.findDocumentSymbols) {
                        arrays_1.pushAll(symbols, yield m.findDocumentSymbols(document));
                    }
                }
            }
            return symbols;
        }), [], `Error while computing document symbols for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideDocumentSymbols = provideDocumentSymbols;
    function provideFoldingRanges(textDocumentIdentifier, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                return htmlFolding_1.getFoldingRanges(languageModes, document, foldingRangeLimit, token);
            }
            return null;
        }), null, `Error while computing folding regions for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideFoldingRanges = provideFoldingRanges;
    function provideSelectionRanges(textDocumentIdentifier, positions, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                return selectionRanges_1.getSelectionRanges(languageModes, document, positions);
            }
            return [];
        }), [], `Error while computing selection ranges for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideSelectionRanges = provideSelectionRanges;
    function provideRename(textDocument, position, newName, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocument.uri);
            if (document) {
                const mode = languageModes.getModeAtPosition(document, position);
                if (mode && mode.doRename) {
                    return mode.doRename(document, position, newName);
                }
            }
            return null;
        }), null, `Error while computing rename for ${textDocument.uri}`, token);
    }
    HtmlCssJsService.provideRename = provideRename;
    function provideDocumentColours(textDocumentIdentifier, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const infos = [];
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                for (let m of languageModes.getAllModesInDocument(document)) {
                    if (m.findDocumentColors) {
                        arrays_1.pushAll(infos, yield m.findDocumentColors(document));
                    }
                }
                ;
            }
            return infos;
        }), [], `Error while computing document colors for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideDocumentColours = provideDocumentColours;
    function provideColorPresentations(textDocumentIdentifier, range, color, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                const mode = languageModes.getModeAtPosition(document, range.start);
                if (mode && mode.getColorPresentations) {
                    return mode.getColorPresentations(document, color, range);
                }
            }
            return [];
        }), [], `Error while computing color presentations for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideColorPresentations = provideColorPresentations;
    function provideTagClose(textDocumentIdentifier, position, token) {
        return runner_1.runSafe(() => __awaiter(this, void 0, void 0, function* () {
            const document = documents.get(textDocumentIdentifier.uri);
            if (document) {
                const pos = position;
                if (pos.character > 0) {
                    const mode = languageModes.getModeAtPosition(document, vscode_languageserver_types_1.Position.create(pos.line, pos.character - 1));
                    if (mode && mode.doAutoClose) {
                        return mode.doAutoClose(document, pos);
                    }
                }
            }
            return null;
        }), null, `Error while computing tag close actions for ${textDocumentIdentifier.uri}`, token);
    }
    HtmlCssJsService.provideTagClose = provideTagClose;
    function getDocumentSettings(textDocument, needsDocumentSettings) {
        if (scopedSettingsSupport && needsDocumentSettings()) {
            let promise = documentSettings[textDocument.uri];
            if (!promise && HtmlCssJsService.requestConfigurationDelegate) {
                const scopeUri = textDocument.uri;
                const configRequestParam = { items: [{ scopeUri, section: 'css' }, { scopeUri, section: 'html' }, { scopeUri, section: 'javascript' }] };
                promise = HtmlCssJsService.requestConfigurationDelegate(configRequestParam).then(s => ({ css: s[0], html: s[1], javascript: s[2] }));
                documentSettings[textDocument.uri] = promise;
            }
            return promise;
        }
        return Promise.resolve(undefined);
    }
    function isValidationEnabled(languageId, settings = globalSettings) {
        const validationSettings = settings && settings.html && settings.html.validate;
        if (validationSettings) {
            return languageId === 'css' && validationSettings.styles !== false || languageId === 'javascript' && validationSettings.scripts !== false;
        }
        return true;
    }
    function validateTextDocument(textDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const version = textDocument.version;
                const diagnostics = [];
                if (textDocument.languageId === 'html') {
                    const modes = languageModes.getAllModesInDocument(textDocument);
                    const settings = yield getDocumentSettings(textDocument, () => modes.some(m => !!m.doValidation));
                    const latestTextDocument = documents.get(textDocument.uri);
                    if (latestTextDocument && latestTextDocument.version === version) {
                        for (let mode of modes) {
                            if (mode.doValidation && isValidationEnabled(mode.getId(), settings)) {
                                arrays_1.pushAll(diagnostics, yield mode.doValidation(latestTextDocument, settings));
                            }
                        }
                        return { uri: latestTextDocument.uri, diagnostics };
                    }
                }
                return { uri: textDocument.uri, diagnostics: [] };
            }
            catch (e) {
                return { uri: textDocument.uri, diagnostics: [] };
            }
        });
    }
})(HtmlCssJsService = exports.HtmlCssJsService || (exports.HtmlCssJsService = {}));
