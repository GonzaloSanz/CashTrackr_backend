"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    const bearer = req.headers.authorization;
    // Si no se está enviando un Bearer Token
    if (!bearer) {
        const error = new Error('No Autorizado');
        res.status(401).json({ error: error.message });
        return;
    }
    const [, token] = bearer.split(' ');
    // Si no existe un Token
    if (!token) {
        const error = new Error('El token no es válido');
        res.status(401).json({ error: error.message });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) {
            req.user = await User_1.default.findByPk(decoded?.id, { attributes: ['id', 'name', 'email'] });
            next();
        }
    }
    catch (error) {
        res.status(500).json({ error: 'El token no es válido' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map