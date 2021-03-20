import { LanguageModes, Settings, TextDocument, Range, TextEdit, FormattingOptions } from './languageModes';
export declare function format(languageModes: LanguageModes, document: TextDocument, formatRange: Range, formattingOptions: FormattingOptions, settings: Settings | undefined, enabledModes: {
    [mode: string]: boolean;
}): Promise<TextEdit[]>;
