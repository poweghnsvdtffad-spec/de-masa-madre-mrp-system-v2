/**
 * Calculates the total quantities needed for each product based on active orders.
 * @param {Array} orders - List of orders
 * @returns {Object} Map of productId -> totalQuantity
 */
export function calculateProductionNeeds(orders) {
    const needs = {};

    orders.forEach(order => {
        // Only count orders that are PENDING or IN_PRODUCTION (not delivered/cancelled)
        if (order.status === 'PENDING' || order.status === 'PRODUCTION') {
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

/**
 * Calculates total raw materials needed based on production plan.
 * @param {Object} productionNeeds - Map of productId -> quantity
 * @param {Object} recipes - Map of productId -> Recipe
 * @returns {Object} Map of resourceId -> requiredQuantity
 */
export function calculateMaterialRequirements(productionNeeds, recipes) {
    const materialNeeds = {};

    Object.entries(productionNeeds).forEach(([productId, quantity]) => {
        const recipe = recipes[productId];
        if (recipe) {
            recipe.inputs.forEach(input => {
                if (!materialNeeds[input.resourceId]) {
                    materialNeeds[input.resourceId] = 0;
                }
                // Quantity needed = (Active Demand / Recipe Output) * Unit Input
                const batches = quantity / recipe.output_units;
                materialNeeds[input.resourceId] += batches * input.quantity;
            });
        }
    });

    return materialNeeds;
}
