import { createRequest, createResponse } from 'node-mocks-http';
import { BudgetController } from '../../controllers/BudgetController';
import Budget from '../../models/Budget';
import { budgets } from '../mocks/budgets';

jest.mock('../../models/Budget', () => ({
    findAll: jest.fn()
}));

describe('BudgetController.getAll', () => {
    beforeEach(() => {
        (Budget.findAll as jest.Mock).mockReset();
        (Budget.findAll as jest.Mock).mockImplementation((options) => {
            const updatedBudgets = budgets.filter(budget => budget.userId === options.where.userId);
            return Promise.resolve(updatedBudgets);
        });
    });

    test('Debería devolver 2 presupuestos', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 1 }
        });

        const res = createResponse();
        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(2);
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });

    test('Debería devolver 1 presupuesto para el usuario con ID 2', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 2 }
        });

        const res = createResponse();
        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(1);
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });

    test('Debería devolver 0 presupuestos para el usuario con ID 10', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 10 }
        });

        const res = createResponse();
        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(0);
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });

    test('Debería devolver errores al buscar los presupuestos', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 100 }
        });

        const res = createResponse();
        (Budget.findAll as jest.Mock).mockRejectedValue(new Error);
        await BudgetController.getAll(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({error: 'Hubo un error'});
    });
});