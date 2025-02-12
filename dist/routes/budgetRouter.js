"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BudgetController_1 = require("../controllers/BudgetController");
const ExpensesController_1 = require("../controllers/ExpensesController");
const validation_1 = require("../middlewares/validation");
const budget_1 = require("../middlewares/budget");
const expense_1 = require("../middlewares/expense");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.param('budgetId', budget_1.validateBudgetId);
router.param('budgetId', budget_1.validateBudgetExists);
router.param('budgetId', budget_1.hasAccess);
router.param('expenseId', expense_1.validateExpenseId);
router.param('expenseId', expense_1.validateExpenseExists);
router.param('expenseId', expense_1.belongsToBudget);
/* PRESUPUESTOS */
router.get('/', BudgetController_1.BudgetController.getAll);
router.post('/', budget_1.validateBudgetInput, validation_1.handleInputErrors, BudgetController_1.BudgetController.create);
router.get('/:budgetId', BudgetController_1.BudgetController.getById);
router.put('/:budgetId', budget_1.validateBudgetInput, validation_1.handleInputErrors, BudgetController_1.BudgetController.updateById);
router.delete('/:budgetId', BudgetController_1.BudgetController.deleteById);
/* GASTOS */
router.post('/:budgetId/expenses', expense_1.validateExpenseInput, validation_1.handleInputErrors, ExpensesController_1.ExpensesController.create);
router.get('/:budgetId/expenses/:expenseId', ExpensesController_1.ExpensesController.getById);
router.put('/:budgetId/expenses/:expenseId', expense_1.validateExpenseInput, validation_1.handleInputErrors, ExpensesController_1.ExpensesController.updateById);
router.delete('/:budgetId/expenses/:expenseId', ExpensesController_1.ExpensesController.deleteById);
exports.default = router;
//# sourceMappingURL=budgetRouter.js.map