"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.list = exports.getOne = exports.getResults = exports.uploadResult = exports.requestTest = void 0;
const DiagnosticService = __importStar(require("../services/diagnostic.service"));
const requestTest = async (req, res, next) => {
    try {
        const test = await DiagnosticService.requestTest({ ...req.body, userId: req.user.id });
        res.status(201).json(test);
    }
    catch (err) {
        next(err);
    }
};
exports.requestTest = requestTest;
const uploadResult = async (req, res, next) => {
    try {
        const test = await DiagnosticService.uploadResult(req.params.id, req.body.result);
        res.json(test);
    }
    catch (err) {
        next(err);
    }
};
exports.uploadResult = uploadResult;
const getResults = async (req, res, next) => {
    try {
        const results = await DiagnosticService.getResults(req.user.id);
        res.json(results);
    }
    catch (err) {
        next(err);
    }
};
exports.getResults = getResults;
const getOne = async (req, res, next) => {
    try {
        const test = await DiagnosticService.getTestById(req.params.id);
        res.json(test);
    }
    catch (err) {
        next(err);
    }
};
exports.getOne = getOne;
const list = async (_req, res, next) => {
    try {
        const tests = await DiagnosticService.getTests({});
        res.json(tests);
    }
    catch (err) {
        next(err);
    }
};
exports.list = list;
const update = async (req, res, next) => {
    try {
        const test = await DiagnosticService.updateTest(req.params.id, req.body);
        res.json(test);
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const test = await DiagnosticService.deleteTest(req.params.id);
        res.json(test);
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
