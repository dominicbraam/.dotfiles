import { ResponseError, CancellationToken } from 'vscode-languageserver';
export declare function formatError(message: string, err: any): string;
export declare function runSafe<T>(func: () => Thenable<T>, errorVal: T, errorMessage: string, token: CancellationToken): Thenable<T | ResponseError<any>>;
