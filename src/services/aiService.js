export const simulateAIResponse = async (userMessage) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simple keyword matching for demo purposes
            const lowerMsg = userMessage.toLowerCase();
            let response = "No estoy seguro de cómo responder a eso, pero estoy aprendiendo.";

            if (lowerMsg.includes('hola') || lowerMsg.includes('buenos dias')) {
                response = "¡Hola! ¿En qué puedo ayudarte con la gestión de tu producción hoy?";
            } else if (lowerMsg.includes('stock') || lowerMsg.includes('inventario')) {
                response = "Parece que quieres consultar el inventario. Puedes ir a la sección 'Inventario' en el menú lateral.";
            } else if (lowerMsg.includes('orden') || lowerMsg.includes('pedido')) {
                response = "Para ver los pedidos, visita la sección 'Órdenes'. Ahí podrás ver el estado de cada una.";
            } else if (lowerMsg.includes('ayuda')) {
                response = "Soy tu asistente virtual. Puedo guiarte por la aplicación. Pregúntame sobre stock, órdenes o producción.";
            }

            resolve(response);
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    });
};
