"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const apiError_1 = require("../utils/apiError");
const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success) {
        const message = result.error.errors.map((e) => e.message).join('; ');
        return next(new apiError_1.ApiError(400, message));
    }
    Object.assign(req, result.data);
    return next();
};
exports.validate = validate;
