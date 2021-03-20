import { Connection } from 'vscode-languageserver';
import { RequestService } from './requests';
export interface RuntimeEnvironment {
    file?: RequestService;
    http?: RequestService;
    configureHttpRequests?(proxy: string, strictSSL: boolean): void;
}
export declare function startServer(connection: Connection, runtime: RuntimeEnvironment): void;
