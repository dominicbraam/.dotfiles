"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const runner_1 = require("../utils/runner");
const htmlServer_1 = require("../htmlServer");
const nodeFs_1 = require("./nodeFs");
const connection = node_1.createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
process.on('unhandledRejection', (e) => {
    connection.console.error(runner_1.formatError(`Unhandled exception`, e));
});
htmlServer_1.startServer(connection, { file: nodeFs_1.getNodeFSRequestService() });
