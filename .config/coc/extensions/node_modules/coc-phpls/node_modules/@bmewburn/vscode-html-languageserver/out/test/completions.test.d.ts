import 'mocha';
import { WorkspaceFolder, TextDocument, CompletionList, CompletionItemKind } from '../modes/languageModes';
export interface ItemDescription {
    label: string;
    documentation?: string;
    kind?: CompletionItemKind;
    resultText?: string;
    command?: {
        title: string;
        command: string;
    };
    notAvailable?: boolean;
}
export declare function assertCompletion(completions: CompletionList, expected: ItemDescription, document: TextDocument): void;
export declare function testCompletionFor(value: string, expected: {
    count?: number;
    items?: ItemDescription[];
}, uri?: string, workspaceFolders?: WorkspaceFolder[]): Promise<void>;
