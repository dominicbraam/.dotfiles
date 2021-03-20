/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Copyright (c) 2019 - present  Ben Robert Mewburn <ben@mewburn.id.au> */

import {
	InitializeParams, InitializeResult, ServerCapabilities, ConfigurationParams,
    WorkspaceFolder, ColorInformation, TextDocumentSyncKind, Emitter, TextDocumentChangeEvent
} from 'vscode-languageserver/node';
import { Event, CancellationToken, PublishDiagnosticsParams, TextDocumentContentChangeEvent } from 'vscode-languageserver-protocol/node'
import { 
	Diagnostic, DocumentLink, SymbolInformation, CompletionItem, 
	Position, Range, TextDocumentIdentifier, VersionedTextDocumentIdentifier,
	TextDocumentItem, FormattingOptions, Color
} from 'vscode-languageserver-types';
import { getLanguageModes, LanguageModes, Settings, TextDocument } from './modes/languageModes';

import { format } from './modes/formatting';
import { pushAll } from './utils/arrays';
import { getDocumentContext } from './utils/documentContext';
import { URI } from 'vscode-uri';
import { runSafe } from './utils/runner';

import { getFoldingRanges } from './modes/htmlFolding';
import { getSelectionRanges } from './modes/selectionRanges';
import { RequestService } from './requests';
export { FileStat, FileType, RequestService } from './requests';

interface UpdateableDocument extends TextDocument {
	update(event: TextDocumentContentChangeEvent, version: number): void;
}

namespace UpdateableDocument {
	export function isUpdateableDocument(value: TextDocument): value is UpdateableDocument {
		return typeof (value as UpdateableDocument).update === 'function';
    }
}

/**
 * A manager for simple text documents
 */
class TextDocuments {

	private _documents: { [uri: string]: TextDocument };

	private _onDidChangeContent: Emitter<TextDocumentChangeEvent<TextDocument>>;
	private _onDidOpen: Emitter<TextDocumentChangeEvent<TextDocument>>;
	private _onDidClose: Emitter<TextDocumentChangeEvent<TextDocument>>;
	private _onDidSave: Emitter<TextDocumentChangeEvent<TextDocument>>;

	/**
	 * Create a new text document manager.
	 */
	public constructor() {
		this._documents = Object.create(null);
		this._onDidChangeContent = new Emitter<TextDocumentChangeEvent<TextDocument>>();
		this._onDidOpen = new Emitter<TextDocumentChangeEvent<TextDocument>>();
		this._onDidClose = new Emitter<TextDocumentChangeEvent<TextDocument>>();
		this._onDidSave = new Emitter<TextDocumentChangeEvent<TextDocument>>();
	}

	/**
	 * Returns the [TextDocumentSyncKind](#TextDocumentSyncKind) used by
	 * this text document manager.
	 */
	public get syncKind(): TextDocumentSyncKind {
		return TextDocumentSyncKind.Full;
	}

	/**
	 * An event that fires when a text document managed by this manager
	 * has been opened or the content changes.
	 */
	public get onDidChangeContent(): Event<TextDocumentChangeEvent<TextDocument>> {
		return this._onDidChangeContent.event;
	}

	/**
	 * An event that fires when a text document managed by this manager
	 * has been opened.
	 */
	public get onDidOpen(): Event<TextDocumentChangeEvent<TextDocument>> {
		return this._onDidOpen.event;
	}

	/**
	 * An event that fires when a text document managed by this manager
	 * has been saved.
	 */
	public get onDidSave(): Event<TextDocumentChangeEvent<TextDocument>> {
		return this._onDidSave.event;
	}

	/**
	 * An event that fires when a text document managed by this manager
	 * has been closed.
	 */
	public get onDidClose(): Event<TextDocumentChangeEvent<TextDocument>> {
		return this._onDidClose.event;
	}

	/**
	 * Returns the document for the given URI. Returns undefined if
	 * the document is not mananged by this instance.
	 *
	 * @param uri The text document's URI to retrieve.
	 * @return the text document or `undefined`.
	 */
	public get(uri: string): TextDocument | undefined {
		return this._documents[uri];
	}

	/**
	 * Returns all text documents managed by this instance.
	 *
	 * @return all text documents.
	 */
	public all(): TextDocument[] {
		return Object.keys(this._documents).map(key => this._documents[key]);
	}

	/**
	 * Returns the URIs of all text documents managed by this instance.
	 *
	 * @return the URI's of all text documents.
	 */
	public keys(): string[] {
		return Object.keys(this._documents);
	}

	public open(textDocumentItem: TextDocumentItem) {
		let document = TextDocument.create(
			textDocumentItem.uri,
			textDocumentItem.languageId,
			textDocumentItem.version,
			textDocumentItem.text
		);
		this._documents[textDocumentItem.uri] = document;
		let toFire = Object.freeze({ document });
		this._onDidOpen.fire(toFire);
		this._onDidChangeContent.fire(toFire);
	}

	public close(textDocumentIdentifier: TextDocumentIdentifier) {
		let document = this._documents[textDocumentIdentifier.uri];
		if (document) {
			delete this._documents[textDocumentIdentifier.uri];
			this._onDidClose.fire(Object.freeze({ document }));
		}
	}

	public change(
		textDocumentIdentifier: VersionedTextDocumentIdentifier,
		changes: TextDocumentContentChangeEvent[]
	) {
		let last: TextDocumentContentChangeEvent | undefined = changes.length > 0 ? changes[changes.length - 1] : undefined;
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

export namespace HtmlCssJsService {

	let workspaceFolders: WorkspaceFolder[] = [];
	let languageModes: LanguageModes;
	const documents: TextDocuments = new TextDocuments();

	let clientSnippetSupport = false;
	let scopedSettingsSupport = false;
	let foldingRangeLimit = Number.MAX_VALUE;

	let globalSettings: Settings = {};
	let documentSettings: { [key: string]: Thenable<Settings> } = {};

	documents.onDidClose(e => {
		delete documentSettings[e.document.uri];
    });
    
    const notReady = () => Promise.reject('Not Ready');
	let dummyRequestService: RequestService = { getContent: notReady, stat: notReady, readDirectory: notReady };

	export function initialise(params: InitializeParams, requestService: RequestService = dummyRequestService): InitializeResult {

		workspaceFolders = (<any>params).workspaceFolders;
		if (!Array.isArray(workspaceFolders)) {
			workspaceFolders = [];
			if (params.rootPath) {
				workspaceFolders.push({ name: '', uri: URI.file(params.rootPath).toString() });
			}
		}

		const workspace = {
			get settings() { return globalSettings; },
			get folders() { return workspaceFolders; }
		};

		languageModes = getLanguageModes({ css: true, javascript: true }, workspace, params.capabilities, requestService);

		documents.onDidClose(e => {
			languageModes.onDocumentRemoved(e.document);
		});

		function getClientCapability<T>(name: string, def: T) {
			const keys = name.split('.');
			let c: any = params.capabilities;
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
		const capabilities: ServerCapabilities = {
			// Tell the client that the server works in FULL text document sync mode
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

    export function setWorkspaceFolders(folders:string[]) {
        workspaceFolders = folders.map(f => {
            return {name: '', uri: f};
        });
    }

	export function shutdown() {
		languageModes.dispose();
	}

	export function openDocument(textDocumentItem: TextDocumentItem) {
		documents.open(textDocumentItem);
	}

	export function closeDocument(textDocumentIdentifier: TextDocumentIdentifier) {
		documents.close(textDocumentIdentifier);
	}

	export function changeDocument(
		textDocumentIdentifier: VersionedTextDocumentIdentifier,
		changes: TextDocumentContentChangeEvent[]
	) {
		documents.change(textDocumentIdentifier, changes);
	}

	export function setConfig(config) {
		globalSettings = config;
		documentSettings = {}; // reset all document settings
	}

	export function diagnose(textDocumentIdentifier: TextDocumentIdentifier) {
		let doc = documents.get(textDocumentIdentifier.uri);
		if(!doc) {
			return Promise.resolve(<PublishDiagnosticsParams>{uri: textDocumentIdentifier.uri, diagnostics: []});
		}
		return validateTextDocument(doc);
	}

	export function provideCompletions(
		textDocumentIdentifier: TextDocumentIdentifier,
		position: Position,
		token: CancellationToken
	) {
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (!document) {
				return null;
			}
			const mode = languageModes.getModeAtPosition(document, position);
			if (!mode || !mode.doComplete) {
				return { isIncomplete: true, items: [] };
			}
			const doComplete = mode.doComplete!;
            const settings = await getDocumentSettings(document, () => doComplete.length > 2);
            const documentContext = getDocumentContext(document.uri, workspaceFolders);
			const result = doComplete(document, position, documentContext, settings);
			return result;

		}, null, `Error while computing completions for ${textDocumentIdentifier.uri}`, token);
	}

	export function completionItemResolve(item: CompletionItem, token: CancellationToken) {
		return runSafe(async () => {
			const data = item.data;
			if (data && data.languageId && data.uri) {
				const mode = languageModes.getMode(data.languageId);
				const document = documents.get(data.uri);
				if (mode && mode.doResolve && document) {
					return mode.doResolve(document, item);
				}
			}
			return item;
		}, item, `Error while resolving completion proposal`, token);
	}

	export function provideHover(
		textDocumentIdentifier:TextDocumentIdentifier, 
		position:Position, 
		token:CancellationToken
	) {
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				const mode = languageModes.getModeAtPosition(document, position);
				if (mode && mode.doHover) {
					return mode.doHover(document, position);
				}
			}
			return null;
		}, null, `Error while computing hover for ${textDocumentIdentifier.uri}`, token);
	}


	export function provideDocumentHighlight(textDocumentIdentifier:TextDocumentIdentifier, position:Position, token:CancellationToken){
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				const mode = languageModes.getModeAtPosition(document, position);
				if (mode && mode.findDocumentHighlight) {
					return mode.findDocumentHighlight(document, position);
				}
			}
			return [];
		}, [], `Error while computing document highlights for ${textDocumentIdentifier.uri}`, token);
	}


	export function onDefinition(textDocumentIdentifier:TextDocumentIdentifier, position: Position, token:CancellationToken){
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				const mode = languageModes.getModeAtPosition(document, position);
				if (mode && mode.findDefinition) {
					return mode.findDefinition(document, position);
				}
			}
			return [];
		}, null, `Error while computing definitions for ${textDocumentIdentifier.uri}`, token);
	}

	export function provideReferences(textDocumentIdentifier:TextDocumentIdentifier, position:Position, token:CancellationToken){
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				const mode = languageModes.getModeAtPosition(document, position);
				if (mode && mode.findReferences) {
					return mode.findReferences(document, position);
				}
			}
			return [];
		}, [], `Error while computing references for ${textDocumentIdentifier.uri}`, token);
	}

	export function provideSignatureHelp(textDocumentIdentifier:TextDocumentIdentifier, position: Position, token:CancellationToken){
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				const mode = languageModes.getModeAtPosition(document, position);
				if (mode && mode.doSignatureHelp) {
					return mode.doSignatureHelp(document, position);
				}
			}
			return null;
		}, null, `Error while computing signature help for ${textDocumentIdentifier.uri}`, token);
	}

	export function provideDocumentRangeFormattingEdits(
		textDocumentIdentifier: TextDocumentIdentifier, 
		range:Range,
		options:FormattingOptions, 
		token:CancellationToken
	){
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				let settings = await getDocumentSettings(document, () => true);
				if (!settings) {
					settings = globalSettings;
				}
				const unformattedTags: string = settings && settings.html && settings.html.format && settings.html.format.unformatted || '';
				const enabledModes = { css: !unformattedTags.match(/\bstyle\b/), javascript: !unformattedTags.match(/\bscript\b/) };

				return format(languageModes, document, range, options, settings, enabledModes);
			}
			return [];
		}, [], `Error while formatting range for ${textDocumentIdentifier.uri}`, token);
	}

	export function provideDocumentLinks(textDocumentIdentifier:TextDocumentIdentifier, token:CancellationToken) {
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			const links: DocumentLink[] = [];
			if (document) {
				const documentContext = getDocumentContext(document.uri, workspaceFolders);
				for (let m of languageModes.getAllModesInDocument(document)) {
					if (m.findDocumentLinks) {
						pushAll(links, await m.findDocumentLinks(document, documentContext));
					}
				};
			}
			return links;
		}, [], `Error while document links for ${textDocumentIdentifier.uri}`, token);
	}

	export function provideDocumentSymbols(textDocumentIdentifier:TextDocumentIdentifier, token:CancellationToken) {
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			const symbols: SymbolInformation[] = [];
			if (document) {
				for (let m of languageModes.getAllModesInDocument(document)) {
					if (m.findDocumentSymbols) {
						pushAll(symbols, await m.findDocumentSymbols(document));
					}
				}
			}
			return symbols;
		}, [], `Error while computing document symbols for ${textDocumentIdentifier.uri}`, token);
	}

	export function provideFoldingRanges(textDocumentIdentifier:TextDocumentIdentifier, token:CancellationToken) {
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				return getFoldingRanges(languageModes, document, foldingRangeLimit, token);
			}
			return null;
		}, null, `Error while computing folding regions for ${textDocumentIdentifier.uri}`, token);
	}

	export function provideSelectionRanges(
		textDocumentIdentifier: TextDocumentIdentifier, 
		positions:Position[], 
		token:CancellationToken
	) {
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);

			if (document) {
                return getSelectionRanges(languageModes, document, positions);
			}
			return [];
		}, [], `Error while computing selection ranges for ${textDocumentIdentifier.uri}`, token);
    }
    
    export function provideRename(
        textDocument: TextDocumentIdentifier, 
        position:Position,
        newName:string, 
        token:CancellationToken
    ) {
        return runSafe(async () => {
			const document = documents.get(textDocument.uri);

			if (document) {
				const mode = languageModes.getModeAtPosition(document, position);

				if (mode && mode.doRename) {
					return mode.doRename(document, position, newName);
				}
			}
			return null;
		}, null, `Error while computing rename for ${textDocument.uri}`, token);
    }

	export function provideDocumentColours(textDocumentIdentifier:TextDocumentIdentifier, token:CancellationToken) {
		return runSafe(async () => {
			const infos: ColorInformation[] = [];
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				for (let m of languageModes.getAllModesInDocument(document)) {
					if (m.findDocumentColors) {
						pushAll(infos, await m.findDocumentColors(document));
					}
				};
			}
			return infos;
		}, [], `Error while computing document colors for ${textDocumentIdentifier.uri}`, token);
	}

	export function provideColorPresentations(
		textDocumentIdentifier: TextDocumentIdentifier, 
		range: Range, 
		color: Color, 
		token:CancellationToken
	) {
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				const mode = languageModes.getModeAtPosition(document, range.start);
				if (mode && mode.getColorPresentations) {
					return mode.getColorPresentations(document, color, range);
				}
			}
			return [];
		}, [], `Error while computing color presentations for ${textDocumentIdentifier.uri}`, token);
	}

	export function provideTagClose(textDocumentIdentifier:TextDocumentIdentifier, position:Position, token:CancellationToken) {
		return runSafe(async () => {
			const document = documents.get(textDocumentIdentifier.uri);
			if (document) {
				const pos = position;
				if (pos.character > 0) {
					const mode = languageModes.getModeAtPosition(document, Position.create(pos.line, pos.character - 1));
					if (mode && mode.doAutoClose) {
						return mode.doAutoClose(document, pos);
					}
				}
			}
			return null;
		}, null, `Error while computing tag close actions for ${textDocumentIdentifier.uri}`, token);
	}

	export var requestConfigurationDelegate:(params: ConfigurationParams) => Thenable<Settings>;

	function getDocumentSettings(textDocument: TextDocument, needsDocumentSettings: () => boolean): Thenable<Settings | undefined> {
		if (scopedSettingsSupport && needsDocumentSettings()) {
			let promise = documentSettings[textDocument.uri];
			if (!promise && requestConfigurationDelegate) {
				const scopeUri = textDocument.uri;
				const configRequestParam: ConfigurationParams = { items: [{ scopeUri, section: 'css' }, { scopeUri, section: 'html' }, { scopeUri, section: 'javascript' }] };
				promise = requestConfigurationDelegate(configRequestParam).then(s => ({ css: s[0], html: s[1], javascript: s[2] }));
				documentSettings[textDocument.uri] = promise;
			}
			return promise;
		}
		return Promise.resolve(undefined);
	}

	function isValidationEnabled(languageId: string, settings: Settings = globalSettings) {
		const validationSettings = settings && settings.html && settings.html.validate;
		if (validationSettings) {
			return languageId === 'css' && validationSettings.styles !== false || languageId === 'javascript' && validationSettings.scripts !== false;
		}
		return true;
	}

	async function validateTextDocument(textDocument: TextDocument) {
		try {
			const version = textDocument.version;
			const diagnostics: Diagnostic[] = [];
			if (textDocument.languageId === 'html') {
				const modes = languageModes.getAllModesInDocument(textDocument);
				const settings = await getDocumentSettings(textDocument, () => modes.some(m => !!m.doValidation));
				const latestTextDocument = documents.get(textDocument.uri);
				if (latestTextDocument && latestTextDocument.version === version) { // check no new version has come in after in after the async op
					for (let mode of modes) {
						if (mode.doValidation && isValidationEnabled(mode.getId(), settings)) {
							pushAll(diagnostics, await mode.doValidation(latestTextDocument, settings));
						}
					}
					return <PublishDiagnosticsParams>{ uri: latestTextDocument.uri, diagnostics };
				}
			}
			return <PublishDiagnosticsParams>{ uri: textDocument.uri, diagnostics: [] };
		} catch (e) {
			return <PublishDiagnosticsParams>{ uri: textDocument.uri, diagnostics: [] };
		}
	}

}
