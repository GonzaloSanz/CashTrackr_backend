"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExpenseInput = exports.belongsToBudget = exports.validateExpenseExists = exports.validateExpenseId = void 0;
const express_validator_1 = require("express-validator");
const Expense_1 = __importDefault(require("../models/Expense"));
const validateExpenseId = async (req, res, next) => {
    await (0, express_validator_1.param)('expenseId')
        .isInt().withMessage('El ID no es válido')
        .custom(value => value > 0).withMessage('El ID no es válido')
        .run(req);
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateExpenseId = validateExpenseId;
const validateExpenseExists = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const expense = await Expense_1.default.findByPk(expenseId);
        // Si el gasto no existe
        if (!expense) {
            const error = new Error('Gasto no encontrado');
            res.status(404).json({ error: error.message });
            return;
        }
        req.expense = expense;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error' });
    }
};
exports.validateExpenseExists = validateExpenseExists;
const belongsToBudget = async (req, res, next) => {
    if (req.budget.id !== req.expense.budgetId) {
        const error = new Error('Acción no válida');
        return res.status(403).json({ error: error.message });
    }
    next();
};
exports.belongsToBudget = belongsToBudget;
const validateExpenseInput = async (req, res, next) => {
    await (0, express_validator_1.body)('name')
        .notEmpty().withMessage('El nombre no es válido')
        .run(req);
    await (0, express_validator_1.body)('amount')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isNumeric().withMessage('La cantidad no es válida')
        .custom(value => value > 0).withMessage('La cantidad debe ser mayor a 0')
        .run(req);
    next();
};
exports.validateExpenseInput = validateExpenseInput;
//# sourceMappingURL=expense.js.map