"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const validation_1 = require("../middlewares/validation");
const limiter_1 = require("../config/limiter");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(limiter_1.limiter);
router.post('/create-account', (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre no puede ir vacío'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'), (0, express_validator_1.body)('email')
    .isEmail().withMessage('El email no es válido'), validation_1.handleInputErrors, AuthController_1.default.createAccount);
router.post('/confirm-account', (0, express_validator_1.body)('token')
    .isLength({ min: 6, max: 6 })
    .notEmpty().withMessage('El token no es válido'), validation_1.handleInputErrors, AuthController_1.default.confirmAccount);
router.post('/login', (0, express_validator_1.body)('email')
    .isEmail().withMessage('El email no es válido'), (0, express_validator_1.body)('password')
    .notEmpty().withMessage('La contraseña no es válida'), validation_1.handleInputErrors, AuthController_1.default.login);
router.post('/forgot-password', (0, express_validator_1.body)('email')
    .isEmail().withMessage('El email no es válido'), validation_1.handleInputErrors, AuthController_1.default.forgotPassword);
router.post('/validate-token', (0, express_validator_1.body)('token')
    .isLength({ min: 6, max: 6 })
    .notEmpty().withMessage('El token no es válido'), validation_1.handleInputErrors, AuthController_1.default.validateToken);
router.post('/reset-password/:token', (0, express_validator_1.param)('token')
    .isLength({ min: 6, max: 6 })
    .notEmpty().withMessage('El token no es válido'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'), validation_1.handleInputErrors, AuthController_1.default.resetPasswordWithToken);
router.get('/user', auth_1.authenticate, AuthController_1.default.user);
router.put('/user', auth_1.authenticate, AuthController_1.default.updateUser);
router.post('/update-password', auth_1.authenticate, (0, express_validator_1.body)('current_password')
    .notEmpty().withMessage('La contraseña actual no es válida'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('La contraseña nueva debe tener mínimo 8 caracteres'), validation_1.handleInputErrors, AuthController_1.default.updatePassword);
router.post('/check-password', auth_1.authenticate, (0, express_validator_1.body)('password')
    .isLength({ min: 1 }).withMessage('La contraseña no es válida'), validation_1.handleInputErrors, AuthController_1.default.checkPassword);
exports.default = router;
//# sourceMappingURL=authRouter.js.map