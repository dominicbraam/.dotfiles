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
exports.getHTMLMode = void 0;
const languageModelCache_1 = require("../languageModelCache");
function getHTMLMode(htmlLanguageService, workspace) {
    let htmlDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => htmlLanguageService.parseHTMLDocument(document));
    return {
        getId() {
            return 'html';
        },
        getSelectionRange(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                return htmlLanguageService.getSelectionRanges(document, [position])[0];
            });
        },
        doComplete(document, position, documentContext, settings = workspace.settings) {
            let options = settings && settings.html && settings.html.suggest;
            let doAutoComplete = settings && settings.html && settings.html.autoClosingTags;
            if (doAutoComplete) {
                options.hideAutoCompleteProposals = true;
            }
            const htmlDocument = htmlDocuments.get(document);
            let completionList = htmlLanguageService.doComplete2(document, position, htmlDocument, documentContext, options);
            return completionList;
        },
        doHover(document, position, settings) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                return htmlLanguageService.doHover(document, position, htmlDocuments.get(document), (_a = settings === null || settings === void 0 ? void 0 : settings.html) === null || _a === void 0 ? void 0 : _a.hover);
            });
        },
        findDocumentHighlight(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                return htmlLanguageService.findDocumentHighlights(document, position, htmlDocuments.get(document));
            });
        },
        findDocumentLinks(document, documentContext) {
            return __awaiter(this, void 0, void 0, function* () {
                return htmlLanguageService.findDocumentLinks(document, documentContext);
            });
        },
        findDocumentSymbols(document) {
            return __awaiter(this, void 0, void 0, function* () {
                return htmlLanguageService.findDocumentSymbols(document, htmlDocuments.get(document));
            });
        },
        format(document, range, formatParams, settings = workspace.settings) {
            return __awaiter(this, void 0, void 0, function* () {
                let formatSettings = settings && settings.html && settings.html.format;
                if (formatSettings) {
                    formatSettings = merge(formatSettings, {});
                }
                else {
                    formatSettings = {};
                }
                if (formatSettings.contentUnformatted) {
                    formatSettings.contentUnformatted = formatSettings.contentUnformatted + ',script';
                }
                else {
                    formatSettings.contentUnformatted = 'script';
                }
                formatSettings = merge(formatParams, formatSettings);
                return htmlLanguageService.format(document, range, formatSettings);
            });
        },
        getFoldingRanges(document) {
            return __awaiter(this, void 0, void 0, function* () {
                return htmlLanguageService.getFoldingRanges(document);
            });
        },
        doAutoClose(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let offset = document.offsetAt(position);
                let text = document.getText();
                if (offset > 0 && text.charAt(offset - 1).match(/[>\/]/g)) {
                    return htmlLanguageService.doTagComplete(document, position, htmlDocuments.get(document));
                }
                return null;
            });
        },
        doRename(document, position, newName) {
            return __awaiter(this, void 0, void 0, function* () {
                const htmlDocument = htmlDocuments.get(document);
                return htmlLanguageService.doRename(document, position, newName, htmlDocument);
            });
        },
        onDocumentRemoved(document) {
            return __awaiter(this, void 0, void 0, function* () {
                htmlDocuments.onDocumentRemoved(document);
            });
        },
        findMatchingTagPosition(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                const htmlDocument = htmlDocuments.get(document);
                return htmlLanguageService.findMatchingTagPosition(document, position, htmlDocument);
            });
        },
        doLinkedEditing(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                const htmlDocument = htmlDocuments.get(document);
                return htmlLanguageService.findLinkedEditingRanges(document, position, htmlDocument);
            });
        },
        dispose() {
            htmlDocuments.dispose();
        }
    };
}
exports.getHTMLMode = getHTMLMode;
function merge(src, dst) {
    for (const key in src) {
        if (src.hasOwnProperty(key)) {
            dst[key] = src[key];
        }
    }
    return dst;
}
