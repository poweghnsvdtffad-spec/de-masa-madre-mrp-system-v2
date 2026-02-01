import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MessageSquare, AlertCircle } from 'lucide-react';

export const IncomingList = ({ orders, onApprove, onDismiss }) => {
    if (orders.length === 0) return null;

    return (
        <div className="mb-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare size={14} className="text-rose-500" />
                Pendientes de WhatsApp ({orders.length})
            </h3>
            
            <AnimatePresence>
                {orders.map(order => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-600 shadow-sm">
                                <MessageSquare size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-sm">{order.customer}</div>
                                <div className="text-xs text-rose-600 flex items-center gap-1">
                                    <AlertCircle size={10} />
                                    {order.items.length} productos detectados
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => onDismiss(order.id)}
                                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <button 
                                onClick={() => onApprove(order)}
                                className="bg-rose-600 text-white p-2 rounded-lg shadow-sm hover:bg-rose-700 transition-colors flex items-center gap-2 text-xs font-bold"
                            >
                                <Check size={16} /> Aprobar
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
