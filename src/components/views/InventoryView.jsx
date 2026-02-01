import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { Package, Edit2, Save, X } from 'lucide-react';
import '../../styles/layout.css';

export const InventoryView = () => {
    const { resources, updateResource } = useApp();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Inventario</h2>
                    <p className="text-slate-500">Gestión de materias primas.</p>
                </div>
                <button className="btn-primary">
                    + Nuevo Insumo
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="p-4 font-semibold text-slate-500 text-sm">Insumo</th>
                            <th className="p-4 font-semibold text-slate-500 text-sm">Stock Actual</th>
                            <th className="p-4 font-semibold text-slate-500 text-sm">Mínimo</th>
                            <th className="p-4 font-semibold text-slate-500 text-sm text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map((res, idx) => (
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={res.id}
                                className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                            >
                                <td className="p-4 font-medium text-slate-900 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Package size={16} />
                                    </div>
                                    {res.name}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className={`w-20 p-1 border rounded font-bold ${(res.stock <= (res.safety_stock || 0)) ? 'text-red-600 border-red-200 bg-red-50' : 'text-slate-700 border-slate-200'}`}
                                            value={res.stock}
                                            step="0.1"
                                            onChange={(e) => updateResource(res.id, { stock: parseFloat(e.target.value) || 0 })}
                                        />
                                        <span className="text-xs text-slate-500">{res.unit}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="w-16 p-1 border border-slate-200 rounded text-slate-500 text-sm"
                                            value={res.safety_stock}
                                            onChange={(e) => updateResource(res.id, { safety_stock: parseInt(e.target.value) || 0 })}
                                        />
                                        <span className="text-xs text-slate-400">{res.unit}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="text-xs text-slate-400 font-medium">Auto-guardado</div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
