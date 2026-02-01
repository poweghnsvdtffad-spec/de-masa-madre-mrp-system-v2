import React from 'react';
import { useApp } from '../../store/AppContext';
import { Play, CheckCircle2 } from 'lucide-react';

export function ProductionView() {
    const { productionNeeds, materialsNeeded, getProductById, getResourceById, updateOrderStatus, orders } = useApp();

    const handleStartBatch = (productId) => {
        // Simple logic: Update all PENDING orders for this product to PRODUCTION
        orders.forEach(o => {
            if (o.status === 'PENDING' && o.items.find(i => i.productId === productId)) {
                updateOrderStatus(o.id, 'PRODUCTION');
            }
        });
    };

    return (
        <div className="production-view">
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Plan de Producción</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="card-premium">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>A Producir (Consolidado)</h3>
                    {Object.entries(productionNeeds).map(([pid, qty]) => (
                        <div key={pid} className="prod-item" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '1rem',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            marginBottom: '1rem'
                        }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{getProductById(pid)?.name || pid}</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total requerido: {qty}</div>
                            </div>
                            <button className="btn-premium" onClick={() => handleStartBatch(pid)}>
                                <Play size={16} /> Empezar
                            </button>
                        </div>
                    ))}
                </div>

                <div className="card-premium">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Insumos Requeridos</h3>
                    {Object.entries(materialsNeeded).map(([rid, qty]) => {
                        const res = getResourceById(rid);
                        return (
                            <div key={rid} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span>{res?.name}</span>
                                <span style={{ fontWeight: 600, color: (res?.stock < qty) ? '#e11d48' : '#0f172a' }}>
                                    {qty} {res?.unit}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
