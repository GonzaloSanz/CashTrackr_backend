import { Router } from 'express';
import { BudgetController } from '../controllers/BudgetController';
import { ExpensesController } from '../controllers/ExpensesController';
import { handleInputErrors } from '../middlewares/validation';
import { hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInput } from '../middlewares/budget';
import { belongsToBudget, validateExpenseExists, validateExpenseId, validateExpenseInput } from '../middlewares/expense';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);
router.param('budgetId', hasAccess);

router.param('expenseId', validateExpenseId);
router.param('expenseId', validateExpenseExists);
router.param('expenseId', belongsToBudget);

/* PRESUPUESTOS */
router.get('/', BudgetController.getAll);

router.post('/',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create
);

router.get('/:budgetId', BudgetController.getById);

router.put('/:budgetId',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateById
);

router.delete('/:budgetId', BudgetController.deleteById);

/* GASTOS */
router.post('/:budgetId/expenses', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create
);

router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById);

router.put('/:budgetId/expenses/:expenseId',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateById
);

router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById);

export default router;