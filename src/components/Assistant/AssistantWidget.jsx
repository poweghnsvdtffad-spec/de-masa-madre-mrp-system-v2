import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import '../../styles/layout.css';

const MOCK_RESPONSES = [
    { keywords: ['hola', 'buen', 'dia'], text: "¡Hola! Soy tu asistente de Masa Madre. ¿En qué puedo ayudarte hoy? Podés preguntarme por stock, pedidos o producción." },
    { keywords: ['pedido', 'cargar', 'nuevo'], text: "Para cargar un nuevo pedido, andá a la sección 'Pedidos' y tocá el botón 'Nuevo Pedido'. Acordate que podés elegir varios productos a la vez." },
    { keywords: ['stock', 'rojo', 'alerta', 'faltante', 'comprar', 'donde'], text: "Si ves una alerta roja, significa que estás por debajo del stock mínimo. Podés ver cuánto te falta en la pestaña de **'Inventario'**; ahí podés ajustar las cantidades directamente en la tabla." },
    { keywords: ['critico', 'minimo', 'seguridad', 'ajustar', 'configurar', 'nivel'], text: "Para configurar tus alertas, andá a **'Inventario'** y cambiá el número en la columna **'Mínimo'**. Si el stock baja de ese número, verás automáticamente una alerta roja en el Dashboard." },
    { keywords: ['produccion', 'plan', 'empezar'], text: "En la vista de 'Producción' ves todo lo que tenés que cocinar hoy. Al darle 'Iniciar', los pedidos pasan a estado 'En Producción' y se descuenta el stock teórico." },
    { keywords: ['borrar', 'eliminar', 'cancelar'], text: "Por seguridad, para borrar un pedido tenés que contactar al administrador o hacerlo desde la base de datos por ahora." },
];

export const AssistantWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hola 👋 Soy el asistente del sistema. ¿Tenés alguna duda sobre cómo manejar tu stock o tus pedidos?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        const query = inputValue.toLowerCase();
        setInputValue('');

        setTimeout(() => {
            let responseText = "";

            if (query.includes('whatsapp') || query.includes('wsp') || query.includes('whats') || query.includes('celular') || query.includes('mensaje')) {
                responseText = "📱 **Conexión con WhatsApp**:\n¡El sistema ya está listo para trabajar con WhatsApp!\n1. En **'Pedidos'**, tenés el botón **'Importar'** para reconocer mensajes pegados.\n2. Si configurás la API oficial (Backend), los pedidos entrarán automáticamente a la cola de revisión.";
            } else if (query.includes('sheets') || query.includes('excel') || query.includes('google') || query.includes('hoja')) {
                responseText = "📊 **Conexión con Google Sheets**:\nPodés vincular tu planilla para que los productos y recetas se carguen solos.\n1. Prepará tu Excel con solapas para 'Productos', 'Recetas' e 'Insumos'.\n2. Pasame el link por acá y te ayudo a integrarlo al código del conector.";
            }

            if (!responseText) {
                const match = MOCK_RESPONSES.find(r => r.keywords.some(k => query.includes(k)));
                if (match) {
                    responseText = match.text;
                }
            }

            if (!responseText) {
                responseText = "No estoy seguro de cómo responder eso. Para configurar stock crítico o ajustar inventario, te recomiendo ir directo a la pestaña de 'Inventario'.";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: responseText }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl w-80 sm:w-96 border border-slate-200 overflow-hidden flex flex-col"
                        style={{ maxHeight: '500px', height: '60vh' }}
                    >
                        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Bot size={20} className="text-emerald-400" />
                                <span className="font-semibold text-sm">Asistente Virtual</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                                        ${msg.type === 'user' ? 'bg-rose-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                            <input
                                type="text"
                                placeholder="Escribí tu consulta..."
                                className="flex-1 text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                            />
                            <button type="submit" disabled={!inputValue.trim()} className="p-2 bg-slate-900 text-white rounded-lg disabled:opacity-50 hover:bg-slate-800 transition-colors">
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="h-16 w-16 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl flex items-center justify-center border-2 border-white/20 relative group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                    {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                </div>
            </motion.button>
        </div>
    );
};
