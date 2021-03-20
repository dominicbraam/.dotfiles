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
exports.getSelectionRanges = void 0;
const languageModes_1 = require("./languageModes");
const positions_1 = require("../utils/positions");
function getSelectionRanges(languageModes, document, positions) {
    return __awaiter(this, void 0, void 0, function* () {
        const htmlMode = languageModes.getMode('html');
        return Promise.all(positions.map((position) => __awaiter(this, void 0, void 0, function* () {
            const htmlRange = yield htmlMode.getSelectionRange(document, position);
            const mode = languageModes.getModeAtPosition(document, position);
            if (mode && mode.getSelectionRange) {
                let range = yield mode.getSelectionRange(document, position);
                let top = range;
                while (top.parent && positions_1.insideRangeButNotSame(htmlRange.range, top.parent.range)) {
                    top = top.parent;
                }
                top.parent = htmlRange;
                return range;
            }
            return htmlRange || languageModes_1.SelectionRange.create(languageModes_1.Range.create(position, position));
        })));
    });
}
exports.getSelectionRanges = getSelectionRanges;
