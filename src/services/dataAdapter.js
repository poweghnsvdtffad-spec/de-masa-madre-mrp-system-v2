/**
 * Service to handle data bridging between components and external sources
 * (Initially mocks, intended for Google Sheets / API integration later)
 */

export const dataAdapter = {
    getProducts: async () => {
        // Simulating fetch
        return [
            { id: 'p1', name: 'Pan de Masa Madre (Classic)', category: 'Panes', price: 4500 },
            { id: 'p2', name: 'Focaccia de Romero', category: 'Focaccias', price: 3800 },
            { id: 'p3', name: 'Pan de Campo (700g)', category: 'Panes', price: 4200 },
        ];
    },

    getRecipes: async () => {
        return {
            'p1': {
                output_units: 1,
                inputs: [
                    { resourceId: 'r1', quantity: 500, unit: 'g' }, // Flour
                    { resourceId: 'r2', quantity: 350, unit: 'ml' }, // Water
                    { resourceId: 'r3', quantity: 10, unit: 'g' }, // Salt
                ]
            },
            'p2': {
                output_units: 1,
                inputs: [
                    { resourceId: 'r1', quantity: 450, unit: 'g' },
                    { resourceId: 'r2', quantity: 400, unit: 'ml' },
                    { resourceId: 'r4', quantity: 50, unit: 'ml' }, // Olive Oil
                ]
            }
        };
    },

    getOrders: async () => {
        return [
            { id: 'o-101', customer: 'Juan Perez', items: [{ productId: 'p1', quantity: 2 }], status: 'PENDING', date: '2024-03-20' },
            { id: 'o-102', customer: 'Maria Garcia', items: [{ productId: 'p2', quantity: 1 }, { productId: 'p1', quantity: 1 }], status: 'PENDING', date: '2024-03-20' },
        ];
    },

    getResources: async () => {
        return [
            { id: 'r1', name: 'Harina de Fuerza', stock: 50, unit: 'kg', min: 10 },
            { id: 'r2', name: 'Agua', stock: 1000, unit: 'L', min: 0 },
            { id: 'r3', name: 'Sal Marina', stock: 5, unit: 'kg', min: 1 },
            { id: 'r4', name: 'Aceite de Oliva extra virgen', stock: 2000, unit: 'ml', min: 500 },
        ];
    },

    saveOrder: async (order) => {
        console.log("Saving order to storage...", order);
        return { success: true };
    }
};
