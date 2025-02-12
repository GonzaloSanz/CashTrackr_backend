import { Router } from "express"
import { body, param } from "express-validator";
import AuthController from "../controllers/AuthController";
import { handleInputErrors } from "../middlewares/validation";
import { limiter } from "../config/limiter";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(limiter);

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacío'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
    body('email')
        .isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token')
        .isLength({ min: 6, max: 6 })
        .notEmpty().withMessage('El token no es válido'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post('/login',
    body('email')
        .isEmail().withMessage('El email no es válido'),
    body('password')
        .notEmpty().withMessage('La contraseña no es válida'),
    handleInputErrors,
    AuthController.login
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .isLength({ min: 6, max: 6 })
        .notEmpty().withMessage('El token no es válido'),
    handleInputErrors,
    AuthController.validateToken
);

router.post('/reset-password/:token',
    param('token')
        .isLength({ min: 6, max: 6 })
        .notEmpty().withMessage('El token no es válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
);

router.get('/user',
    authenticate,
    AuthController.user
);

router.put('/user', 
    authenticate,
    AuthController.updateUser
);

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('La contraseña actual no es válida'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña nueva debe tener mínimo 8 caracteres'),
    handleInputErrors,
    AuthController.updatePassword
);

router.post('/check-password',
    authenticate,
    body('password')
        .isLength({ min: 1 }).withMessage('La contraseña no es válida'),
    handleInputErrors,
    AuthController.checkPassword
);

export default router;