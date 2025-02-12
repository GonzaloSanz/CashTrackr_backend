"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000, // 1 minuto
    limit: 5, // 5 request
    message: { "error": "Has alcanzado el límite de peticiones" }
});
//# sourceMappingURL=limiter.js.map