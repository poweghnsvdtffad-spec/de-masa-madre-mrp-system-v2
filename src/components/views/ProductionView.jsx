import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { ChefHat, ArrowRight, AlertTriangle, Check, Package as PackageIcon } from 'lucide-react';
import { calculateMaterialRequirements } from '../../domain/mrp';
import '../../styles/layout.css';

export const ProductionView = () => {
    const { productionNeeds, products, recipes, resources, updateOrderStatus, orders } = useApp();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const Package = PackageIcon;

    // Filter only products that have demand
    const activeProducts = Object.keys(productionNeeds);

    const handleStartProduction = (productId, quantity) => {
        const product = products.find(p => p.id === productId);
        const recipe = recipes[productId];

        // Check if we have enough stock for THIS product's requirement
        const productNeeds = { [productId]: quantity };
        const reqs = calculateMaterialRequirements(productNeeds, recipes);

        const missing = [];
        Object.entries(reqs).forEach(([resId, needed]) => {
            const res = resources.find(r => r.id === resId);
            if (!res || res.stock < needed) {
                missing.push(res?.name || resId);
            }
        });

        if (missing.length > 0) {
            alert(`⚠️ No podés iniciar producción. Falta stock de: ${missing.join(', ')}`);
            return;
        }

        const relatedOrders = orders.filter(o =>
            o.status === 'PENDING' && o.items.some(i => i.productId === productId)
        );

        relatedOrders.forEach(o => updateOrderStatus(o.id, 'PRODUCTION'));
        setSelectedProduct(null); 
    };

    const handleFinishProduction = (productId) => {
        const relatedOrders = orders.filter(o =>
            o.status === 'PRODUCTION' && o.items.some(i => i.productId === productId)
        );
        relatedOrders.forEach(o => updateOrderStatus(o.id, 'DONE'));
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Plan de Producción</h2>
                <p className="text-slate-500">Demanda agregada para hoy.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demand List */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">A Producir</h3>
                    {activeProducts.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-slate-400">
                            No hay producción pendiente.
                        </div>
                    ) : (
                        activeProducts.map(prodId => {
                            const product = products.find(p => p.id === prodId);
                            const qty = productionNeeds[prodId];
                            const recipe = recipes[prodId];

                            if (!product) return null;

                            return (
                                <motion.div
                                    layout
                                    key={prodId}
                                    className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => setSelectedProduct({ product, qty, recipe })}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                                                <ChefHat size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg">{product.name}</h4>
                                                <p className="text-sm text-slate-500">{qty} unidades requeridas</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-300" />
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Recipe / materials breakdown panel */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 h-fit sticky top-24">
                    {!selectedProduct ? (
                        <div className="text-center text-slate-400 py-12">
                            Seleccioná un producto para ver el plan de receta y stock.
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedProduct.product.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedProduct.product.name}</h3>
                                <div className="text-sm font-semibold text-rose-600 mb-6 bg-rose-50 inline-block px-3 py-1 rounded-full">
                                    Receta x {selectedProduct.qty} unidades
                                </div>

                                <div className="space-y-3 mb-8">
                                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">Ingredientes Necesarios</p>
                                    {selectedProduct.recipe?.inputs.map(input => {
                                        const resource = resources.find(r => r.id === input.resourceId);
                                        const totalNeeded = (selectedProduct.qty / selectedProduct.recipe.output_units) * input.quantity;
                                        const hasStock = resource?.stock >= totalNeeded;

                                        return (
                                            <div key={input.resourceId} className="flex justify-between items-center text-sm p-2 rounded-lg bg-white border border-slate-100">
                                                <span className="text-slate-700">{resource?.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold">{totalNeeded.toFixed(2)} {resource?.unit}</span>
                                                    {hasStock ? (
                                                        <Check size={16} className="text-emerald-500" />
                                                    ) : (
                                                        <AlertTriangle size={16} className="text-red-500" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleStartProduction(selectedProduct.product.id, selectedProduct.qty)}
                                        className="btn-primary"
                                    >
                                        Iniciar Producción
                                    </button>
                                    <button
                                        onClick={() => handleFinishProduction(selectedProduct.product.id)}
                                        className="btn-secondary"
                                    >
                                        Marcar Terminado
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-4 text-center">
                                    "Iniciar" mueve los pedidos a estado Producción.<br />
                                    "Terminado" los marca para Entrega.
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChevronRight = ({ className }) => (
    <svg className={`w-6 h-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);
