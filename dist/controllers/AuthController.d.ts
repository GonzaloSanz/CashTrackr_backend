import { Request, Response } from "express";
export declare class AuthController {
    static createAccount: (req: Request, res: Response) => Promise<void>;
    static confirmAccount: (req: Request, res: Response) => Promise<void>;
    static login: (req: Request, res: Response) => Promise<void>;
    static forgotPassword: (req: Request, res: Response) => Promise<void>;
    static validateToken: (req: Request, res: Response) => Promise<void>;
    static resetPasswordWithToken: (req: Request, res: Response) => Promise<void>;
    static user: (req: Request, res: Response) => Promise<void>;
    static updatePassword: (req: Request, res: Response) => Promise<void>;
    static checkPassword: (req: Request, res: Response) => Promise<void>;
    static updateUser: (req: Request, res: Response) => Promise<void>;
}
export default AuthController;
