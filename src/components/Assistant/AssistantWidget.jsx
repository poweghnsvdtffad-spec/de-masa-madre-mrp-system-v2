import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_RESPONSES = [
    { keywords: ['cuanto', 'harina', 'queda'], text: "Quedan **45kg** de Harina de Fuerza. Con eso podés hacer unas 90 hogazas." },
    { keywords: ['hola', 'quien', 'sos'], text: "Soy el asistente de **De Masa Madre**. Te ayudo a calcular cuánto producir y qué insumos necesitás." },
    { keywords: ['pedido', 'nuevo', 'como'], text: "Andá a la pestaña 'Pedidos' y dale al botón 'Nuevo Pedido' para registrarlo." },
];

export function AssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "¡Hola! Soy tu asistente inteligente. ¿En qué te ayudo hoy?" }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        const query = inputValue.toLowerCase();
        setInputValue('');

        // Simulate AI thinking delay
        setTimeout(() => {
            let responseText = "";

            // 1. Integration Guides
            if (query.includes('whatsapp') || query.includes('celular') || query.includes('mensaje')) {
                responseText = "📱 **Conexión con WhatsApp Business**:\n1. Asegurate de tener instalada la app de WA Business.\n2. En la sección 'Pedidos', usá el botón 'Importar' (muy pronto disponible) para leer los mensajes automáticamente.\n3. Por ahora, podés copiar y pegar los pedidos directamente en 'Nuevo Pedido' y el sistema reconocerá el formato.";
            } else if (query.includes('sheets') || query.includes('excel') || query.includes('google') || query.includes('hoja')) {
                responseText = "📊 **Conexión con Google Sheets**:\n1. Tu planilla debe tener las solapas: 'Productos', 'Recetas' e 'Insumos'.\n2. Las columnas deben respetar los nombres exactos (ID, Nombre, Unidad, Stock).\n3. Pasame el Link de tu planilla por acá y yo te ayudo a vincularla al código.";
            }

            // 2. Keyword matching for other things
            if (!responseText) {
                const match = MOCK_RESPONSES.find(r => r.keywords.some(k => query.includes(k)));
                if (match) {
                    responseText = match.text;
                }
            }

            // 3. Fallback
            if (!responseText) {
                responseText = "No estoy seguro de cómo responder eso. Por favor contactá al desarrollador (Antigravity) para soporte técnico avanzado.";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: responseText }]);
        }, 600);
    };

    return (
        <div className="assistant-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        style={{
                            width: '350px',
                            height: '500px',
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            marginBottom: '1rem'
                        }}
                    >
                        <div style={{ background: 'var(--primary-gradient)', padding: '1.25rem', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700 }}>Asistente Inteligente</span>
                            <X size={20} cursor="pointer" onClick={() => setIsOpen(false)} />
                        </div>
                        
                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map(msg => (
                                <div key={msg.id} style={{ 
                                    alignSelf: msg.type === 'bot' ? 'flex-start' : 'flex-end',
                                    background: msg.type === 'bot' ? '#f1f5f9' : 'var(--rose-600)',
                                    color: msg.type === 'bot' ? '#334155' : 'white',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '15px',
                                    maxWidth: '85%',
                                    fontSize: '0.875rem',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
                            <input 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Escribí tu duda..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px',
                                    outline: 'none'
                                }}
                            />
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                className="btn-premium" 
                style={{ width: '60px', height: '60px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ background: 'var(--primary-gradient)', p: 4, rounded: 'full' }}>
                   <MessageSquare size={28} />
                </div>
            </button>
        </div>
    );
}
