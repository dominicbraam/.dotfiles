import { TextDocument, SemanticTokenData } from './languageModes';
import * as ts from 'typescript';
export declare function getSemanticTokenLegend(): {
    types: string[];
    modifiers: string[];
};
export declare function getSemanticTokens(jsLanguageService: ts.LanguageService, currentTextDocument: TextDocument, fileName: string): SemanticTokenData[];
export declare const enum TokenType {
    class = 0,
    enum = 1,
    interface = 2,
    namespace = 3,
    typeParameter = 4,
    type = 5,
    parameter = 6,
    variable = 7,
    property = 8,
    function = 9,
    method = 10,
    _ = 11
}
export declare const enum TokenModifier {
    declaration = 0,
    static = 1,
    async = 2,
    readonly = 3,
    _ = 4
}
