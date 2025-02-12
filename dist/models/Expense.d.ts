import { Model } from 'sequelize-typescript';
declare class Expense extends Model {
    name: string;
    amount: number;
    budgetId: number;
    budget: number;
}
export default Expense;
