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
exports.fetchHTMLDataProviders = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
function fetchHTMLDataProviders(dataPaths, requestService) {
    const providers = dataPaths.map((p) => __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield requestService.getContent(p);
            return parseHTMLData(p, content);
        }
        catch (e) {
            return vscode_html_languageservice_1.newHTMLDataProvider(p, { version: 1 });
        }
    }));
    return Promise.all(providers);
}
exports.fetchHTMLDataProviders = fetchHTMLDataProviders;
function parseHTMLData(id, source) {
    let rawData;
    try {
        rawData = JSON.parse(source);
    }
    catch (err) {
        return vscode_html_languageservice_1.newHTMLDataProvider(id, { version: 1 });
    }
    return vscode_html_languageservice_1.newHTMLDataProvider(id, {
        version: rawData.version || 1,
        tags: rawData.tags || [],
        globalAttributes: rawData.globalAttributes || [],
        valueSets: rawData.valueSets || []
    });
}
