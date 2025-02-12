import { transport } from "../config/nodemailer";

type EmailType = {
    name: String,
    email: string,
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'Cashtrackr - Confirma tu Cuenta',
            html: `
                <p>Hola ${user.name}, Tu cuenta en CashTrackr ya está casi lista.</p>
                <p>Visita el siguiente enlace e ingresa el código de confirmación: <strong>${user.token}</strong></p>
                <p><a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a></p>
            `
        });
    }

    static sendPasswordResetToken = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'Cashtrackr - Reestablecer Contraseña',
            html: `
                <p>Hola ${user.name}, has solicitado reestablecer tu contraseña.</p>
                <p>Visita el siguiente enlace e ingresa el código: <strong>${user.token}</strong></p>
                <p><a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Contraseña</a></p>
            `
        });
    }
}
