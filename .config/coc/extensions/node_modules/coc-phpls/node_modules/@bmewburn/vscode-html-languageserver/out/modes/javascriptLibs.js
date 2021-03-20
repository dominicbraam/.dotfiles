"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLibrary = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const contents = {};
const isPacked = path_1.basename(__dirname) === 'lib';
const serverFolder = isPacked ? __dirname : path_1.dirname(path_1.dirname(__dirname));
const TYPESCRIPT_LIB_SOURCE = isPacked ? serverFolder : path_1.join(serverFolder, 'node_modules/typescript/lib');
const JQUERY_PATH = isPacked ? path_1.join(serverFolder, 'jquery.d.ts') : path_1.join(serverFolder, 'lib/jquery.d.ts');
function loadLibrary(name) {
    let content = contents[name];
    if (typeof content !== 'string') {
        let libPath;
        if (name === 'jquery') {
            libPath = JQUERY_PATH;
        }
        else {
            libPath = path_1.join(TYPESCRIPT_LIB_SOURCE, name);
        }
        try {
            content = fs_1.readFileSync(libPath).toString();
        }
        catch (e) {
            console.log(`Unable to load library ${name} at ${libPath}: ${e.message}`);
            content = '';
        }
        contents[name] = content;
    }
    return content;
}
exports.loadLibrary = loadLibrary;
