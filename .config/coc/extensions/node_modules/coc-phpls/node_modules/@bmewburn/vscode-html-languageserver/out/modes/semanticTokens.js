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
exports.newSemanticTokenProvider = void 0;
const languageModes_1 = require("./languageModes");
const positions_1 = require("../utils/positions");
function newSemanticTokenProvider(languageModes) {
    const legend = { types: [], modifiers: [] };
    const legendMappings = {};
    for (let mode of languageModes.getAllModes()) {
        if (mode.getSemanticTokenLegend && mode.getSemanticTokens) {
            const modeLegend = mode.getSemanticTokenLegend();
            legendMappings[mode.getId()] = { types: createMapping(modeLegend.types, legend.types), modifiers: createMapping(modeLegend.modifiers, legend.modifiers) };
        }
    }
    return {
        legend,
        getSemanticTokens(document, ranges) {
            return __awaiter(this, void 0, void 0, function* () {
                const allTokens = [];
                for (let mode of languageModes.getAllModesInDocument(document)) {
                    if (mode.getSemanticTokens) {
                        const mapping = legendMappings[mode.getId()];
                        const tokens = yield mode.getSemanticTokens(document);
                        applyTypesMapping(tokens, mapping.types);
                        applyModifiersMapping(tokens, mapping.modifiers);
                        for (let token of tokens) {
                            allTokens.push(token);
                        }
                    }
                }
                return encodeTokens(allTokens, ranges, document);
            });
        }
    };
}
exports.newSemanticTokenProvider = newSemanticTokenProvider;
function createMapping(origLegend, newLegend) {
    const mapping = [];
    let needsMapping = false;
    for (let origIndex = 0; origIndex < origLegend.length; origIndex++) {
        const entry = origLegend[origIndex];
        let newIndex = newLegend.indexOf(entry);
        if (newIndex === -1) {
            newIndex = newLegend.length;
            newLegend.push(entry);
        }
        mapping.push(newIndex);
        needsMapping = needsMapping || (newIndex !== origIndex);
    }
    return needsMapping ? mapping : undefined;
}
function applyTypesMapping(tokens, typesMapping) {
    if (typesMapping) {
        for (let token of tokens) {
            token.typeIdx = typesMapping[token.typeIdx];
        }
    }
}
function applyModifiersMapping(tokens, modifiersMapping) {
    if (modifiersMapping) {
        for (let token of tokens) {
            let modifierSet = token.modifierSet;
            if (modifierSet) {
                let index = 0;
                let result = 0;
                while (modifierSet > 0) {
                    if ((modifierSet & 1) !== 0) {
                        result = result + (1 << modifiersMapping[index]);
                    }
                    index++;
                    modifierSet = modifierSet >> 1;
                }
                token.modifierSet = result;
            }
        }
    }
}
function encodeTokens(tokens, ranges, document) {
    const resultTokens = tokens.sort((d1, d2) => d1.start.line - d2.start.line || d1.start.character - d2.start.character);
    if (ranges) {
        ranges = ranges.sort((d1, d2) => d1.start.line - d2.start.line || d1.start.character - d2.start.character);
    }
    else {
        ranges = [languageModes_1.Range.create(languageModes_1.Position.create(0, 0), languageModes_1.Position.create(document.lineCount, 0))];
    }
    let rangeIndex = 0;
    let currRange = ranges[rangeIndex++];
    let prefLine = 0;
    let prevChar = 0;
    let encodedResult = [];
    for (let k = 0; k < resultTokens.length && currRange; k++) {
        const curr = resultTokens[k];
        const start = curr.start;
        while (currRange && positions_1.beforeOrSame(currRange.end, start)) {
            currRange = ranges[rangeIndex++];
        }
        if (currRange && positions_1.beforeOrSame(currRange.start, start) && positions_1.beforeOrSame({ line: start.line, character: start.character + curr.length }, currRange.end)) {
            if (prefLine !== start.line) {
                prevChar = 0;
            }
            encodedResult.push(start.line - prefLine);
            encodedResult.push(start.character - prevChar);
            encodedResult.push(curr.length);
            encodedResult.push(curr.typeIdx);
            encodedResult.push(curr.modifierSet);
            prefLine = start.line;
            prevChar = start.character;
        }
    }
    return encodedResult;
}
