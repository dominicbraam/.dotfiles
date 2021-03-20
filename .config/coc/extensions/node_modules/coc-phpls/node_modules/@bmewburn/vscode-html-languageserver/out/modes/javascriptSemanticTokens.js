"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemanticTokens = exports.getSemanticTokenLegend = void 0;
const ts = require("typescript");
function getSemanticTokenLegend() {
    if (tokenTypes.length !== 11) {
        console.warn('TokenType has added new entries.');
    }
    if (tokenModifiers.length !== 4) {
        console.warn('TokenModifier has added new entries.');
    }
    return { types: tokenTypes, modifiers: tokenModifiers };
}
exports.getSemanticTokenLegend = getSemanticTokenLegend;
function getSemanticTokens(jsLanguageService, currentTextDocument, fileName) {
    let resultTokens = [];
    const collector = (node, typeIdx, modifierSet) => {
        resultTokens.push({ start: currentTextDocument.positionAt(node.getStart()), length: node.getWidth(), typeIdx, modifierSet });
    };
    collectTokens(jsLanguageService, fileName, { start: 0, length: currentTextDocument.getText().length }, collector);
    return resultTokens;
}
exports.getSemanticTokens = getSemanticTokens;
function collectTokens(jsLanguageService, fileName, span, collector) {
    const program = jsLanguageService.getProgram();
    if (program) {
        const typeChecker = program.getTypeChecker();
        function visit(node) {
            if (!node || !ts.textSpanIntersectsWith(span, node.pos, node.getFullWidth())) {
                return;
            }
            if (ts.isIdentifier(node)) {
                let symbol = typeChecker.getSymbolAtLocation(node);
                if (symbol) {
                    if (symbol.flags & ts.SymbolFlags.Alias) {
                        symbol = typeChecker.getAliasedSymbol(symbol);
                    }
                    let typeIdx = classifySymbol(symbol);
                    if (typeIdx !== undefined) {
                        let modifierSet = 0;
                        if (node.parent) {
                            const parentTypeIdx = tokenFromDeclarationMapping[node.parent.kind];
                            if (parentTypeIdx === typeIdx && node.parent.name === node) {
                                modifierSet = 1 << 0;
                            }
                        }
                        const decl = symbol.valueDeclaration;
                        const modifiers = decl ? ts.getCombinedModifierFlags(decl) : 0;
                        const nodeFlags = decl ? ts.getCombinedNodeFlags(decl) : 0;
                        if (modifiers & ts.ModifierFlags.Static) {
                            modifierSet |= 1 << 1;
                        }
                        if (modifiers & ts.ModifierFlags.Async) {
                            modifierSet |= 1 << 2;
                        }
                        if ((modifiers & ts.ModifierFlags.Readonly) || (nodeFlags & ts.NodeFlags.Const) || (symbol.getFlags() & ts.SymbolFlags.EnumMember)) {
                            modifierSet |= 1 << 3;
                        }
                        collector(node, typeIdx, modifierSet);
                    }
                }
            }
            ts.forEachChild(node, visit);
        }
        const sourceFile = program.getSourceFile(fileName);
        if (sourceFile) {
            visit(sourceFile);
        }
    }
}
function classifySymbol(symbol) {
    const flags = symbol.getFlags();
    if (flags & ts.SymbolFlags.Class) {
        return 0;
    }
    else if (flags & ts.SymbolFlags.Enum) {
        return 1;
    }
    else if (flags & ts.SymbolFlags.TypeAlias) {
        return 5;
    }
    else if (flags & ts.SymbolFlags.Type) {
        if (flags & ts.SymbolFlags.Interface) {
            return 2;
        }
        if (flags & ts.SymbolFlags.TypeParameter) {
            return 4;
        }
    }
    const decl = symbol.valueDeclaration || symbol.declarations && symbol.declarations[0];
    return decl && tokenFromDeclarationMapping[decl.kind];
}
const tokenTypes = [];
tokenTypes[0] = 'class';
tokenTypes[1] = 'enum';
tokenTypes[2] = 'interface';
tokenTypes[3] = 'namespace';
tokenTypes[4] = 'typeParameter';
tokenTypes[5] = 'type';
tokenTypes[6] = 'parameter';
tokenTypes[7] = 'variable';
tokenTypes[8] = 'property';
tokenTypes[9] = 'function';
tokenTypes[10] = 'method';
const tokenModifiers = [];
tokenModifiers[2] = 'async';
tokenModifiers[0] = 'declaration';
tokenModifiers[3] = 'readonly';
tokenModifiers[1] = 'static';
const tokenFromDeclarationMapping = {
    [ts.SyntaxKind.VariableDeclaration]: 7,
    [ts.SyntaxKind.Parameter]: 6,
    [ts.SyntaxKind.PropertyDeclaration]: 8,
    [ts.SyntaxKind.ModuleDeclaration]: 3,
    [ts.SyntaxKind.EnumDeclaration]: 1,
    [ts.SyntaxKind.EnumMember]: 8,
    [ts.SyntaxKind.ClassDeclaration]: 0,
    [ts.SyntaxKind.MethodDeclaration]: 10,
    [ts.SyntaxKind.FunctionDeclaration]: 9,
    [ts.SyntaxKind.MethodSignature]: 10,
    [ts.SyntaxKind.GetAccessor]: 8,
    [ts.SyntaxKind.PropertySignature]: 8,
    [ts.SyntaxKind.InterfaceDeclaration]: 2,
    [ts.SyntaxKind.TypeAliasDeclaration]: 5,
    [ts.SyntaxKind.TypeParameter]: 4
};
