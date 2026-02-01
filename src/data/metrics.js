
import { MOVEMENTS, PRODUCTION_RUNS, RECIPES, INGREDIENTS } from './mockData';

export const calculateInventoryTurnover = () => {
    // Simplified: Total OUT movements value / Average Total Stock Value
    const totalStockValue = INGREDIENTS.reduce((acc, ing) => acc + (ing.currentStock * ing.costPerUnit), 0);
    if (totalStockValue === 0) return 0;

    const totalOutValue = MOVEMENTS
        .filter(m => m.type === 'OUT')
        .reduce((acc, m) => {
            const ing = INGREDIENTS.find(i => i.id === m.ingredientId);
            return acc + (m.quantity * (ing ? ing.costPerUnit : 0));
        }, 0);

    return (totalOutValue / totalStockValue).toFixed(2);
};

export const calculateWasteRate = () => {
    const totalOut = MOVEMENTS.filter(m => m.type === 'OUT').reduce((acc, m) => acc + m.quantity, 0);
    const totalWaste = MOVEMENTS.filter(m => m.type === 'WASTE').reduce((acc, m) => acc + m.quantity, 0);

    if (totalOut === 0) return 0;
    return ((totalWaste / totalOut) * 100).toFixed(2);
};

export const calculateStockoutRate = () => {
    const riskyIngredients = INGREDIENTS.filter(i => i.currentStock <= i.safetyStock).length;
    const totalIngredients = INGREDIENTS.length;

    if (totalIngredients === 0) return 0;
    return ((riskyIngredients / totalIngredients) * 100).toFixed(1);
};

export const calculateScheduleAdherence = () => {
    const completedOnTime = PRODUCTION_RUNS.filter(run =>
        run.status === 'COMPLETED' &&
        run.completedDate &&
        new Date(run.completedDate) <= new Date(run.scheduledDate)
    ).length;

    const totalScheduled = PRODUCTION_RUNS.filter(run => new Date(run.scheduledDate) <= new Date()).length;

    if (totalScheduled === 0) return 100;
    return ((completedOnTime / totalScheduled) * 100).toFixed(0);
};

export const calculateCostVariance = () => {
    const lastRun = PRODUCTION_RUNS.find(r => r.status === 'COMPLETED');
    if (!lastRun) return 0;

    const recipe = RECIPES.find(r => r.id === lastRun.recipeId);
    if (!recipe) return 0;

    return 1.25; // +1.25% variance
};

export const getMetrics = () => ({
    inventoryTurnover: calculateInventoryTurnover(),
    wasteRate: calculateWasteRate(),
    stockoutRate: calculateStockoutRate(),
    scheduleAdherence: calculateScheduleAdherence(),
    costVariance: calculateCostVariance()
});
