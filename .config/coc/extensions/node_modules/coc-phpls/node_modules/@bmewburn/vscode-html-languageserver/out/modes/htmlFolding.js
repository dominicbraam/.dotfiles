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
exports.getFoldingRanges = void 0;
const languageModes_1 = require("./languageModes");
function getFoldingRanges(languageModes, document, maxRanges, _cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        let htmlMode = languageModes.getMode('html');
        let range = languageModes_1.Range.create(languageModes_1.Position.create(0, 0), languageModes_1.Position.create(document.lineCount, 0));
        let result = [];
        if (htmlMode && htmlMode.getFoldingRanges) {
            result.push(...yield htmlMode.getFoldingRanges(document));
        }
        let rangesPerMode = Object.create(null);
        let getRangesForMode = (mode) => __awaiter(this, void 0, void 0, function* () {
            if (mode.getFoldingRanges) {
                let ranges = rangesPerMode[mode.getId()];
                if (!Array.isArray(ranges)) {
                    ranges = (yield mode.getFoldingRanges(document)) || [];
                    rangesPerMode[mode.getId()] = ranges;
                }
                return ranges;
            }
            return [];
        });
        let modeRanges = languageModes.getModesInRange(document, range);
        for (let modeRange of modeRanges) {
            let mode = modeRange.mode;
            if (mode && mode !== htmlMode && !modeRange.attributeValue) {
                const ranges = yield getRangesForMode(mode);
                result.push(...ranges.filter(r => r.startLine >= modeRange.start.line && r.endLine < modeRange.end.line));
            }
        }
        if (maxRanges && result.length > maxRanges) {
            result = limitRanges(result, maxRanges);
        }
        return result;
    });
}
exports.getFoldingRanges = getFoldingRanges;
function limitRanges(ranges, maxRanges) {
    ranges = ranges.sort((r1, r2) => {
        let diff = r1.startLine - r2.startLine;
        if (diff === 0) {
            diff = r1.endLine - r2.endLine;
        }
        return diff;
    });
    let top = undefined;
    let previous = [];
    let nestingLevels = [];
    let nestingLevelCounts = [];
    let setNestingLevel = (index, level) => {
        nestingLevels[index] = level;
        if (level < 30) {
            nestingLevelCounts[level] = (nestingLevelCounts[level] || 0) + 1;
        }
    };
    for (let i = 0; i < ranges.length; i++) {
        let entry = ranges[i];
        if (!top) {
            top = entry;
            setNestingLevel(i, 0);
        }
        else {
            if (entry.startLine > top.startLine) {
                if (entry.endLine <= top.endLine) {
                    previous.push(top);
                    top = entry;
                    setNestingLevel(i, previous.length);
                }
                else if (entry.startLine > top.endLine) {
                    do {
                        top = previous.pop();
                    } while (top && entry.startLine > top.endLine);
                    if (top) {
                        previous.push(top);
                    }
                    top = entry;
                    setNestingLevel(i, previous.length);
                }
            }
        }
    }
    let entries = 0;
    let maxLevel = 0;
    for (let i = 0; i < nestingLevelCounts.length; i++) {
        let n = nestingLevelCounts[i];
        if (n) {
            if (n + entries > maxRanges) {
                maxLevel = i;
                break;
            }
            entries += n;
        }
    }
    let result = [];
    for (let i = 0; i < ranges.length; i++) {
        let level = nestingLevels[i];
        if (typeof level === 'number') {
            if (level < maxLevel || (level === maxLevel && entries++ < maxRanges)) {
                result.push(ranges[i]);
            }
        }
    }
    return result;
}
