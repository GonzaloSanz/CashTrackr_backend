"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
class ExpensesController {
    static create = async (req, res) => {
        try {
            const expense = new Expense_1.default(req.body);
            expense.budgetId = req.budget.id;
            await expense.save();
            res.status(201).json({ msg: '¡Gasto creado correctamente!' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static getById = async (req, res) => {
        res.json(req.expense);
    };
    static updateById = async (req, res) => {
        try {
            await req.expense.update(req.body);
            res.status(201).json({ msg: '¡Gasto actualizado correctamente!' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static deleteById = async (req, res) => {
        try {
            await req.expense.destroy(req.body);
            res.status(201).json({ msg: '¡Gasto eliminado correctamente!' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
exports.ExpensesController = ExpensesController;
//# sourceMappingURL=ExpensesController.js.map