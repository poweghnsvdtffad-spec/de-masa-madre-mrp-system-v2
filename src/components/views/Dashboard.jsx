import React from 'react';
import { useApp } from '../../store/AppContext';
import { TrendingUp, AlertCircle, ShoppingBag, Clock } from 'lucide-react';

export function Dashboard() {
    const { orders, productionNeeds, materialsNeeded, resources } = useApp();

    const lowStock = resources.filter(r => r.stock <= r.min);

    return (
        <div className="dashboard-grid">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Hola, Panadero 👋</h1>
                <p style={{ color: '#64748b' }}>Esto es lo que tenés para hoy.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card-premium">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontWeight: 700 }}>Stock Crítico</h3>
                        <AlertCircle color="#e11d48" />
                    </div>
                    {lowStock.length > 0 ? (
                        lowStock.map(r => (
                            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span>{r.name}</span>
                                <span style={{ color: '#e11d48', fontWeight: 600 }}>{r.stock} {r.unit}</span>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#94a3b8' }}>Todo en orden por ahora.</p>
                    )}
                </div>

                <div className="card-premium">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontWeight: 700 }}>Demanda Activa</h3>
                        <ShoppingBag color="#2563eb" />
                    </div>
                    {Object.entries(productionNeeds).map(([id, qty]) => (
                        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <span>Producto {id}</span>
                            <span style={{ fontWeight: 600 }}>{qty} u.</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
