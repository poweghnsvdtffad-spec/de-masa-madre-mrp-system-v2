
export const INGREDIENTS = [
    { id: '1', name: 'Harina de Trigo', currentStock: 50, unit: 'kg', costPerUnit: 1.20, safetyStock: 10 },
    { id: '2', name: 'Agua', currentStock: 1000, unit: 'L', costPerUnit: 0.05, safetyStock: 50 },
    { id: '3', name: 'Sal', currentStock: 5, unit: 'kg', costPerUnit: 0.80, safetyStock: 2 },
    { id: '4', name: 'Masa Madre (Cultivo)', currentStock: 2, unit: 'kg', costPerUnit: 0.00, safetyStock: 1 },
];

export const RECIPES = [
    {
        id: '1',
        name: 'Pan de Masa Madre Clásico',
        standardLaborCost: 2.00,
        ingredients: [
            { ingredientId: '1', quantity: 0.500, wastePercentage: 0.02 }, // 500g Harina
            { ingredientId: '2', quantity: 0.350, wastePercentage: 0.0 },  // 350ml Agua
            { ingredientId: '3', quantity: 0.010, wastePercentage: 0.01 }, // 10g Sal
            { ingredientId: '4', quantity: 0.100, wastePercentage: 0.05 }, // 100g Masa Madre
        ]
    }
];

export const PRODUCTION_RUNS = [
    {
        id: '101',
        recipeId: '1',
        scheduledDate: '2023-10-25',
        completedDate: '2023-10-25',
        plannedQuantity: 20,
        actualQuantity: 19, // 1 desperdiciado/fallido
        status: 'COMPLETED'
    },
    {
        id: '102',
        recipeId: '1',
        scheduledDate: '2023-10-26',
        completedDate: null,
        plannedQuantity: 30,
        actualQuantity: 0,
        status: 'PLANNED'
    }
];

export const MOVEMENTS = [
    { id: 'm1', ingredientId: '1', type: 'IN', quantity: 100, date: '2023-10-01' },
    { id: 'm2', ingredientId: '1', type: 'OUT', quantity: 10, date: '2023-10-25' }, // Producción 101
    { id: 'm3', ingredientId: '1', type: 'WASTE', quantity: 0.5, date: '2023-10-25' }, // Bolsa rota
];
