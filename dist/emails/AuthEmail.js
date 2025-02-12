"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: 'CashTrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'Cashtrackr - Confirma tu Cuenta',
            html: `
                <p>Hola ${user.name}, Tu cuenta en CashTrackr ya está casi lista.</p>
                <p>Visita el siguiente enlace e ingresa el código de confirmación: <strong>${user.token}</strong></p>
                <p><a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a></p>
            `
        });
    };
    static sendPasswordResetToken = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: 'CashTrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'Cashtrackr - Reestablecer Contraseña',
            html: `
                <p>Hola ${user.name}, has solicitado reestablecer tu contraseña.</p>
                <p>Visita el siguiente enlace e ingresa el código: <strong>${user.token}</strong></p>
                <p><a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Contraseña</a></p>
            `
        });
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map