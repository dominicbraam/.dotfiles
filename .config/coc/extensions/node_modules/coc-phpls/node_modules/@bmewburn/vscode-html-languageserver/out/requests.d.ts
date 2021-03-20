import { RequestType, Connection } from 'vscode-languageserver';
import { RuntimeEnvironment } from './htmlServer';
export declare namespace FsContentRequest {
    const type: RequestType<{
        uri: string;
        encoding?: string;
    }, string, any>;
}
export declare namespace FsStatRequest {
    const type: RequestType<string, FileStat, any>;
}
export declare namespace FsReadDirRequest {
    const type: RequestType<string, [string, FileType][], any>;
}
export declare enum FileType {
    Unknown = 0,
    File = 1,
    Directory = 2,
    SymbolicLink = 64
}
export interface FileStat {
    type: FileType;
    ctime: number;
    mtime: number;
    size: number;
}
export interface RequestService {
    getContent(uri: string, encoding?: string): Promise<string>;
    stat(uri: string): Promise<FileStat>;
    readDirectory(uri: string): Promise<[string, FileType][]>;
}
export declare function getRequestService(handledSchemas: string[], connection: Connection, runtime: RuntimeEnvironment): RequestService;
export declare function getScheme(uri: string): string;
export declare function dirname(uri: string): string;
export declare function basename(uri: string): string;
export declare function extname(uri: string): string;
export declare function isAbsolutePath(path: string): boolean;
export declare function resolvePath(uriString: string, path: string): string;
export declare function normalizePath(parts: string[]): string;
export declare function joinPath(uriString: string, ...paths: string[]): string;
