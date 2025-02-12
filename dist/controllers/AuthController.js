"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    // Crear una cuenta
    static createAccount = async (req, res) => {
        const { email, password } = req.body;
        // Comprobar si el usuario ya existe
        const userExists = await User_1.default.findOne({ where: { email } });
        if (userExists) {
            const error = new Error('El email ya está registrado');
            res.status(409).json({ error: error.message });
            return;
        }
        try {
            const user = new User_1.default(req.body);
            // Generar contraseña y token
            user.password = await (0, auth_1.hashPassword)(password);
            user.token = (0, token_1.generateToken)();
            await user.save();
            // Enviar email de confirmación de cuenta
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            });
            res.json({ msg: '¡Cuenta creada correctamente!' });
        }
        catch (error) {
            console.log(error);
        }
    };
    // Confirmar una cuenta creada
    static confirmAccount = async (req, res) => {
        const { token } = req.body;
        // Buscar si existe un usuario con ese token
        const user = await User_1.default.findOne({ where: { token } });
        if (!user) {
            const error = new Error('El token no es válido');
            res.status(401).json({ error: error.message });
            return;
        }
        // Confirmar la cuenta y eliminar el token
        user.confirmed = true;
        user.token = null;
        await user.save();
        res.json({ msg: '¡Cuenta confirmada correctamente!' });
    };
    // Iniciar Sesión
    static login = async (req, res) => {
        const { email, password } = req.body;
        // Comprobar si el usuario existe
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            const error = new Error('El usuario no existe');
            res.status(409).json({ error: error.message });
            return;
        }
        // Comprobar si la contraseña es correcta
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña es incorrecta');
            res.status(401).json({ error: error.message });
            return;
        }
        // Comprobar si la cuenta está confirmada
        if (!user.confirmed) {
            const error = new Error('La cuenta no está confirmada');
            res.status(403).json({ error: error.message });
            return;
        }
        // Generar un JWT
        const jwt = (0, jwt_1.generateJWT)(user.id);
        res.json(jwt);
    };
    // Olvido de Contraseña
    static forgotPassword = async (req, res) => {
        const { email } = req.body;
        // Comprobar si el usuario ya existe
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            const error = new Error('El usuario no existe');
            res.status(401).json({ error: error.message });
            return;
        }
        // Generar un token nuevo
        user.token = (0, token_1.generateToken)();
        await user.save();
        // Enviar un email
        await AuthEmail_1.AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        });
        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    };
    // Validar Token
    static validateToken = async (req, res) => {
        const { token } = req.body;
        const tokenExists = await User_1.default.findOne({ where: { token } });
        if (!tokenExists) {
            const error = new Error('El token no es válido');
            res.status(404).json({ error: error.message });
            return;
        }
        res.json({ msg: 'Token válido, asigna una nueva contraseña a tu cuenta' });
    };
    // Cambiar Contraseña y Resetear Token
    static resetPasswordWithToken = async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;
        // Buscar el usuario con ese token
        const user = await User_1.default.findOne({ where: { token } });
        if (!user) {
            const error = new Error('El token no es válido');
            res.status(404).json({ error: error.message });
            return;
        }
        // Cambiar Contraseña y eliminar token
        user.password = await (0, auth_1.hashPassword)(password);
        user.token = null;
        await user.save();
        res.json({ msg: '¡Contraseña cambiada correctamente!' });
    };
    // Obtener datos del usuario
    static user = async (req, res) => {
        res.json(req.user);
    };
    // Cambiar contraseña de un usuario autenticado
    static updatePassword = async (req, res) => {
        const { current_password, password } = req.body;
        const { id } = req.user;
        const user = await User_1.default.findByPk(id);
        // Comprobar si la contraseña actual es correcta
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña actual es incorrecta');
            res.status(401).json({ error: error.message });
            return;
        }
        user.password = await (0, auth_1.hashPassword)(password);
        await user.save();
        res.json({ msg: '¡Contraseña cambiada correctamente!' });
    };
    // Comprobar contraseña del usuario
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const { id } = req.user;
        const user = await User_1.default.findByPk(id);
        // Comprobar si la contraseña es correcta
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña es incorrecta');
            res.status(401).json({ error: error.message });
            return;
        }
        res.json({ msg: '¡Contraseña correcta!' });
    };
    // Modificar perfil del usuario
    static updateUser = async (req, res) => {
        const { name, email } = req.body;
        try {
            // Comprobar si el email ya existe
            const existingUser = await User_1.default.findOne({ where: { email } });
            if (existingUser && existingUser.id !== req.user.id) {
                const error = new Error('El email ya está asociado a otro usuario');
                res.status(409).json({ error: error.message });
            }
            // Actualizar usuario
            await User_1.default.update({ email, name }, {
                where: { id: req.user.id }
            });
            res.json({ msg: 'Perfil actualizado correctamente!' });
        }
        catch (error) {
            res.status(500).json('Hubo un error');
        }
    };
}
exports.AuthController = AuthController;
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map