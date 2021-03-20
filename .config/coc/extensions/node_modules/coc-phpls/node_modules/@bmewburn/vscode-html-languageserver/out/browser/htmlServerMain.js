"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("vscode-languageserver/browser");
const htmlServer_1 = require("../htmlServer");
const messageReader = new browser_1.BrowserMessageReader(self);
const messageWriter = new browser_1.BrowserMessageWriter(self);
const connection = browser_1.createConnection(messageReader, messageWriter);
htmlServer_1.startServer(connection, {});
