import React from 'react';
import { useApp } from '../../store/AppContext';
import { Package, TrendingDown } from 'lucide-react';

export function InventoryView() {
    const { resources } = useApp();

    return (
        <div className="inventory-view">
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Inventario</h1>

            <div className="card-premium">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '0.875rem' }}>
                            <th style={{ padding: '1rem' }}>Insumo</th>
                            <th style={{ padding: '1rem' }}>Stock Actual</th>
                            <th style={{ padding: '1rem' }}>Mínimo</th>
                            <th style={{ padding: '1rem' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map(res => (
                            <tr key={res.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{res.name}</td>
                                <td style={{ padding: '1rem' }}>{res.stock} {res.unit}</td>
                                <td style={{ padding: '1rem', color: '#64748b' }}>{res.min} {res.unit}</td>
                                <td style={{ padding: '1rem' }}>
                                    {res.stock <= res.min ? (
                                        <span style={{ color: '#e11d48', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                                            <TrendingDown size={14} /> Reponer
                                        </span>
                                    ) : (
                                        <span style={{ color: '#15803d', fontSize: '0.875rem' }}>OK</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
