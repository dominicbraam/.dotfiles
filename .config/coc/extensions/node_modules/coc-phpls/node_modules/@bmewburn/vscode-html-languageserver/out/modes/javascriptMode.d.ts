import { LanguageModelCache } from '../languageModelCache';
import { LanguageMode, Workspace } from './languageModes';
import { HTMLDocumentRegions } from './embeddedSupport';
export declare function getJavaScriptMode(documentRegions: LanguageModelCache<HTMLDocumentRegions>, languageId: 'javascript' | 'typescript', workspace: Workspace): LanguageMode;
