/**
 * WhatsApp Message Parser
 * Attempts to extract products, quantities, and customer info from a text blob.
 */

export const parseWAMessage = (text, availableProducts) => {
    const lines = text.split('\n');
    let customer = "Cliente Web";
    const items = [];

    // Simple heuristic for customer name
    const nameMatch = text.match(/(?:soy|me llamo|hola,? soy|atentamente|saludos,?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (nameMatch) {
        customer = nameMatch[1];
    }

    // Product matching
    availableProducts.forEach(product => {
        const escapedName = product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?:(\\d+)\\s*)?${escapedName}(?:\\s*x?\\s*(\\d+))?`, 'gi');
        
        let match;
        while ((match = regex.exec(text)) !== null) {
            const qty = parseInt(match[1] || match[2] || "1");
            if (qty > 0) {
                items.push({
                    productId: product.id,
                    name: product.name,
                    quantity: qty
                });
            }
        }
    });

    return {
        customer,
        items,
        raw: text,
        isValid: items.length > 0
    };
};
