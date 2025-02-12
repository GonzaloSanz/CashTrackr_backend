import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    limit: 5, // 5 request
    message: { "error": "Has alcanzado el límite de peticiones"}
});
