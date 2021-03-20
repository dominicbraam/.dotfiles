import { ClientCapabilities, DocumentContext, IHTMLDataProvider, SelectionRange, CompletionItem, CompletionList, Definition, Diagnostic, DocumentHighlight, DocumentLink, FoldingRange, FormattingOptions, Hover, Location, Position, Range, SignatureHelp, SymbolInformation, TextDocument, TextEdit, Color, ColorInformation, ColorPresentation, WorkspaceEdit } from 'vscode-html-languageservice';
import { WorkspaceFolder } from 'vscode-languageserver';
import { RequestService } from '../requests';
export * from 'vscode-html-languageservice';
export { WorkspaceFolder } from 'vscode-languageserver';
export interface Settings {
    css?: any;
    html?: any;
    javascript?: any;
}
export interface Workspace {
    readonly settings: Settings;
    readonly folders: WorkspaceFolder[];
}
export interface SemanticTokenData {
    start: Position;
    length: number;
    typeIdx: number;
    modifierSet: number;
}
export interface LanguageMode {
    getId(): string;
    getSelectionRange?: (document: TextDocument, position: Position) => Promise<SelectionRange>;
    doValidation?: (document: TextDocument, settings?: Settings) => Promise<Diagnostic[]>;
    doComplete?: (document: TextDocument, position: Position, documentContext: DocumentContext, settings?: Settings) => Promise<CompletionList>;
    doResolve?: (document: TextDocument, item: CompletionItem) => Promise<CompletionItem>;
    doHover?: (document: TextDocument, position: Position, settings?: Settings) => Promise<Hover | null>;
    doSignatureHelp?: (document: TextDocument, position: Position) => Promise<SignatureHelp | null>;
    doRename?: (document: TextDocument, position: Position, newName: string) => Promise<WorkspaceEdit | null>;
    doLinkedEditing?: (document: TextDocument, position: Position) => Promise<Range[] | null>;
    findDocumentHighlight?: (document: TextDocument, position: Position) => Promise<DocumentHighlight[]>;
    findDocumentSymbols?: (document: TextDocument) => Promise<SymbolInformation[]>;
    findDocumentLinks?: (document: TextDocument, documentContext: DocumentContext) => Promise<DocumentLink[]>;
    findDefinition?: (document: TextDocument, position: Position) => Promise<Definition | null>;
    findReferences?: (document: TextDocument, position: Position) => Promise<Location[]>;
    format?: (document: TextDocument, range: Range, options: FormattingOptions, settings?: Settings) => Promise<TextEdit[]>;
    findDocumentColors?: (document: TextDocument) => Promise<ColorInformation[]>;
    getColorPresentations?: (document: TextDocument, color: Color, range: Range) => Promise<ColorPresentation[]>;
    doAutoClose?: (document: TextDocument, position: Position) => Promise<string | null>;
    findMatchingTagPosition?: (document: TextDocument, position: Position) => Promise<Position | null>;
    getFoldingRanges?: (document: TextDocument) => Promise<FoldingRange[]>;
    onDocumentRemoved(document: TextDocument): void;
    getSemanticTokens?(document: TextDocument): Promise<SemanticTokenData[]>;
    getSemanticTokenLegend?(): {
        types: string[];
        modifiers: string[];
    };
    dispose(): void;
}
export interface LanguageModes {
    updateDataProviders(dataProviders: IHTMLDataProvider[]): void;
    getModeAtPosition(document: TextDocument, position: Position): LanguageMode | undefined;
    getModesInRange(document: TextDocument, range: Range): LanguageModeRange[];
    getAllModes(): LanguageMode[];
    getAllModesInDocument(document: TextDocument): LanguageMode[];
    getMode(languageId: string): LanguageMode | undefined;
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
export interface LanguageModeRange extends Range {
    mode: LanguageMode | undefined;
    attributeValue?: boolean;
}
export declare function getLanguageModes(supportedLanguages: {
    [languageId: string]: boolean;
}, workspace: Workspace, clientCapabilities: ClientCapabilities, requestService: RequestService): LanguageModes;
