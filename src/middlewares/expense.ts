import { Request, Response, NextFunction } from "express";
import { param, validationResult, body } from "express-validator";
import Expense from "../models/Expense";

// Aceptar budget en el Request
declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId')
        .isInt().withMessage('El ID no es válido')
        .custom(value => value > 0).withMessage('El ID no es válido')
        .run(req)

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next();
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params;
        const expense = await Expense.findByPk(expenseId);

        // Si el gasto no existe
        if (!expense) {
            const error = new Error('Gasto no encontrado');
            res.status(404).json({ error: error.message });
            return;
        }

        req.expense = expense;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error' });
    }
}

export const belongsToBudget = async(req: Request, res: Response, next: NextFunction) => {
    if(req.budget.id !== req.expense.budgetId) {
        const error = new Error('Acción no válida');
        return res.status(403).json({error: error.message});
    }

    next();
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
        .notEmpty().withMessage('El nombre no es válido')
        .run(req)
    await body('amount')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isNumeric().withMessage('La cantidad no es válida')
        .custom(value => value > 0).withMessage('La cantidad debe ser mayor a 0')
        .run(req)

    next();
}