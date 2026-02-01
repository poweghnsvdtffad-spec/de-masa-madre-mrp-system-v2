export function calculateProductionNeeds(orders) {
    const needs = {};

    orders.forEach(order => {
        if (order.status === 'PENDING') {
            order.items.forEach(item => {
                if (!needs[item.productId]) {
                    needs[item.productId] = 0;
                }
                needs[item.productId] += item.quantity;
            });
        }
    });

    return needs;
}

export function calculateMaterialRequirements(productionNeeds, recipes) {
    const materialNeeds = {};

    Object.entries(productionNeeds).forEach(([productId, quantity]) => {
        const recipe = recipes[productId];
        if (recipe) {
            recipe.inputs.forEach(input => {
                if (!materialNeeds[input.resourceId]) {
                    materialNeeds[input.resourceId] = 0;
                }
                const batches = quantity / recipe.output_units;
                materialNeeds[input.resourceId] += batches * input.quantity;
            });
        }
    });

    return materialNeeds;
}
