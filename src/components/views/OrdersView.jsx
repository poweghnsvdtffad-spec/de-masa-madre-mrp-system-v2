import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Plus, Download } from 'lucide-react';
import { WAImportModal } from '../orders/WAImportModal';

export function OrdersView() {
    const { orders, addOrder } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const [showWAImport, setShowWAImport] = useState(false);

    return (
        <div className="orders-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Pedidos</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        className="nav-link" 
                        style={{ border: '1px solid #e2e8f0', background: 'white' }}
                        onClick={() => setShowWAImport(true)}
                    >
                        <Download size={18} /> Importar
                    </button>
                    <button className="btn-premium" onClick={() => setIsAdding(true)}>
                        <Plus size={18} /> Nuevo Pedido
                    </button>
                </div>
            </div>

            <div className="card-premium">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '0.875rem' }}>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem' }}>Cliente</th>
                            <th style={{ padding: '1rem' }}>Fecha</th>
                            <th style={{ padding: '1rem' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem' }}>{order.id}</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{order.customer}</td>
                                <td style={{ padding: '1rem' }}>{order.date}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ 
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '20px', 
                                        fontSize: '0.75rem',
                                        background: order.status === 'PENDING' ? '#fff7ed' : '#f0fdf4',
                                        color: order.status === 'PENDING' ? '#c2410c' : '#15803d'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showWAImport && (
                <WAImportModal 
                    onClose={() => setShowWAImport(false)}
                    onImport={addOrder}
                />
            )}
        </div>
    );
}
