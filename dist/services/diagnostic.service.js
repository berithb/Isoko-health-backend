"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResults = exports.uploadResult = exports.requestTest = void 0;
const apiError_1 = require("../utils/apiError");
const DiagnosticTest_1 = require("../models/DiagnosticTest");
const requestTest = async (payload) => DiagnosticTest_1.DiagnosticTest.create(payload);
exports.requestTest = requestTest;
const uploadResult = async (id, result) => {
    const test = await DiagnosticTest_1.DiagnosticTest.findById(id);
    if (!test)
        throw new apiError_1.ApiError(404, 'Diagnostic test not found');
    test.result = result;
    test.status = 'completed';
    await test.save();
    return test;
};
exports.uploadResult = uploadResult;
const getResults = async (userId) => DiagnosticTest_1.DiagnosticTest.find({ userId });
exports.getResults = getResults;
