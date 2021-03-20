import { LanguageModelCache } from '../languageModelCache';
import { LanguageService as CSSLanguageService } from 'vscode-css-languageservice';
import { LanguageMode, Workspace } from './languageModes';
import { HTMLDocumentRegions } from './embeddedSupport';
export declare function getCSSMode(cssLanguageService: CSSLanguageService, documentRegions: LanguageModelCache<HTMLDocumentRegions>, workspace: Workspace): LanguageMode;
