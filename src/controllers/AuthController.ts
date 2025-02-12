import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
    // Crear una cuenta
    static createAccount = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Comprobar si el usuario ya existe
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            const error = new Error('El email ya está registrado');
            res.status(409).json({ error: error.message });
            return;
        }

        try {
            const user = new User(req.body);

            // Generar contraseña y token
            user.password = await hashPassword(password);
            user.token = generateToken();
            await user.save();

            // Enviar email de confirmación de cuenta
            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            });

            res.json({ msg: '¡Cuenta creada correctamente!' });
        } catch (error) {
            console.log(error);
        }
    }

    // Confirmar una cuenta creada
    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body;

        // Buscar si existe un usuario con ese token
        const user = await User.findOne({ where: { token } });

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
    }

    // Iniciar Sesión
    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Comprobar si el usuario existe
        const user = await User.findOne({ where: { email } });

        if (!user) {
            const error = new Error('El usuario no existe');
            res.status(409).json({ error: error.message });
            return;
        }

        // Comprobar si la contraseña es correcta
        const isPasswordCorrect = await checkPassword(password, user.password);

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
        const jwt = generateJWT(user.id);
        res.json(jwt);
    }

    // Olvido de Contraseña
    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;

        // Comprobar si el usuario ya existe
        const user = await User.findOne({ where: { email } });

        if (!user) {
            const error = new Error('El usuario no existe');
            res.status(401).json({ error: error.message });
            return;
        }

        // Generar un token nuevo
        user.token = generateToken();
        await user.save();

        // Enviar un email
        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        });

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    }

    // Validar Token
    static validateToken = async (req: Request, res: Response) => {
        const { token } = req.body;

        const tokenExists = await User.findOne({ where: { token } });

        if (!tokenExists) {
            const error = new Error('El token no es válido');
            res.status(404).json({ error: error.message });
            return;
        }

        res.json({ msg: 'Token válido, asigna una nueva contraseña a tu cuenta' });
    }

    // Cambiar Contraseña y Resetear Token
    static resetPasswordWithToken = async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;

        // Buscar el usuario con ese token
        const user = await User.findOne({ where: { token } });

        if (!user) {
            const error = new Error('El token no es válido');
            res.status(404).json({ error: error.message });
            return;
        }

        // Cambiar Contraseña y eliminar token
        user.password = await hashPassword(password);
        user.token = null;
        await user.save();

        res.json({ msg: '¡Contraseña cambiada correctamente!' });
    }

    // Obtener datos del usuario
    static user = async (req: Request, res: Response) => {
        res.json(req.user);
    }

    // Cambiar contraseña de un usuario autenticado
    static updatePassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body;
        const { id } = req.user;

        const user = await User.findByPk(id);

        // Comprobar si la contraseña actual es correcta
        const isPasswordCorrect = await checkPassword(current_password, user.password);

        if (!isPasswordCorrect) {
            const error = new Error('La contraseña actual es incorrecta');
            res.status(401).json({ error: error.message });
            return;
        }

        user.password = await hashPassword(password);
        await user.save();
        res.json({ msg: '¡Contraseña cambiada correctamente!' });
    }

    // Comprobar contraseña del usuario
    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body;
        const { id } = req.user;

        const user = await User.findByPk(id);

        // Comprobar si la contraseña es correcta
        const isPasswordCorrect = await checkPassword(password, user.password);

        if (!isPasswordCorrect) {
            const error = new Error('La contraseña es incorrecta');
            res.status(401).json({ error: error.message });
            return;
        }

        res.json({ msg: '¡Contraseña correcta!' });
    }

    // Modificar perfil del usuario
    static updateUser = async (req: Request, res: Response) => {
        const { name, email } = req.body;

        try {
            // Comprobar si el email ya existe
            const existingUser = await User.findOne({ where: { email } });

            if (existingUser && existingUser.id !== req.user.id) {
                const error = new Error('El email ya está asociado a otro usuario');
                res.status(409).json({ error: error.message });
            }

            // Actualizar usuario
            await User.update({ email, name }, {
                where: { id: req.user.id }
            });

            res.json({ msg: 'Perfil actualizado correctamente!' });

        } catch (error) {
            res.status(500).json('Hubo un error');
        }
    }
}

export default AuthController;