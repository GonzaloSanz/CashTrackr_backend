"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
const Expense_1 = __importDefault(require("../models/Expense"));
class BudgetController {
    // Obtener todos los presupuestos
    static getAll = async (req, res) => {
        try {
            const budgets = await Budget_1.default.findAll({
                order: [
                    ['updatedAt', 'DESC']
                ],
                where: {
                    userId: req.user.id
                }
            });
            res.json(budgets);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    // Crear un presupuesto
    static create = async (req, res) => {
        try {
            const budget = new Budget_1.default(req.body);
            budget.userId = req.user.id;
            await budget.save();
            res.status(201).json({ msg: '¡Presupuesto creado correctamente!' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    // Obtener un presupuesto
    static getById = async (req, res) => {
        const budget = await Budget_1.default.findByPk(req.budget.id, {
            include: [Expense_1.default]
        });
        res.json(budget);
    };
    // Editar un presupuesto
    static updateById = async (req, res) => {
        await req.budget.update(req.body);
        res.json({ msg: '¡Presupuesto actualizado correctamente!' });
    };
    // Eliminar un presupuesto
    static deleteById = async (req, res) => {
        await req.budget.destroy();
        res.json({ msg: '¡Presupuesto eliminado correctamente!' });
    };
}
exports.BudgetController = BudgetController;
//# sourceMappingURL=BudgetController.js.map