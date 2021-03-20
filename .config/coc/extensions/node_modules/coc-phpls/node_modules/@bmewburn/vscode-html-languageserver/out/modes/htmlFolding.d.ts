import { TextDocument, FoldingRange, LanguageModes } from './languageModes';
import { CancellationToken } from 'vscode-languageserver';
export declare function getFoldingRanges(languageModes: LanguageModes, document: TextDocument, maxRanges: number | undefined, _cancellationToken: CancellationToken | null): Promise<FoldingRange[]>;
