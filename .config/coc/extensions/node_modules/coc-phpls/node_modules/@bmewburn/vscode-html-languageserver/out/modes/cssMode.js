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
exports.getCSSMode = void 0;
const languageModelCache_1 = require("../languageModelCache");
const languageModes_1 = require("./languageModes");
const embeddedSupport_1 = require("./embeddedSupport");
function getCSSMode(cssLanguageService, documentRegions, workspace) {
    let embeddedCSSDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => documentRegions.get(document).getEmbeddedDocument('css'));
    let cssStylesheets = languageModelCache_1.getLanguageModelCache(10, 60, document => cssLanguageService.parseStylesheet(document));
    return {
        getId() {
            return 'css';
        },
        doValidation(document, settings = workspace.settings) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.doValidation(embedded, cssStylesheets.get(embedded), settings && settings.css);
            });
        },
        doComplete(document, position, documentContext, _settings = workspace.settings) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                const stylesheet = cssStylesheets.get(embedded);
                return cssLanguageService.doComplete2(embedded, position, stylesheet, documentContext) || languageModes_1.CompletionList.create();
            });
        },
        doHover(document, position, settings) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.doHover(embedded, position, cssStylesheets.get(embedded), (_a = settings === null || settings === void 0 ? void 0 : settings.html) === null || _a === void 0 ? void 0 : _a.hover);
            });
        },
        findDocumentHighlight(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.findDocumentHighlights(embedded, position, cssStylesheets.get(embedded));
            });
        },
        findDocumentSymbols(document) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.findDocumentSymbols(embedded, cssStylesheets.get(embedded)).filter(s => s.name !== embeddedSupport_1.CSS_STYLE_RULE);
            });
        },
        findDefinition(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.findDefinition(embedded, position, cssStylesheets.get(embedded));
            });
        },
        findReferences(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.findReferences(embedded, position, cssStylesheets.get(embedded));
            });
        },
        findDocumentColors(document) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.findDocumentColors(embedded, cssStylesheets.get(embedded));
            });
        },
        getColorPresentations(document, color, range) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.getColorPresentations(embedded, cssStylesheets.get(embedded), color, range);
            });
        },
        getFoldingRanges(document) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.getFoldingRanges(embedded, {});
            });
        },
        getSelectionRange(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let embedded = embeddedCSSDocuments.get(document);
                return cssLanguageService.getSelectionRanges(embedded, [position], cssStylesheets.get(embedded))[0];
            });
        },
        onDocumentRemoved(document) {
            embeddedCSSDocuments.onDocumentRemoved(document);
            cssStylesheets.onDocumentRemoved(document);
        },
        dispose() {
            embeddedCSSDocuments.dispose();
            cssStylesheets.dispose();
        }
    };
}
exports.getCSSMode = getCSSMode;
