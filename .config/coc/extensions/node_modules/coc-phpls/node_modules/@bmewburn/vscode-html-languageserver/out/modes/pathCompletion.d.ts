import { ICompletionParticipant, TextDocument, CompletionItem, WorkspaceFolder } from './languageModes';
export declare function getPathCompletionParticipant(document: TextDocument, workspaceFolders: WorkspaceFolder[], result: CompletionItem[]): ICompletionParticipant;
