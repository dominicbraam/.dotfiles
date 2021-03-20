import { LanguageModes, TextDocument, Position, SelectionRange } from './languageModes';
export declare function getSelectionRanges(languageModes: LanguageModes, document: TextDocument, positions: Position[]): Promise<SelectionRange[]>;
