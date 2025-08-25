"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = void 0;
/* eslint-disable no-console */
const notify = (userId, message) => {
    console.log(`[NOTIFY] User ${userId}: ${message}`);
};
exports.notify = notify;
