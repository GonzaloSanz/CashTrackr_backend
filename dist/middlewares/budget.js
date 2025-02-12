"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAccess = exports.validateBudgetInput = exports.validateBudgetExists = exports.validateBudgetId = void 0;
const express_validator_1 = require("express-validator");
const Budget_1 = __importDefault(require("../models/Budget"));
const validateBudgetId = async (req, res, next) => {
    await (0, express_validator_1.param)('budgetId')
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
exports.validateBudgetId = validateBudgetId;
const validateBudgetExists = async (req, res, next) => {
    try {
        const { budgetId } = req.params;
        const budget = await Budget_1.default.findByPk(budgetId);
        // Si el presupuesto no existe
        if (!budget) {
            const error = new Error('La acción no es válida');
            res.status(404).json({ error: error.message });
            return;
        }
        req.budget = budget;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error' });
    }
};
exports.validateBudgetExists = validateBudgetExists;
const validateBudgetInput = async (req, res, next) => {
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
exports.validateBudgetInput = validateBudgetInput;
const hasAccess = (req, res, next) => {
    if (req.budget.userId !== req.user.id) {
        const error = new Error('Acción no válida');
        res.status(401).json({ error: error.message });
        return;
    }
    next();
};
exports.hasAccess = hasAccess;
//# sourceMappingURL=budget.js.map