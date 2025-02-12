import { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
    // Obtener todos los presupuestos
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['updatedAt', 'DESC']
                ],
                where: {
                    userId: req.user.id
                }
            });
            res.json(budgets);

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    // Crear un presupuesto
    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body);
            budget.userId = req.user.id;
            await budget.save();

            res.status(201).json({ msg: '¡Presupuesto creado correctamente!' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    // Obtener un presupuesto
    static getById = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        });
        
        res.json(budget);
    }

    // Editar un presupuesto
    static updateById = async (req: Request, res: Response) => {
        await req.budget.update(req.body);
        res.json({ msg: '¡Presupuesto actualizado correctamente!' });
    }

    // Eliminar un presupuesto
    static deleteById = async (req: Request, res: Response) => {
        await req.budget.destroy();
        res.json({ msg: '¡Presupuesto eliminado correctamente!' });
    }
}