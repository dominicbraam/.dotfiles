export declare function getWordAtText(text: string, offset: number, wordDefinition: RegExp): {
    start: number;
    length: number;
};
export declare function startsWith(haystack: string, needle: string): boolean;
export declare function endsWith(haystack: string, needle: string): boolean;
export declare function repeat(value: string, count: number): string;
export declare function isWhitespaceOnly(str: string): boolean;
export declare function isEOL(content: string, offset: number): boolean;
export declare function isNewlineCharacter(charCode: number): boolean;
