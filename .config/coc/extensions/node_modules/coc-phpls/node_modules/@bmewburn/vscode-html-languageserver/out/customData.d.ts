import { IHTMLDataProvider } from 'vscode-html-languageservice';
import { RequestService } from './requests';
export declare function fetchHTMLDataProviders(dataPaths: string[], requestService: RequestService): Promise<IHTMLDataProvider[]>;
